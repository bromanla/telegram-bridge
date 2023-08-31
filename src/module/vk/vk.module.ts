import { VkStore } from './vk.store.js';
import { VkService } from './vk.service.js';
import { VkController } from './vk.controller.js';

import type { EventService } from '#src/service/event.service.js';
import type { DatabaseService } from '#src/service/database.service.js';

export class VkModule {
  protected readonly store: VkStore;
  protected readonly service: VkService;
  protected readonly controller: VkController;

  constructor(emitter: EventService, database: DatabaseService) {
    this.store = new VkStore(database);
    this.service = new VkService(emitter);
    this.controller = new VkController(emitter, this.store, this.service);
  }

  public launch() {
    return this.service.launch();
  }
}
