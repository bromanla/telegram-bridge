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

  private async textHandler(ctx: Filter<BotContext, "message:text">) {
    // const { peerId } = this.service.asyncStorage.getStore()!

    // this.emitter.emit('vk.sendText', {
    //   handler: 'vk',
    //   text: ctx.message.text,
    //   peerId: ctx.peerId,
    //   });
  }

  private async voiceHandler(ctx: Filter<BotContext, "message:voice">) {
    const fileId = ctx.message.voice.file_id;
    const url = await this.service.getFileUrl(fileId);

    //   this.emitter.emit('vk.sendVoice', {
    //     handler: 'vk',
    //     peerId: ctx.peerId,
    //     url,
    //   });
  }

  private async stickerHandler(ctx: Filter<BotContext, "message:sticker">) {
    const { sticker } = ctx.message;

    const fileId = sticker.is_animated || sticker.is_video
      ? sticker.thumbnail!.file_id
      : sticker.file_id;

    const url = await this.service.getFileUrl(fileId);

    //   this.emitter.emit('vk.sendGraffiti', {
    //     handler: 'vk',
    //     peerId: ctx.peerId,
    //     url,
    //   });
  }

  private async imageHandler(ctx: Filter<BotContext, "message:photo">) {
    const fileId = ctx.message.photo.pop()!.file_id;
    const text = ctx.message.caption;
    const url = await this.service.getFileUrl(fileId);

    //   this.emitter.emit('vk.sendImage', {
    //     handler: 'vk',
    //     peerId: ctx.peerId,
    //     text,
    //     url,
    //   });
  }
}
