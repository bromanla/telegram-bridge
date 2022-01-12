import { IState, IMedia } from '@interfaces';

class Message {
  // Previous message user id
  private senderId = 0;
  // Previous message chat id
  private chatId = 0;
  // Time after which the sender will be added
  private forgetTime = 0;

  public form(state: IState) {
    let message: string;
    const { text } = state;

    // Chat message or private message
    if (state?.chat) {
      // The last message was sent from the same as from the same user
      message = this.senderId === state.sender.id
        && this.chatId === state.chat.id
        && this.forgetTime > Date.now()
        ? text
        : `${state.title}\n${text}`;

      this.chatId = state.chat.id;
    } else {
      // A previous message was sent from the same user
      message = this.senderId === state.sender.id
        && this.forgetTime > Date.now()
        ? text
        : `${state.title}\n${text}`;
    }

    this.senderId = state.sender.id;
    this.forgetTime = Date.now() + 1000 * 60 * 1; // 1 min

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
