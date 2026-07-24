import { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";
import { userService } from "../../services/userService";
import Pagination from "../../components/Pagination";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [activeStatus, setActiveStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus]);

  async function fetchCustomers() {
    try {
      const data = await userService.getAllUsers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(true);
    try {
      await userService.deleteUser(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.message || "Failed to delete customer");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = customers.filter((c) => {
    const fullName = `${c.first_name || ""} ${c.last_name || ""}`.toLowerCase();
    const matchSearch =
      search === "" ||
      fullName.includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ||
      (filter === "Admin" && c.role === "admin") ||
      (filter === "User" && c.role === "user");
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const customerToDelete = customers.find((c) => c.id === deleteConfirm);

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
          Customers
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
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-[#e8e8e8] pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#4A7E96] bg-white"
          />
        </div>
        <div className="flex gap-2">
          {["All", "User", "Admin"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2.5 text-xs tracking-[0.15em] uppercase border transition-all duration-200 ${
                filter === s
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
                  "Customer",
                  "Phone",
                  "Role",
                  "Joined",
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
              {paginated.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-[#fafafa] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#4A7E96]/10 flex items-center justify-center shrink-0 overflow-hidden">
                        {customer.avatar_url ? (
                          <img
                            src={customer.avatar_url}
                            alt=""
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-xs font-medium text-[#4A7E96]">
                            {customer.first_name?.[0]}
                            {customer.last_name?.[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1a1a1a]">
                          {customer.first_name} {customer.last_name}
                        </p>
                        <p className="text-xs text-[#888]">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#666]">
                    {customer.phone || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        customer.role === "admin"
                          ? "text-[#B5685A] bg-[#B5685A]/10"
                          : "text-[#4A7E96] bg-[#4A7E96]/10"
                      }`}
                    >
                      {customer.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#666]">
                    {new Date(customer.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-3 py-1 rounded-full font-medium text-emerald-600 bg-emerald-50">
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setDeleteConfirm(customer.id)}
                      className="w-8 h-8 flex items-center justify-center border border-[#e8e8e8] text-[#888] hover:border-[#B5685A] hover:text-[#B5685A] transition-all duration-200"
                      title="Delete customer"
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            label="orders"
          />
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#888] text-sm">
              No customers found.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-sm w-full">
            <h3
              className="text-xl font-light text-[#1a1a1a] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Delete Customer?
            </h3>
            <div className="bg-[#f8f8f6] border border-[#e8e8e8] p-4 mb-4">
              <p className="text-sm font-medium text-[#1a1a1a]">
                {customerToDelete?.first_name} {customerToDelete?.last_name}
              </p>
              <p className="text-xs text-[#888]">{customerToDelete?.email}</p>
            </div>
            <p className="text-[#888] text-sm mb-2">
              This will permanently delete:
            </p>
            <ul className="text-sm text-[#666] mb-6 flex flex-col gap-1">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B5685A]" />
                Their account and profile
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B5685A]" />
                All their orders and order history
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B5685A]" />
                All their appointments
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B5685A]" />
                Their wishlist
              </li>
            </ul>
            <p className="text-xs text-[#B5685A] mb-6 font-medium">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 bg-[#B5685A] text-white py-3 text-xs tracking-[0.15em] uppercase hover:bg-red-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting ? (
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
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 border border-[#e8e8e8] text-[#888] py-3 text-xs tracking-[0.15em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;
