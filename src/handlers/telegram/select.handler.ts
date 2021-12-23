import { Composer } from 'telegraf';
import config from '@config';
import logger from '@logger';

const bot = new Composer();

bot.action(/^#([0-9]+)$/, async (ctx) => {
  const id = Number(ctx.match[1]);
  const user = config.vk.users.find((el) => el.id === id);

  if (!user) {
    logger.error(`User with id: ${id} is not contained in the settings.json`);
    await ctx.reply('Internal error, see logs');
    return;
  }

  config.vk.selected = user.id;
  const message = await ctx.reply(`${user?.name}`);
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  await ctx.unpinAllChatMessages();
  await ctx.pinChatMessage(message.message_id);
});

export default bot;
