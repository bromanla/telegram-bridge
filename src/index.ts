import '@total-typescript/ts-reset';
import { PrismaClient } from '@prisma/client';
import { VkModule } from '#src/module/vk/vk.module.js';
import { EventService } from '#src/service/event.service.js';
import { LoggerService } from '#src/service/logger.service.js';
import { ConfigService } from '#src/service/config.service.js';
import { TelegramModule } from '#src/module/telegram/telegram.module.js';

const emitter = new EventService();
const config = new ConfigService();
const logger = new LoggerService(config);
const database = new PrismaClient();

const vk = new VkModule(logger, config, emitter, database);
const telegram = new TelegramModule(logger, config, emitter, database);

await vk.launch();
await telegram.launch();

logger.info(`node: ${process.version}`);
