import { Router } from "express";
import { getAllPosts, getPostBySlug, createPost, updatePost, deletePost } from "../controllers/blogController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";
import upload from "../config/multer.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:slug", getPostBySlug);
router.post("/", authenticate, isAdmin, upload.single("image"), createPost);
router.put("/:id", authenticate, isAdmin, upload.single("image"), updatePost);
router.delete("/:id", authenticate, isAdmin, deletePost);

export default router;