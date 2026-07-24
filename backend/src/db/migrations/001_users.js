export async function up(knex) {
  await knex.schema.createTable("users", (t) => {
    t.increments("id").primary();
    t.string("first_name").notNullable();
    t.string("last_name").notNullable();
    t.string("email").unique().notNullable();
    t.string("password_hash").notNullable();
    t.string("phone");
    t.string("avatar_url");
    t.string("avatar_public_id");
    t.enum("role", ["user", "admin"]).defaultTo("user");
    t.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable("users");
}