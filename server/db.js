// server/db.js
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./wishlist.db",
  },
  useNullAsDefault: true,
});

module.exports = knex;