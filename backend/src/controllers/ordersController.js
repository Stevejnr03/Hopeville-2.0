import db from "../config/db.js";
import { sendEmail } from "../config/email.js";

function generateOrderNumber() {
  return `HEC-${Date.now().toString().slice(-6)}`;
}

export async function createOrder(req, res) {
  try {
    const {
      customer_name, customer_email, customer_phone,
      fulfillment, address, city, state, notes,
      subtotal, delivery_fee, total, items,
      paystack_reference,
    } = req.body;

    const order_number = generateOrderNumber();

    // ✅ Only set user_id if we actually have a valid logged-in user
    const user_id = req.user?.id || null;

    const [order] = await db("orders").insert({
      order_number,
      user_id,           // null for guests — fine
      customer_name,
      customer_email,
      customer_phone,
      fulfillment,
      address,
      city,
      state,
      notes,
      subtotal,
      delivery_fee,
      total,
      paystack_reference,
      paid: !!paystack_reference,
    }).returning("*");

    // Insert order items
    if (items?.length) {
      await db("order_items").insert(
        items.map(item => ({
          order_id: order.id,
          product_id: item.product_id || null,
          product_name: item.name,
          product_variant: item.variant || "",
          quantity: item.quantity,
          price: item.price,
          selected_color: item.selectedColor || "",
          selected_lens: item.selectedLens || "",
        }))
      );
    }

    // Send confirmation email
    try {
      await sendEmail({
        to: customer_email,
        subject: `Order Confirmed — #${order_number}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px;">
            <h1 style="color: #4A7E96; font-weight: 300;">Order Confirmed!</h1>
            <p style="color: #555; line-height: 1.8;">
              Thank you, ${customer_name}. Your order <strong>#${order_number}</strong>
              has been received and is being processed.
            </p>
            <div style="background: #f8f8f6; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Order Total</p>
              <p style="margin: 8px 0 0; color: #1a1a1a; font-size: 24px; font-weight: 300;">
                ₦${Number(total).toLocaleString()}
              </p>
            </div>
            <p style="color: #555; line-height: 1.8;">
              ${fulfillment === "pickup"
                ? "Your order will be ready for pickup at <strong>#64 Alcon Road, Woji, Port Harcourt</strong>."
                : `Your order will be delivered to <strong>${address}, ${city}</strong>.`
              }
            </p>
            <p style="color: #aaa; font-size: 12px; margin-top: 40px;">
              Hopeville Eye Clinic · +234 813 330 0378
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      // Don't fail the order if email fails
      console.error("Email send failed:", emailErr.message);
    }

    res.status(201).json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await db("orders")
      .where({ user_id: req.user.id })
      .orderBy("created_at", "desc");

    const full = await Promise.all(orders.map(async order => {
      const items = await db("order_items").where({ order_id: order.id });
      return { ...order, items };
    }));

    res.json(full);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAllOrders(req, res) {
  try {
    const { status, search } = req.query;
    let query = db("orders").orderBy("created_at", "desc");
    if (status && status !== "All") query = query.where({ status });
    if (search) {
      query = query.where(function () {
        this.whereILike("customer_name", `%${search}%`)
          .orWhereILike("order_number", `%${search}%`);
      });
    }

    const orders = await query;
    const full = await Promise.all(orders.map(async order => {
      const items = await db("order_items").where({ order_id: order.id });
      return { ...order, items };
    }));

    res.json(full);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [order] = await db("orders")
      .where({ id })
      .update({ status, updated_at: new Date() })
      .returning("*");

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}