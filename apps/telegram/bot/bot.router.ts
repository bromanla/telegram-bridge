import type { BotService } from "#src/bot/bot.service.ts";

export class BotRouter {
  constructor(private _botService: BotService) {
  }
}
