import { TelegramStore } from './telegram.store.js';
import { TelegramService } from './telegram.service.js';
import { TelegramController } from './telegram.controller.js';

import type { LoggerService } from '#src/service/logger.service.js';
import type { ConfigService } from '#src/service/config.service.js';
import type { PrismaClient } from '@prisma/client';
import type { EventService } from '#src/service/event.service.js';

export class TelegramModule {
  private readonly store: TelegramStore;
  private readonly service: TelegramService;
  private readonly controller: TelegramController;

  constructor(
    logger: LoggerService,
    config: ConfigService,
    emitter: EventService,
    database: PrismaClient,
  ) {
    this.store = new TelegramStore(logger, database.forum);
    this.service = new TelegramService(config, logger, emitter, this.store);
    this.controller = new TelegramController(
      logger,
      this.store,
      this.service,
      emitter,
      config,
    );
  }

  public launch() {
    return this.service.launch();
  }
}
