import { Bot, InputMediaBuilder } from 'grammy';
import { parseMode } from '@grammyjs/parse-mode';
import { logger } from '@bridge/common';

// import type {
//   EventService,
//   TelegramEvent,
//   TelegramBaseEvent,
// } from '#src/service/event.service.js';
import type { BotError } from 'grammy';
import type { BotContext } from '#src/service/telegram.type.js';
import type { BusService } from '@bridge/bus';
import type { BusData } from '@bridge/contract';
// import type { TelegramStore } from './telegram.store.js';
// import type { Forum } from '#src/service/database.service.js';

export class TelegramService {
  public readonly bot: Bot<BotContext>;

  constructor(private _bus: BusService<BusData>) {
    // this.bot = new Bot<BotContext>(this.config.telegram.token);

    // this.bot.api.config.use(apiThrottler());
    this.bot.api.config.use(parseMode('HTML'));

    process.once('SIGINT', () => this.bot.stop());
    process.once('SIGTERM', () => this.bot.stop());
  }

  // private wrap<E extends TelegramEvent[keyof TelegramEvent]>(
  //   fn: (event: E, forum: Forum, message: string) => Promise<number | number[]>,
  // ) {
  //   return this.queue.wrap(async (event: E) => {
  //     if (event.handler === 'telegram') {
  //       const forum = await this.loadForum(event);
  //       const message = this.getMessageText(event);

  //       await fn.call(this, event, forum, message);
  //     }
  //   });
  // }

  // private async catchMiddleware(err: BotError<BotContext>) {
  //   const ctx = err.ctx;
  //   const e = err.error;

  //   try {
  //     await ctx.reply(
  //       e instanceof Error
  //         ? `Произошла ошибка: ${e.message}`
  //         : 'Произошла непредвиденная ошибка',
  //     );
  //   } catch {
  //     this.logger.error(e);
  //   }
  // }

  public async getFileUrl(fileId: string) {
    const url = await this.bot.api.getFile(fileId);

    // return `https://api.telegram.org/file/bot${this.context.token}/${url.file_path}`;
  }

  // private async loadForum(event: TelegramBaseEvent) {
  //   const id = event.isChat ? event.chatId : event.senderId;
  //   const name = event.isChat ? event.chatTitle : event.fullName;
  //   const field = event.isChat ? 'chat_id' : 'user_id';

  //   let forum = await this.store.findOneForum(id);
  //   if (!forum) {
  //     const { message_thread_id } = await this.bot.api.createForumTopic(
  //       this.config.telegram.chatId,
  //       name,
  //     );

  //     forum = await this.store.createForum({
  //       id: message_thread_id,
  //       [field]: id,
  //     });
  //   }

  //   return forum;
  // }

  // private chatHistory = new Map<number, number>();
  // private getMessageText(event: TelegramBaseEvent) {
  //   const { text, extra } = event;
  //   const message: string[] = [];

  //   if (event.isChat) {
  //     const { chatId, senderId, fullName } = event;

  //     const lastSender = this.chatHistory.get(chatId);
  //     if (lastSender !== senderId) {
  //       message.push(`<b>${fullName}</b>`);
  //       this.chatHistory.set(chatId, senderId);
  //     }
  //   }

  //   if (text) {
  //     message.push(text);
  //   }

  //   const processedExtra = extra.map((extra) =>
  //     typeof extra === 'string'
  //       ? extra
  //       : `<a href="${extra.url}">${extra.text}</a>`,
  //   );

  //   if (processedExtra.length) {
  //     message.push(`<b>[${processedExtra.join(', ')}]</b>`);
  //   }

  //   return message.join('\n\n');
  // }

  // private async sendText(
  //   _: TelegramEvent['telegram:sendText'],
  //   forum: Forum,
  //   message: string,
  // ) {
  //   const { message_id } = await this.bot.api.sendMessage(
  //     this.config.telegram.chatId,
  //     message,
  //     {
  //       message_thread_id: forum.id,
  //     },
  //   );

  //   return message_id;
  // }

  // private async sendSticker(
  //   event: TelegramEvent['telegram:sendSticker'],
  //   forum: Forum,
  //   message: string,
  // ) {
  //   const { message_id } = await this.bot.api.sendPhoto(
  //     this.config.telegram.chatId,
  //     event.url,
  //     {
  //       caption: message,
  //       message_thread_id: forum.id,
  //     },
  //   );

  //   return message_id;
  // }

  // private async sendVoice(
  //   event: TelegramEvent['telegram:sendVoice'],
  //   forum: Forum,
  //   message: string,
  // ) {
  //   const { message_id } = await this.bot.api.sendVoice(
  //     this.config.telegram.chatId,
  //     event.url,
  //     {
  //       caption: message,
  //       message_thread_id: forum.id,
  //     },
  //   );

  //   return message_id;
  // }

  // private async sendImage(
  //   event: TelegramEvent['telegram:sendImage'],
  //   forum: Forum,
  //   message: string,
  // ) {
  //   const media = event.url.map((url, i) =>
  //     InputMediaBuilder.photo(
  //       url,
  //       i === 0 ? { caption: message, parse_mode: 'HTML' } : {},
  //     ),
  //   );

  //   const messages = await this.bot.api.sendMediaGroup(
  //     this.config.telegram.chatId,
  //     media,
  //     {
  //       message_thread_id: forum.id,
  //     },
  //   );

  //   return messages.map(({ message_id }) => message_id);
  // }

  // public async launch() {
  //   this.bot.catch(this.catchMiddleware.bind(this));
  //   this.bot.start({ drop_pending_updates: true });

  //   this.logger.info(`launch telegram`);
  // }
}
