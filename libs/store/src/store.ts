import pg from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { logger, requiredEnv } from "@bridge/common";

import type { Store } from "./types.ts";

const connectionString = requiredEnv("POSTGRESQL_URL");

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
