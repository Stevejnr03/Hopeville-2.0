import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import BookAppointment from "./pages/BookAppointment";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import PaymentVerify from "./pages/PaymentVerify";

// USER DASHBOARD
import Dashboard from "./pages/Dashboard";

// ADMIN DASHBOARD
import AdminRoute from "./components/admin/AdminRoute";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* All other pages — with Navbar and Footer */}
        <Route path="/*" element={<MainLayout />} />

        {/* Dashboard — no Navbar or Footer */}
        <Route path="/dashboard/*" element={<Dashboard />} />

        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function MainLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:slug" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/checkout/verify" element={<PaymentVerify />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
