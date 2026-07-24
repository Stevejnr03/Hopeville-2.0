import { useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate 
} from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Calendar,
  Heart,
  User,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";
import logo from "../assets/hope-logo.png";

import DashboardHome from "./dashboard/DashboardHome";
import DashboardOrders from "./dashboard/DashboardOrders";
import DashboardAppointments from "./dashboard/DashboardAppointments";
import DashboardWishlist from "./dashboard/DashboardWishlist";
import DashboardCart from "./dashboard/DashboardCart";
import DashboardProfile from "./dashboard/DashboardProfile";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";

const navItems = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
  },
  {
    label: "My Orders",
    path: "/dashboard/orders",
    icon: <FileText size={18} strokeWidth={1.5} />,
  },
  {
    label: "Appointments",
    path: "/dashboard/appointments",
    icon: <Calendar size={18} strokeWidth={1.5} />,
  },
  {
    label: "Wishlist",
    path: "/dashboard/wishlist",
    icon: <Heart size={18} strokeWidth={1.5} />,
  },
  {
    label: "My Cart",
    path: "/dashboard/cart",
    icon: <ShoppingCart size={18} strokeWidth={1.5} />,
  },
  {
    label: "My Profile",
    path: "/dashboard/profile",
    icon: <User size={18} strokeWidth={1.5} />,
  },
];

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { wishlist, cartCount } = useShop();

  // ✅ Destructure logout from useAuth
  const { user, logout, loading } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // ✅ Safe name helpers — handles both DB snake_case and any legacy camelCase
  const firstName = user?.first_name || user?.firstName || "";
  const lastName = user?.last_name || user?.lastName || "";
  const avatarUrl = user?.avatar_url || user?.avatar || null;
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`;

  if (loading) return (
    <main className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
      <svg className="animate-spin w-8 h-8 text-[#4A7E96]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </main>
  );

   if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#f8f8f6] flex lg:items-start">

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
            <img
              src={logo}
              alt="Hopeville Eye Clinic"
              className="h-12 w-auto brightness-0 invert"
            />
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.path === "/dashboard"
                ? location.pathname === "/dashboard"
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
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <span className={isActive ? "text-white" : "text-white/40 group-hover:text-white/70"}>
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.label}</span>

                {/* Wishlist badge */}
                {item.label === "Wishlist" && wishlist.length > 0 && (
                  <span className="ml-auto bg-[#B5685A] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}

                {/* Cart badge */}
                {item.label === "My Cart" && cartCount > 0 && (
                  <span className="ml-auto bg-[#B5685A] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-1 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white text-sm transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <ChevronRight size={16} strokeWidth={1.5} className="rotate-180" />
            Back Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-[#B5685A] text-sm transition-colors w-full"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <LogOut size={16} strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-[#e8e8e8] px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            className="lg:hidden text-[#1a1a1a]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* User info */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#4A7E96] flex items-center justify-center shrink-0 overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={firstName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-xs font-medium">
                  {initials || "?"}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-[#1a1a1a] leading-none">
                {firstName} {lastName}
              </p>
              <p className="text-xs text-[#888] mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4 ml-auto">
            <Link
              to="/shop"
              className="text-xs tracking-[0.15em] uppercase text-[#4A7E96] hover:text-[#B5685A] transition-colors font-medium hidden sm:block"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Shop Eyewear
            </Link>
            <Link
              to="/book"
              className="bg-[#4A7E96] text-white px-5 py-2 text-xs tracking-[0.15em] uppercase hover:bg-[#B5685A] transition-all duration-300 font-medium"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Book Appointment
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/orders" element={<DashboardOrders />} />
            <Route path="/appointments" element={<DashboardAppointments />} />
            <Route path="/wishlist" element={<DashboardWishlist />} />
            <Route path="/cart" element={<DashboardCart />} />
            <Route path="/profile" element={<DashboardProfile />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-[#e8e8e8] px-6 py-4">
          <div className="flex justify-center">
            <p
              className="text-[#666] text-xs tracking-wide text-center"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              © {new Date().getFullYear()} Hopeville Eye Clinic Ltd. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;