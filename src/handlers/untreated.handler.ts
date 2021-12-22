import { Composer } from 'telegraf';

const bot = new Composer();

bot.on('message', (ctx) => {
  ctx.reply('❗️ User not selected');
});

export default bot;
