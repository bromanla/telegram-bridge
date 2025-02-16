import { getRandomId } from "vk-io";
import { createSendMethodName } from "@bridge/common";
import { logger } from "@bridge/common";
import type { BotService } from "#src/bot/bot.service.ts";
import type { Message } from "@bridge/bus";

export class BotHandler {
  constructor(private service: BotService) {
    this.service.bus.consume(
      "message",
      ["message.vk"],
      "vk",
      async (_, message) => {
        logger.debug("handle message event");

        const peerId = this.getPeerId(message);
        if (!peerId) {
          return;
        }

        const method = createSendMethodName(message.type);
        await this[method](message as any, peerId);
      },
    );
  }

  private getPeerId(message: Partial<Message>) {
    /**
     * Chats require an addition 2000000000
     * https://dev.vk.com/ru/method/messages.send#Параметры
     */
    if (message.chat) {
      return 2000000000 + message.chat.id;
    }

    if (message.user) {
      return message.user.id;
    }

    return undefined;
  }

  private sendText(
    message: Extract<Message, { type: "text" }>,
    peerId: number,
  ) {
    return this.service.bot.api.messages.send({
      peer_id: peerId,
      message: message.text,
      random_id: getRandomId(),
    });
  }

  private async sendSticker(
    message: Extract<Message, { type: "sticker" }>,
    peerId: number,
  ) {
    const attachment = await this.service.bot.upload.messageGraffiti({
      source: { value: message.url },
    });

    return this.service.bot.api.messages.send({
      peer_id: peerId,
      attachment,
      random_id: getRandomId(),
    });
  }

  private async sendImage(
    message: Extract<Message, { type: "image" }>,
    peerId: number,
  ) {
    const attachment = await this.service.bot.upload.messagePhoto({
      source: { value: message.urls[0] },
    });

    return this.service.bot.api.messages.send({
      peer_id: peerId,
      attachment,
      random_id: getRandomId(),
    });
  }

  private async sendVoice(
    message: Extract<Message, { type: "voice" }>,
    peerId: number,
  ) {
    const attachment = await this.service.bot.upload.audioMessage({
      source: { value: message.url },
    });

    return this.service.bot.api.messages.send({
      peer_id: peerId,
      attachment,
      random_id: getRandomId(),
    });
  }
}
