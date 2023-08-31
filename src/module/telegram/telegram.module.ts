import { TelegramStore } from './telegram.store.js';
import { TelegramService } from './telegram.service.js';
import { TelegramController } from './telegram.controller.js';

import type { EventService } from '#src/service/event.service.js';
import type { DatabaseService } from '#src/service/database.service.js';

export class TelegramModule {
  protected readonly store: TelegramStore;
  protected readonly service: TelegramService;
  protected readonly controller: TelegramController;

  constructor(emitter: EventService, database: DatabaseService) {
    this.store = new TelegramStore(database);
    this.service = new TelegramService(emitter, this.store);
    this.controller = new TelegramController(emitter, this.store, this.service);
  }

  public launch() {
    return this.service.launch();
  }
}
