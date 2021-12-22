import { Composer } from 'telegraf';
import config from '@config';

const bot = new Composer();

bot.command('clear', async (ctx) => {
  config.vk.selected = -1;

  await ctx.unpinAllChatMessages();
  await ctx.reply('Cleared selected user');
});

export default bot;
