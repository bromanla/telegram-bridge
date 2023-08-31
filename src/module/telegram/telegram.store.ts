import { Cache } from '#src/common/cache.decorator.js';
import { LoggerInstance } from '#src/common/logger.instance.js';

import type { Insertable } from 'kysely';
import type { DatabaseService, Forum } from '#src/service/database.service.js';

export class TelegramStore {
  private readonly logger = new LoggerInstance();

  constructor(private readonly database: DatabaseService) {}

  public async createForum(data: Insertable<Forum>) {
    const forum = await this.database
      .insertInto('forum')
      .values(data)
      .returningAll()
      .executeTakeFirst();

    this.logger.debug(`Forum created (${forum!.id})`);

    return forum!;
  }

  @Cache()
  public async findOneForum(id: number) {
    return this.database
      .selectFrom('forum')
      .where((eb) => eb.or([eb('chat_id', '=', id), eb('user_id', '=', id)]))
      .selectAll()
      .executeTakeFirst();
  }

  @Cache()
  public async getForum(forumId: number) {
    return this.database
      .selectFrom('forum')
      .where('id', '=', forumId)
      .selectAll()
      .executeTakeFirst();
  }
}
