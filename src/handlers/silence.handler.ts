import { Composer } from 'telegraf';
import config from '@config';

const bot = new Composer();

bot.command('silence', (ctx) => {
  config.silence = !config.silence;

  ctx.reply(`Silence ${config.silence ? 'on' : 'is off'}`);
});

export default bot;
