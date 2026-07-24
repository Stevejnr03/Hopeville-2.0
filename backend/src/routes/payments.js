// src/routes/payments.js
import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { initializePayment, verifyPayment } from "../controllers/paymentsController.js";

dotenv.config();

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

const router = Router();

// ✅ Anyone can initialize and verify payments — logged in or not
router.post("/initialize", optionalAuth, initializePayment);
router.get("/verify/:reference", verifyPayment);

export default router;