import bcrypt from "bcrypt";

export async function seed(knex) {
  await knex("users").del();

  const passwordHash = await bcrypt.hash("admin123", 12);

  await knex("users").insert([
    {
      first_name: "Ezinne",
      last_name: "Ihekweaba",
      email: "admin@hopeville.com",
      password_hash: passwordHash,
      phone: "+234 813 550 0578",
      role: "admin",
    },
  ]);
}