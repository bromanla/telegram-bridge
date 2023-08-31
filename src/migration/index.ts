import { readdir } from 'fs/promises';
import { join } from 'path';
import { Migrator, MigrationProvider, Migration } from 'kysely';
import { DatabaseService } from '#src/service/database.service.js';

import type { Kysely } from 'kysely';

const migrationPath = join(process.cwd(), 'build', 'migration');

/**
 * Fix error running migrations with esm + windows
 * https://github.com/kysely-org/kysely/issues/277
 */
class ESMFileMigrationProvider implements MigrationProvider {
  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = {};
    const files = await readdir(migrationPath);

    for (const fileName of files) {
      if (fileName.startsWith('index') || !fileName.endsWith('.js')) {
        continue;
      }

      const importPath = `./${fileName}`;
      const migration = await import(importPath);
      const migrationKey = fileName.substring(0, fileName.lastIndexOf('.'));

      migrations[migrationKey] = migration;
    }

    return migrations;
  }
}

const [command] = process.argv.slice(2);

const action =
  command === 'up'
    ? 'migrateUp'
    : command === 'down'
    ? 'migrateDown'
    : 'migrateToLatest';

const store = new DatabaseService() as Kysely<any>;
const migrator = new Migrator({
  db: store,
  provider: new ESMFileMigrationProvider(),
});

const { error, results } = await migrator[action]();

results?.forEach(({ status, migrationName, direction }) => {
  let text: string;
  let level: 'log' | 'warn' | 'error';

  switch (status) {
    case 'Success': {
      text = `${direction}: migration "${migrationName}" was executed successfully`;
      level = 'log';
      break;
    }

    case 'Error': {
      text = `${direction}: failed to execute migration "${migrationName}"`;
      level = 'error';
      break;
    }

    case 'NotExecuted': {
      text = `${direction}: migration was not executed "${migrationName}"`;
      level = 'warn';
      break;
    }
  }

  console[level](text);
});

if (error) {
  console.log('failed to migrate');
  console.log(error);
  process.exit(1);
}

if (results && !results.length) {
  console.log('there are no suitable migrations');
}

await store.destroy();
