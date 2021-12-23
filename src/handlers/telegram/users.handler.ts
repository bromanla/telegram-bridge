import { Composer, Markup } from 'telegraf';
import config from '@config';

const bot = new Composer();

bot.command('users', async (ctx) => {
  const keyboard = config.vk.users.map((el) => Markup.button.callback(el.name, `#${el.id}`));

  ctx.reply(
    'Select the user you want to switch to:',
    Markup.inlineKeyboard(keyboard, { columns: 2 })
  );
});

export default bot;
