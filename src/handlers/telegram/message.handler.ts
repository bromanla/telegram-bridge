import { Composer } from 'telegraf';
import config from '@config';

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
  ctx.reply(ctx.message.text);
});

bot.on('voice', async (ctx) => {
  const fileId = ctx.message.voice.file_id;
  const { href } = await ctx.telegram.getFileLink(fileId);
  console.log(href);
  ctx.reply('voice');
});

bot.on('photo', async (ctx) => {
  const fileId = ctx.message.photo.pop()?.file_id;

  if (!fileId) {
    // Todo catch
    return;
  }

  const { href } = await ctx.telegram.getFileLink(fileId);
  console.log(href);
  ctx.reply('photo');
});

bot.on('sticker', async (ctx) => {
  const fileId = ctx.message.sticker.thumb?.file_id;

  if (!fileId) {
    // Todo catch
    return;
  }

  const { href } = await ctx.telegram.getFileLink(fileId);
  console.log(href);
  ctx.reply('sticker');
});

export default bot;
