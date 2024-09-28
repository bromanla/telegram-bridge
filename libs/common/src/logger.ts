import { createLogger, format, transports } from 'winston';

const loggerFormat = [
  format.timestamp(),
  format.errors({ stack: true }),
  format.json(),
];

if (process.env.NODE_ENV === 'development') {
  loggerFormat.push(format.prettyPrint({ colorize: true }));
}

export const logger = createLogger({
  level: process.env.LOGGER_LEVEL ?? 'debug',
  format: format.combine(...loggerFormat),
  transports: [new transports.Console()],
});
