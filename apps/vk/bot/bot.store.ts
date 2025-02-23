import { logger } from "@bridge/common";
import { StoreService } from "@bridge/store";
import type { Chat, Insertable, User } from "@bridge/store";

export class BotStore extends StoreService {
  public async createUser(data: Insertable<User>) {
    // FIXME: This is a temporary solution to prevent SQL injection
    // data.full_name = this.escape(data.full_name);

    const user = await this
      .insertInto("user")
      .values(data)
      .returningAll()
      .executeTakeFirst();

    if (!user) {
      throw new Error("Failed to create a user", { cause: data });
    }

    logger.debug(`User created (${user!.id})`);
    return user;
  }

  public async createChat(data: Insertable<Chat>) {
    // FIXME: This is a temporary solution to prevent SQL injection
    // data.title = this.escape(data.title);

    const chat = await this
      .insertInto("chat")
      .values(data)
      .returningAll()
      .executeTakeFirst();

    if (!chat) {
      throw new Error("Failed to create a chat", { cause: data });
    }

    logger.debug(`Chat created (${chat!.id})`);
    return chat;
  }
}
