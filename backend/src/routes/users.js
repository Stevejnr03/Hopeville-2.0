import { Router } from "express";
import {
  getProfile, updateProfile, updatePassword,
  getAllUsers, deleteUser
} from "../controllers/usersController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";
import upload from "../config/multer.js";

const router = Router();

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, upload.single("avatar"), updateProfile);
router.put("/password", authenticate, updatePassword);
router.get("/", authenticate, isAdmin, getAllUsers);
router.delete("/:id", authenticate, isAdmin, deleteUser);

export default router;