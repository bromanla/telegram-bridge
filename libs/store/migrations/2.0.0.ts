import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("user")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("first_name", "varchar(256)")
    .addColumn("last_name", "varchar(256)")
    .addColumn("group", "integer")
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
