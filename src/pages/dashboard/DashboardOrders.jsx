import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { orderService } from "../../services/orderService";

import Pagination from "../../components/Pagination";

const statuses = ["All", "Pending", "Delivered", "Cancelled"];

function statusColor(status) {
  if (status === "Delivered") return "text-[#4A7E96] bg-[#4A7E96]/10";
  if (status === "Pending") return "text-[#C9A84C] bg-[#C9A84C]/10";
  if (status === "Cancelled") return "text-[#B5685A] bg-[#B5685A]/10";
  return "text-[#888] bg-[#f0f0f0]";
}

function DashboardOrders() {
  const [activeStatus, setActiveStatus] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    orderService.getMyOrders().then(setOrders).catch(console.error);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus]);

  const filtered =
    activeStatus === "All"
      ? orders
      : orders.filter((o) => o.status === activeStatus);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p
          className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-1"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Order History
        </p>
        <h1
          className="text-3xl font-light text-[#1a1a1a]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          My Orders
        </h1>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-all duration-200 ${
              activeStatus === status
                ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                : "border-[#e8e8e8] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
            }`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#e8e8e8] p-12 text-center">
          <ShoppingBag
            size={40}
            strokeWidth={0.8}
            className="text-[#d0d0d0] mx-auto mb-4"
          />
          <p className="text-[#888] text-base">
            No {activeStatus.toLowerCase()} orders found.
          </p>
          <Link
            to="/shop"
            className="mt-4 inline-block text-xs tracking-[0.15em] uppercase text-[#4A7E96] hover:text-[#B5685A] transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Shop Now →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {paginated.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#e8e8e8] overflow-hidden"
            >
              {/* Order Header */}
              <button
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#fafafa] transition-colors"
              >
                <div className="flex items-center gap-6 flex-wrap">
                  <div>
                    <p className="text-xs text-[#888] mb-1">Order ID</p>
                    <p className="text-sm font-medium text-[#1a1a1a]">
                      #{order.order_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#888] mb-1">Date</p>
                    <p className="text-sm text-[#555]">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#888] mb-1">Total</p>
                    <p
                      className="text-sm font-light text-[#1a1a1a]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      ₦{order.total.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#888] mb-1">Fulfillment</p>
                    <p className="text-sm text-[#555] capitalize">
                      {order.fulfillment}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <span className="text-[#888] shrink-0">
                  {expandedOrder === order.id ? (
                    <ChevronUp size={16} strokeWidth={1.5} />
                  ) : (
                    <ChevronDown size={16} strokeWidth={1.5} />
                  )}
                </span>
              </button>

              {/* Order Items */}
              {expandedOrder === order.id && (
                <div className="border-t border-[#e8e8e8] p-6">
                  <div className="flex flex-col gap-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#f8f8f6] flex items-center justify-center shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl opacity-20">👓</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className="text-sm font-medium text-[#1a1a1a]"
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                            }}
                          >
                            {item.name}
                          </p>
                          <p className="text-xs text-[#888] italic">
                            {item.variant}
                          </p>
                          <p className="text-xs text-[#666] mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p
                          className="text-sm font-light text-[#1a1a1a]"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#e8e8e8] mt-5 pt-4 flex items-center justify-between">
                    <div className="text-sm text-[#666]">
                      📍 {order.address}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#888]">Order Total</p>
                      <p
                        className="text-lg font-light text-[#1a1a1a]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        ₦{order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {order.status === "Delivered" && (
                    <div className="mt-4 flex gap-3">
                      <Link
                        to="/shop"
                        className="text-xs tracking-[0.15em] uppercase text-[#4A7E96] hover:text-[#B5685A] transition-colors border border-[#4A7E96] px-4 py-2 hover:border-[#B5685A]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        Reorder
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        label="orders"
      />
    </div>
  );
}

export default DashboardOrders;
