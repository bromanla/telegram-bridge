import { Telegraf } from 'telegraf';
import config from '@config';
import handlers from '../handlers/telegram';

const bot = new Telegraf(config.telegram.token);
const api = bot.telegram;

const loader = async () => {
  // Set available commands to the bot
  await bot.telegram.setMyCommands(config.telegram.commands);

  // Get pinned message
  // Solving the problem of telegraf types (crutch)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chat: any = await bot.telegram.getChat(config.telegram.id);

  if (chat?.pinned_message) {
    const name: string = chat.pinned_message.text;
    const user = config.vk.users.find(((el) => el.name === name));
    if (user) config.vk.selected = user.id;
  }

  // Only accept messages from a registered user
  bot.use(async (ctx, next) => (ctx?.chat?.id === config.telegram.id ? next() : false));

  // Connecting message and action handlers
  handlers.forEach((handler) => bot.use(handler));

  await bot.launch();

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

export { api, loader };
