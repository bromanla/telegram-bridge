import { cache, logger } from "@bridge/common";
import { StoreService } from "@bridge/store";
import type { Chat, Insertable, User } from "@bridge/store";

export class BotStore extends StoreService {
  public async createUser(data: Insertable<User>) {
    // TODO: escaping name
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

  @cache()
  public getUser(userId: number) {
    return this
      .selectFrom("user")
      .where("id", "=", userId)
      .selectAll()
      .executeTakeFirst();
  }

  public async createChat(data: Insertable<Chat>) {
    // TODO: escaping title
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

  @cache()
  public getChat(chatId: number) {
    return this
      .selectFrom("chat")
      .where("id", "=", chatId)
      .selectAll()
      .executeTakeFirst();
  }
}
