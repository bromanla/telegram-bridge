import { ChatModel } from '@loaders/mongo.loader';
import { api } from '@loaders/vk.loader';

const getChatName = async (chatId: number) => {
  let chat = await ChatModel.findOne({ chatId, type: 'chat' }).lean();

  if (!chat) {
    // vk-io 4.4.0 bug api type
    // @ts-ignore
    const { title: name } = await api.messages.getChat({ chat_id: chatId });
    const entity = new ChatModel({ chatId, name, type: 'chat' });
    await entity.save();
    chat = entity.toObject();
  }

  return {
    id: chat.chatId,
    name: chat.name
  };
};

const getUserName = async (chatId: number) => {
  let user = await ChatModel.findOne({ chatId, type: 'user' }).lean();

  if (!user) {
    const [{ first_name, last_name }] = await api.users.get({ user_ids: String(chatId) });
    const name = `${first_name} ${last_name}`;

    const entity = new ChatModel({ chatId, name, type: 'user' });
    await entity.save();
    user = entity.toObject();
  }

  return {
    id: user.chatId,
    name: user.name
  };
};

const getGroupName = async (chatId: number) => {
  let group = await ChatModel.findOne({ chatId, type: 'group' }).lean();

  if (!group) {
    const [{ name }] = await api.groups.getById({ group_id: String(Math.abs(chatId)) });
    const entity = new ChatModel({ chatId, name, type: 'group' });
    await entity.save();
    group = entity.toObject();
  }

  return {
    id: group.chatId,
    name: group.name
  };
};

export { getUserName, getChatName, getGroupName };
