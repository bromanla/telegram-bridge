interface IAttachment {
  type: 'photo' | 'voice' | 'document' | 'sticker',
  url: string
}

interface IState {
  user: {
    userId: number,
    name: string
  }
  chat?: {
    chatId: number,
    title: string
  }
  title: string
  text?: string
  attachments: Array<IAttachment>
}

export { IAttachment, IState };
