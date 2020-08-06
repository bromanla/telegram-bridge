const { HearManager } = require('@puregram/hear');
const { KeyboardBuilder } = require('puregram');

const { updates, api } = require('../connection/telegram');
const { whitelist, tgToken } = require('../config.json');
const { sendPhoto, sendText, sendVoice, sendSticker, sendDocument } = require('../send/vk');

const hearManager = new HearManager();
const parse_mode = 'Markdown';
let selectedUser = false;

hearManager.hear(/\/start/i, (ctx) => {
    const keyboard = new KeyboardBuilder()
        .textButton('/clear')
        .textButton('/list')
        .textButton('/info')
        .resize();

    return ctx.send('*Author: bromanla*', {
        reply_markup: keyboard,
        parse_mode: 'Markdown'
    });
})

// Control commands (middleware)
hearManager.hear(/\/clear/i, async (ctx) => {
    selectedUser = false;
    ctx.send('*Selected user cleared*', {parse_mode});
})

// Info about selected user
hearManager.hear(/\/info/i, async (ctx) => {
    ctx.send(
        selectedUser ? `*Selected user:* ${selectedUser.name}` : '*User not selected*',
        {parse_mode}
    )
})

// Show whitelist
hearManager.hear(/\/list/i, async (ctx) => {
    ctx.send(
        whitelist.reduce((text, {name}, index) => text += `${++index}. ${name}\n`, '*White list:*\n'),
        {parse_mode}
    )
})

// Set selected user
hearManager.hear(/^\/select|\/s\s(.+)$/i, async (ctx) => {
    const name = ctx.$match[1];
    const [ user ] = whitelist.filter(user => user.name.toLowerCase() == name.toLowerCase());

    if (!user)
        return ctx.send('*User is not found*', {parse_mode});

    selectedUser = {id: user.id, name: user.name};

    return ctx.send(`*Selected user:* ${user.name}`, {parse_mode});
})

hearManager.hear(
(
    (value, ctx) => ctx.replyMessage && /^\/select|\/s$/i.test(value)
), async (ctx) => {
    const { replyMessage } = ctx;
    const user = getUser(replyMessage);

    if (!user)
        return ctx.send('*User is not found*', {parse_mode});

    selectedUser = user;
    ctx.send(`*Selected user:* ${user.name}`, {parse_mode});
})

// Messages to forward
hearManager.hear({}, async (ctx) => {
    const { replyMessage } = ctx;

    if (!replyMessage && !selectedUser)
        return ctx.send('*User not selected*', {parse_mode});

    // User selected in the system
    if (!replyMessage && selectedUser)
        return messageManager(ctx, selectedUser.id);

    const user = getUser(replyMessage);

    if (!user)
        return ctx.send('*User is not found*', {parse_mode});

    messageManager(ctx, user.id);
})

const messageManager = async (ctx, id) => {
    if (!ctx.hasAttachments())
        return sendText(id, ctx.text)

    ctx.getAttachments().forEach(async attachment => {
        switch (attachment.attachmentType) {
            case 'photo': {
                const { fileId } = attachment.smallSize;
                const url = await getUrl(fileId);
                sendPhoto(id, ctx.caption, url);
                break;
            }
            case 'voice': {
                const { fileId } = attachment;
                const url = await getUrl(fileId);
                sendVoice(id, url);
                break;
            }
            case 'sticker': {
                const { fileId } = attachment;
                const url = await getUrl(fileId);
                sendSticker(id, ctx.caption, url);
                break;
            }
            case 'document' : {
                const { fileId } = attachment;
                const url = await getUrl(fileId);
                sendDocument(id, ctx.caption, url);
                break;
            }
            default:
                ctx.send(`*Is not supported* \`(${attachment.attachmentType})\``, {parse_mode});
                break;
        }
    })
}

const getUser = (replyMessage) => {
    let text, entities

    // When there are attachments, the fields change
    if (replyMessage.caption) {
        text = replyMessage.caption;
        [ entities ] = replyMessage.captionEntities;
    } else {
        text = replyMessage.text;
        [ entities ] = replyMessage.entities;
    }

    // Not found
    if (!entities || !text)
        return false;

    // Check whitelist
    const name = text.substr(entities.offset, entities.length);
    const [user] = whitelist.filter(user => user.name === name);

    return user
}

const getUrl = async (file_id) => {
    const { file_path } = await api.getFile({file_id});
    return `https://api.telegram.org/file/bot${tgToken}/${file_path}`;
}

updates.on('message', hearManager.middleware);
