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

  // // Only text message
  // if (!state.attachments.length) {
  //   queue.push(async () => {
  //     const { message_id } = await api.sendMessage(chatId, message, { parse_mode: 'HTML' });
  //   });

  //   return;
  // }

  // const photoAttachments = messageUtility.formAttachments(state.attachments, 'photo', message);
  // eslint-disable-next-line max-len
  // const documentAttachments = messageUtility.formAttachments(state.attachments, 'document', message);
  // const audioAttachments = messageUtility.formAttachments(state.attachments, 'audio', message);

  // if (photoAttachments.length) {
  //   queue.push(async () => {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     await api.sendMediaGroup(chatId, photoAttachments);
  //     // TODO: Add to mongodb
  //   });
  // }

  // if (documentAttachments.length) {
  //   queue.push(async () => {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     await api.sendMediaGroup(chatId, documentAttachments);
  //     // TODO: Add to mongodb
  //   });
  // }

  // if (audioAttachments.length) {
  //   queue.push(async () => {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     await api.sendMediaGroup(chatId, audioAttachments);
  //     // TODO: Add to mongodb
  //   });
  // }
});

export default emitter;
