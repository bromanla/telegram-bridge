import { VK } from 'vk-io';
import telegramSendService from '@services/telegram.send.service';

export default (bot: VK) => {
  bot.updates.on('message_new', async (ctx) => {
    const { state } = ctx;

    if (ctx.hasText) state.text = ctx.text;

    if (ctx.hasAttachments()) {
      await ctx.loadMessagePayload();

      ctx.getAttachments('photo').forEach((image) => {
        const url = image.largeSizeUrl;
        state.attachments.push({ type: 'photo', url });
      });

      ctx.getAttachments('audio_message').forEach((voice) => {
        const { url } = voice;
        state.attachments.push({ type: 'voice', url });
      });

      ctx.getAttachments('doc').forEach((doc) => {
        const { url } = doc;
        state.attachments.push({ type: 'document', url });
      });

      ctx.getAttachments('sticker').forEach((sticker) => {
        const url = sticker.imagesWithBackground.pop()?.url;
        state.attachments.push({ type: 'sticker', url });
      });
    }

    telegramSendService.emit('message', state);
  });
};
