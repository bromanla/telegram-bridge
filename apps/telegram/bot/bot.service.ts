import { Bot } from "grammy";
import { config } from "#src/common/config.ts";
import { logger } from "@bridge/common";
import { parseMode } from "@grammyjs/parse-mode";
import { AsyncLocalStorage } from "node:async_hooks";

import { getUptime } from "#src/common/uptime.ts";
import { BotHandler } from "#src/bot/bot.handler.ts";
import { BotRouter } from "#src/bot/bot.router.ts";
import { i18n } from "#src/bot/middlewares/i18n.ts";

import type { BotError, NextFunction } from "grammy";
import type { BotContext, LocalStorage } from "#src/bot/bot.type.ts";
import type { BusService } from "@bridge/bus";
import type { BotStore } from "#src/bot/bot.store.ts";

export class BotService {
  private startAt: number;

  public readonly bot: Bot<BotContext>;
  public readonly asyncStorage = new AsyncLocalStorage<LocalStorage>();

  constructor(readonly store: BotStore, readonly bus: BusService) {
    this.bot = new Bot<BotContext>(config.token);
    this.bot.api.config.use(parseMode("HTML"));
    this.bot.use(i18n);
    this.bot.use(this.initLocalStorage.bind(this));
  }

  private async initLocalStorage(
    ctx: BotContext,
    next: NextFunction,
  ) {
    if (ctx.chat?.id !== config.chatId) {
      logger.warn("access denied", ctx.from);
      return;
    }

    if (!ctx.message) {
      logger.warn("invalid message", ctx.update);
      return;
    }

    const forumId = ctx.message.message_thread_id;
    if (!forumId) {
      const uptime = getUptime(this.startAt);
      const message = ctx.t("uptime", uptime);

      return ctx.reply(message);
    }

    const forum = await this.store.getForum(forumId);
    if (!forum) {
      logger.warn(`failed load forum`, { forumId });
      const message = ctx.t("error.loadForum", { forumId });

      return ctx.api.sendMessage(config.chatId, message, {
        message_thread_id: forumId,
      });
    }

    /**
     * Chats require an addition 2000000000
     * https://dev.vk.com/ru/method/messages.send#Параметры
     */
    const peerId = forum.chat_id ? forum.chat_id! + 2000000000 : forum.user_id!;
    const data = await this.store.getUserOrChatByForum(forum);
    console.log(data);

    // this.asyncStorage.run({ forum, peerId }, () => next());
  }

  private async catchMiddleware(err: BotError<BotContext>) {
    const ctx = err.ctx;
    const e = err.error;

    try {
      // TODO: i18n text
      await ctx.reply(
        e instanceof Error
          ? `Произошла ошибка: ${e.message}`
          : "Произошла непредвиденная ошибка",
      );
    } catch {
      logger.error(e);
    }
  }

  public async getFileUrl(fileId: string) {
    const url = await this.bot.api.getFile(fileId);

    return `https://api.telegram.org/file/bot${config.token}/${url.file_path}`;
  }

  public async launch() {
    this.bot.catch(this.catchMiddleware.bind(this));
    this.bot.start({ drop_pending_updates: true });
    this.startAt = Date.now();

    const me = await this.bot.api.getMe();

    new BotHandler(this);
    new BotRouter(this);

    logger.info(`launch telegram`, me);
  }
}
