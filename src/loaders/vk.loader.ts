import { VK } from 'vk-io';
import config from '@config';

import handlers from '../handlers/vk';

const bot = new VK({ token: config.vk.token });
const { api, upload } = bot;

const loader = async () => {
  handlers.forEach((handler) => handler(bot));
  await bot.updates.start();
};

export { api, upload, loader };
