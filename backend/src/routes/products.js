import { Router } from "express";
import {
  getAllProducts, getProductBySlug, createProduct,
  updateProduct, deleteProduct, toggleStock,
} from "../controllers/productsController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";
import upload from "../config/multer.js";

const router = Router();

const productUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "hoverImage", maxCount: 1 },
  { name: "tryonImage", maxCount: 1 },
]);

router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);
router.post("/", authenticate, isAdmin, productUpload, createProduct);
router.put("/:id", authenticate, isAdmin, productUpload, updateProduct);
router.delete("/:id", authenticate, isAdmin, deleteProduct); 
router.patch("/:id/toggle-stock", authenticate, isAdmin, toggleStock);

export default router;