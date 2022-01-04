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
  text: string
  attachments: Array<string>
}
