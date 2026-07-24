// src/controllers/paymentsController.js
import dotenv from "dotenv";
import db from "../config/db.js";

dotenv.config();

export async function initializePayment(req, res) {
  try {
    const { email, amount, metadata } = req.body;

    // console.log("=== PAYMENT INIT ===");
    // console.log("Email:", email);
    // console.log("Amount:", amount);
    // console.log("Key prefix:", process.env.PAYSTACK_SECRET_KEY?.slice(0, 10));

    if (!email || !amount) {
      return res.status(400).json({ error: "Email and amount are required" });
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return res
        .status(500)
        .json({ error: "Paystack secret key not configured" });
    }

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(Number(amount) * 100), // convert to kobo
          metadata,
          callback_url: `${process.env.CLIENT_URL}/checkout/verify`,
        }),
      },
    );

    const text = await response.text();
    // console.log("Paystack status:", response.status);
   // console.log("Paystack response:", text);

    if (!text) {
      return res
        .status(500)
        .json({ error: "Paystack returned empty response" });
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    console.error("initializePayment error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function verifyPayment(req, res) {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({ error: "Reference is required" });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const text = await response.text();
    // console.log("Verify status:", response.status);
   // console.log("Verify response:", text);

    if (!text) {
      return res
        .status(500)
        .json({ error: "Paystack returned empty response" });
    }

    const data = JSON.parse(text);

    // Mark order as paid if successful
    if (data.data?.status === "success") {
      try {
        const updated = await db("orders")
          .where({ paystack_reference: reference })
          .update({ paid: true, status: "Pending", updated_at: new Date() });
        console.log("Order marked as paid:", updated, "ref:", reference);
      } catch (dbErr) {
        console.error("DB update error:", dbErr.message);
      }
    }

    res.json(data);
  } catch (err) {
    console.error("verifyPayment error:", err);
    res.status(500).json({ error: err.message });
  }
}
