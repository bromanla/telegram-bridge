export * from "kysely";

export interface Store {
  user: User;
  chat: Chat;
  forum: Forum;
}

export interface User {
  id: number;
  first_name: string | null;
  last_name: string | null;
  is_group: boolean | null;
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
