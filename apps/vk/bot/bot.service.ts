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

  constructor(public store: BotStore, public bus: BusService) {
    this.bot = new VK({ token: config.token });
    this.bot.updates.on("message_new", this.initAsyncContext.bind(this));
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
    if (!ctx.isInbox) return;

    const user = await this.getUserFromContext(ctx);
    if (!user) return;

    const chat = await this.getChatFromContext(ctx);

    this.asyncContext.run({
      user,
      chat,
      unsupported: [],
    }, () => next());
  }

  /* Uploading user data via the API */
  private async loadUserInfo(userId: number) {
    const [user] = await this.bot.api.users.get({ user_ids: [userId] }) || [];
    if (!user) return undefined;

    const { first_name, last_name } = user;
    return {
      id: userId,
      full_name: `${last_name} ${first_name} [user]`,
      is_group: false,
    };
  }

  /* Uploading group data via the API */
  private async loadGroupInfo(groupId: number) {
    /**
     * FIXME: vk-io 4.9.0+ contract has changed
     * { groups: [group] }
     */
    const [group] = await this.bot.api.groups.getById({
      group_id: Math.abs(groupId),
    }) as any;

    if (!group) return undefined;
    return {
      id: groupId,
      full_name: `${group.name} [group]`,
      is_group: true,
    };
  }

  /* Uploading chat data via the API */
  private async loadChatInfo(chatId: number) {
    /**
     * FIXME: vk-io 4.9.0+ there is no need to use any
     */
    const chat = await (this.bot.api.messages as any).getChat({
      chat_id: chatId,
    });
    if (!chat) return undefined;

    return {
      id: chatId,
      title: `${chat.title} [chat]`,
    };
  }

  public async launch() {
    this.bot.updates.startPolling();
    const [me] = await this.bot.api.users.get({});

    new BotHandler(this);
    new BotRouter(this);

    logger.info(`VK connection successful`, me);
  }
}
