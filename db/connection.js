var knex = require("knex");
knex = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
  debug: true
});