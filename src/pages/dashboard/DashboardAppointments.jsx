import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, X, RefreshCw } from "lucide-react";
import { appointmentService } from "../../services/appointmentService";
import Pagination from "../../components/Pagination";

const statuses = ["All", "Upcoming", "Completed", "Cancelled"];

function statusColor(status) {
  if (status === "Completed")
    return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (status === "Upcoming")
    return "text-[#C9A84C] bg-[#C9A84C]/10 border-[#C9A84C]/20";
  if (status === "Cancelled")
    return "text-[#B5685A] bg-[#B5685A]/10 border-[#B5685A]/20";
  return "text-[#888] bg-[#f0f0f0] border-[#e8e8e8]";
}

function DashboardAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("All");
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [showReschedule, setShowReschedule] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: "", time: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus]);

  async function fetchAppointments() {
    try {
      const data = await appointmentService.getMyAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered =
    activeStatus === "All"
      ? appointments
      : appointments.filter((a) => a.status === activeStatus);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  async function handleCancel(id) {
    setCancellingId(id);
    try {
      const updated = await appointmentService.cancel(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a)),
      );
      setConfirmCancel(null);
    } catch (err) {
      alert(err.message || "Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  }

  async function handleReschedule(e) {
    e.preventDefault();
    if (!rescheduleData.date || !rescheduleData.time) {
      alert("Please select a new date and time");
      return;
    }
    try {
      // Update via admin status route — just update date/time
      // For now redirect to contact/book with pre-filled service
      const apt = appointments.find((a) => a.id === showReschedule);
      setShowReschedule(null);
      // Cancel old and redirect to book new
      await appointmentService.cancel(showReschedule);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === showReschedule ? { ...a, status: "Cancelled" } : a,
        ),
      );
      alert(
        `Your appointment has been cancelled. Please book a new one for ${rescheduleData.date} at ${rescheduleData.time}.`,
      );
    } catch (err) {
      alert(err.message || "Failed to reschedule");
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <svg
          className="animate-spin w-8 h-8 text-[#4A7E96]"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p
            className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            My Appointments
          </p>
          <h1
            className="text-3xl font-light text-[#1a1a1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Appointments
          </h1>
        </div>
        <Link
          to="/book"
          className="bg-[#1a1a1a] text-white px-6 py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#4A7E96] transition-all duration-300"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          + Book New
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={`px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-all duration-200 ${
              activeStatus === s
                ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                : "border-[#e8e8e8] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a] bg-white"
            }`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Appointments list */}
      {paginated.length === 0 ? (
        <div className="bg-white border border-[#e8e8e8] p-16 text-center">
          <Calendar
            size={48}
            strokeWidth={0.8}
            className="text-[#d0d0d0] mx-auto mb-5"
          />
          <h2
            className="text-2xl font-light text-[#1a1a1a] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {activeStatus === "All"
              ? "No Appointments Yet"
              : `No ${activeStatus} Appointments`}
          </h2>
          <p className="text-[#888] text-sm font-light mb-8">
            Book an appointment with our specialists today.
          </p>
          <Link
            to="/book"
            className="bg-[#1a1a1a] text-white px-10 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#4A7E96] transition-all inline-block"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Book Appointment
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {paginated.map((apt) => (
            <div
              key={apt.id}
              className="bg-white border border-[#e8e8e8] p-6 hover:border-[#4A7E96]/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border font-medium ${statusColor(apt.status)}`}
                    >
                      {apt.status}
                    </span>
                    <span className="text-xs text-[#888]">
                      #{apt.appointment_number}
                    </span>
                  </div>

                  <h3
                    className="text-lg font-medium text-[#1a1a1a] mb-3"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {apt.service}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-sm text-[#666]">
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={14}
                        strokeWidth={1.5}
                        className="text-[#4A7E96]"
                      />
                      <span>
                        {apt.date
                          ? new Date(apt.date).toLocaleDateString("en-GB", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock
                        size={14}
                        strokeWidth={1.5}
                        className="text-[#4A7E96]"
                      />
                      <span>{apt.time}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#888]">
                    <span>Doctor: {apt.doctor || "Dr. Ezinne Ihekweaba"}</span>
                    <span>·</span>
                    <span>Location: #64 Alcon Road, Woji</span>
                  </div>

                  {apt.notes && (
                    <p className="mt-3 text-sm text-[#666] italic">
                      Notes: {apt.notes}
                    </p>
                  )}
                </div>

                {/* Actions — only for Upcoming */}
                {apt.status === "Upcoming" && (
                  <div className="flex flex-col gap-2 shrink-0">
                    {/* <button
                      onClick={() => {
                        setShowReschedule(apt.id);
                        setRescheduleData({ date: apt.date, time: apt.time });
                      }}
                      className="flex items-center gap-2 border border-[#e8e8e8] text-[#555] px-4 py-2 text-xs tracking-[0.1em] uppercase hover:border-[#4A7E96] hover:text-[#4A7E96] transition-all">
                      <RefreshCw size={12} strokeWidth={1.5} />
                      Reschedule
                    </button> */}
                    <button
                      onClick={() => setConfirmCancel(apt.id)}
                      className="flex items-center gap-2 border border-[#e8e8e8] text-[#888] px-4 py-2 text-xs tracking-[0.1em] uppercase hover:border-[#B5685A] hover:text-[#B5685A] transition-all"
                    >
                      <X size={12} strokeWidth={1.5} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filtered.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                  label="orders"
                />

        </div>
      )}

      {/* Cancel Confirm Modal */}
      {confirmCancel && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-[#B5685A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={24} strokeWidth={1.5} className="text-[#B5685A]" />
            </div>
            <h3
              className="text-xl font-light text-[#1a1a1a] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Cancel Appointment?
            </h3>
            <p className="text-[#888] text-sm mb-6">
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleCancel(confirmCancel)}
                disabled={cancellingId === confirmCancel}
                className="flex-1 bg-[#B5685A] text-white py-3 text-xs tracking-[0.15em] uppercase hover:bg-red-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {cancellingId === confirmCancel ? (
                  <>
                    <svg
                      className="animate-spin w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
              <button
                onClick={() => setConfirmCancel(null)}
                className="flex-1 border border-[#e8e8e8] text-[#888] py-3 text-xs tracking-[0.15em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all"
              >
                Keep It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {/* {showReschedule && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
              <h2 className="text-xl font-light text-[#1a1a1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Reschedule Appointment
              </h2>
              <button onClick={() => setShowReschedule(null)}
                className="w-8 h-8 flex items-center justify-center border border-[#e8e8e8] hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleReschedule} className="p-6 flex flex-col gap-5">
              <div className="bg-[#f8f8f6] border border-[#e8e8e8] p-4 text-sm text-[#666]">
                <p>Rescheduling will cancel your current appointment and you'll need to book a new time.</p>
              </div>

              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                  New Date *
                </label>
                <input type="date"
                  value={rescheduleData.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                  required
                  className="w-full border border-[#e8e8e8] px-4 py-3 text-sm focus:outline-none focus:border-[#4A7E96] transition-colors bg-white" />
              </div>

              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                  New Time *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(slot => (
                    <button key={slot} type="button"
                      onClick={() => setRescheduleData(prev => ({ ...prev, time: slot }))}
                      className={`py-2 text-xs border transition-all duration-200 ${
                        rescheduleData.time === slot
                          ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                          : "border-[#e8e8e8] text-[#666] hover:border-[#1a1a1a]"
                      }`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-[#e8e8e8]">
                <button type="submit"
                  className="flex-1 bg-[#1a1a1a] text-white py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#4A7E96] transition-all"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Confirm Reschedule
                </button>
                <button type="button" onClick={() => setShowReschedule(null)}
                  className="flex-1 border border-[#e8e8e8] text-[#888] py-3 text-xs tracking-[0.15em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all">
                  Keep Current
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default DashboardAppointments;
