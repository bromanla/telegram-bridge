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

emitter.on('message', async (state: IState) => {
  const message = messageUtility.form(state);

  if (state.attachments.length === 0) {
    queue.push(async () => {
      const { message_id } = await api.sendMessage(chatId, message, { parse_mode: 'HTML' });
    });

    return;
  }

  interface IMedia {
    type: 'photo' | 'video' | 'document' | 'audio'
    media: string
    caption?: string
    parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  }

  const photoAttachments: Array<IMedia> = state.attachments
    .filter((el) => el.type === 'photo')
    .map((el) => ({
      type: 'photo',
      media: el.url
    }));

  if (photoAttachments.length) {
    photoAttachments[0] = {
      caption: message,
      parse_mode: 'HTML',
      ...photoAttachments[0]
    };
    queue.push(async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await api.sendMediaGroup(chatId, photoAttachments);
      // TODO: Add to mongodb
    });
  }
});

// emitter.on('text', (data) => {
//   const { text } = data;
//   api.sendMessage(config.telegram.id, text);
// });

// emitter.on('photo', (data) => {
//   const { text, url } = data;
//   api.sendPhoto(config.telegram.id, url, {
//     caption: text
//   });
// });

// emitter.on('voice', (data) => {
//   const { text, url } = data;
//   api.sendVoice(config.telegram.id, url, {
//     caption: text
//   });
// });

// emitter.on('doc', (data) => {
//   const { text, url } = data;
//   api.sendDocument(config.telegram.id, url, {
//     caption: text
//   });
// });

// emitter.on('sticker', (data) => {
//   const { text, url } = data;
//   api.sendPhoto(config.telegram.id, url, {
//     caption: text
//   });
// });

export default emitter;
