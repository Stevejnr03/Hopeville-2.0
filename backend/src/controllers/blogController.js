import db from "../config/db.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/uploadToCloudinary.js";

export async function getAllPosts(req, res) {
  try {
    const { category, search } = req.query;
    let query = db("blog_posts").orderBy("created_at", "desc");
    if (category) query = query.where({ category });
    if (search) query = query.whereILike("title", `%${search}%`);
    const posts = await query;
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getPostBySlug(req, res) {
  try {
    const post = await db("blog_posts").where({ slug: req.params.slug }).first();
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createPost(req, res) {
  try {
    const { title, category, excerpt, content, author, read_time, featured } = req.body;
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    let image_url = null;
    let image_public_id = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "hopeville/blog");
      image_url = result.secure_url;
      image_public_id = result.public_id;
    }

    const [post] = await db("blog_posts").insert({
      slug, title, category, excerpt, content,
      image_url, image_public_id, author, read_time,
      featured: featured === "true" || featured === true,
    }).returning("*");

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const post = await db("blog_posts").where({ id }).first();
    if (!post) return res.status(404).json({ error: "Post not found" });

    const updates = { ...req.body, updated_at: new Date() };
    if (updates.featured !== undefined) {
      updates.featured = updates.featured === "true" || updates.featured === true;
    }

    if (req.file) {
      if (post.image_public_id) await deleteFromCloudinary(post.image_public_id);
      const result = await uploadToCloudinary(req.file.buffer, "hopeville/blog");
      updates.image_url = result.secure_url;
      updates.image_public_id = result.public_id;
    }

    const [updated] = await db("blog_posts").where({ id }).update(updates).returning("*");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const post = await db("blog_posts").where({ id }).first();
    if (post?.image_public_id) await deleteFromCloudinary(post.image_public_id);
    await db("blog_posts").where({ id }).delete();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}