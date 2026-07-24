export async function up(knex) {
  await knex.schema.createTable("appointments", (t) => {
    t.increments("id").primary();
    t.string("appointment_number").unique().notNullable();
    t.integer("user_id").references("id").inTable("users").onDelete("SET NULL");
    t.string("patient_name").notNullable();
    t.string("patient_email").notNullable();
    t.string("patient_phone");
    t.string("service").notNullable();
    t.date("date").notNullable();
    t.string("time").notNullable();
    t.string("doctor").defaultTo("Dr. Ezinne Ihekweaba");
    t.enum("status", ["Upcoming", "Completed", "Cancelled"]).defaultTo("Upcoming");
    t.text("notes");
    t.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable("appointments");
}