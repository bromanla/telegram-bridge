import { IState, IMessage } from '@interfaces';
import config from '@config';
import { api } from '@loaders/tg.loader';
import { MessageModel } from '@loaders/mongo.loader';
import EventEmitter from 'events';
import Queue from 'utils/queue.utility';
import Message from 'utils/vk.message.utility';

const chatId = config.telegram.id;
const emitter = new EventEmitter();
const queue = new Queue();
const messageUtility = new Message();

emitter.on('text', async (state: IState) => {
  const message = messageUtility.form(state);

  queue.push(async () => {
    const { message_id } = await api.sendMessage(chatId, message, { parse_mode: 'HTML' });
    await new MessageModel({ chatId: state.senderId, messageId: message_id }).save();
  });
});

emitter.on('photo', async (state: IState) => {
  const mediaGroup = messageUtility.formPhotosGroup(state);

  queue.push(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const sentMessages = await api.sendMediaGroup(chatId, mediaGroup);
    const entities: Array<IMessage> = sentMessages.map((el) => (
      { chatId: state.senderId, messageId: el.message_id }
    ));
    await MessageModel.insertMany(entities);
  });
});

emitter.on('voice', async (state: IState) => {
  const message = messageUtility.form(state);
  const [url] = state.attachments;

  queue.push(async () => {
    const { message_id } = await api.sendVoice(chatId, url, { caption: message, parse_mode: 'HTML' });
    await new MessageModel({ chatId: state.senderId, messageId: message_id }).save();
  });
});

emitter.on('sticker', async (state: IState) => {
  const message = messageUtility.form(state);
  const [url] = state.attachments;

  queue.push(async () => {
    const { message_id } = await api.sendPhoto(chatId, url, { caption: message, parse_mode: 'HTML' });
    await new MessageModel({ chatId: state.senderId, messageId: message_id }).save();
  });
});

export default emitter;
