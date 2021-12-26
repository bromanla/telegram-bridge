import config from '@config';
import { IUserModel, IChatModel } from '@interfaces';
import { connect, Schema, model } from 'mongoose';

const loader = async () => {
  await connect(config.mongo.uri);
};

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

const UserModel = model<IUserModel>('User', usersSchema);
const ChatModel = model<IChatModel>('Chat', chatSchema);

export { loader, UserModel, ChatModel };
