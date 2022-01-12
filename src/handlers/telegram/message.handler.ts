import { Composer } from 'telegraf';
import vkSendService from '@services/vk-send.service';
import TgMessageUtility from 'utils/tg-message.utility';
import ApiError from 'utils/tg-error.utility';

const bot = new Composer();
const tgMessageUtility = new TgMessageUtility();

bot.on('message', async (ctx, next) => {
  const { message } = ctx;

  // @ts-ignore
  if (message?.forward_from || message?.forward_date) throw new ApiError('Forwarded messages are not supported');

  await tgMessageUtility.identificationRecipient(message);

  await next();
});

bot.on('text', async (ctx) => {
  const id = tgMessageUtility.recipient;
  const { text } = ctx.message;

  vkSendService.emit('text', { id, text });
});

bot.on('voice', async (ctx) => {
  const id = tgMessageUtility.recipient;
  const fileId = ctx.message.voice.file_id;
  const { href } = await ctx.telegram.getFileLink(fileId);

  vkSendService.emit('voice', { id, href });
});

bot.on('photo', async (ctx) => {
  const id = tgMessageUtility.recipient;
  const fileId = ctx.message.photo.pop()?.file_id;

  if (!fileId) throw new ApiError('Failed to get fileId');

  const { href } = await ctx.telegram.getFileLink(fileId);
  vkSendService.emit('photo', { id, href });
});

bot.on('document', async (ctx) => {
  const id = tgMessageUtility.recipient;
  const fileId = ctx.message.document.file_id;

  const { href } = await ctx.telegram.getFileLink(fileId);
  vkSendService.emit('document', { id, href });
});

bot.on('sticker', async (ctx) => {
  const id = tgMessageUtility.recipient;
  const fileId = ctx.message.sticker.file_id;

  if (!fileId) throw new ApiError('Failed to get fileId');

  const { href } = await ctx.telegram.getFileLink(fileId);
  vkSendService.emit('sticker', { id, href });
});

export default bot;
