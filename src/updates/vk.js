const { updates } = require('../connection/vk');
const { sendText, sendPhoto, sendVoice, sendSticker, sendDocument } = require('../send/telegram');
const { whitelist } = require('../config.json');

// Middleware (for further expansion)
updates.on('message', async (ctx, next) => {
    const [ user ] = whitelist.filter(user => user.id == ctx.senderId);

    if (!user)
        return

    ctx.state.user = user;
    next();
})

updates.hear({}, async (ctx) => {
    const { user }  = ctx.state;

    // Forming a message
    let text = `*${user.name}*\n`;
    text += ctx.text || '';

    if (ctx.hasForwards)
        text += (ctx.hasText ? '\n' : '') + '`(forwards)`';

    if (!ctx.hasAttachments()) {
        return sendText(text);
    }

    await ctx.loadMessagePayload();

    ctx.getAttachments().forEach(attachment => {
        switch (attachment.type) {
            case 'photo':
                sendPhoto(text, attachment.largePhoto);
                break;
            case 'audio_message':
                sendVoice(text, attachment.oggUrl);
                break;
            case 'sticker':
                sendSticker(text, attachment.imagesWithBackground.pop().url);
                break;
            case 'doc':
                sendDocument(text, attachment.url);
                break;
            default:
                text += (ctx.hasText ? '\n' : '') + `\`(${attachment.type}\`)`;
                sendText(text);
                break;
        }
    })
})
