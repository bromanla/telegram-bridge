import { MessageModel } from '@loaders/mongo.loader';
import config from '@config';
import { Message } from 'telegraf/typings/core/types/typegram';
import ApiError from './tg-error.utility';

export default class {
  public recipient = config.vk.selected;

  public async identificationRecipient(message: Message) {
    // @ts-ignore
    if (message?.reply_to_message) {
      // @ts-ignore
      const messageId = message.reply_to_message.message_id;
      const user = await MessageModel.findOne({ messageId }).lean();

      if (!user) {
        throw new ApiError('Could not identify the sender');
      }

      this.recipient = user.chatId;
    } else if (config.vk.selected === -1) {
      throw new ApiError('User not selected');
    } else {
      this.recipient = config.vk.selected;
    }
  }
}
