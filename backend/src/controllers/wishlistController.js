import db from "../config/db.js";

export async function getWishlist(req, res) {
  try {
    const items = await db("wishlist")
      .where({ "wishlist.user_id": req.user.id })
      .join("products", "wishlist.product_id", "products.id")
      .select("products.*", "wishlist.id as wishlist_id", "wishlist.created_at as saved_at");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addToWishlist(req, res) {
  try {
    const { product_id } = req.body;
    await db("wishlist")
      .insert({ user_id: req.user.id, product_id })
      .onConflict(["user_id", "product_id"])
      .ignore();
    res.status(201).json({ message: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function removeFromWishlist(req, res) {
  try {
    await db("wishlist")
      .where({ user_id: req.user.id, product_id: req.params.productId })
      .delete();
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}