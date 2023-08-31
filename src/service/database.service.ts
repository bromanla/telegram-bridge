import SQLite from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { ConfigInstance } from '#src/common/config.instance.js';

export interface Store {
  user: User;
  chat: Chat;
  forum: Forum;
}

export interface User {
  id: number;
  first_name: string | null;
  last_name: string | null;
  full_name: string;
  group: number | null;
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

export class DatabaseService extends Kysely<Store> {
  constructor() {
    const config = new ConfigInstance();

    super({
      dialect: new SqliteDialect({
        database: new SQLite(config.store.path),
      }),
    });
  }
}
