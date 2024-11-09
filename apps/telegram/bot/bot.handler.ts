import { AsyncLocalStorage } from "node:async_hooks";

import type { Filter, NextFunction } from "grammy";
import type { BotService } from "/bot/bot.service.ts";
import type { BotContext } from "/bot/bot.type.ts";

export class BotHandler {
  constructor(private _service: BotService) {
    // this._service.bot.on("message", this.loadForumMiddleware.bind(this));
    this._service.bot.on("message:text", this.textHandler.bind(this));

    // this.service.bot.on('message', this.loadForumMiddleware.bind(this));
    // this.service.bot.on('message:text', this.textHandler.bind(this));
    // this.service.bot.on('message:voice', this.voiceHandler.bind(this));
    // this.service.bot.on('message:sticker', this.stickerHandler.bind(this));
    // this.service.bot.on('message:photo', this.imageHandler.bind(this));
  }

  // private async loadForumMiddleware(
  //   ctx: Filter<BotContext, "message">,
  //   next: NextFunction,
  // ) {

  // const forumId = ctx.message.message_thread_id;
  // if (!forumId) {
  //   return ctx.reply(`⚙️ <b>Uptime:</b> ${this.config.uptime}ms`);
  // }

  // const forum = await this.store.getForum(forumId);
  // if (!forum) {
  //   this.logger.warn(`Failed load forum (${forumId})`);
  //   return undefined;
  // }

  // /**
  //  * Chats require an addition 2000000000
  //  * https://dev.vk.com/ru/method/messages.send#Параметры
  //  */
  // const isChat = Boolean(forum?.chat_id);
  // ctx.peerId = isChat ? forum.chat_id! + 2000000000 : forum.user_id!;

  // return next();
  // }

  private async textHandler(ctx: Filter<BotContext, "message:text">) {
    const store = this._service.asyncStorage.getStore();

    console.log(store);

    console.log("2");

    // this.emitter.emit('vk.sendText', {
    //   handler: 'vk',
    //   text: ctx.message.text,
    //   peerId: ctx.peerId,
    // });
  }
}
