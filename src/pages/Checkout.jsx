import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  MapPin,
  Package,
  User,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react";
import { useShop } from "../context/ShopContext";

import { orderService } from "../services/orderService";
import { paymentService } from "../services/paymentService";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const { user } = useAuth();

  const navigate = useNavigate();
  const { cart, cartSubtotal, deliveryFee, cartTotal, clearCart } = useShop();
  const [fulfillment, setFulfillment] = useState("delivery"); // delivery | pickup
  const [createAccount, setCreateAccount] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginWithToken } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    notes: "",
    password: "",
  });

  //Populate when user loads from token
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.first_name || user.firstName || "",
        lastName: user.last_name || user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // Create account if requested
      if (createAccount && formData.password) {
        const authData = await authService.register({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        });
        loginWithToken(authData.token);
      }

      const finalTotal = fulfillment === "pickup" ? cartSubtotal : cartTotal;
      const finalDeliveryFee = fulfillment === "pickup" ? 0 : deliveryFee;

      // Initialize Paystack
      const paymentData = await paymentService.initialize({
        email: formData.email,
        amount: finalTotal,
        metadata: {
          customer_name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
        },
      });

      if (!paymentData.status) throw new Error("Payment initialization failed");

      // Save order to DB
      await orderService.create({
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        fulfillment,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        notes: formData.notes,
        subtotal: cartSubtotal,
        delivery_fee: finalDeliveryFee,
        total: finalTotal,
        paystack_reference: paymentData.data.reference,
        items: cart.map((item) => ({
          product_id: item.id,
          name: item.name,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.selectedColor,
          selectedLens: item.selectedLens,
        })),
      });

      // Redirect to Paystack
      window.location.href = paymentData.data.authorization_url;
    } catch (err) {
      alert(err.message || "Something went wrong.");
      setLoading(false);
    }
  }

  if (cart.length === 0 && !submitted) {
    return (
      <main className="bg-white min-h-screen pt-40 pb-20 text-center px-4">
        <h1
          className="text-3xl font-light text-[#1a1a1a] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Your cart is empty
        </h1>
        <Link to="/shop" className="text-[#4A7E96] text-sm underline">
          Continue Shopping
        </Link>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="bg-[#f8f8f6] min-h-screen pt-20 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-[#4A7E96]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle
              size={40}
              strokeWidth={1.2}
              className="text-[#4A7E96]"
            />
          </div>
          <p
            className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Order Confirmed
          </p>
          <h1
            className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Thank You, {formData.firstName || ""}!
          </h1>
          <p className="text-[#666] text-base font-light leading-relaxed mb-3">
            Your order has been placed successfully. We'll send a confirmation
            to <strong>{formData.email}</strong>.
          </p>
          {fulfillment === "pickup" ? (
            <p className="text-[#555] text-sm font-light mb-8 bg-white border border-[#e8e8e8] p-4">
              📍 Your order will be ready for pickup at
              <br />
              <strong>#64 Alcon Road, Woji, Port Harcourt</strong>
            </p>
          ) : (
            <p className="text-[#555] text-sm font-light mb-8 bg-white border border-[#e8e8e8] p-4">
              🚚 Your order will be delivered to
              <br />
              <strong>
                {formData.address}, {formData.city}
              </strong>
            </p>
          )}
          <div className="flex flex-col gap-3">
            <Link
              to="/shop"
              className="bg-[#1a1a1a] text-white px-10 py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300 inline-block"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="text-xs text-[#888] hover:text-[#1a1a1a] transition-colors tracking-wide"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const inputClass =
    "w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200 bg-white";
  const labelClass =
    "text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block";

  return (
    <main className="bg-[#f8f8f6] min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-10">
          <p
            className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Almost There
          </p>
          <h1
            className="text-3xl md:text-4xl font-light text-[#1a1a1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* LEFT — Form */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Fulfillment Toggle */}
              <div className="bg-white border border-[#e8e8e8] p-6">
                <h2
                  className="text-lg font-medium text-[#1a1a1a] mb-5"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  How would you like to receive your order?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFulfillment("delivery")}
                    className={`flex items-center gap-3 p-4 border-2 transition-all duration-200 ${
                      fulfillment === "delivery"
                        ? "border-[#1a1a1a] bg-[#f8f8f6]"
                        : "border-[#e8e8e8] hover:border-[#d0d0d0]"
                    }`}
                  >
                    <MapPin
                      size={18}
                      strokeWidth={1.5}
                      className={
                        fulfillment === "delivery"
                          ? "text-[#4A7E96]"
                          : "text-[#aaa]"
                      }
                    />
                    <div className="text-left">
                      <p
                        className={`text-sm font-medium ${fulfillment === "delivery" ? "text-[#1a1a1a]" : "text-[#888]"}`}
                      >
                        Delivery
                      </p>
                      <p className="text-xs text-[#aaa]">To your address</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfillment("pickup")}
                    className={`flex items-center gap-3 p-4 border-2 transition-all duration-200 ${
                      fulfillment === "pickup"
                        ? "border-[#1a1a1a] bg-[#f8f8f6]"
                        : "border-[#e8e8e8] hover:border-[#d0d0d0]"
                    }`}
                  >
                    <Package
                      size={18}
                      strokeWidth={1.5}
                      className={
                        fulfillment === "pickup"
                          ? "text-[#4A7E96]"
                          : "text-[#aaa]"
                      }
                    />
                    <div className="text-left">
                      <p
                        className={`text-sm font-medium ${fulfillment === "pickup" ? "text-[#1a1a1a]" : "text-[#888]"}`}
                      >
                        Pickup
                      </p>
                      <p className="text-xs text-[#aaa]">From our clinic</p>
                    </div>
                  </button>
                </div>

                {/* Pickup info */}
                {fulfillment === "pickup" && (
                  <div className="mt-4 bg-[#4A7E96]/5 border border-[#4A7E96]/20 p-4 flex items-start gap-3">
                    <MapPin
                      size={16}
                      strokeWidth={1.5}
                      className="text-[#4A7E96] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a]">
                        Hopeville Eye Clinic
                      </p>
                      <p className="text-xs text-[#666] mt-1">
                        #64 Alcon Road, Woji, Port-Harcourt
                      </p>
                      <p className="text-xs text-[#888] mt-1">
                        Mon–Fri: 8AM–5:30PM · Sat: 10AM–3PM
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="bg-white border border-[#e8e8e8] p-6 md:p-8">
                <h2
                  className="text-lg font-medium text-[#1a1a1a] mb-6 pb-4 border-b border-[#e8e8e8]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                       readOnly={!!user}
                      required
                      placeholder="Adaeze"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                       readOnly={!!user}
                      required
                      placeholder="Okonkwo"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                       readOnly={!!user}
                      required
                      placeholder="adaeze@email.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                       readOnly={!!user}
                      required
                      placeholder="+234 800 000 0000"
                      className={inputClass}
                    />
                  </div>
                </div>

                {user && (
                    <div className="flex items-center gap-2 mt-5">
                      <div className="w-2 h-2 rounded-full bg-[#4A7E96]" />
                      <p className="text-xs text-[#4A7E96] tracking-wide">
                        Details from your account ·{" "}
                        <Link
                          to="/dashboard/profile"
                          className="underline hover:text-[#B5685A]"
                        >
                          Edit profile
                        </Link>
                      </p>
                    </div>
                  )}

                {/* Create Account */}
                {!user && (
                <div className="mt-5 pt-5 border-t border-[#e8e8e8]">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div
                      onClick={() => setCreateAccount(!createAccount)}
                      className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
                        createAccount
                          ? "bg-[#1a1a1a] border-[#1a1a1a]"
                          : "border-[#d0d0d0] group-hover:border-[#1a1a1a]"
                      }`}
                    >
                      {createAccount && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a]">
                        Create an account for faster checkout
                      </p>
                      <p className="text-xs text-[#888] mt-1">
                        Track your orders and manage your wishlist
                      </p>
                    </div>
                  </label>

                  {createAccount && (
                    <div className="mt-4">
                      <label className={labelClass}>Create Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={createAccount}
                        placeholder="Min. 8 characters"
                        className={inputClass}
                      />
                    </div>
                  )}
                </div>
                )}
              </div>

              {/* Delivery Address — only if delivery */}
              {fulfillment === "delivery" && (
                <div className="bg-white border border-[#e8e8e8] p-6 md:p-8">
                  <h2
                    className="text-lg font-medium text-[#1a1a1a] mb-6 pb-4 border-b border-[#e8e8e8]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Delivery Address
                  </h2>
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className={labelClass}>Street Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required={fulfillment === "delivery"}
                        placeholder="12 Example Street, Estate Name"
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required={fulfillment === "delivery"}
                          placeholder="Port Harcourt"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>State *</label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required={fulfillment === "delivery"}
                          className={inputClass}
                        >
                          <option value="">Select State</option>
                          {[
                            "Abia",
                            "Adamawa",
                            "Akwa Ibom",
                            "Anambra",
                            "Bauchi",
                            "Bayelsa",
                            "Benue",
                            "Borno",
                            "Cross River",
                            "Delta",
                            "Ebonyi",
                            "Edo",
                            "Ekiti",
                            "Enugu",
                            "FCT",
                            "Gombe",
                            "Imo",
                            "Jigawa",
                            "Kaduna",
                            "Kano",
                            "Katsina",
                            "Kebbi",
                            "Kogi",
                            "Kwara",
                            "Lagos",
                            "Nasarawa",
                            "Niger",
                            "Ogun",
                            "Ondo",
                            "Osun",
                            "Oyo",
                            "Plateau",
                            "Rivers",
                            "Sokoto",
                            "Taraba",
                            "Yobe",
                            "Zamfara",
                          ].map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>
                        Delivery Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Any special instructions for delivery..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment */}
              <div className="bg-white border border-[#e8e8e8] p-6 md:p-8">
                <h2
                  className="text-lg font-medium text-[#1a1a1a] mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Payment
                </h2>
                <div className="bg-[#f8f8f6] border border-[#e8e8e8] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0BA4DB] rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a]">
                        Pay with Paystack
                      </p>
                      <p className="text-xs text-[#888]">
                        Cards, Bank Transfer, USSD & more
                      </p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-[#1a1a1a] border-2 border-[#1a1a1a] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
                <p className="text-xs text-[#aaa] mt-3 leading-relaxed">
                  You will be redirected to Paystack's secure payment page to
                  complete your purchase. Paystack integration will be connected
                  in the next phase.
                </p>
              </div>
            </div>

            {/* RIGHT — Order Summary */}
            <div className="flex flex-col gap-4 lg:sticky lg:top-36">
              <div className="bg-white border border-[#e8e8e8] p-6 md:p-8">
                <h2
                  className="text-lg font-medium text-[#1a1a1a] mb-6 pb-4 border-b border-[#e8e8e8]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Order Summary
                </h2>

                {/* Items */}
                <div className="flex flex-col gap-4 mb-6">
                  {cart.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-16 h-16 bg-[#f8f8f6] shrink-0 overflow-hidden">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">
                            👓
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium text-[#1a1a1a] truncate"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {item.name}
                        </p>
                        <p className="text-xs text-[#888] mt-0.5">
                          {item.selectedColor} · {item.selectedLens}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-[#666]">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-light text-[#1a1a1a]">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-[1px] bg-[#e8e8e8] mb-4" />

                {/* Totals */}
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#666]">Subtotal</span>
                    <span className="text-sm text-[#1a1a1a]">
                      ₦{cartSubtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#666]">
                      {fulfillment === "pickup" ? "Pickup" : "Delivery Fee"}
                    </span>
                    <span className="text-sm text-[#1a1a1a]">
                      {fulfillment === "pickup"
                        ? "Free"
                        : `₦${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="h-[1px] bg-[#e8e8e8]" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-[#1a1a1a]">
                      Total
                    </span>
                    <span
                      className="text-xl font-light text-[#1a1a1a]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      ₦
                      {(fulfillment === "pickup"
                        ? cartSubtotal
                        : cartTotal
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1a1a1a] text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
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
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>

                <p className="text-xs text-[#aaa] text-center mt-3">
                  By placing your order you agree to our{" "}
                  <Link to="#" className="underline hover:text-[#4A7E96]">
                    Terms of Service
                  </Link>
                </p>
              </div>

              {/* Back to cart */}
              <Link
                to="/cart"
                className="text-center text-xs text-[#888] hover:text-[#1a1a1a] transition-colors tracking-wide"
              >
                ← Back to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Checkout;
