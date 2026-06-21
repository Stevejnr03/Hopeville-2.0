import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import logo from "../assets/hope-logo.png";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("login"); // login | forgot

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  }

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    // Simulate login — replace with real API call later
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1500);
  }

  function handleForgot(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView("forgot-sent");
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-[#f8f8f6] flex flex-col items-center justify-center px-4 py-16">

      {/* Logo */}
      <Link to="/" className="mb-10">
        <img src={logo} alt="Hopeville Eye Clinic" className="h-16 w-auto" />
      </Link>

      {/* Card */}
      <div className="bg-white border border-[#e8e8e8] w-full max-w-md">

        {/* ── LOGIN VIEW ── */}
        {view === "login" && (
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Welcome Back
              </p>
              <h1 className="text-3xl font-light text-[#1a1a1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Sign In
              </h1>
            </div>

            {/* Social Login */}
            <div className="flex flex-col gap-3 mb-6">
              <button className="w-full flex items-center justify-center gap-3 border border-[#e8e8e8] py-3 text-sm text-[#444] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-200 font-medium">
                {/* Google SVG */}
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <button className="w-full flex items-center justify-center gap-3 border border-[#e8e8e8] py-3 text-sm text-[#444] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-200 font-medium">
                {/* Apple SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-[1px] bg-[#e8e8e8]" />
              <span className="text-xs text-[#aaa] tracking-widest uppercase">or</span>
              <div className="flex-1 h-[1px] bg-[#e8e8e8]" />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 mb-5 tracking-wide">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">

              {/* Email */}
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} strokeWidth={1.5}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} required
                    placeholder="you@email.com"
                    className="w-full border border-[#e8e8e8] pl-10 pr-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs tracking-[0.15em] uppercase text-[#888]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-xs text-[#4A7E96] hover:text-[#B5685A] transition-colors duration-200">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} strokeWidth={1.5}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password" value={formData.password}
                    onChange={handleChange} required
                    placeholder="••••••••"
                    className="w-full border border-[#e8e8e8] pl-10 pr-10 py-3 text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#1a1a1a] transition-colors">
                    {showPassword
                      ? <EyeOff size={15} strokeWidth={1.5} />
                      : <Eye size={15} strokeWidth={1.5} />
                    }
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a1a] text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing In...
                  </>
                ) : "Sign In"}
              </button>
            </form>

            {/* Register note */}
            <div className="mt-6 pt-6 border-t border-[#e8e8e8] text-center">
              <p className="text-xs text-[#888] leading-relaxed">
                Don't have an account?{" "}
                <span className="text-[#555]">
                  Accounts are created automatically during checkout.
                </span>
              </p>
              <Link to="/shop"
                className="inline-block mt-3 text-xs tracking-[0.15em] uppercase text-[#4A7E96] hover:text-[#B5685A] transition-colors font-medium"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Shop Now →
              </Link>
            </div>
          </div>
        )}

        {/* ── FORGOT PASSWORD VIEW ── */}
        {view === "forgot" && (
          <div className="p-8 md:p-10">
            <button
              onClick={() => setView("login")}
              className="flex items-center gap-2 text-xs text-[#888] tracking-wide hover:text-[#1a1a1a] transition-colors mb-8">
              ← Back to Sign In
            </button>

            <div className="text-center mb-8">
              <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Reset Password
              </p>
              <h1 className="text-3xl font-light text-[#1a1a1a] mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Forgot Password?
              </h1>
              <p className="text-[#888] text-sm font-light leading-relaxed">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleForgot} className="flex flex-col gap-4">
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} strokeWidth={1.5}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} required
                    placeholder="you@email.com"
                    className="w-full border border-[#e8e8e8] pl-10 pr-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a1a] text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Sending...
                  </>
                ) : "Send Reset Link"}
              </button>
            </form>
          </div>
        )}

        {/* ── FORGOT SENT VIEW ── */}
        {view === "forgot-sent" && (
          <div className="p-8 md:p-10 text-center">
            <div className="w-16 h-16 bg-[#4A7E96]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={28} strokeWidth={1.2} className="text-[#4A7E96]" />
            </div>
            <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Check Your Inbox
            </p>
            <h2 className="text-3xl font-light text-[#1a1a1a] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Email Sent!
            </h2>
            <p className="text-[#888] text-sm font-light leading-relaxed mb-8 max-w-xs mx-auto">
              We've sent a password reset link to{" "}
              <span className="text-[#1a1a1a] font-medium">{formData.email}</span>.
              Please check your inbox and follow the instructions.
            </p>
            <button
              onClick={() => setView("login")}
              className="w-full bg-[#1a1a1a] text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Back to Sign In
            </button>
            <button
              onClick={() => setView("forgot")}
              className="mt-3 text-xs text-[#888] hover:text-[#1a1a1a] transition-colors tracking-wide">
              Didn't receive it? Try again
            </button>
          </div>
        )}
      </div>

      {/* Bottom links */}
      <div className="flex items-center gap-6 mt-8">
        {["Privacy Policy", "Terms of Service", "Contact Us"].map((item) => (
          <Link key={item} to="/contact"
            className="text-xs text-[#aaa] hover:text-[#4A7E96] transition-colors tracking-wide">
            {item}
          </Link>
        ))}
      </div>

    </main>
  );
}

export default Login;