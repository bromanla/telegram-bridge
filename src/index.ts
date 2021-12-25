import logger from '@logger';
import { loader as tgLoader } from './loaders/telegram';
import { loader as vkLoader } from './loaders/vk';

const launch = async () => {
  logger.info('launch...');

  await tgLoader();
  await vkLoader();

  logger.info('ok');
};

launch();
