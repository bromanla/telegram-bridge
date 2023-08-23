import { AttachmentType, VK, getRandomId } from 'vk-io';

import type { Updates } from 'vk-io';
import type { ConfigService } from '#src/service/config.service.js';
import type { LoggerService } from '#src/service/logger.service.js';
import type { Event, EventService } from '#src/service/event.service.js';
import type { MessageContext } from './vk.type.js';

export class VkService {
  public readonly bot: VK;
  public readonly updates: Updates;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly emitter: EventService,
  ) {
    this.bot = new VK({ token: this.config.vk.token });
    this.updates = this.bot.updates;

    this.emitter.on('vk.sendText', this.sendText.bind(this));
    this.emitter.on('vk.sendGraffiti', this.sendGraffiti.bind(this));
    this.emitter.on('vk.sendVoice', this.sendVoice.bind(this));
    this.emitter.on('vk.sendImage', this.sendImage.bind(this));
  }

  /* Uploading user data via the API */
  public async loadUserInfo(userId: number) {
    const data = await this.bot.api.users.get({ user_ids: [userId] });

    if (data && data?.length) {
      const user = data.at(0);

      const first_name = user?.first_name;
      const last_name = user?.last_name;

      if (typeof first_name === 'string' && typeof last_name === 'string') {
        return {
          id: userId,
          first_name,
          last_name,
          full_name: `${first_name} ${last_name}`,
        };
      }
    }

    return undefined;
  }

  /* Uploading group data via the API */
  public async loadGroupInfo(groupId: number) {
    const data = await this.bot.api.groups.getById({
      group_id: Math.abs(groupId),
    });

    if (data && data?.length) {
      const group = data.at(0);

      const full_name = group?.name;

      if (typeof full_name === 'string') {
        return {
          id: groupId,
          full_name: `${full_name} [group]`,
        };
      }
    }

    return undefined;
  }

  /* Uploading chat data via the API */
  public async loadChatInfo(chat_id: number) {
    const data = await (this.bot.api.messages as any).getChat({ chat_id });
    const title = data?.title;

    if (typeof title === 'string') {
      return {
        id: chat_id,
        title: `${title} [chat]`,
      };
    }

    return undefined;
  }

  public handleText(ctx: MessageContext) {
    const text = ctx.text;
    const hasAttachments = ctx.hasAttachments();

    /* Send only text message */
    if (!hasAttachments && text) {
      this.emitter.emit('telegram:sendText', { text, ...ctx.state });
    }

    ctx.state.text = text;
    return hasAttachments;
  }

  public handleImages(ctx: MessageContext) {
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

  public handleVoices(ctx: MessageContext) {
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

  public handleStickers(ctx: MessageContext) {
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

  public handleUnprocessed(ctx: MessageContext) {
    const unprocessedAttachments: string[] = [];
    for (const type of Object.values(AttachmentType)) {
      /* Required until all types of attachments are processed */
      const isProcessed = [
        AttachmentType.PHOTO,
        AttachmentType.AUDIO_MESSAGE,
        AttachmentType.STICKER,
      ].includes(type);

      if (isProcessed) continue;

      /* Drowning out errors in types vk-io */
      const tmp = ctx.getAttachments(type as AttachmentType.WALL_REPLY);
      const isNotEmpty = Boolean(tmp.length);

      if (isNotEmpty) unprocessedAttachments.push(type);
    }

    if (unprocessedAttachments.length) {
      this.emitter.emit('telegram:sendText', {
        ...ctx.state,
        text: ctx.text ?? '',
        extra: '[' + unprocessedAttachments.join(', ') + ']',
      });
    }
  }

  private sendText(event: Event['vk.sendText']) {
    return this.bot.api.messages.send({
      peer_id: event.peerId,
      message: event.text,
      random_id: getRandomId(),
    });
  }

  private async sendGraffiti(event: Event['vk.sendGraffiti']) {
    const attachment = await this.bot.upload.messageGraffiti({
      source: { value: event.url },
    });

    return this.bot.api.messages.send({
      peer_id: event.peerId,
      attachment,
      random_id: getRandomId(),
    });
  }

  private async sendImage(event: Event['vk.sendImage']) {
    const attachment = await this.bot.upload.messagePhoto({
      source: { value: event.url },
    });

    return this.bot.api.messages.send({
      peer_id: event.peerId,
      message: event.text,
      attachment,
      random_id: getRandomId(),
    });
  }

  private async sendVoice(event: Event['vk.sendVoice']) {
    const attachment = await this.bot.upload.audioMessage({
      source: { value: event.url },
    });

    return this.bot.api.messages.send({
      peer_id: event.peerId,
      attachment,
      random_id: getRandomId(),
    });
  }

  public launch() {
    this.logger.info(`launch vk`);
    return this.bot.updates.startPolling();
  }
}
