export async function up(knex) {
  await knex.schema.createTable("orders", (t) => {
    t.increments("id").primary();
    t.string("order_number").unique().notNullable();
    t.integer("user_id").references("id").inTable("users").onDelete("SET NULL");
    t.string("customer_name").notNullable();
    t.string("customer_email").notNullable();
    t.string("customer_phone");
    t.enum("status", ["Pending", "Delivered", "Cancelled"]).defaultTo("Pending");
    t.enum("fulfillment", ["delivery", "pickup"]).defaultTo("delivery");
    t.string("address");
    t.string("city");
    t.string("state");
    t.text("notes");
    t.decimal("subtotal", 12, 2).notNullable();
    t.decimal("delivery_fee", 12, 2).defaultTo(0);
    t.decimal("total", 12, 2).notNullable();
    t.string("paystack_reference");
    t.boolean("paid").defaultTo(false);
    t.timestamps(true, true);
  });

  await knex.schema.createTable("order_items", (t) => {
    t.increments("id").primary();
    t.integer("order_id").references("id").inTable("orders").onDelete("CASCADE");
    t.integer("product_id").references("id").inTable("products").onDelete("SET NULL");
    t.string("product_name").notNullable();
    t.string("product_variant");
    t.integer("quantity").notNullable();
    t.decimal("price", 12, 2).notNullable();
    t.string("selected_color");
    t.string("selected_lens");
  });
}

export async function down(knex) {
  await knex.schema.dropTable("order_items");
  await knex.schema.dropTable("orders");
}