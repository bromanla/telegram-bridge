import config from '@config';
import { IChat, IMessage } from '@interfaces';
import { Schema, connect, model } from 'mongoose';

const chatSchema = new Schema<IChat>({
  name: {
    type: String,
    required: true
  },
  chatId: {
    type: Number,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['user', 'chat', 'group'],
    required: true
  },
  favorite: {
    type: Boolean,
    default: false,
    required: true
  }
});

const messageSchema = new Schema<IMessage>({
  chatId: {
    type: Number,
    required: true
  },
  messageId: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: '10d'
  }
});

const ChatModel = model<IChat>('Chat', chatSchema);
const MessageModel = model<IMessage>('Message', messageSchema);

const loader = async () => {
  await connect(config.mongo.uri);
};

export { loader, ChatModel, MessageModel };
