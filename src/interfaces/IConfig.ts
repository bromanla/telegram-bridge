interface ICommand {
  command: string
  description: string
}

interface IUsers {
  id: number
  name: string
}

export interface IConfig {
  telegram: {
    token: string
    id: number
    commands: Array<ICommand>
  },
  vk: {
    token: string
    selected: number
    users: Array<IUsers>
  },
  silence: boolean
  debug: boolean
}
