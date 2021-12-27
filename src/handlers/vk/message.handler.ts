import { VK } from 'vk-io';
import telegramSendService from '@services/telegram.send.service';

export default (bot: VK) => {
  bot.updates.on('message_new', async (ctx) => {
    const { state } = ctx;

    if (ctx.hasText) state.text = ctx.text;

    if (ctx.hasReplyMessage || ctx.hasForwards) state.text += '\n[reply message]';

    // Only text message
    if (!ctx.hasAttachments()) {
      state.type = 'text';
      telegramSendService.emit('message', state);
      return;
    }

    // FIXME

    await ctx.loadMessagePayload();

    if (ctx.getAttachments('wall').length) state.text += '\n[wall]';
    if (ctx.getAttachments('poll').length) state.text += '\n[poll]';
    if (ctx.getAttachments('gift').length) state.text += '\n[gift]';
    if (ctx.getAttachments('audio').length) state.text += '\n[audio]';
    if (ctx.getAttachments('video').length) state.text += '\n[video]';
    if (ctx.getAttachments('story').length) state.text += '\n[story]';
    if (ctx.getAttachments('sticker').length) state.text += '\n[sticker]';
    if (ctx.getAttachments('graffiti').length) state.text += '\n[graffiti]';
    if (ctx.getAttachments('wall_reply').length) state.text += '\n[wall_reply]';

    const images = ctx.getAttachments('photo').map((image) => image.largeSizeUrl);

    if (images.length) {
      state.type = 'image';
      state.attachments = images;
      telegramSendService.emit('message', state);
    }

    const voices = ctx.getAttachments('audio_message').map((voice) => voice.url);

    if (voices.length) {
      state.type = 'voice';
      state.attachments = voices;
    }

    const documents = ctx.getAttachments('doc').map((document) => document.url);

    if (documents.length) {
      state.type = 'document';
      state.attachments = documents;
    }
  });
};
