import { IState } from '@interfaces';
import config from '@config';
import { api } from '@loaders/tg.loader';
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

    console.log(message_id);
  });
});

emitter.on('photo', async (state: IState) => {
  const mediaGroup = messageUtility.formPhotosGroup(state);

  queue.push(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const sentMessages = await api.sendMediaGroup(chatId, mediaGroup);
    const message_ids = sentMessages.map((el) => el.message_id);

    console.log(message_ids);
  });
});

emitter.on('voice', async (state: IState) => {
  const message = messageUtility.form(state);
  const [url] = state.attachments;

  queue.push(async () => {
    const { message_id } = await api.sendVoice(chatId, url, { caption: message, parse_mode: 'HTML' });

    console.log(message_id);
  });
});

emitter.on('sticker', async (state: IState) => {
  const message = messageUtility.form(state);
  const [url] = state.attachments;

  queue.push(async () => {
    const { message_id } = await api.sendPhoto(chatId, url, { caption: message, parse_mode: 'HTML' });

    console.log(message_id);
  });
});

export default emitter;
