import ApiError from '@utils/tg-error.utility';
import { Composer } from 'telegraf';
import { ChatModel, MessageModel } from '@loaders/mongo.loader';

const bot = new Composer();

bot.command('favorite', async (ctx) => {
  // @ts-ignore
  if (!ctx.message?.reply_to_message) throw new ApiError('No reply message');

  // @ts-ignore
  const messageId = ctx.message.reply_to_message.message_id;
  const message = await MessageModel.findOne({ messageId });
  if (!message) throw new ApiError('Could not identify the sender');

  const user = await ChatModel.findOne({ chatId: message.chatId });
  if (!user) throw new ApiError('User is not in the database');

  user.favorite = true;
  await user.save();
  await ctx.reply(`${user.name} added to favorites`);
});

export default bot;
