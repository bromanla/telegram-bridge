import { IState, IAttachment, IMedia } from '@interfaces';

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

  // eslint-disable-next-line class-methods-use-this
  public formAttachments(attachments: Array<IAttachment>, type: IMedia['type'], message: string) {
    const media: Array<IMedia> = attachments.filter((el) => el.type === type)
      .map((el, i) => {
        const acc: IMedia = {
          type: 'photo',
          media: el.url
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
