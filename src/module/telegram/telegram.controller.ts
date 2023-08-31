import { LoggerInstance } from '#src/common/logger.instance.js';
import { ConfigInstance } from '#src/common/config.instance.js';

import type { NextFunction, Filter } from 'grammy';
import type { TelegramService } from '#src/module/telegram/telegram.service.js';
import type { TelegramStore } from '#src/module/telegram/telegram.store.js';
import type { BotContext } from '#src/module/telegram/telegram.type.js';
import type { EventService } from '#src/service/event.service.js';

export class TelegramController {
  private readonly logger = new LoggerInstance();
  private readonly config = new ConfigInstance();

  constructor(
    private readonly emitter: EventService,
    private readonly store: TelegramStore,
    private readonly service: TelegramService,
  ) {
    this.service.bot.use(this.accessMiddleware.bind(this));

    this.service.bot.on('message', this.loadForumMiddleware.bind(this));
    this.service.bot.on('message:text', this.textHandler.bind(this));
    this.service.bot.on('message:voice', this.voiceHandler.bind(this));
    this.service.bot.on('message:sticker', this.stickerHandler.bind(this));
    this.service.bot.on('message:photo', this.imageHandler.bind(this));
  }

  private accessMiddleware(ctx: BotContext, next: NextFunction) {
    const userId = ctx.from?.id;
    const chatId = ctx.message?.chat.id;

    if (
      userId === this.config.telegram.accessId &&
      chatId === this.config.telegram.chatId
    ) {
      return next();
    }

    this.logger.debug(`access attempt: ${userId}`);
    return undefined;
  }

  private async loadForumMiddleware(
    ctx: Filter<BotContext, 'message'>,
    next: NextFunction,
  ) {
    const forumId = ctx.message.message_thread_id;
    if (!forumId) {
      return ctx.reply(`⚙️ <b>Uptime:</b> ${this.config.uptime}ms`);
    }

    const forum = await this.store.getForum(forumId);
    if (!forum) {
      this.logger.warn(`Failed load forum (${forumId})`);
      return undefined;
    }

    /**
     * Chats require an addition 2000000000
     * https://dev.vk.com/ru/method/messages.send#Параметры
     */
    const isChat = Boolean(forum?.chat_id);
    ctx.peerId = isChat ? forum.chat_id! + 2000000000 : forum.user_id!;

    return next();
  }

  private async textHandler(ctx: Filter<BotContext, 'message:text'>) {
    this.emitter.emit('vk.sendText', {
      handler: 'vk',
      text: ctx.message.text,
      peerId: ctx.peerId,
    });
  }

  private async voiceHandler(ctx: Filter<BotContext, 'message:voice'>) {
    const fileId = ctx.message.voice.file_id;
    const url = await this.service.getFileUrl(fileId);

    this.emitter.emit('vk.sendVoice', {
      handler: 'vk',
      peerId: ctx.peerId,
      url,
    });
  }

  private async stickerHandler(ctx: Filter<BotContext, 'message:sticker'>) {
    const { sticker } = ctx.message;

    const fileId =
      sticker.is_animated || sticker.is_video
        ? sticker.thumbnail!.file_id
        : sticker.file_id;

    const url = await this.service.getFileUrl(fileId);

    this.emitter.emit('vk.sendGraffiti', {
      handler: 'vk',
      peerId: ctx.peerId,
      url,
    });
  }

  private async imageHandler(ctx: Filter<BotContext, 'message:photo'>) {
    const fileId = ctx.message.photo.pop()!.file_id;
    const text = ctx.message.caption;
    const url = await this.service.getFileUrl(fileId);

    this.emitter.emit('vk.sendImage', {
      handler: 'vk',
      peerId: ctx.peerId,
      text,
      url,
    });
  }
}
