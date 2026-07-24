import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Calendar, Heart, ArrowRight, Clock } from "lucide-react";
import { useShop } from "../../context/ShopContext";
import { orderService } from "../../services/orderService";
import { appointmentService } from "../../services/appointmentService";
import { useAuth } from "../../context/AuthContext";

function DashboardHome() {

  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [o, a] = await Promise.all([
          orderService.getMyOrders(),
          appointmentService.getMyAppointments(),
        ]);
        setOrders(o);
        setAppointments(a);
      } catch (err) { console.error(err); }
    }
    fetchData();
  }, []);

  const { wishlist } = useShop();
  const recentOrder = orders[0];
  const nextAppointment = appointments.find(a => a.status === "Upcoming");

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: <ShoppingBag size={20} strokeWidth={1.5} />,
      link: "/dashboard/orders",
      color: "bg-[#4A7E96]/10 text-[#4A7E96]",
    },
    {
      label: "Appointments",
      value: appointments.length,
      icon: <Calendar size={20} strokeWidth={1.5} />,
      link: "/dashboard/appointments",
      color: "bg-[#B5685A]/10 text-[#B5685A]",
    },
    {
      label: "Wishlist Items",
      value: wishlist.length,
      icon: <Heart size={20} strokeWidth={1.5} />,
      link: "/dashboard/wishlist",
      color: "bg-[#4A7E96]/10 text-[#4A7E96]",
    },
  ];

  function statusColor(status) {
    if (status === "Delivered" || status === "Completed" || status === "Upcoming") return "text-[#4A7E96] bg-[#4A7E96]/10";
    if (status === "Pending") return "text-[#C9A84C] bg-[#C9A84C]/10";
    if (status === "Cancelled") return "text-[#B5685A] bg-[#B5685A]/10";
    return "text-[#888] bg-[#f0f0f0]";
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Welcome */}
      <div>
        <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-1"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Welcome Back
        </p>
        <h1 className="text-3xl md:text-4xl font-light text-[#1a1a1a]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-[#888] text-sm mt-1">Member since {user?.joinedDate}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link}
            className="bg-white border border-[#e8e8e8] p-6 hover:border-[#4A7E96] hover:shadow-md transition-all duration-300 group">
            <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-3xl font-light text-[#1a1a1a] mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {stat.value}
            </p>
            <p className="text-sm text-[#888]">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Recent Order */}
        <div className="bg-white border border-[#e8e8e8] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Recent Order
            </h2>
            <Link to="/dashboard/orders"
              className="text-xs text-[#4A7E96] hover:text-[#B5685A] transition-colors flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {recentOrder ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#1a1a1a]">#{recentOrder.id}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(recentOrder.status)}`}>
                  {recentOrder.status}
                </span>
              </div>
              <p className="text-xs text-[#888] mb-3">{recentOrder.date}</p>
              <div className="flex flex-col gap-2 mb-4">
                {recentOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-[#555]">{item.name}</span>
                    <span className="text-sm text-[#888]">×{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#e8e8e8] pt-3 flex items-center justify-between">
                <span className="text-sm text-[#888]">Total</span>
                <span className="text-base font-light text-[#1a1a1a]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  ₦{recentOrder.total.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-[#888] text-sm">No orders yet.</p>
          )}
        </div>

        {/* Next Appointment */}
        <div className="bg-white border border-[#e8e8e8] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Next Appointment
            </h2>
            <Link to="/dashboard/appointments"
              className="text-xs text-[#4A7E96] hover:text-[#B5685A] transition-colors flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {nextAppointment ? (
            <div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium mb-4 inline-block ${statusColor(nextAppointment.status)}`}>
                {nextAppointment.status}
              </span>
              <h3 className="text-base font-medium text-[#1a1a1a] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {nextAppointment.service}
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-[#666]">
                  <Calendar size={14} strokeWidth={1.5} className="text-[#4A7E96]" />
                  {nextAppointment.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#666]">
                  <Clock size={14} strokeWidth={1.5} className="text-[#4A7E96]" />
                  {nextAppointment.time}
                </div>
              </div>
              {nextAppointment.notes && (
                <p className="text-xs text-[#888] mt-4 bg-[#f8f8f6] p-3 border border-[#e8e8e8]">
                  📝 {nextAppointment.notes}
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-[#888] text-sm mb-4">No upcoming appointments.</p>
              <Link to="/book"
                className="text-xs tracking-[0.15em] uppercase text-[#4A7E96] hover:text-[#B5685A] transition-colors font-medium"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Book Now →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions
      <div className="bg-[#0d1f2d] p-6 md:p-8">
        <h2 className="text-lg font-medium text-white mb-5"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Book Appointment", link: "/book", icon: <Calendar size={16} strokeWidth={1.5} /> },
            { label: "Shop Eyewear", link: "/shop", icon: <ShoppingBag size={16} strokeWidth={1.5} /> },
            { label: "View Wishlist", link: "/dashboard/wishlist", icon: <Heart size={16} strokeWidth={1.5} /> },
            { label: "Edit Profile", link: "/dashboard/profile", icon: <ArrowRight size={16} strokeWidth={1.5} /> },
          ].map((action) => (
            <Link key={action.label} to={action.link}
              className="flex items-center gap-2 border border-white/20 text-white/70 hover:border-[#4A7E96] hover:text-white px-4 py-3 text-xs tracking-[0.1em] uppercase transition-all duration-200"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="text-[#4A7E96]">{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default DashboardHome;