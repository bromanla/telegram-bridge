import { IState, IMedia } from '@interfaces';
import config from '@config';
import { api } from '@loaders/tg.loader';
import EventEmitter from 'events';
import Queue from 'utils/queue.utility';
import Message from 'utils/vk.message.utility';

const chatId = config.telegram.id;
const emitter = new EventEmitter();
const queue = new Queue();
const messageUtility = new Message();

emitter.on('message', async (state: IState) => {
  const message = messageUtility.form(state);
  console.log(state.attachments);

  // Only text message
  if (state.type === 'text') {
    queue.push(async () => {
      await api.sendMessage(chatId, message, { parse_mode: 'HTML' });
    });
  }

  if (state.type === 'document' || state.type === 'photo') {
    state.attachments.forEach((url) => {
      queue.push(async () => {
        await api.sendDocument(chatId, url);
      });
    });

    // const media = state.attachments.map((url, i) => {
    //   const acc: IMedia = {
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     type: state.type,
    //     media: url
    //   };

    //   if (i === 0) {
    //     acc.caption = message;
    //     acc.parse_mode = 'HTML';
    //   }

    //   return acc;
    // });

    // queue.push(async () => {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   await api.sendMediaGroup(chatId, media);
    //   // TODO: Add to mongodb
    // });
  }

  if (state.type === 'sticker') {
    const [url] = state.attachments;
    queue.push(async () => {
      await api.sendPhoto(chatId, url);
    });
  }

  if (state.type === 'voice') {
    const [url] = state.attachments;
    queue.push(async () => {
      await api.sendVoice(chatId, url);
    });
  }
});

export default emitter;
