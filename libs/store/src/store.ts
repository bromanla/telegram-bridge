import pg from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { cache, getStringEnv, logger } from "@bridge/common";

import type { Store } from "./types.ts";

export const connectionString = getStringEnv("POSTGRESQL_URL");

export class StoreService extends Kysely<Store> {
  constructor() {
    super({
      dialect: new PostgresDialect({
        pool: new pg.Pool({ connectionString }),
      }),
    });

    logger.info("Store connection successful");
  }

  @cache()
  public getUser(userId: number) {
    return this
      .selectFrom("user")
      .where("id", "=", userId)
      .selectAll()
      .executeTakeFirst();
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
