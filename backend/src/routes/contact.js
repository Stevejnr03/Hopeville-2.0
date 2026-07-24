import { Router } from "express";
import { sendEmail } from "../config/email.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required" });
    }

    // Send to clinic
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `New Contact Message — ${subject || "General Enquiry"}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px;">
          <h2 style="color: #4A7E96; font-weight: 300;">New Message from Website</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 120px;">Name</td>
              <td style="padding: 8px 0; color: #1a1a1a;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
              <td style="padding: 8px 0; color: #1a1a1a;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
              <td style="padding: 8px 0; color: #1a1a1a;">${phone || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Subject</td>
              <td style="padding: 8px 0; color: #1a1a1a;">${subject || "—"}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 20px; background: #f8f8f6; border-left: 3px solid #4A7E96;">
            <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px;">Message</p>
            <p style="color: #1a1a1a; line-height: 1.8; margin: 0;">${message}</p>
          </div>
          <p style="color: #aaa; font-size: 12px; margin-top: 30px;">
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
      replyTo: email,
    });

    // Send confirmation to user
    await sendEmail({
      to: email,
      subject: "We received your message — Hopeville Eye Clinic",
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px;">
          <h2 style="color: #4A7E96; font-weight: 300;">Thank you, ${name}!</h2>
          <p style="color: #555; line-height: 1.8;">
            We have received your message and will get back to you within 24 hours.
          </p>
          <div style="background: #f8f8f6; padding: 20px; margin: 20px 0; border-left: 3px solid #4A7E96;">
            <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Message</p>
            <p style="margin: 10px 0 0; color: #1a1a1a; line-height: 1.8;">${message}</p>
          </div>
          <p style="color: #555; line-height: 1.8;">
            In the meantime, you can reach us at:
          </p>
          <p style="color: #1a1a1a;">
            📞 +234 813 330 0378<br/>
            📍 #64 Alcon Road, Woji, Port Harcourt
          </p>
          <p style="color: #aaa; font-size: 12px; margin-top: 40px;">
            Hopeville Eye Clinic · Vision Specialists
          </p>
        </div>
      `,
    });

    res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;