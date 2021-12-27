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
  type: 'text' | 'photo' | 'voice' | 'document' | 'sticker'
  attachments: Array<string>
}

export { IAttachment, IState };
