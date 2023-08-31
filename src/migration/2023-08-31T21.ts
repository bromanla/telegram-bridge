import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('first_name', 'text')
    .addColumn('last_name', 'text')
    .addColumn('full_name', 'text', (col) => col.notNull())
    .addColumn('group', 'integer')
    .execute();

  await db.schema
    .createTable('chat')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('title', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('forum')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) => col.references('user.id'))
    .addColumn('chat_id', 'integer', (col) => col.references('chat.id'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user').execute();
  await db.schema.dropTable('chat').execute();
  await db.schema.dropTable('forum').execute();
}
