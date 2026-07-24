import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { sendEmail } from "../config/email.js";

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

export async function register(req, res) {
  try {
    const { first_name, last_name, email, password, phone } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await db("users").where({ email }).first();
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const [user] = await db("users")
      .insert({ first_name, last_name, email, password_hash, phone })
      .returning(["id", "first_name", "last_name", "email", "phone", "role", "created_at"]);

    const token = generateToken(user);

    // Send welcome email
    await sendEmail({
      to: email,
      subject: "Welcome to Hopeville Eye Clinic",
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px;">
          <h1 style="color: #4A7E96; font-weight: 300;">Welcome, ${first_name}!</h1>
          <p style="color: #555; line-height: 1.8;">
            Thank you for creating an account with Hopeville Eye Clinic. 
            We're delighted to have you as part of our community.
          </p>
          <p style="color: #555; line-height: 1.8;">
            You can now book appointments, track your orders, and manage your wishlist 
            all from your personal dashboard.
          </p>
          <a href="${process.env.CLIENT_URL}/dashboard" 
            style="display: inline-block; background: #4A7E96; color: white; 
            padding: 12px 32px; text-decoration: none; margin-top: 20px; 
            font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
            Go to Dashboard
          </a>
          <p style="color: #aaa; font-size: 12px; margin-top: 40px;">
            Hopeville Eye Clinic · #64 Alcon Road, Woji, Port Harcourt
          </p>
        </div>
      `,
    });

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user);
    const { password_hash, ...safeUser } = user;

    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getMe(req, res) {
  try {
    const user = await db("users")
      .where({ id: req.user.id })
      .select("id", "first_name", "last_name", "email", "phone", "avatar_url", "role", "created_at")
      .first();

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, token, password } = req.body;


    // =====================================
    // STEP 1: REQUEST RESET LINK
    // =====================================
    if (email && !token && !password) {

      const user = await db("users")
        .where({ email })
        .first();


      // Security: don't reveal if user exists
      if (!user) {
        return res.json({
          message: "If the email exists, a reset link has been sent."
        });
      }


      const resetToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );


      const resetUrl =
        `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;


      await sendEmail({
        to: user.email,
        subject: "Reset Your Password — Hopeville Eye Clinic",
        html: `
          <div style="font-family: Georgia, serif; max-width:600px; margin:auto; padding:40px;">
            <h1 style="color:#4A7E96;font-weight:300;">
              Password Reset
            </h1>

            <p style="color:#555;">
              Hi ${user.first_name}, we received a request to reset your password.
            </p>

            <a href="${resetUrl}"
              style="
                display:inline-block;
                padding:12px 25px;
                background:#1a1a1a;
                color:white;
                text-decoration:none;
              ">
              Reset Password
            </a>

            <p style="color:#999;font-size:12px;margin-top:30px;">
              This link expires in 15 minutes.
            </p>
          </div>
        `,
      });


      return res.json({
        message: "Password reset email sent."
      });
    }



    // =====================================
    // STEP 2: UPDATE PASSWORD
    // =====================================

    if (!token || !password) {
      return res.status(400).json({
        error: "Token and password are required"
      });
    }


    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters"
      });
    }


    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    } catch (err) {

      return res.status(400).json({
        error: "Reset link has expired or is invalid. Please request a new one."
      });
    }


    const user = await db("users")
      .where({ id: decoded.id })
      .first();


    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }


    const password_hash = await bcrypt.hash(password, 12);


    await db("users")
      .where({ id: decoded.id })
      .update({
        password_hash,
        updated_at: new Date(),
      });



    // Confirmation email
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Successful — Hopeville Eye Clinic",
        html: `
          <div style="font-family: Georgia, serif; max-width:600px; margin:auto; padding:40px;">
            <h1 style="color:#4A7E96;font-weight:300;">
              Password Updated
            </h1>

            <p style="color:#555;">
              Hi ${user.first_name}, your password has been successfully reset.
            </p>

            <p style="color:#555;">
              If you did not make this change, please contact us immediately.
            </p>
          </div>
        `,
      });

    } catch(emailErr) {
      console.error(
        "Confirmation email failed:",
        emailErr.message
      );
    }


    return res.json({
      message: "Password reset successfully"
    });


  } catch(err) {

    console.error("resetPassword error:", err);

    res.status(500).json({
      error: err.message
    });
  }
}