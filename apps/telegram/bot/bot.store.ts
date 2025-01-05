import { cache, logger } from "@bridge/common";
import { StoreService } from "@bridge/store";

import type { Forum, Insertable } from "@bridge/store";

export class BotStore extends StoreService {
  public async createForum(data: Insertable<Forum>) {
    const forum = await this
      .insertInto("forum")
      .values(data)
      .returningAll()
      .executeTakeFirst();

    logger.debug(`forum created (${forum!.id})`);

    return forum!;
  }

  @cache()
  getForumByUserIdOrChatId(id: number) {
    return this
      .selectFrom("forum")
      .where((eb) => eb.or([eb("chat_id", "=", id), eb("user_id", "=", id)]))
      .selectAll()
      .executeTakeFirst();
  }

  async getUserOrChatByForum({ chat_id, user_id }: Forum) {
    if (chat_id) return { chat: await this.getChat(chat_id) };
    if (user_id) return { user: await this.getUser(user_id) };

    return undefined;
  }

  @cache()
  public getForum(forumId: number) {
    return this
      .selectFrom("forum")
      .where("id", "=", forumId)
      .selectAll()
      .executeTakeFirst();
  }
}
