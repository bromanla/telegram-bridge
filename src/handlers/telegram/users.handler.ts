import { Composer, Markup } from 'telegraf';
import { ChatModel } from '@loaders/mongo.loader';
import ApiError from '@utils/tg-error.utility';
import config from '@config';

const bot = new Composer();

bot.command('users', async (ctx) => {
  const users = await ChatModel.find({ favorite: true }).lean();
  const keyboard = users.map((el) => Markup.button.callback(el.name, `#${el.chatId}`));

  if (!users.length) throw new ApiError('No featured users');

  ctx.reply(
    'Select the user you want to switch to:',
    Markup.inlineKeyboard(keyboard, { columns: 2 })
  );
});

// (hash sign) + (optional minus) + (user/chat/group id)
bot.action(/^#(-?[0-9]+)$/, async (ctx) => {
  const id = Number(ctx.match[1]);
  const user = await ChatModel.findOne({ chatId: id }).lean();

  if (!user) throw new ApiError('Internal error');

  config.vk.selected = user.chatId;
  const message = await ctx.reply(`${user.name}`);
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  await ctx.unpinAllChatMessages();
  await ctx.pinChatMessage(message.message_id);
});

export default bot;
