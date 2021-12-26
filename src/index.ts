import logger from '@logger';
import { loader as tgLoader } from '@loaders/tg.loader';
import { loader as vkLoader } from '@loaders/vk.loader';
import { loader as mongoLoader } from '@loaders/mongo.loader';

const launch = async () => {
  await mongoLoader();
  logger.info('mongo launched');

  await tgLoader();
  logger.info('telegram launched');

  await vkLoader();
  logger.info('vk launched');
};

launch();
