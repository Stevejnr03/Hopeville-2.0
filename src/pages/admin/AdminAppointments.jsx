import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { appointmentService } from "../../services/appointmentService";
import Pagination from "../../components/Pagination";

const statuses = ["All", "Upcoming", "Completed", "Cancelled"];

function statusColor(status) {
  if (status === "Completed") return "text-emerald-600 bg-emerald-50";
  if (status === "Upcoming") return "text-[#C9A84C] bg-[#C9A84C]/10";
  if (status === "Cancelled") return "text-[#B5685A] bg-[#B5685A]/10";
  return "text-[#888] bg-[#f0f0f0]";
}

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchAppointments();
  }, [activeStatus, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus, search]);

  async function fetchAppointments() {
    try {
      const params = {};
      if (activeStatus !== "All") params.status = activeStatus;
      if (search) params.search = search;
      const data = await appointmentService.getAll(params);
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = appointments.filter((a) => {
    const matchStatus = activeStatus === "All" || a.status === activeStatus;
    const matchSearch =
      search === "" ||
      a.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.service?.toLowerCase().includes(search.toLowerCase()) ||
      a.appointment_number?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  async function updateStatus(id, newStatus) {
    try {
      await appointmentService.updateStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
      );
    } catch (err) {
      console.error(err);
    }
  }

  console.log(appointments);

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
      <div>
        <p
          className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-1"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Manage
        </p>
        <h1
          className="text-3xl font-light text-[#1a1a1a]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Appointments
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]"
          />
          <input
            type="text"
            placeholder="Search patients or services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-[#e8e8e8] pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#4A7E96] transition-colors bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`px-4 py-2.5 text-xs tracking-[0.15em] uppercase border transition-all duration-200 ${
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
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e8e8e8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f8f6] border-b border-[#e8e8e8]">
              <tr>
                {[
                  "Ref",
                  "Patient",
                  "Service",
                  "Date",
                  "Time",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs tracking-[0.15em] uppercase text-[#888] font-medium whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8]">
              {paginated.map((apt) => (
                <>
                  <tr
                    key={apt.id}
                    className="hover:bg-[#fafafa] transition-colors cursor-pointer"
                    onClick={() =>
                      setExpandedAppointment(
                        expandedAppointment === apt.id ? null : apt.id,
                      )
                    }
                  >
                    <td className="px-5 py-4 text-sm font-medium text-[#1a1a1a]">
                      #{apt.appointment_number || apt.id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-[#1a1a1a]">
                        {apt.patient_name}
                      </p>
                      <p className="text-xs text-[#888]">{apt.patient_email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#666] max-w-[200px]">
                      <span className="line-clamp-1">{apt.service}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#666] whitespace-nowrap">
                      {apt.date
                        ? new Date(apt.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#666]">
                      {apt.time}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(apt.status)}`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={apt.status}
                        onChange={(e) => updateStatus(apt.id, e.target.value)}
                        className="text-xs border border-[#e8e8e8] px-2 py-1.5 focus:outline-none focus:border-[#4A7E96] bg-white"
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>

                  {/* Expanded Appointment Details */}
                  {expandedAppointment === apt.id && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-4 bg-[#f8f8f6] border-t border-[#e8e8e8]"
                      >
                        <p className="text-xs tracking-[0.15em] uppercase text-[#888] mb-3 font-medium">
                          Appointment Details
                        </p>
                        <div className="py-2 border-b border-[#e8e8e8] last:border-0">
                          <div>
                            <p className="text-sm text-[#1a1a1a] font-medium">
                              {apt.service}
                            </p>
                          </div>

                          <div className="text-xs text-[#888] pt-2">
                            <span>{apt.notes || "No additional notes."}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            label="appointments"
          />
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#888] text-sm">
              No appointments found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminAppointments;
