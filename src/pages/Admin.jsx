import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, Calendar, Package,
  Users, FileText, Settings, LogOut, Menu, ChevronRight
} from "lucide-react";
import logo from "../assets/hope-logo.png";
import { useAuth } from "../context/AuthContext";

import AdminHome from "./admin/AdminHome";
import AdminOrders from "./admin/AdminOrders";
import AdminAppointments from "./admin/AdminAppointments";
import AdminProducts from "./admin/AdminProducts";
import AdminCustomers from "./admin/AdminCustomers";
import AdminBlog from "./admin/AdminBlog";
import AdminSettings from "./admin/AdminSettings";

const navItems = [
  { label: "Overview", path: "/admin", icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
  { label: "Orders", path: "/admin/orders", icon: <ShoppingBag size={18} strokeWidth={1.5} /> },
  { label: "Appointments", path: "/admin/appointments", icon: <Calendar size={18} strokeWidth={1.5} /> },
  { label: "Products", path: "/admin/products", icon: <Package size={18} strokeWidth={1.5} /> },
  { label: "Customers", path: "/admin/customers", icon: <Users size={18} strokeWidth={1.5} /> },
  { label: "Blog", path: "/admin/blog", icon: <FileText size={18} strokeWidth={1.5} /> },
  { label: "Settings", path: "/admin/settings", icon: <Settings size={18} strokeWidth={1.5} /> },
];

function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

   if (loading) return (
    <main className="min-h-screen bg-[#0d1f2d] flex items-center justify-center">
      <svg className="animate-spin w-8 h-8 text-[#4A7E96]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </main>
  );

  if (!user) return <Navigate to="/login" replace />;

   if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-[#f8f8f6] flex">

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed top-0 left-0 h-screen z-50 bg-[#0d1f2d] w-64 flex flex-col
        transition-transform duration-300 overflow-y-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10 shrink-0">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <img src={logo} alt="Hopeville Eye Clinic" className="h-12 w-auto brightness-0 invert" />
          </Link>
          <div className="mt-3">
            <span className="text-xs tracking-[0.2em] uppercase text-[#B5685A] font-medium"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Admin Panel
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.path === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 rounded-sm group ${
                  isActive
                    ? "bg-[#4A7E96] text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <span className={isActive ? "text-white" : "text-white/40 group-hover:text-white/70"}>
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-2 shrink-0">
          <Link to="/"
            className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white text-sm transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <ChevronRight size={16} strokeWidth={1.5} className="rotate-180" />
            View Site
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-[#B5685A] text-sm transition-colors w-full"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <LogOut size={16} strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-[#e8e8e8] px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <button className="lg:hidden text-[#1a1a1a]" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-[#888]">
            <span>Hopeville Eye Clinic</span>
            <ChevronRight size={14} strokeWidth={1.5} />
            <span className="text-[#1a1a1a] font-medium">Admin</span>
          </div>

          {/* Admin info */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-[#1a1a1a] leading-none">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-[#B5685A] mt-0.5 tracking-wide">Administrator</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#B5685A] flex items-center justify-center shrink-0 overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.first_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-medium">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </span>
              )}
            </div>
            <Link to="/shop"
              className="text-xs tracking-[0.15em] uppercase text-[#4A7E96] hover:text-[#B5685A] transition-colors font-medium hidden md:block ml-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              View Store
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Admin;