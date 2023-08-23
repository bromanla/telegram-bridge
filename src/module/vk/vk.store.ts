import { Cache } from '#src/common/cache.decorator.js';

import type { Prisma, PrismaClient } from '@prisma/client';
import type { LoggerService } from '#src/service/logger.service.js';

export class VkStore {
  constructor(
    private readonly logger: LoggerService,
    private readonly userStore: PrismaClient['user'],
    private readonly chatStore: PrismaClient['chat'],
  ) {}

  public async createUser(data: Prisma.UserCreateInput) {
    const user = await this.userStore.create({ data });
    this.logger.debug(`User created (${user.id})`);

    return user;
  }

  @Cache()
  public async getUser(userId: number) {
    return this.userStore.findUnique({
      where: { id: userId },
    });
  }

  public async createChat(data: Prisma.ChatCreateInput) {
    const chat = await this.chatStore.create({ data });
    this.logger.debug(`Chat created (${chat.id})`);

    return chat;
  }

  @Cache()
  public async getChat(chatId: number) {
    return this.chatStore.findUnique({
      where: { id: chatId },
    });
  }
}
