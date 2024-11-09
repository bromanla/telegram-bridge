import pg from "pg";

import fs from "node:fs/promises";
import path from "node:path";

import { connectionString } from "./store.ts";
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from "kysely";

const [command] = Deno.args;

const action = command === "up"
  ? "migrateUp"
  : command === "down"
  ? "migrateDown"
  : "migrateToLatest";

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new pg.Pool({ connectionString }),
  }),
});

const migrationFolder = path.resolve(
  import.meta.dirname!,
  path.join("..", "migrations"),
);

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({ fs, path, migrationFolder }),
});

const { error, results } = await migrator[action]();

results?.forEach(({ status, migrationName, direction }) => {
  let text: string;
  let level: "log" | "warn" | "error";

  switch (status) {
    case "Success": {
      text =
        `${direction}: migration "${migrationName}" was executed successfully`;
      level = "log";
      break;
    }

    case "Error": {
      text = `${direction}: failed to execute migration "${migrationName}"`;
      level = "error";
      break;
    }

    case "NotExecuted": {
      text = `${direction}: migration was not executed "${migrationName}"`;
      level = "warn";
      break;
    }
  }

  console[level](text);
});

await db.destroy();

if (error) {
  console.error("failed to migrate");
  console.error(error);
  Deno.exit(1);
}

if (results && !results.length) {
  console.log("there are no suitable migrations");
}
