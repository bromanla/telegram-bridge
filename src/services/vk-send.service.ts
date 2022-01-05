import EventEmitter from 'events';
import { getRandomId } from 'vk-io';
import { api, upload } from '@loaders/vk.loader';

const emitter = new EventEmitter();

emitter.on('text', (data: { id: number, text: string }) => {
  api.messages.send({
    peer_id: data.id,
    message: data.text,
    random_id: getRandomId()
  });
});

emitter.on('voice', async (data) => {
  const { id, href } = data;

  const attachment = await upload.audioMessage({ source: { value: href } });

  await api.messages.send({
    peer_id: id,
    attachment,
    random_id: getRandomId()
  });
});

emitter.on('photo', async (data) => {
  const { id, href } = data;

  const attachment = await upload.messagePhoto({ source: { value: href } });

  await api.messages.send({
    peer_id: id,
    attachment,
    random_id: getRandomId()
  });
});

emitter.on('document', async (data) => {
  const { id, href } = data;

  const attachment = await upload.messageDocument({ source: { value: href } });

  await api.messages.send({
    peer_id: id,
    attachment,
    random_id: getRandomId()
  });
});

emitter.on('sticker', async (data) => {
  const { id, href } = data;

  const attachment = await upload.messageGraffiti({ source: { value: href } });

  await api.messages.send({
    peer_id: id,
    attachment,
    random_id: getRandomId()
  });
});

export default emitter;
