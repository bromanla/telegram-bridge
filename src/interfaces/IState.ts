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
  type: 'text' | 'photo' | 'voice' | 'document' | 'sticker'
  attachments: Array<string>
}
