import { Telegraf } from 'telegraf';
import config from '@config';
import tgErrorService from '@services/tg-error.service';
import handlers from '../handlers/telegram';
import { ChatModel } from './mongo.loader';

const bot = new Telegraf(config.telegram.token);
const api = bot.telegram;

const loader = async () => {
  // Set available commands to the bot
  await bot.telegram.setMyCommands([
    { command: 'users', description: 'Show favorite users' },
    { command: 'clear', description: 'Clear selected user' },
    { command: 'select', description: 'Switch dialog to this user' },
    { command: 'favorite', description: 'Add user to favorites' },
    { command: 'edit', description: 'Edit favorite users' }
  ]);

  // Get pinned message
  const chat = await bot.telegram.getChat(config.telegram.id);

  if (chat?.pinned_message) {
    // @ts-ignore
    const name: string = chat.pinned_message.text;
    const user = await ChatModel.findOne({ name }).lean();
    if (user) config.vk.selected = user.chatId;
  }

  // Error handler
  bot.use(async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      // @ts-ignore
      tgErrorService(e);
    }
  });

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
