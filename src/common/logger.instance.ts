import { createLogger, format, transports } from 'winston';
import { ConfigInstance } from '#src/common/config.instance.js';
import type { Logger } from 'winston';

const instance = Symbol('instance');

/* Singleton class */
export class LoggerInstance {
  static [instance]: LoggerInstance;

  private logger: Logger;

  constructor() {
    if (LoggerInstance[instance]) return LoggerInstance[instance];

    const config = new ConfigInstance();

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

    LoggerInstance[instance] = this;
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
