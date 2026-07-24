import { Router } from "express";
import {
  createAppointment, getMyAppointments,
  getAllAppointments, updateAppointmentStatus,
  cancelAppointment,
} from "../controllers/appointmentsController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }
  try {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    req.user = null;
  }
  next();
}

const router = Router();

router.post("/", optionalAuth, createAppointment);       // ✅ guests + users
router.get("/my", authenticate, getMyAppointments);
router.get("/", authenticate, isAdmin, getAllAppointments);
router.patch("/:id/status", authenticate, isAdmin, updateAppointmentStatus);
router.patch("/:id/cancel", authenticate, cancelAppointment); // ✅ user cancel

export default router;