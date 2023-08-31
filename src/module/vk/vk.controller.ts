import { LoggerInstance } from '#src/common/logger.instance.js';
import { AttachmentType } from 'vk-io';

import type { VkStore } from './vk.store.js';
import type { VkService } from './vk.service.js';
import type { NextFunction, MessageContext } from './vk.type.js';
import type {
  EventService,
  TelegramBaseEvent,
} from '#src/service/event.service.js';

export class VkController {
  private logger = new LoggerInstance();

  constructor(
    private readonly emitter: EventService,
    private readonly store: VkStore,
    private readonly service: VkService,
  ) {
    this.service.updates.on('message_new', this.inboxMiddleware.bind(this));
    this.service.updates.on('message_new', this.userMiddleware.bind(this));
    this.service.updates.on('message_new', this.chatMiddleware.bind(this));
    this.service.updates.on('message_new', this.messageHandler.bind(this));
  }

  /* Ignore outgoing events */
  private inboxMiddleware(ctx: MessageContext, next: NextFunction) {
    ctx.state.handler = 'telegram';
    ctx.state.extra = [];

    return ctx.isInbox ? next() : undefined;
  }

  /* User identification */
  private async userMiddleware(ctx: MessageContext, next: NextFunction) {
    if (!ctx.isUser && !ctx.isGroup) return next();

    const userId = ctx.senderId;
    let user = await this.store.getUser(userId);

    if (!user) {
      const userData = ctx.isGroup
        ? await this.service.loadGroupInfo(userId)
        : await this.service.loadUserInfo(userId);
      if (!userData) {
        this.logger.warn(`Failed to load user (${userId})`);
        return undefined;
      }

      user = await this.store.createUser(userData);
    }

    ctx.state.senderId = user.id;
    ctx.state.fullName = user.full_name;
    ctx.state.isChat = ctx.isChat;
    ctx.state.isGroup = ctx.isGroup;

    return next();
  }

  /* Chat Identification */
  private async chatMiddleware(ctx: MessageContext, next: NextFunction) {
    if (!ctx.isChat) return next();

    const chatId = ctx.chatId!;
    let chat = await this.store.getChat(chatId);

    if (!chat) {
      const chatData = await this.service.loadChatInfo(chatId);
      if (!chatData) {
        this.logger.warn(`Failed to load chat (${chatId})`);
        return undefined;
      }

      chat = await this.store.createChat(chatData);
    }

    ctx.state = {
      ...ctx.state,
      isChat: true,
      chatId: chat.id,
      chatTitle: chat.title,
    };

    return next();
  }

  /* Processing of the message text and attachments */
  private async messageHandler(ctx: MessageContext) {
    ctx.state.text = ctx.text;

    /* Send only text message */
    const hasAttachments = this.textHandler(ctx);
    if (!hasAttachments) return;

    await ctx.loadMessagePayload();

    this.imagesHandler(ctx);
    this.voiceHandler(ctx);
    this.stickerHandler(ctx);

    this.unprocessedHandler(ctx);
  }

  private textHandler(ctx: MessageContext) {
    const text = ctx.text;
    const hasAttachments = ctx.hasAttachments();
    const hasForwards = ctx.hasForwards;

    if (hasForwards) {
      ctx.state.extra.push('forward');
    }

    /* Send only text message */
    if (!hasAttachments && text) {
      this.emitter.emit('telegram:sendText', { text, ...ctx.state });
    }

    ctx.state.text = text;
    return hasAttachments;
  }

  public imagesHandler(ctx: MessageContext) {
    const images = ctx
      .getAttachments(AttachmentType.PHOTO)
      .map((image) => image.largeSizeUrl)
      .filter(Boolean);

    if (images.length)
      this.emitter.emit('telegram:sendImage', {
        url: images,
        ...ctx.state,
      });
  }

  private voiceHandler(ctx: MessageContext) {
    const [voice] = ctx
      .getAttachments(AttachmentType.AUDIO_MESSAGE)
      .map((voice) => voice.oggUrl)
      .filter(Boolean);

    if (voice)
      this.emitter.emit('telegram:sendVoice', {
        url: voice,
        ...ctx.state,
      });
  }

  private stickerHandler(ctx: MessageContext) {
    const [sticker] = ctx
      .getAttachments(AttachmentType.STICKER)
      .map((sticker) => sticker.imagesWithBackground.pop()?.url)
      .filter(Boolean);

    if (sticker)
      this.emitter.emit('telegram:sendSticker', {
        url: sticker,
        ...ctx.state,
      });
  }

  private unprocessedHandler(ctx: MessageContext) {
    const unprocessedAttachments: TelegramBaseEvent['extra'] = [];
    for (const type of Object.values(AttachmentType)) {
      /* Required until all types of attachments are processed */
      const isProcessed = [
        AttachmentType.PHOTO,
        AttachmentType.AUDIO_MESSAGE,
        AttachmentType.STICKER,
      ].includes(type);

      if (isProcessed) continue;

      /* Drowning out errors in types vk-io */
      const attachments = ctx.getAttachments(type as AttachmentType.WALL);
      const isNotEmpty = Boolean(attachments.length);

      if (isNotEmpty) {
        if (type === AttachmentType.WALL) {
          const [wall] = attachments;

          const url = `https://vk.com/wall${wall.ownerId}_${wall.id}`;
          unprocessedAttachments.push({ url, text: type });
        } else {
          unprocessedAttachments.push(type);
        }
      }
    }

    if (unprocessedAttachments.length) {
      this.emitter.emit('telegram:sendText', {
        ...ctx.state,
        text: ctx.text ?? '',
        extra: unprocessedAttachments,
      });
    }
  }
}
