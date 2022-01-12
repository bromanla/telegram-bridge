export interface ICommand {
  command: string
  description: string
}

export interface IConfig {
  telegram: {
    token: string
    id: number
  },
  vk: {
    token: string
    selected: number
  },
  mongo: {
    uri: string
  }
  silence: boolean
  debug: boolean
}
