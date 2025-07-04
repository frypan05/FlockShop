// server/setup.js
const db = require("./db");

async function setup() {
  await db.schema.hasTable("users").then(async (exists) => {
  if (!exists) {
    await db.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("email").unique();
    });
  }
});

  await db.schema.hasTable("wishlists").then(async (exists) => {
  if (!exists) {
    await db.schema.createTable("wishlists", (table) => {
      table.increments("id").primary();
      table.string("title");
      table.string("owner_email");
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }
});

  await db.schema.hasTable("products").then(async (exists) => {
  if (!exists) {
    await db.schema.createTable("products", (table) => {
      table.increments("id").primary();
      table.integer("wishlist_id").references("id").inTable("wishlists");
      table.string("name");
      table.string("image_url");
      table.float("price");
      table.string("added_by");
      table.timestamp("updated_at").defaultTo(db.fn.now());
    });
  }
});

  await db.schema.hasTable("shared").then(async (exists) => {
  if (!exists) {
    await db.schema.createTable("shared", (table) => {
      table.increments("id").primary();
      table.integer("wishlist_id");
      table.string("shared_with_email");
    });
  }
});

  console.log("Tables created.");
  process.exit();
}

setup();