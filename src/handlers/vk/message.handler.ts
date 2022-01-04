import { VK, AttachmentType } from 'vk-io';
import { IState } from '@interfaces';
import telegramSendService from '@services/telegram.send.service';
import { getUserName, getChatTitle, getGroupName } from '@services/vk.title.service';

const rawAttachments = [
  AttachmentType.GIFT,
  AttachmentType.POLL,
  AttachmentType.WALL,
  AttachmentType.AUDIO,
  AttachmentType.STORY,
  AttachmentType.VIDEO,
  AttachmentType.DOCUMENT,
  AttachmentType.GRAFFITI,
  AttachmentType.WALL_REPLY
];

export default (bot: VK) => {
  bot.updates.on('message_new', async (ctx) => {
    if (ctx.isGroup) {
      const group = await getGroupName(ctx.senderId);
      console.log(group);
    }

    // if (ctx.isChat)

    // console.log(ctx.isGroup);
    // console.log(ctx.senderId);

    const user = await getUserName(ctx.senderId);

    const state: IState = {
      user,
      title: `<b>${user.name}</b>`,
      text: '',
      attachments: []
    };

    if (ctx.isChat && ctx.chatId) {
      const chat = await getChatTitle(ctx.chatId);
      state.chat = chat;
      state.title += ` [${chat.title}]`;
    }

    if (ctx.hasText) state.text = `${ctx.text}\n`;
    if (ctx.hasGeo) state.text += '[geo]\n';
    if (ctx.hasReplyMessage || ctx.hasForwards) state.text += '[reply message]\n';

    // Only text message
    if (!ctx.hasAttachments()) {
      telegramSendService.emit('text', state);
      return;
    }

    await ctx.loadMessagePayload();

    const images = ctx.getAttachments('photo').map((image) => image.largeSizeUrl);
    if (images.length) telegramSendService.emit('photo', { ...state, attachments: images });

    const voices = ctx.getAttachments('audio_message').map((voice) => voice.oggUrl);
    if (voices.length) telegramSendService.emit('voice', { ...state, attachments: voices });

    const stickers = ctx.getAttachments('sticker').map((sticker) => sticker.imagesWithBackground.pop()?.url);
    if (stickers.length) telegramSendService.emit('sticker', { ...state, attachments: stickers });

    const isRawAttachments = rawAttachments.reduce((res, type) => {
      let acc = res;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (ctx.getAttachments(type).length) {
        state.text += `[${type}]\n`;
        acc = true;
      }

      return acc;
    }, false);

    if (isRawAttachments) telegramSendService.emit('text', state);
  });
};
