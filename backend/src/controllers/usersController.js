import db from "../config/db.js";
import bcrypt from "bcrypt";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/uploadToCloudinary.js";


export async function getProfile(req, res) {
  try {
    const user = await db("users")
      .where({ id: req.user.id })
      .select("id", "first_name", "last_name", "email", "phone", "avatar_url", "role", "created_at")
      .first();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const { first_name, last_name, phone } = req.body;
    const updates = { first_name, last_name, phone, updated_at: new Date() };

    if (req.file) {
      const user = await db("users").where({ id: req.user.id }).first();
      if (user.avatar_public_id) await deleteFromCloudinary(user.avatar_public_id);
      const result = await uploadToCloudinary(req.file.buffer, "hopeville/avatars");
      updates.avatar_url = result.secure_url;
      updates.avatar_public_id = result.public_id;
    }

    const [user] = await db("users")
      .where({ id: req.user.id })
      .update(updates)
      .returning(["id", "first_name", "last_name", "email", "phone", "avatar_url", "role"]);

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updatePassword(req, res) {
  try {
    const { current_password, new_password } = req.body;
    const user = await db("users").where({ id: req.user.id }).first();

    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Current password is incorrect" });

    const password_hash = await bcrypt.hash(new_password, 12);
    await db("users").where({ id: req.user.id }).update({ password_hash, updated_at: new Date() });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await db("users")
      .select("id", "first_name", "last_name", "email", "phone", "role", "created_at")
      .orderBy("created_at", "desc");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (Number(id) === req.user.id) {
      return res.status(400).json({ error: "You cannot delete your own account" });
    }

    const user = await db("users").where({ id }).first();
    if (!user) return res.status(404).json({ error: "User not found" });

    // Delete avatar from Cloudinary if exists
    if (user.avatar_public_id) {
      try {
        await deleteFromCloudinary(user.avatar_public_id);
      } catch (e) {
        console.error("Cloudinary delete failed:", e.message);
      }
    }

    // Delete all related data for this user
    const orders = await db("orders").where({ user_id: id });
    for (const order of orders) {
      await db("order_items").where({ order_id: order.id }).delete();
    }
    await db("orders").where({ user_id: id }).delete();

    // Delete appointments
    await db("appointments").where({ user_id: id }).delete();

    // Delete wishlist
    await db("wishlist").where({ user_id: id }).delete();

    // Delete user
    await db("users").where({ id }).delete();

    res.json({ message: "User and all associated data deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ error: err.message });
  }
}