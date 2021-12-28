import { VK, AttachmentTypeString, AttachmentType } from 'vk-io';
import telegramSendService from '@services/telegram.send.service';

export default (bot: VK) => {
  bot.updates.on('message_new', async (ctx) => {
    const { state } = ctx;
    state.text = ctx.hasText ? ctx.text : '';

    if (ctx.hasReplyMessage || ctx.hasForwards) state.text += '\n[reply message]';

    // Only text message
    if (!ctx.hasAttachments()) {
      telegramSendService.emit('message', state);
      return;
    }

    await ctx.loadMessagePayload();

    const images = ctx.getAttachments('photo').map((image) => image.largeSizeUrl);

    if (images.length) {
      state.type = 'photo';
      state.attachments = images;
      telegramSendService.emit('message', state);
    }

    const voices = ctx.getAttachments('audio_message').map((voice) => voice.url);

    if (voices.length) {
      state.type = 'voice';
      state.attachments = voices;
      telegramSendService.emit('message', state);
    }

    const documents = ctx.getAttachments('doc').map((document) => document.url);

    if (documents.length) {
      state.type = 'document';
      state.attachments = documents;
      telegramSendService.emit('message', state);
    }

    const stickers = ctx.getAttachments('sticker').map((sticker) => sticker.imagesWithBackground.pop()?.url);

    if (stickers.length) {
      state.type = 'sticker';
      state.attachments = stickers;
      telegramSendService.emit('message', state);
    }

    const rawAttachments = [
      AttachmentType.WALL,
      AttachmentType.POLL,
      AttachmentType.GIFT,
      AttachmentType.AUDIO,
      AttachmentType.VIDEO,
      AttachmentType.STORY,
      AttachmentType.GRAFFITI,
      AttachmentType.WALL_REPLY
    ];

    const isRawAttachments = rawAttachments.reduce((res, type) => {
      let acc = res;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (ctx.getAttachments(type).length) {
        state.type = 'text';
        state.text += `\n[${type}]`;
        acc = true;
      }
      return acc;
    }, false);

    if (isRawAttachments) {
      telegramSendService.emit('message', state);
    }
  });
};
