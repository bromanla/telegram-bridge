export interface IState {
  senderId: number
  title: string
  text: string
  sender: {
    id: number
    name: string
  }
  chat?: {
    id: number,
    name: string
  }
  attachments: Array<string>
}
