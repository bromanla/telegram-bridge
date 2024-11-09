import pg from "pg";
import z from "zod";
import { Kysely, PostgresDialect } from "kysely";
import { logger } from "@bridge/common";

import type { Store } from "./types.ts";

const postgresUrlSchema = z.string();
export const connectionString = postgresUrlSchema.parse(
  Deno.env.get("POSTGRESQL_URL"),
);

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
