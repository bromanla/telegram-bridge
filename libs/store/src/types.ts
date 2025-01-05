export * from "kysely";

export interface Store {
  user: User;
  chat: Chat;
  forum: Forum;
}

export interface User {
  id: number;
  full_name: string;
  is_group: boolean;
}

export interface Chat {
  id: number;
  title: string;
}

export interface Forum {
  id: number;
  chat_id: number | null;
  user_id: number | null;
}
