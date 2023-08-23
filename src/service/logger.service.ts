import { createLogger, format, transports } from 'winston';
import { ConfigService } from '#src/service/config.service.js';

import type { Logger } from 'winston';

export class LoggerService {
  private logger: Logger;

  constructor(config: ConfigService) {
    const loggerFormat = [
      format.timestamp(),
      format.splat(),
      format.errors({ stack: true }),
      format.json(),
    ];

    if (config.isDevelopment)
      loggerFormat.push(format.prettyPrint({ colorize: true }));

    this.logger = createLogger({
      level: config.logger.level,
      format: format.combine(...loggerFormat),
      transports: [new transports.Console()],
    });
  }

  public error(message: any) {
    this.logger.error(message);
  }

  public warn(message: any) {
    this.logger.warn(message);
  }

  public info(message: any) {
    this.logger.info(message);
  }

  public verbose(message: any) {
    this.logger.verbose(message);
  }

  public debug(message: any) {
    this.logger.debug(message);
  }
}
