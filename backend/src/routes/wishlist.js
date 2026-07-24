import { Router } from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getWishlist);
router.post("/", authenticate, addToWishlist);
router.delete("/:productId", authenticate, removeFromWishlist);

export default router;