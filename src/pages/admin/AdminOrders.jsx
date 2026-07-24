import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { orderService } from "../../services/orderService";
import Pagination from "../../components/Pagination";

const statuses = ["All", "Pending", "Delivered", "Cancelled"];

function statusColor(status) {
  if (status === "Delivered") return "text-emerald-600 bg-emerald-50";
  if (status === "Pending") return "text-[#C9A84C] bg-[#C9A84C]/10";
  if (status === "Cancelled") return "text-[#B5685A] bg-[#B5685A]/10";
  return "text-[#888] bg-[#f0f0f0]";
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchOrders();
  }, [activeStatus, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus, search]);

  async function fetchOrders() {
    try {
      const params = {};
      if (activeStatus !== "All") params.status = activeStatus;
      if (search) params.search = search;
      const data = await orderService.getAll(params);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = orders.filter((o) => {
    const matchStatus = activeStatus === "All" || o.status === activeStatus;
    const matchSearch =
      search === "" ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.order_number?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  async function updateStatus(id, newStatus) {
    try {
      await orderService.updateStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      console.error(err);
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
          Orders
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
            placeholder="Search orders or customers..."
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
                  "Order ID",
                  "Customer",
                  "Date",
                  "Items",
                  "Total",
                  "Fulfillment",
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
              {paginated.map((order) => (
                <>
                  <tr
                    key={order.id}
                    className="hover:bg-[#fafafa] transition-colors cursor-pointer"
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order.id ? null : order.id,
                      )
                    }
                  >
                    <td className="px-5 py-4 text-sm font-medium text-[#1a1a1a]">
                      #{order.order_number || order.id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-[#1a1a1a]">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-[#888]">
                        {order.customer_email}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#666] whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#666]">
                      {Array.isArray(order.items) ? order.items.length : 0}
                    </td>
                    <td
                      className="px-5 py-4 text-sm font-light text-[#1a1a1a] whitespace-nowrap"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      ₦{Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#666] capitalize">
                      {order.fulfillment}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td
                      className="px-5 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs border border-[#e8e8e8] px-2 py-1.5 focus:outline-none focus:border-[#4A7E96] bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>

                  {/* Expanded order items */}
                  {expandedOrder === order.id &&
                    Array.isArray(order.items) &&
                    order.items.length > 0 && (
                      <tr key={`${order.id}-items`}>
                        <td
                          colSpan={8}
                          className="px-5 py-4 bg-[#f8f8f6] border-t border-[#e8e8e8]"
                        >
                          <p className="text-xs tracking-[0.15em] uppercase text-[#888] mb-3 font-medium">
                            Order Items
                          </p>
                          <div className="flex flex-col gap-2">
                            {order.items.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between py-2 border-b border-[#e8e8e8] last:border-0"
                              >
                                <div>
                                  <p className="text-sm text-[#1a1a1a] font-medium">
                                    {item.product_name}
                                  </p>
                                  <p className="text-xs text-[#888]">
                                    {item.selected_color} · {item.selected_lens}{" "}
                                    · Qty: {item.quantity}
                                  </p>
                                </div>
                                <p
                                  className="text-sm font-light text-[#1a1a1a]"
                                  style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                  }}
                                >
                                  ₦{Number(item.price).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-[#e8e8e8] flex items-center justify-between">
                            <div className="text-xs text-[#888]">
                              {order.fulfillment === "delivery" &&
                                order.address && (
                                  <span>
                                    📍 {order.address}, {order.city},{" "}
                                    {order.state}
                                  </span>
                                )}
                              {order.fulfillment === "pickup" && (
                                <span>🏪 Store Pickup — Alcon Road, Woji</span>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-[#888]">
                                Delivery: ₦
                                {Number(order.delivery_fee).toLocaleString()}
                              </p>
                              <p className="text-sm font-medium text-[#1a1a1a]">
                                Total: ₦{Number(order.total).toLocaleString()}
                              </p>
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
            label="orders"
          />
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#888] text-sm">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
