import { IState } from '@interfaces';

class Message {
  // Previous message user id
  private userId = 0;

  // Previous message chat id
  private chatId = 0;

  public form(state: IState) {
    let message: string;
    const text = state?.text ?? '';

    // Chat message or private message
    if (state?.chat) {
      // The last message was sent from the same as from the same user
      message = this.userId === state.user.userId
        && this.chatId === state.chat.chatId
        ? text
        : `${state.title}\n${text}`;

      this.chatId = state.chat.chatId;
    } else {
      // A previous message was sent from the same user
      message = this.userId === state.user.userId
        ? text
        : `${state.title}\n${text}`;
    }

    this.userId = state.user.userId;

    return message;
  }
}

export default Message;
