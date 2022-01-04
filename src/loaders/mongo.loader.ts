import config from '@config';
import { IUserModel, IChatModel, IMessageModel } from '@interfaces';
import { connect, Schema, model } from 'mongoose';

const usersSchema = new Schema<IUserModel>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: Number,
    required: true,
    unique: true
  },
  favorite: {
    type: Boolean,
    required: true
  }
});

const chatSchema = new Schema<IChatModel>({
  title: {
    type: String,
    required: true,
    unique: true
  },
  chatId: {
    type: Number,
    required: true,
    unique: true
  }
});

const messageSchema = new Schema<IMessageModel>({
  chatId: {
    type: Number,
    required: true
  },
  messageId: {
    type: Number,
    required: true
  }
});

const UserModel = model<IUserModel>('User', usersSchema);
const ChatModel = model<IChatModel>('Chat', chatSchema);
const MessageModel = model<IMessageModel>('Message', messageSchema);

const loader = async () => {
  await connect(config.mongo.uri);
};

export {
  loader, UserModel, ChatModel, MessageModel
};
