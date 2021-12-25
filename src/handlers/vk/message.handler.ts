import { VK } from 'vk-io';
import config from '@config';
// eslint-disable-next-line import/no-cycle
import TelegramEmitter from '../../services/telegram';

export default (bot: VK) => {
  bot.updates.on('message_new', async (ctx) => {
    // Incoming messages only
    if (!ctx.isInbox) return;

    const id = ctx.senderId;
    const { isGroup } = ctx;
    const text = ctx.hasText ? ctx.text : '';

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const [{ first_name, last_name }] = await bot.api.users.get({ user_ids: String(id) });
    const name = first_name + last_name;

    if (!ctx.hasAttachments()) {
      TelegramEmitter.emit('text', { id, text, name });
      return;
    }

    await ctx.loadMessagePayload();

    ctx.getAttachments('photo').forEach((image) => {
      const url = image.largeSizeUrl;

      TelegramEmitter.emit('photo', {
        id, text, name, url
      });
    });

    ctx.getAttachments('audio_message').forEach((voice) => {
      const { url } = voice;

      TelegramEmitter.emit('voice', {
        id, text, name, url
      });
    });

    ctx.getAttachments('doc').forEach((doc) => {
      const { url } = doc;

      TelegramEmitter.emit('doc', {
        id, text, name, url
      });
    });

    ctx.getAttachments('sticker').forEach((sticker) => {
      const url = sticker.imagesWithBackground.pop()?.url;

      TelegramEmitter.emit('sticker', {
        id, text, name, url
      });
    });
  });
};
