interface IAttachment {
  type: 'photo' | 'voice' | 'document' | 'sticker' | 'video',
  url: string
}

export interface IState {
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
