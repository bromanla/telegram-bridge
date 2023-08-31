import { VkModule } from '#src/module/vk/vk.module.js';
import { EventService } from '#src/service/event.service.js';
import { TelegramModule } from '#src/module/telegram/telegram.module.js';
import { LoggerInstance } from '#src/common/logger.instance.js';
import { DatabaseService } from '#src/service/database.service.js';

const logger = new LoggerInstance();
const emitter = new EventService();
const database = new DatabaseService();

const vk = new VkModule(emitter, database);
const telegram = new TelegramModule(emitter, database);

await vk.launch();
await telegram.launch();

logger.info(`node: ${process.version}`);
