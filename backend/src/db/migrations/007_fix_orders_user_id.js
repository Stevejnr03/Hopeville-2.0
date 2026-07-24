export async function up(knex) {
  // Drop and recreate the foreign key to allow null properly
  await knex.schema.alterTable("orders", (t) => {
    t.integer("user_id").nullable().alter();
  });
}

export async function down(knex) {
  await knex.schema.alterTable("orders", (t) => {
    t.integer("user_id").nullable().alter();
  });
}