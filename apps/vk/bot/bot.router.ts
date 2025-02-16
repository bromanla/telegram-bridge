import { AttachmentType } from "vk-io";

import type { BotService } from "#src/bot/bot.service.ts";
import type { AsyncContext } from "#src/bot/bot.type.ts";
import type { MessageContext } from "vk-io";

export class BotRouter {
  constructor(private service: BotService) {
    this.service.bot.updates.on("message_new", this.messageHandler.bind(this));
  }

  /* Processing of the message text and attachments */
  private async messageHandler(ctx: MessageContext) {
    const store = this.service.asyncContext.getStore()!;

    /* Send only text message */
    const hasAttachments = this.textHandler(ctx, store);
    if (!hasAttachments) return;

    await ctx.loadMessagePayload();

    this.imagesHandler(ctx, store);
    this.voiceHandler(ctx, store);
    this.stickerHandler(ctx, store);
    this.unsupportedHandler(ctx, store);
  }

  private textHandler(ctx: MessageContext, store: AsyncContext) {
    store.text = ctx.text;

    const hasForwards = ctx.hasForwards;
    const hasAttachments = ctx.hasAttachments();

    if (hasForwards) {
      store.unsupported.push({ text: "forward" });
    }

    /* Send only text message */
    if (!hasAttachments && ctx.text) {
      this.service.bus.publish("message.telegram", {
        type: "text",
        text: ctx.text,
        ...store,
      });
    }

    return hasAttachments;
  }

  public imagesHandler(ctx: MessageContext, store: AsyncContext) {
    const images = ctx
      .getAttachments(AttachmentType.PHOTO)
      .map((image) => image.largeSizeUrl)
      .filter(Boolean) as string[];

    if (images.length) {
      this.service.bus.publish("message.telegram", {
        type: "image",
        urls: images,
        ...store,
      });
    }
  }

  private voiceHandler(ctx: MessageContext, store: AsyncContext) {
    const voice = ctx
      .getAttachments(AttachmentType.AUDIO_MESSAGE)
      .map((voice) => voice.oggUrl)
      .filter(Boolean)
      .at(0);

    if (voice) {
      this.service.bus.publish("message.telegram", {
        type: "voice",
        url: voice,
        ...store,
      });
    }
  }

  private stickerHandler(ctx: MessageContext, store: AsyncContext) {
    const sticker = ctx
      .getAttachments(AttachmentType.STICKER)
      .map((sticker) => sticker.imagesWithBackground.pop()?.url)
      .filter(Boolean).at(0);

    if (sticker) {
      this.service.bus.publish("message.telegram", {
        type: "sticker",
        url: sticker,
        ...store,
      });
    }
  }

  private unsupportedHandler(ctx: MessageContext, store: AsyncContext) {
    for (const type of Object.values(AttachmentType)) {
      /** Required until all types of attachments are processed */
      const isProcessed = [
        AttachmentType.PHOTO,
        AttachmentType.AUDIO_MESSAGE,
        AttachmentType.STICKER,
      ].includes(type);

      if (isProcessed) continue;

      try {
        /** Drowning out errors in types vk-io */
        const attachments = ctx.getAttachments(type as any);

        if (attachments.length) {
          if (type === AttachmentType.WALL) {
            const [wall] = attachments;

            const url = `https://vk.com/wall${wall.ownerId}_${wall.id}`;
            store.unsupported.push({ url, text: type });
          } else {
            store.unsupported.push({ text: type });
          }
        }
      } catch {
        /** mute */
      }
    }

    if (store.unsupported.length) {
      this.service.bus.publish("message.telegram", {
        type: "text",
        text: ctx.text ?? "",
        ...store,
      });
    }
  }
}
