import { UserModel, ChatModel } from '@loaders/mongo.loader';
import { api } from '@loaders/vk.loader';

const getChatTitle = async (chatId: number) => {
  let chat = await ChatModel.findOne({ chatId }).lean();

  if (!chat) {
    // vk-io 4.4.0 bug api type
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { title } = await api.messages.getChat({ chat_id: chatId });
    const entity = new ChatModel({ chatId, title });
    await entity.save();
    chat = entity.toObject();
  }

  return {
    chatId: chat.chatId,
    title: chat.title
  };
};

const getUserName = async (userId: number) => {
  let user = await UserModel.findOne({ userId }).lean();

  if (!user) {
    const [{ first_name, last_name }] = await api.users.get({ user_ids: String(userId) });
    const name = `${first_name} ${last_name}`;

    const entity = new UserModel({ userId, name, favorite: false });
    await entity.save();
    user = entity.toObject();
  }

  return {
    userId: user.userId,
    name: user.name
  };
};

export { getUserName, getChatTitle };
