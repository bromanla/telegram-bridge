import type { Filter } from "grammy";
import type { BotContext } from "#src/bot/bot.type.ts";
import type { BotService } from "#src/bot/bot.service.ts";

export class BotRouter {
  constructor(private readonly service: BotService) {
    this.service.bot.on("message:text", this.textHandler.bind(this));
    this.service.bot.on("message:voice", this.voiceHandler.bind(this));
    this.service.bot.on("message:sticker", this.stickerHandler.bind(this));
    this.service.bot.on("message:photo", this.imageHandler.bind(this));
  }

  private textHandler(ctx: Filter<BotContext, "message:text">) {
    this.service.bus.publish("message.vk", {
      type: "text",
      text: ctx.message.text,
      unsupported: [],
      ...this.service.asyncStorage.getStore(),
    });
  }

  private async voiceHandler(ctx: Filter<BotContext, "message:voice">) {
    const fileId = ctx.message.voice.file_id;
    const url = await this.service.getFileUrl(fileId);

    this.service.bus.publish("message.vk", {
      type: "voice",
      url,
      ...this.service.asyncStorage.getStore(),
    });
  }

  private async stickerHandler(ctx: Filter<BotContext, "message:sticker">) {
    const { sticker } = ctx.message;

    const fileId = sticker.is_animated || sticker.is_video
      ? sticker.thumbnail!.file_id
      : sticker.file_id;

    const url = await this.service.getFileUrl(fileId);

    this.service.bus.publish("message.vk", {
      type: "sticker",
      url,
      ...this.service.asyncStorage.getStore(),
    });
  }

  private async imageHandler(ctx: Filter<BotContext, "message:photo">) {
    const fileId = ctx.message.photo.pop()!.file_id;
    const text = ctx.message.caption;
    const url = await this.service.getFileUrl(fileId);

    this.service.bus.publish("message.vk", {
      type: "image",
      text,
      urls: [url],
      ...this.service.asyncStorage.getStore(),
    });
  }
}
