import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("user")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("full_name", "varchar(256)", (col) => col.notNull())
    .addColumn("is_group", "boolean", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("chat")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("title", "varchar(256)", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("forum")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("user_id", "integer", (col) => col.references("user.id"))
    .addColumn("chat_id", "integer", (col) => col.references("chat.id"))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("forum").execute();
  await db.schema.dropTable("chat").execute();
  await db.schema.dropTable("user").execute();
}
