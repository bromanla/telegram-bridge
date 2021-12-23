import { Composer } from 'telegraf';

const bot = new Composer();

bot.start((ctx) => {
  ctx.reply('🙂');
});

export default bot;
