import { config } from "#src/common/config.ts";
import { InputMediaBuilder } from "grammy";

import type { BotService } from "#src/bot/bot.service.ts";
import type { Message } from "@bridge/bus";
import type { Forum } from "@bridge/store";

export class BotHandler {
  constructor(private service: BotService) {
    this.service.bus.consume(
      "message",
      ["message.telegram"],
      "telegram",
      async (data, message) => {
        const forum = await this.loadForum(message);
        const text = this.getMessageText(message);
        const method = this.getMethodFromType(message.type);

        try {
          await this[method](forum, text, message as any);
        } catch (e) {
          console.log(e);
        }
      },
    );
  }

  private chatHistory = new Map<number, number>();

  private getMethodFromType<T extends Message["type"]>(type: T) {
    return "send" + type.charAt(0).toUpperCase() +
      type.slice(1) as `send${Capitalize<T>}`;
  }

  private async loadForum(event: Message) {
    const id = event.chat?.id ?? event.user.id;
    const name = event.chat?.title ??
      `${event.user.first_name} ${event.user.last_name}`;

    const field = event.chat ? "chat_id" : "user_id";

    let forum = await this.service.store.getForumByUserIdOrChatId(id);

    if (!forum) {
      const { message_thread_id } = await this.service.bot.api.createForumTopic(
        config.chatId,
        name,
      );

      forum = await this.service.store.createForum({
        id: message_thread_id,
        [field]: id,
      });
    }

    return forum;
  }

  private getMessageText(message: Message) {
    const forumMessage: string[] = [];

    if (message.chat) {
      const chatId = message.chat.id;
      const lastSender = this.chatHistory.get(message.chat.id);
      const senderId = message.user.id;

      if (lastSender !== senderId) {
        forumMessage.push(`<b>${message.user.full_name}</b>`);
        this.chatHistory.set(chatId, senderId);
      }
    }

    if (message.type === "text") {
      forumMessage.push(message.text);

      const unsupported = message.unsupported.map((item) =>
        "url" in item ? `<a href="${item.url}">${item.text}</a>` : item.text
      );

      if (unsupported.length) {
        forumMessage.push(`<b>[${unsupported.join(", ")}]</b>`);
      }
    }

    return forumMessage.join("\n\n");
  }

  private async sendText(
    forum: Forum,
    text: string,
    message: Extract<Message, { type: "text" }>,
  ) {
    const { message_id } = await this.service.bot.api.sendMessage(
      config.chatId,
      text,
      {
        message_thread_id: forum.id,
      },
    );

    return message_id;
  }

  private async sendSticker(
    forum: Forum,
    caption: string,
    message: Extract<Message, { type: "sticker" }>,
  ) {
    const { message_id } = await this.service.bot.api.sendPhoto(
      config.chatId,
      message.url,
      {
        caption,
        message_thread_id: forum.id,
      },
    );

    return message_id;
  }

  private async sendVoice(
    forum: Forum,
    caption: string,
    message: Extract<Message, { type: "voice" }>,
  ) {
    const { message_id } = await this.service.bot.api.sendVoice(
      config.chatId,
      message.url,
      {
        caption,
        message_thread_id: forum.id,
      },
    );

    return message_id;
  }

  private sendAudio = this.sendVoice.bind(this);

  private async sendImage(
    forum: Forum,
    caption: string,
    message: Extract<Message, { type: "image" }>,
  ) {
    const media = message.urls.map((url, i) =>
      InputMediaBuilder.photo(
        url,
        i === 0 ? { caption, parse_mode: "HTML" } : {},
      )
    );

    const messages = await this.service.bot.api.sendMediaGroup(
      config.chatId,
      media,
      {
        message_thread_id: forum.id,
      },
    );

    return messages.map(({ message_id }) => message_id);
  }
}
