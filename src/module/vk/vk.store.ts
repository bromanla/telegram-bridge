import { LoggerInstance } from '#src/common/logger.instance.js';
import { Cache } from '#src/common/cache.decorator.js';

import type { Insertable } from 'kysely';
import type {
  Chat,
  User,
  DatabaseService,
} from '#src/service/database.service.js';
export class VkStore {
  private readonly logger = new LoggerInstance();

  constructor(private readonly database: DatabaseService) {}

  public async createUser(data: Insertable<User>) {
    const user = await this.database
      .insertInto('user')
      .values(data)
      .returningAll()
      .executeTakeFirst();

    this.logger.debug(`User created (${user!.id})`);

    return user!;
  }

  @Cache()
  public async getUser(userId: number) {
    return this.database
      .selectFrom('user')
      .where('id', '=', userId)
      .selectAll()
      .executeTakeFirst();
  }

  public async createChat(data: Insertable<Chat>) {
    const chat = await this.database
      .insertInto('chat')
      .values(data)
      .returningAll()
      .executeTakeFirst();

    this.logger.debug(`Chat created (${chat!.id})`);
    return chat!;
  }

  @Cache()
  public async getChat(chatId: number) {
    return this.database
      .selectFrom('chat')
      .where('id', '=', chatId)
      .selectAll()
      .executeTakeFirst();
  }
}
