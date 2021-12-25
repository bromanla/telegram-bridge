import EventEmitter from 'events';
import config from '@config';
// eslint-disable-next-line import/no-cycle
import { api } from '../loaders/telegram';

const emitter = new EventEmitter();

emitter.on('text', (data) => {
  const { text } = data;
  api.sendMessage(config.telegram.id, text);
});

emitter.on('photo', (data) => {
  const { text, url } = data;
  api.sendPhoto(config.telegram.id, url, {
    caption: text
  });
});

emitter.on('voice', (data) => {
  const { text, url } = data;
  api.sendVoice(config.telegram.id, url, {
    caption: text
  });
});

emitter.on('doc', (data) => {
  const { text, url } = data;
  api.sendDocument(config.telegram.id, url, {
    caption: text
  });
});

emitter.on('sticker', (data) => {
  const { text, url } = data;
  api.sendPhoto(config.telegram.id, url, {
    caption: text
  });
});

export default emitter;
