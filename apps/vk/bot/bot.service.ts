import { VK } from "vk-io";
import { config } from "#src/common/config.ts";
import { logger } from "@bridge/common";
import { AsyncLocalStorage } from "node:async_hooks";
import { BotHandler } from "#src/bot/bot.handler.ts";
import { BotRouter } from "#src/bot/bot.router.ts";

import type { MessageContext } from "vk-io";
import type { BotStore } from "#src/bot/bot.store.ts";
import type { AsyncContext, NextFunction } from "#src/bot/bot.type.ts";
import type { BusService } from "@bridge/bus";

export class BotService {
  public bot: VK;
  public asyncContext = new AsyncLocalStorage<AsyncContext>();
  public handler: BotHandler;
  public router: BotRouter;

  constructor(public store: BotStore, public bus: BusService) {
    this.bot = new VK({ token: config.token });
    this.bot.updates.use(this.initAsyncContext.bind(this));

    this.handler = new BotHandler(this);
    this.router = new BotRouter(this);
  }

  private async getUserFromContext(ctx: MessageContext) {
    /**
     * | ctx.isUser | ctx.isGroup | !ctx.isUser && !ctx.isGroup | out   |
     * | ---------- | ----------- | --------------------------- | ----- |
     * | true       | true        | false                       | false |
     * | true       | false       | false                       | false |
     * | false      | true        | false                       | false |
     * | false      | false       | true                        | true  |
     */
    if (!ctx.isUser && !ctx.isGroup) return undefined;

    const userId = ctx.senderId;
    let user = await this.store.getUser(userId);

    if (!user) {
      const data = ctx.isGroup
        ? await this.loadGroupInfo(userId)
        : await this.loadUserInfo(userId);

      if (!data) {
        logger.warn(`Failed to load user`, { userId });
        return undefined;
      }

      user = await this.store.createUser(data);
    }

    return user;
  }

  private async getChatFromContext(ctx: MessageContext) {
    const chatId = ctx.chatId;
    if (!chatId) return undefined;

    let chat = await this.store.getChat(chatId);

    if (!chat) {
      const data = await this.loadChatInfo(chatId);

      if (!data) {
        logger.warn(`Failed to load chat (${chatId})`);
        return undefined;
      }

      chat = await this.store.createChat(data);
    }

    return chat;
  }

  private async initAsyncContext(ctx: MessageContext, next: NextFunction) {
    // TODO: comment only dev mode
    // if (ctx.isInbox) return next();

    const user = await this.getUserFromContext(ctx);
    if (!user) return;

    const chat = await this.getChatFromContext(ctx);

    this.asyncContext.run({ user, chat, event: {} }, () => {
      return next();
    });
  }

  /* Uploading user data via the API */
  private async loadUserInfo(userId: number) {
    const [user] = await this.bot.api.users.get({ user_ids: [userId] }) || [];

    if (!user) return undefined;

    const { first_name, last_name } = user;
    return { id: userId, first_name, last_name };
  }

  /* Uploading group data via the API */
  private async loadGroupInfo(groupId: number) {
    const { groups: [group] } = await this.bot.api.groups.getById({
      group_id: Math.abs(groupId),
    });

    if (!group) return undefined;
    return {
      id: groupId,
      full_name: `${group.name} [group]`,
      is_group: true,
    };
  }

  /* Uploading chat data via the API */
  private async loadChatInfo(chatId: number) {
    const chat = await this.bot.api.messages.getChat({ chat_id: chatId });
    if (!chat) return undefined;

    return {
      id: chatId,
      title: `${chat.title} [chat]`,
    };
  }

  public async launch() {
    this.bot.updates.startPolling();
    const [me] = await this.bot.api.users.get({});

    logger.info(`VK connection successful`, me);
  }
}
