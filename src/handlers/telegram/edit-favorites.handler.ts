import { Composer, Markup } from 'telegraf';
import { ChatModel } from '@loaders/mongo.loader';
import ApiError from '@utils/tg-error.utility';

const bot = new Composer();

bot.command('edit', async (ctx) => {
  const users = await ChatModel.find({ favorite: true }).lean();
  const keyboard = users.map((el) => Markup.button.callback(el.name, `remove#${el.chatId}`));

  if (!users.length) throw new ApiError('No featured users');

  ctx.reply(
    'Select the user you want to remove',
    Markup.inlineKeyboard(keyboard, { columns: 2 })
  );
});

// (remove) + (hash sign) + (optional minus) + (user/chat/group id)
bot.action(/^remove#(-?[0-9]+)$/, async (ctx) => {
  const id = Number(ctx.match[1]);
  const user = await ChatModel.findOne({ chatId: id });

  if (!user) throw new ApiError('Internal error');

  user.favorite = false;
  await user.save();

  await ctx.answerCbQuery(`${user.name} removed from the favorites`);
  await ctx.deleteMessage();
});

export default bot;
