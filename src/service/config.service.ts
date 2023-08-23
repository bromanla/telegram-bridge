import 'dotenv/config';
import { cleanEnv, num, str } from 'envalid';

export class ConfigService {
  public readonly isProduction: boolean;
  public readonly isDevelopment: boolean;

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

  constructor() {
    const config = cleanEnv(process.env, {
      TELEGRAM_TOKEN: str(),
      TELEGRAM_ACCESS_ID: num(),
      TELEGRAM_CHAT_ID: num(),
      VK_TOKEN: str(),
      LOG_LEVEL: str(),
    });

    this.isProduction = config.isProduction;
    this.isDevelopment = config.isDevelopment;

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
  }
}
