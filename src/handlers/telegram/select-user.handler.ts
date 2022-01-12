import ApiError from '@utils/tg-error.utility';
import { Composer } from 'telegraf';
import { ChatModel, MessageModel } from '@loaders/mongo.loader';
import config from '@config';

const bot = new Composer();

bot.command('select', async (ctx) => {
  // @ts-ignore
  if (!ctx.message?.reply_to_message) throw new ApiError('No reply message');

  // @ts-ignore
  const messageId = ctx.message.reply_to_message.message_id;
  const message = await MessageModel.findOne({ messageId });
  if (!message) throw new ApiError('Could not identify the sender');

  const user = await ChatModel.findOne({ chatId: message.chatId });
  if (!user) throw new ApiError('User is not in the database');

  config.vk.selected = user.chatId;

  const replyMessage = await ctx.reply(`${user.name}`);
  await ctx.unpinAllChatMessages();
  await ctx.pinChatMessage(replyMessage.message_id);
});

export default bot;
