import 'dotenv/config';
import { cleanEnv, num, str } from 'envalid';
import { join } from 'path';

const instance = Symbol('instance');

/* Singleton class */
export class ConfigInstance {
  static [instance]: ConfigInstance;

  public readonly telegram: {
    token: string;
    accessId: number;
    chatId: number;
  };

  public readonly vk: {
    token: string;
  };

  public readonly logger: {
    level: string;
  };

  public readonly store: {
    path: string;
  };

  public readonly isProduction: boolean;
  public readonly isDevelopment: boolean;

  private readonly launchTime: number;
  public get uptime() {
    return Date.now() - this.launchTime;
  }

  constructor() {
    if (ConfigInstance[instance]) return ConfigInstance[instance];

    const config = this.parse(process.env);

    this.telegram = {
      token: config.TELEGRAM_TOKEN,
      accessId: config.TELEGRAM_ACCESS_ID,
      chatId: config.TELEGRAM_CHAT_ID,
    };

    this.vk = {
      token: config.VK_TOKEN,
    };

    this.logger = {
      level: config.LOG_LEVEL,
    };

    this.store = {
      path: join(process.cwd(), 'store.db'),
    };

    this.isProduction = config.isProduction;
    this.isDevelopment = config.isDevelopment;
    this.launchTime = Date.now();

    ConfigInstance[instance] = this;
  }

  private parse(environment: unknown) {
    return cleanEnv(environment, {
      TELEGRAM_TOKEN: str(),
      TELEGRAM_ACCESS_ID: num(),
      TELEGRAM_CHAT_ID: num(),
      VK_TOKEN: str(),
      LOG_LEVEL: str(),
    });
  }
}
