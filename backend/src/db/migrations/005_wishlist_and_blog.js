export async function up(knex) {
  await knex.schema.createTable("wishlist", (t) => {
    t.increments("id").primary();
    t.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
    t.integer("product_id").references("id").inTable("products").onDelete("CASCADE");
    t.timestamps(true, true);
    t.unique(["user_id", "product_id"]);
  });

  await knex.schema.createTable("blog_posts", (t) => {
    t.increments("id").primary();
    t.string("slug").unique().notNullable();
    t.string("title").notNullable();
    t.string("category");
    t.text("excerpt");
    t.text("content");
    t.string("image_url");
    t.string("image_public_id");
    t.string("author").defaultTo("Dr. Ezinne Ihekweaba");
    t.string("read_time").defaultTo("4 min read");
    t.boolean("featured").defaultTo(false);
    t.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable("blog_posts");
  await knex.schema.dropTable("wishlist");
}