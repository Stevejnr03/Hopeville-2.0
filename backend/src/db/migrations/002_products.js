export async function up(knex) {
  await knex.schema.createTable("products", (t) => {
    t.increments("id").primary();
    t.string("slug").unique().notNullable();
    t.string("name").notNullable();
    t.string("variant");
    t.decimal("price", 12, 2).notNullable();
    t.string("category");
    t.string("shape");
    t.string("material");
    t.string("origin");
    t.text("description");
    t.string("lens_width");
    t.string("bridge_width");
    t.string("temple_length");
    t.boolean("is_new").defaultTo(false);
    t.boolean("in_stock").defaultTo(true);
    t.boolean("prescription_available").defaultTo(true);
    t.string("sold_this_month").defaultTo("0 Sold This Month");
    t.decimal("rating", 3, 1).defaultTo(0);
    t.integer("reviews").defaultTo(0);
    t.timestamps(true, true);
  });

  await knex.schema.createTable("product_images", (t) => {
    t.increments("id").primary();
    t.integer("product_id").references("id").inTable("products").onDelete("CASCADE");
    t.string("image_url").notNullable();
    t.string("public_id");
    t.boolean("is_hover").defaultTo(false);
    t.integer("display_order").defaultTo(0);
  });

  await knex.schema.createTable("product_colors", (t) => {
    t.increments("id").primary();
    t.integer("product_id").references("id").inTable("products").onDelete("CASCADE");
    t.string("name").notNullable();
    t.string("hex").notNullable();
  });

  await knex.schema.createTable("product_lens_options", (t) => {
    t.increments("id").primary();
    t.integer("product_id").references("id").inTable("products").onDelete("CASCADE");
    t.string("option_name").notNullable();
  });

  await knex.schema.createTable("product_features", (t) => {
    t.increments("id").primary();
    t.integer("product_id").references("id").inTable("products").onDelete("CASCADE");
    t.string("feature").notNullable();
  });
}

export async function down(knex) {
  await knex.schema.dropTable("product_features");
  await knex.schema.dropTable("product_lens_options");
  await knex.schema.dropTable("product_colors");
  await knex.schema.dropTable("product_images");
  await knex.schema.dropTable("products");
}