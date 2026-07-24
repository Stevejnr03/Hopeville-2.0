import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { Router } from "express";
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from "../controllers/ordersController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";

const router = Router();

// ✅ Optional auth middleware — allows guests but attaches user if token present
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    req.user = null;
  }
  next();
}

router.post("/", optionalAuth, createOrder);
router.get("/my", authenticate, getMyOrders);
router.get("/", authenticate, isAdmin, getAllOrders);
router.patch("/:id/status", authenticate, isAdmin, updateOrderStatus);

export default router;