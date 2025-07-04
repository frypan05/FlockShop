// init.js
const db = require("./db");

const init = async () => {
  if (!(await db.schema.hasTable("wishlists"))) {
    await db.schema.createTable("wishlists", (table) => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.string("owner_email").notNullable();
    });
  }

  if (!(await db.schema.hasTable("products"))) {
    await db.schema.createTable("products", (table) => {
      table.increments("id").primary();
      table.integer("wishlist_id").notNullable().references("id").inTable("wishlists").onDelete("CASCADE");
      table.string("name").notNullable();
      table.string("image_url");
      table.float("price");
      table.string("added_by");
      table.timestamp("updated_at").defaultTo(db.fn.now());
    });
  }

  if (!(await db.schema.hasTable("shared"))) {
    await db.schema.createTable("shared", (table) => {
      table.increments("id").primary();
      table.integer("wishlist_id").notNullable().references("id").inTable("wishlists").onDelete("CASCADE");
      table.string("shared_with_email").notNullable();
    });
  }
};

init();
