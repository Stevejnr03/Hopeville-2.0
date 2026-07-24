import { useState, useEffect, useCallback } from "react";
import { TrendingUp, ShoppingBag, Calendar, Users, ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { orderService } from "../../services/orderService";
import { appointmentService } from "../../services/appointmentService";
import { userService } from "../../services/userService";
import { productService } from "../../services/productService";
import { useAuth } from "../../context/AuthContext";

const revenueChartData = [
  { month: "Jan", revenue: 320000, orders: 6 },
  { month: "Feb", revenue: 450000, orders: 9 },
  { month: "Mar", revenue: 380000, orders: 7 },
  { month: "Apr", revenue: 520000, orders: 11 },
  { month: "May", revenue: 610000, orders: 13 },
  { month: "Jun", revenue: 875000, orders: 16 },
];

function StatCard({ label, value, icon, color, link, sub }) {
  return (
    <Link to={link}
      className="bg-white border border-[#e8e8e8] p-6 hover:border-[#4A7E96] hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-light text-[#1a1a1a] mb-1"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {value}
      </p>
      <p className="text-sm text-[#888]">{label}</p>
      {sub && <p className="text-xs text-[#aaa] mt-1">{sub}</p>}
    </Link>
  );
}

function statusColor(status) {
  if (status === "Delivered" || status === "Completed") return "text-emerald-600 bg-emerald-50";
  if (status === "Pending" || status === "Upcoming") return "text-[#C9A84C] bg-[#C9A84C]/10";
  if (status === "Cancelled") return "text-[#B5685A] bg-[#B5685A]/10";
  return "text-[#888] bg-[#f0f0f0]";
}

function AdminHome() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [o, a, c, p] = await Promise.all([
        orderService.getAll(),
        appointmentService.getAll(),
        userService.getAllUsers(),
        productService.getAll(),
      ]);
      setOrders(o);
      setAppointments(a);
      setCustomers(c);
      setProducts(p);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchAll(false), 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // ✅ Real revenue — only paid orders
  const paidRevenue = orders
    .filter(o => o.paid === true)
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  // ✅ Total revenue including unpaid pending orders
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const recentOrders = [...orders].slice(0, 5);
  const upcomingApts = appointments
    .filter(a => a.status === "Upcoming")
    .slice(0, 3);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <svg className="animate-spin w-8 h-8 text-[#4A7E96]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Admin Panel
          </p>
          <h1 className="text-3xl font-light text-[#1a1a1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Welcome, {user?.first_name}
          </h1>
          <p className="text-[#888] text-sm mt-1">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long", year: "numeric", month: "long", day: "numeric"
            })}
          </p>
        </div>

        {/* Manual refresh */}
        <button
          onClick={() => fetchAll(true)}
          disabled={refreshing}
          className="flex items-center gap-2 border border-[#e8e8e8] px-4 py-2.5 text-xs tracking-[0.15em] uppercase text-[#888] hover:border-[#4A7E96] hover:text-[#4A7E96] transition-all disabled:opacity-50">
          <RefreshCw size={13} strokeWidth={1.5}
            className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Revenue (Paid)"
          value={`₦${(paidRevenue).toLocaleString()}`}
          // sub={`₦${(totalRevenue / 1000000).toFixed(2)}M total incl. pending`}
          icon={<TrendingUp size={18} strokeWidth={1.5} className="text-[#4A7E96]" />}
          color="bg-[#4A7E96]/10"
          link="/admin/orders"
        />
        <StatCard
          label="Total Orders"
          value={orders.length}
          // sub={`${pendingOrders} pending`}
          icon={<ShoppingBag size={18} strokeWidth={1.5} className="text-[#B5685A]" />}
          color="bg-[#B5685A]/10"
          link="/admin/orders"
        />
        <StatCard
          label="Appointments"
          value={appointments.length}
          // sub={`${upcomingApts.length} upcoming`}
          icon={<Calendar size={18} strokeWidth={1.5} className="text-[#4A7E96]" />}
          color="bg-[#4A7E96]/10"
          link="/admin/appointments"
        />
        <StatCard
          label="Customers"
          value={customers.length}
          // sub={`${products.length} products`}
          icon={<Users size={18} strokeWidth={1.5} className="text-[#B5685A]" />}
          color="bg-[#B5685A]/10"
          link="/admin/customers"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e8e8e8] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Revenue Overview
            </h2>
            <span className="text-xs text-[#888]">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A7E96" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#4A7E96" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false}
                tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={v => [`₦${v.toLocaleString()}`, "Revenue"]}
                contentStyle={{ border: "1px solid #e8e8e8", borderRadius: 0, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#4A7E96" strokeWidth={2}
                fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#e8e8e8] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Orders Per Month
            </h2>
            <span className="text-xs text-[#888]">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={v => [v, "Orders"]}
                contentStyle={{ border: "1px solid #e8e8e8", borderRadius: 0, fontSize: 12 }}
              />
              <Bar dataKey="orders" fill="#B5685A" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders + Upcoming Appointments */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e8e8e8]">
          <div className="flex items-center justify-between p-6 border-b border-[#e8e8e8]">
            <h2 className="text-lg font-medium text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Recent Orders
            </h2>
            <Link to="/admin/orders"
              className="text-xs text-[#4A7E96] hover:text-[#B5685A] transition-colors flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[#e8e8e8]">
            {recentOrders.length === 0 ? (
              <p className="text-center text-[#888] text-sm py-8">No orders yet.</p>
            ) : recentOrders.map(order => (
              <div key={order.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#1a1a1a]">{order.customer_name}</p>
                    {/* ✅ Show paid badge */}
                    {order.paid && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded">
                        Paid
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#888] mt-0.5">
                    #{order.order_number} · {new Date(order.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-light text-[#1a1a1a]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    ₦{Number(order.total).toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e8e8e8]">
          <div className="flex items-center justify-between p-6 border-b border-[#e8e8e8]">
            <h2 className="text-lg font-medium text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Upcoming Appointments
            </h2>
            <Link to="/admin/appointments"
              className="text-xs text-[#4A7E96] hover:text-[#B5685A] transition-colors flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[#e8e8e8]">
            {upcomingApts.length === 0 ? (
              <p className="text-center text-[#888] text-sm py-8">No upcoming appointments.</p>
            ) : upcomingApts.map(apt => (
              <div key={apt.id} className="px-6 py-4 hover:bg-[#fafafa] transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">{apt.patient_name}</p>
                    <p className="text-xs text-[#888] mt-0.5 line-clamp-1">{apt.service}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-xs text-[#1a1a1a] font-medium">
                      {apt.date ? new Date(apt.date).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric"
                      }) : "—"}
                    </p>
                    <p className="text-xs text-[#888]">{apt.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;