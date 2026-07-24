import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useShop();
  const [status, setStatus] = useState("verifying");
  const [orderRef, setOrderRef] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // Paystack returns ?reference=xxx OR ?trxref=xxx
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    console.log("=== PAYMENT VERIFY ===");
    console.log("Full URL:", window.location.href);
    console.log("Reference:", reference);
    console.log("All params:", Object.fromEntries(searchParams.entries()));

    if (!reference) {
      console.error("No reference found in URL");
      setStatus("failed");
      setDebugInfo("No payment reference found in URL");
      return;
    }

    setOrderRef(reference);

    async function verify() {
      try {
        const url = `${API}/payments/verify/${reference}`;
        console.log("Verifying at:", url);

        const res = await fetch(url);
        const text = await res.text();

        console.log("Verify response status:", res.status);
        console.log("Verify response body:", text);

        if (!text) {
          setStatus("failed");
          setDebugInfo("Empty response from server");
          return;
        }

        const data = JSON.parse(text);
        console.log("Parsed verify data:", data);

        const paymentStatus = data.data?.status;
        console.log("Payment status from Paystack:", paymentStatus);

        if (paymentStatus === "success") {
          clearCart();
          setStatus("success");
        } else if (paymentStatus === "pending") {
          setStatus("pending");
        } else {
          setStatus("failed");
          setDebugInfo(`Paystack status: ${paymentStatus || "unknown"}`);
        }
      } catch (err) {
        console.error("Verify error:", err);
        setStatus("failed");
        setDebugInfo(err.message);
      }
    }

    verify();
  }, []);

  if (status === "verifying") return (
    <main className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin w-10 h-10 text-[#4A7E96]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-[#888] text-sm font-light tracking-wide">Verifying your payment...</p>
        <p className="text-[#aaa] text-xs">Please do not close this page</p>
      </div>
    </main>
  );

  if (status === "success") return (
    <main className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-4">
      <div className="bg-white border border-[#e8e8e8] p-12 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-[#4A7E96]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#4A7E96" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Payment Successful
        </p>
        <h1 className="text-3xl font-light text-[#1a1a1a] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Order Confirmed!
        </h1>
        <p className="text-[#888] text-sm font-light mb-6 leading-relaxed">
          Your payment was successful and your order has been confirmed.
          A confirmation email has been sent to you.
        </p>
        {orderRef && (
          <div className="bg-[#f8f8f6] border border-[#e8e8e8] px-4 py-3 mb-8">
            <p className="text-xs text-[#888] tracking-wide uppercase mb-1">Payment Reference</p>
            <p className="text-sm font-medium text-[#1a1a1a] font-mono">{orderRef}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard/orders"
            className="bg-[#1a1a1a] text-white px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#4A7E96] transition-all duration-300"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            View My Orders
          </Link>
          <Link to="/shop"
            className="border border-[#e8e8e8] text-[#888] px-8 py-3 text-xs tracking-[0.2em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Continue Shopping
          </Link>
        </div>
        <p className="text-xs text-[#aaa] mt-6">
          Need help?{" "}
          <Link to="/contact" className="text-[#4A7E96] hover:text-[#B5685A]">Contact us</Link>
        </p>
      </div>
    </main>
  );

  if (status === "pending") return (
    <main className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-4">
      <div className="bg-white border border-[#e8e8e8] p-12 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-[#C9A84C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#C9A84C" strokeWidth="2"/>
            <path d="M12 6v6l4 2" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Payment Pending
        </p>
        <h1 className="text-3xl font-light text-[#1a1a1a] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Payment Processing
        </h1>
        <p className="text-[#888] text-sm font-light mb-8 leading-relaxed">
          Your payment is being processed. We will notify you by email once confirmed.
        </p>
        {orderRef && (
          <div className="bg-[#f8f8f6] border border-[#e8e8e8] px-4 py-3 mb-8">
            <p className="text-xs text-[#888] tracking-wide uppercase mb-1">Payment Reference</p>
            <p className="text-sm font-medium text-[#1a1a1a] font-mono">{orderRef}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard/orders"
            className="bg-[#1a1a1a] text-white px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#4A7E96] transition-all"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Track My Orders
          </Link>
          <Link to="/"
            className="border border-[#e8e8e8] text-[#888] px-8 py-3 text-xs tracking-[0.2em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );

  // Failed
  return (
    <main className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-4">
      <div className="bg-white border border-[#e8e8e8] p-12 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-[#B5685A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M6 18L18 6M6 6l12 12" stroke="#B5685A" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Payment Failed
        </p>
        <h1 className="text-3xl font-light text-[#1a1a1a] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Payment Unsuccessful
        </h1>
        <p className="text-[#888] text-sm font-light mb-6 leading-relaxed">
          Your payment could not be processed. Your cart has been saved — you can try again.
        </p>
        {orderRef && (
          <div className="bg-[#f8f8f6] border border-[#e8e8e8] px-4 py-3 mb-6">
            <p className="text-xs text-[#888] tracking-wide uppercase mb-1">Reference</p>
            <p className="text-sm font-medium text-[#1a1a1a] font-mono">{orderRef}</p>
          </div>
        )}
        {debugInfo && (
          <p className="text-xs text-[#B5685A] bg-[#B5685A]/5 border border-[#B5685A]/20 px-4 py-2 mb-6">
            {debugInfo}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/checkout"
            className="bg-[#1a1a1a] text-white px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#4A7E96] transition-all"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Try Again
          </Link>
          <Link to="/cart"
            className="border border-[#e8e8e8] text-[#888] px-8 py-3 text-xs tracking-[0.2em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Back to Cart
          </Link>
        </div>
        <p className="text-xs text-[#aaa] mt-6">
          Need help?{" "}
          <Link to="/contact" className="text-[#4A7E96] hover:text-[#B5685A]">Contact us</Link>
          {" "}or call +234 813 330 0378
        </p>
      </div>
    </main>
  );
}

export default PaymentVerify;