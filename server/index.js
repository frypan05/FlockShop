const express = require("express");
const cors = require("cors");
const db = require("./db");
require("./init"); // ensure tables are created

const app = express();
app.use(cors());
app.use(express.json());

// Mock auth middleware
app.use((req, res, next) => {
  req.user = { email: req.headers["x-user-email"] || "guest@example.com" };
  next();
});

// -------------------- Wishlist Routes -------------------- //

// Create a new wishlist
app.post("/wishlists", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  const result = await db("wishlists").insert({
    title,
    owner_email: req.user.email,
  });
  res.json({ id: result[0] });
});

// Get all wishlists for a user
app.get("/wishlists", async (req, res) => {
  const user = req.user.email;
  const owned = await db("wishlists").where("owner_email", user);
  const shared = await db("shared")
    .join("wishlists", "shared.wishlist_id", "wishlists.id")
    .where("shared_with_email", user);
  res.json([...owned, ...shared]);
});

// Get all products in a specific wishlist
app.get("/wishlists/:id/products", async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching products for wishlist ${id}`);
  const products = await db("products")
    .where("wishlist_id", id)
    .orderBy("updated_at", "desc");
  res.json(products);
}); 

// Invite someone to a wishlist (mocked)
app.post("/wishlists/:id/invite", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  await db("shared").insert({
    wishlist_id: req.params.id,
    shared_with_email: email,
  });
  res.json({ invited: email });
});

// -------------------- Product Routes -------------------- //

// Add product to a wishlist
app.post("/wishlists/:id/products", async (req, res) => {
  const { name, image_url, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  const wishlist_id = req.params.id;
  const result = await db("products").insert({
    wishlist_id,
    name,
    image_url,
    price,
    added_by: req.user.email,
  });
  res.json({ id: result[0] });
});

// Edit a product
app.put("/products/:id", async (req, res) => {
  const { name, image_url, price } = req.body;
  const updated = await db("products")
    .where("id", req.params.id)
    .update({ name, image_url, price, updated_at: new Date() });

  res.json({ updated });
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
  await db("products").where("id", req.params.id).del();
  res.json({ success: true });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
