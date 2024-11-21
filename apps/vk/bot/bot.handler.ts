// import { AsyncLocalStorage } from "node:async_hooks";

// import type { Filter, NextFunction } from "grammy";
import type { BotService } from "#src/bot/bot.service.ts";
// import type { BotContext } from "/bot/bot.type.ts";

// this.emitter.on("vk.sendText", this.sendText.bind(this));
// this.emitter.on("vk.sendGraffiti", this.sendGraffiti.bind(this));
// this.emitter.on("vk.sendVoice", this.sendVoice.bind(this));
// this.emitter.on("vk.sendImage", this.sendImage.bind(this));

export class BotHandler {
  constructor(private service: BotService) {}
  //     // this._service.bot.on("message", this.loadForumMiddleware.bind(this));
  //     this._service.bot.on("message:text", this.textHandler.bind(this));

  //     // this.service.bot.on('message', this.loadForumMiddleware.bind(this));
  //     // this.service.bot.on('message:text', this.textHandler.bind(this));
  //     // this.service.bot.on('message:voice', this.voiceHandler.bind(this));
  //     // this.service.bot.on('message:sticker', this.stickerHandler.bind(this));
  //     // this.service.bot.on('message:photo', this.imageHandler.bind(this));
  //   }

  //   // private async loadForumMiddleware(
  //   //   ctx: Filter<BotContext, "message">,
  //   //   next: NextFunction,
  //   // ) {

  // private sendText(event: VkEvent['vk.sendText']) {
  //   return this.bot.api.messages.send({
  //     peer_id: event.peerId,
  //     message: event.text,
  //     random_id: getRandomId(),
  //   });
  // }

  // private async sendGraffiti(event: VkEvent['vk.sendGraffiti']) {
  //   const attachment = await this.bot.upload.messageGraffiti({
  //     source: { value: event.url },
  //   });

  //   return this.bot.api.messages.send({
  //     peer_id: event.peerId,
  //     attachment,
  //     random_id: getRandomId(),
  //   });
  // }

  // private async sendImage(event: VkEvent['vk.sendImage']) {
  //   const attachment = await this.bot.upload.messagePhoto({
  //     source: { value: event.url },
  //   });

  //   return this.bot.api.messages.send({
  //     peer_id: event.peerId,
  //     message: event.text,
  //     attachment,
  //     random_id: getRandomId(),
  //   });
  // }

  // private async sendVoice(event: VkEvent['vk.sendVoice']) {
  //   const attachment = await this.bot.upload.audioMessage({
  //     source: { value: event.url },
  //   });

  //   return this.bot.api.messages.send({
  //     peer_id: event.peerId,
  //     attachment,
  //     random_id: getRandomId(),
  //   });
  // }
}
