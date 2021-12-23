import { VK } from 'vk-io';
import config from '@config';
import handlers from '../handlers/vk';

export default async () => {
  const bot = new VK({ token: config.vk.token });

  handlers.forEach((handler) => handler(bot));

  await bot.updates.start();
};
