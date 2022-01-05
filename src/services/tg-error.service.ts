import { api } from '@loaders/tg.loader';
import config from '@config';
import ApiError from 'utils/tg-error.utility';
import logger from '@logger';

export default (e: ApiError | Error) => {
  if (e instanceof ApiError) {
    api.sendMessage(config.telegram.id, e.message);
  } else {
    logger.error(e);
    api.sendMessage(config.telegram.id, 'Unknown error. See logs');
  }
};
