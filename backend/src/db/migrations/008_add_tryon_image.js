export async function up(knex) {
  await knex.schema.alterTable("products", (t) => {
    t.string("tryon_image_url").nullable();
    t.string("tryon_image_public_id").nullable();
  });
}

export async function down(knex) {
  await knex.schema.alterTable("products", (t) => {
    t.dropColumn("tryon_image_url");
    t.dropColumn("tryon_image_public_id");
  });
}