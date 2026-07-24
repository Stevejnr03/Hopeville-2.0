export async function up(knex) {
  await knex.schema.table("users", (t) => {
    t.string("google_id").nullable();
  });
}

export async function down(knex) {
  await knex.schema.table("users", (t) => {
    t.dropColumn("google_id");
  });
}