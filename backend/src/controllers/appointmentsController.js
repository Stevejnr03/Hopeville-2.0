import db from "../config/db.js";
import { sendEmail } from "../config/email.js";

function generateAppointmentNumber() {
  return `APT-${Date.now().toString().slice(-6)}`;
}

export async function createAppointment(req, res) {
  try {
    const {
      patient_name, patient_email, patient_phone,
      service, date, time, notes,
    } = req.body;

    const appointment_number = generateAppointmentNumber();

    // ✅ user_id from token if logged in, null for guests
    const user_id = req.user?.id || null;

    console.log("Creating appointment — user_id:", user_id);

    const [appointment] = await db("appointments").insert({
      appointment_number,
      user_id,
      patient_name,
      patient_email,
      patient_phone,
      service,
      date,
      time,
      notes,
    }).returning("*");

    // Send confirmation email
    try {
      await sendEmail({
        to: patient_email,
        subject: `Appointment Confirmed — #${appointment_number}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px;">
            <h1 style="color: #4A7E96; font-weight: 300;">Appointment Confirmed!</h1>
            <p style="color: #555; line-height: 1.8;">
              Dear ${patient_name}, your appointment has been successfully booked.
            </p>
            <div style="background: #f8f8f6; padding: 20px; margin: 20px 0; border-left: 3px solid #4A7E96;">
              <p style="margin: 0 0 8px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
                Appointment Details
              </p>
              <p style="margin: 4px 0; color: #1a1a1a;"><strong>Ref:</strong> #${appointment_number}</p>
              <p style="margin: 4px 0; color: #1a1a1a;"><strong>Service:</strong> ${service}</p>
              <p style="margin: 4px 0; color: #1a1a1a;"><strong>Date:</strong> ${date}</p>
              <p style="margin: 4px 0; color: #1a1a1a;"><strong>Time:</strong> ${time}</p>
              <p style="margin: 4px 0; color: #1a1a1a;"><strong>Doctor:</strong> Dr. Ezinne Ihekweaba</p>
              <p style="margin: 4px 0; color: #1a1a1a;"><strong>Location:</strong> #64 Alcon Road, Woji, Port Harcourt</p>
            </div>
            <p style="color: #555; line-height: 1.8;">
              Please arrive 10 minutes before your appointment time.
            </p>
            <p style="color: #aaa; font-size: 12px; margin-top: 40px;">
              To reschedule, call us at +234 813 330 0378
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
    }

    res.status(201).json(appointment);
  } catch (err) {
    console.error("createAppointment error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function getMyAppointments(req, res) {
  try {
    const appointments = await db("appointments")
      .where({ user_id: req.user.id })
      .orderBy("date", "desc");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAllAppointments(req, res) {
  try {
    const { status, search } = req.query;
    let query = db("appointments").orderBy("created_at", "desc");
    if (status && status !== "All") query = query.where({ status });
    if (search) {
      query = query.where(function () {
        this.whereILike("patient_name", `%${search}%`)
          .orWhereILike("service", `%${search}%`)
          .orWhereILike("appointment_number", `%${search}%`);
      });
    }
    const appointments = await query;
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateAppointmentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const [apt] = await db("appointments")
      .where({ id })
      .update({ status, updated_at: new Date() })
      .returning("*");
    if (!apt) return res.status(404).json({ error: "Appointment not found" });
    res.json(apt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//User can cancel their own appointment
export async function cancelAppointment(req, res) {
  try {
    const { id } = req.params;

    const apt = await db("appointments").where({ id }).first();
    if (!apt) return res.status(404).json({ error: "Appointment not found" });

    // Only the owner can cancel
    if (apt.user_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (apt.status === "Cancelled") {
      return res.status(400).json({ error: "Appointment is already cancelled" });
    }

    if (apt.status === "Completed") {
      return res.status(400).json({ error: "Cannot cancel a completed appointment" });
    }

    const [updated] = await db("appointments")
      .where({ id })
      .update({ status: "Cancelled", updated_at: new Date() })
      .returning("*");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}