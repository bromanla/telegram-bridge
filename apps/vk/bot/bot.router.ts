import { logger } from "@bridge/common";
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

    store.event.text = ctx.text;

    /* Send only text message */
    // const hasAttachments = this.textHandler(ctx);
    // if (!hasAttachments) return;

    if (ctx.hasAttachments()) {
      await ctx.loadMessagePayload();

      this.imagesHandler(ctx, store);
      this.voiceHandler(ctx, store);
      this.stickerHandler(ctx, store);
    }

    this.textHandler(ctx, store);
    // this.unprocessedHandler(ctx);
  }

  private textHandler(ctx: MessageContext, store: AsyncContext) {
    const text = ctx.text;
    const hasForwards = ctx.hasForwards;
    // const hasAttachments = ctx.hasAttachments();

    //     if (hasForwards) {
    //       ctx.state.extra.push('forward');
    //     }

    //     /* Send only text message */
    //     if (!hasAttachments && text) {
    //       this.emitter.emit('telegram:sendText', { text, ...ctx.state });
    //     }

    //     ctx.state.text = text;
    //     return hasAttachments;
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
        type: "voice",
        url: sticker,
        ...store,
      });
    }
  }

  private unprocessedHandler(ctx: MessageContext) {
    const unprocessedAttachments = [];

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
      // this.emitter.emit('telegram:sendText', {
      //   ...ctx.state,
      //   text: ctx.text ?? '',
      //   extra: unprocessedAttachments,
      // });
    }
  }
}
