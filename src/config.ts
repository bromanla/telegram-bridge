import { IConfig } from '@interfaces';
import dotenv from 'dotenv';

const { error } = dotenv.config();

if (error) {
  throw new Error('Couldn\'t find .env file');
}

const config: IConfig = {
  telegram: {
    token: process.env.TG_TOKEN ?? '',
    id: Number(process.env.TG_ID)
  },
  vk: {
    token: process.env.VK_TOKEN ?? '',
    selected: -1
  },
  mongo: {
    uri: process.env.MONGO_URI ?? ''
  },
  debug: process.env.NODE_ENV !== 'production'
};

export default config;
