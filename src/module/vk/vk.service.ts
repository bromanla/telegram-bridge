import { LoggerInstance } from '#src/common/logger.instance.js';
import { ConfigInstance } from '#src/common/config.instance.js';
import { VK, getRandomId } from 'vk-io';

import type { Updates } from 'vk-io';
import type { EventService, VkEvent } from '#src/service/event.service.js';

export class VkService {
  private readonly logger = new LoggerInstance();
  private readonly config = new ConfigInstance();

  public readonly bot: VK;
  public readonly updates: Updates;

  constructor(private readonly emitter: EventService) {
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
          group: 1,
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

  private sendText(event: VkEvent['vk.sendText']) {
    return this.bot.api.messages.send({
      peer_id: event.peerId,
      message: event.text,
      random_id: getRandomId(),
    });
  }

  private async sendGraffiti(event: VkEvent['vk.sendGraffiti']) {
    const attachment = await this.bot.upload.messageGraffiti({
      source: { value: event.url },
    });

    return this.bot.api.messages.send({
      peer_id: event.peerId,
      attachment,
      random_id: getRandomId(),
    });
  }

  private async sendImage(event: VkEvent['vk.sendImage']) {
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

  private async sendVoice(event: VkEvent['vk.sendVoice']) {
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
