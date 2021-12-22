import logger from '@logger';
import telegram from './loaders/telegram';

const launch = async () => {
  logger.info('launch...');

  await telegram();
};

launch();
