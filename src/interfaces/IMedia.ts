export interface IMedia {
  type: 'photo' | 'video' | 'document' | 'audio'
  media: string
  caption?: string
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2'
}
