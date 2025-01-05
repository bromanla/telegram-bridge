import pg from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { getStringEnv, logger } from "@bridge/common";

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
}
