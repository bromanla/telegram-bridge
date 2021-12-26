import { Composer } from 'telegraf';
import config from '@config';
import VkEmitter from '@services/vk.send.service';

const bot = new Composer();

bot.on('message', async (ctx, next) => {
  // Solving the problem of telegraf (crutch)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { message }: any = ctx;

  if (message?.reply_to_message) {
    // TODO: reply to message handler
    console.log('Пересланное');
    return;
  }

  if (config.vk.selected === -1) {
    await ctx.reply('User not selected');
    return;
  }

  await next();
});

bot.on('text', async (ctx) => {
  const { text } = ctx.message;
  VkEmitter.emit('text', {
    id: config.vk.selected,
    text
  });
});

bot.on('voice', async (ctx) => {
  const fileId = ctx.message.voice.file_id;
  const { href } = await ctx.telegram.getFileLink(fileId);

  VkEmitter.emit('voice', {
    id: config.vk.selected,
    href
  });
});

bot.on('photo', async (ctx) => {
  const fileId = ctx.message.photo.pop()?.file_id;

  if (!fileId) {
    // Todo catch
    return;
  }

  const { href } = await ctx.telegram.getFileLink(fileId);
  VkEmitter.emit('photo', {
    id: config.vk.selected,
    href
  });
});

bot.on('document', async (ctx) => {
  const fileId = ctx.message.document.file_id;

  const { href } = await ctx.telegram.getFileLink(fileId);
  VkEmitter.emit('document', {
    id: config.vk.selected,
    href
  });
});

bot.on('sticker', async (ctx) => {
  const fileId = ctx.message.sticker.thumb?.file_id;

  if (!fileId) {
    // Todo catch
    return;
  }

  const { href } = await ctx.telegram.getFileLink(fileId);
  VkEmitter.emit('sticker', {
    id: config.vk.selected,
    href
  });
});

export default bot;
