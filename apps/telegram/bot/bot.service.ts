import { config } from "/common/config.ts";
import { logger } from "@bridge/common";
import { Bot, InputMediaBuilder } from "grammy";
import { parseMode } from "@grammyjs/parse-mode";
import { AsyncLocalStorage } from "node:async_hooks";

import { getUptime } from "/common/uptime.ts";
import { BotHandler } from "/bot/bot.handler.ts";
import { BotRouter } from "/bot/bot.router.ts";
import { i18n } from "/bot/middlewares/i18n.ts";

import type { BotError, Filter, NextFunction } from "grammy";
import type { BotContext, LocalStorage } from "/bot/bot.type.ts";
import type { BusService } from "@bridge/contract";
import type { BotStore } from "/bot/bot.store.ts";

export class BotService {
  handler: BotHandler;
  router: BotRouter;

  bot: Bot<BotContext>;
  startAt: number;

  asyncStorage = new AsyncLocalStorage<LocalStorage>();

  constructor(private _bus: BusService, private _store: BotStore) {
    this.bot = new Bot<BotContext>(config.token);
    this.bot.api.config.use(parseMode("HTML"));
    this.bot.use(i18n);
    this.bot.use(this.initLocalStorage.bind(this));

    this.handler = new BotHandler(this);
    this.router = new BotRouter(this);

    // Deno.addSignalListener("SIGINT", () => this.bot.stop());
    // Deno.addSignalListener("SIGTERM", () => this.bot.stop());
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

    const forum = await this._store.getForum(forumId);
    if (!forum) {
      logger.warn(`failed load forum`, { forumId });
      const message = ctx.t("error.loadForum", { forumId });

      return ctx.api.sendMessage(config.chatId, message, {
        message_thread_id: forumId,
      });
    }

    this.asyncStorage.run({ forum }, () => {
      return next();
    });
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

  //   // private async loadForum(event: TelegramBaseEvent) {
  //   //   const id = event.isChat ? event.chatId : event.senderId;
  //   //   const name = event.isChat ? event.chatTitle : event.fullName;
  //   //   const field = event.isChat ? 'chat_id' : 'user_id';

  //   //   let forum = await this.store.findOneForum(id);
  //   //   if (!forum) {
  //   //     const { message_thread_id } = await this.bot.api.createForumTopic(
  //   //       this.config.telegram.chatId,
  //   //       name,
  //   //     );

  //   //     forum = await this.store.createForum({
  //   //       id: message_thread_id,
  //   //       [field]: id,
  //   //     });
  //   //   }

  //   //   return forum;
  //   // }

  //   // private chatHistory = new Map<number, number>();
  //   // private getMessageText(event: TelegramBaseEvent) {
  //   //   const { text, extra } = event;
  //   //   const message: string[] = [];

  //   //   if (event.isChat) {
  //   //     const { chatId, senderId, fullName } = event;

  //   //     const lastSender = this.chatHistory.get(chatId);
  //   //     if (lastSender !== senderId) {
  //   //       message.push(`<b>${fullName}</b>`);
  //   //       this.chatHistory.set(chatId, senderId);
  //   //     }
  //   //   }

  //   //   if (text) {
  //   //     message.push(text);
  //   //   }

  //   //   const processedExtra = extra.map((extra) =>
  //   //     typeof extra === 'string'
  //   //       ? extra
  //   //       : `<a href="${extra.url}">${extra.text}</a>`,
  //   //   );

  //   //   if (processedExtra.length) {
  //   //     message.push(`<b>[${processedExtra.join(', ')}]</b>`);
  //   //   }

  //   //   return message.join('\n\n');
  //   // }

  //   // private async sendText(
  //   //   _: TelegramEvent['telegram:sendText'],
  //   //   forum: Forum,
  //   //   message: string,
  //   // ) {
  //   //   const { message_id } = await this.bot.api.sendMessage(
  //   //     this.config.telegram.chatId,
  //   //     message,
  //   //     {
  //   //       message_thread_id: forum.id,
  //   //     },
  //   //   );

  //   //   return message_id;
  //   // }

  //   // private async sendSticker(
  //   //   event: TelegramEvent['telegram:sendSticker'],
  //   //   forum: Forum,
  //   //   message: string,
  //   // ) {
  //   //   const { message_id } = await this.bot.api.sendPhoto(
  //   //     this.config.telegram.chatId,
  //   //     event.url,
  //   //     {
  //   //       caption: message,
  //   //       message_thread_id: forum.id,
  //   //     },
  //   //   );

  //   //   return message_id;
  //   // }

  //   // private async sendVoice(
  //   //   event: TelegramEvent['telegram:sendVoice'],
  //   //   forum: Forum,
  //   //   message: string,
  //   // ) {
  //   //   const { message_id } = await this.bot.api.sendVoice(
  //   //     this.config.telegram.chatId,
  //   //     event.url,
  //   //     {
  //   //       caption: message,
  //   //       message_thread_id: forum.id,
  //   //     },
  //   //   );

  //   //   return message_id;
  //   // }

  //   // private async sendImage(
  //   //   event: TelegramEvent['telegram:sendImage'],
  //   //   forum: Forum,
  //   //   message: string,
  //   // ) {
  //   //   const media = event.url.map((url, i) =>
  //   //     InputMediaBuilder.photo(
  //   //       url,
  //   //       i === 0 ? { caption: message, parse_mode: 'HTML' } : {},
  //   //     ),
  //   //   );

  //   //   const messages = await this.bot.api.sendMediaGroup(
  //   //     this.config.telegram.chatId,
  //   //     media,
  //   //     {
  //   //       message_thread_id: forum.id,
  //   //     },
  //   //   );

  //   //   return messages.map(({ message_id }) => message_id);
  //   // }

  public async launch() {
    this.bot.catch(this.catchMiddleware.bind(this));
    this.bot.start({ drop_pending_updates: true });
    this.startAt = Date.now();

    const me = await this.bot.api.getMe();

    logger.info(`launch telegram`, me);
  }
}
