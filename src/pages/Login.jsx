import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import logo from "../assets/hope-logo.png";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const { login, loading, error, user } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false); // ✅ own state
  const [forgotError, setForgotError] = useState("");

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    }
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleLogin(e) {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result) {
      if (result.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    }
  }

  async function handleForgot(e) {
    e.preventDefault();
    setForgotLoading(true); // ✅ use local state
    setForgotError("");
    try {
      await authService.resetPassword(forgotEmail);
      setForgotSent(true);
    } catch (err) {
      setForgotError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setForgotLoading(false); // ✅ use local state
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f8f6] flex flex-col items-center justify-center px-4 py-16">
      <Link to="/" className="mb-10">
        <img src={logo} alt="Hopeville Eye Clinic" className="h-16 w-auto" />
      </Link>

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

            {/* Google Login */}
            <div className="flex flex-col gap-3 mb-6">
               <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost:5000/api/auth/google")
                }
                className="w-full flex items-center justify-center gap-3 border border-[#e8e8e8] py-3 text-sm text-[#444] hover:border-[#1a1a1a] transition-all duration-200 font-medium"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-[1px] bg-[#e8e8e8]" />
              <span className="text-xs text-[#aaa] tracking-widest uppercase">or</span>
              <div className="flex-1 h-[1px] bg-[#e8e8e8]" />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 mb-5 tracking-wide">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} strokeWidth={1.5}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                  <input type="email" name="email" value={formData.email}
                    onChange={handleChange} required placeholder="you@email.com"
                    className="w-full border border-[#e8e8e8] pl-10 pr-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs tracking-[0.15em] uppercase text-[#888]">
                    Password
                  </label>
                  <button type="button" onClick={() => setView("forgot")}
                    className="text-xs text-[#4A7E96] hover:text-[#B5685A] transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} strokeWidth={1.5}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                  <input type={showPassword ? "text" : "password"} name="password"
                    value={formData.password} onChange={handleChange}
                    required placeholder="••••••••"
                    className="w-full border border-[#e8e8e8] pl-10 pr-10 py-3 text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#1a1a1a]">
                    {showPassword
                      ? <EyeOff size={15} strokeWidth={1.5} />
                      : <Eye size={15} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-[#1a1a1a] text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300 mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
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

            <div className="mt-6 pt-6 border-t border-[#e8e8e8] text-center">
              <p className="text-xs text-[#888]">
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
        {view === "forgot" && !forgotSent && (
          <div className="p-8 md:p-10">
            <button onClick={() => { setView("login"); setForgotError(""); }}
              className="flex items-center gap-2 text-xs text-[#888] hover:text-[#1a1a1a] transition-colors mb-8">
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
              <p className="text-[#888] text-sm font-light">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            {forgotError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 mb-5 tracking-wide">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleForgot} className="flex flex-col gap-4">
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} strokeWidth={1.5}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
                  <input type="email" value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required placeholder="you@email.com"
                    className="w-full border border-[#e8e8e8] pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#4A7E96] transition-colors" />
                </div>
              </div>

              <button type="submit" disabled={forgotLoading}
                className="w-full bg-[#1a1a1a] text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {forgotLoading ? (
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

        {/* ── EMAIL SENT VIEW ── */}
        {view === "forgot" && forgotSent && (
          <div className="p-8 md:p-10 text-center">
            <div className="w-16 h-16 bg-[#4A7E96]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={28} strokeWidth={1.2} className="text-[#4A7E96]" />
            </div>
            <h2 className="text-3xl font-light text-[#1a1a1a] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Email Sent!
            </h2>
            <p className="text-[#888] text-sm font-light mb-2">
              We've sent a reset link to <strong>{forgotEmail}</strong>.
            </p>
            <p className="text-[#aaa] text-xs mb-8">
              Check your spam folder if you don't see it within a few minutes.
            </p>
            <button
              onClick={() => { setView("login"); setForgotSent(false); setForgotEmail(""); }}
              className="w-full bg-[#1a1a1a] text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Back to Sign In
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 mt-8">
        {["Privacy Policy", "Terms of Service", "Contact Us"].map(item => (
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