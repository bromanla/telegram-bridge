import { IState, IMedia } from '@interfaces';

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

  public formPhotosGroup(state: IState) {
    const message = this.form(state);

    const media = state.attachments.map((url, i) => {
      const acc: IMedia = {
        type: 'photo',
        media: url
      };

      if (i === 0) {
        acc.caption = message;
        acc.parse_mode = 'HTML';
      }

      return acc;
    });

    return media;
  }
}

export default Message;
