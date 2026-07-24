import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";
import {
  register, login, getMe, resetPassword
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Email/password routes
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/me", authenticate, getMe);

// Google OAuth routes
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
}));

router.get("/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  (req, res) => {
    // Generate JWT for the authenticated user
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Redirect to frontend with token
    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${token}&role=${req.user.role}`
    );
  }
);

export default router;