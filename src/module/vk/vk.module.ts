import { VkStore } from './vk.store.js';
import { VkService } from './vk.service.js';
import { VkController } from './vk.controller.js';

import type { LoggerService } from '#src/service/logger.service.js';
import type { ConfigService } from '#src/service/config.service.js';
import type { PrismaClient } from '@prisma/client';
import type { EventService } from '#src/service/event.service.js';

export class VkModule {
  private readonly store: VkStore;
  private readonly service: VkService;
  private readonly controller: VkController;

  constructor(
    logger: LoggerService,
    config: ConfigService,
    emitter: EventService,
    database: PrismaClient,
  ) {
    this.store = new VkStore(logger, database.user, database.chat);
    this.service = new VkService(config, logger, emitter);
    this.controller = new VkController(logger, this.store, this.service);
  }

  public launch() {
    return this.service.launch();
  }
}
