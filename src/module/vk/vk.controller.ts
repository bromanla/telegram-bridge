import type { LoggerService } from '#src/service/logger.service.js';
import type { VkStore } from './vk.store.js';
import type { VkService } from './vk.service.js';
import type { NextFunction, MessageContext } from './vk.type.js';

export class VkController {
  constructor(
    private readonly logger: LoggerService,
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

    return ctx.isInbox ? undefined : next();
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
    const hasAttachments = this.service.handleText(ctx);
    if (!hasAttachments) return;

    // TODO: implement nested messages
    await ctx.loadMessagePayload();

    this.service.handleImages(ctx);
    this.service.handleVoices(ctx);
    this.service.handleStickers(ctx);

    this.service.handleUnprocessed(ctx);
  }
}
