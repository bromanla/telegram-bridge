import { Cache } from '#src/common/cache.decorator.js';

import type { LoggerService } from '#src/service/logger.service.js';
import type { Prisma, PrismaClient } from '@prisma/client';

export class TelegramStore {
  constructor(
    private readonly logger: LoggerService,
    private readonly forumStore: PrismaClient['forum'],
  ) {}

  public async createForum(data: Prisma.ForumCreateInput) {
    const forum = await this.forumStore.create({ data });
    this.logger.debug(`Forum created (${forum.id})`);

    return forum;
  }

  @Cache()
  public async findOneForum(id: number) {
    return this.forumStore.findFirst({
      where: {
        OR: [{ chatId: id }, { userId: id }],
      },
    });
  }

  @Cache()
  public async getForum(forumId: number) {
    return this.forumStore.findUnique({
      where: { id: forumId },
    });
  }
}
