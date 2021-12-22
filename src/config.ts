import { IConfig } from '@interfaces/IConfig';

import dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const { error } = dotenv.config();

if (error) {
  throw new Error('Couldn\'t find .env file');
}

const settingsPath = resolve(__dirname, '../', 'settings.json');
const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));

const ConfigInstance: IConfig = {
  telegram: {
    token: process.env.TG_TOKEN ?? '',
    id: Number(process.env.TG_ID),
    commands: settings.commands
  },
  vk: {
    selected: -1,
    users: settings.users
  },
  debug: process.env.NODE_ENV !== 'production',
  silence: false
};

export default ConfigInstance;
