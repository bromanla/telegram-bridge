export interface IChat {
  name: string
  chatId: number
  type: 'user' | 'chat' | 'group'
  favorite?: boolean
}
