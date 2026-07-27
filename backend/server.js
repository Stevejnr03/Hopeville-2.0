import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/auth.js";
import productRoutes from "./src/routes/products.js";
import orderRoutes from "./src/routes/orders.js";
import appointmentRoutes from "./src/routes/appointments.js";
import wishlistRoutes from "./src/routes/wishlist.js";
import blogRoutes from "./src/routes/blog.js";
import userRoutes from "./src/routes/users.js";
import paymentRoutes from "./src/routes/payments.js";

import passport from "./src/config/passport.js";

import contactRoute from "./src/routes/contact.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://hopeville-2-0.onrender.com"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

// Static files for local uploads (fallback)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contact", contactRoute);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Hopeville API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Hopeville API running on port ${PORT}`);
});
