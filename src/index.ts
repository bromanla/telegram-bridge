import logger from '@logger';
import telegram from './loaders/telegram';
import vk from './loaders/vk';

const launch = async () => {
  logger.info('launch...');

  await telegram();
  await vk();
};

launch();
