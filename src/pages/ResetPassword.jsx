import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import logo from "../assets/hope-logo.png";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // No token in URL
  if (!token) {
    return (
      <main className="min-h-screen bg-[#f8f8f6] flex flex-col items-center justify-center px-4">
        <Link to="/" className="mb-10">
          <img src={logo} alt="Hopeville Eye Clinic" className="h-16 w-auto" />
        </Link>
        <div className="bg-white border border-[#e8e8e8] w-full max-w-md p-10 text-center">
          <h2 className="text-2xl font-light text-[#1a1a1a] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Invalid Reset Link
          </h2>
          <p className="text-[#888] text-sm mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link to="/login"
            className="bg-[#1a1a1a] text-white px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#4A7E96] transition-all inline-block"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Back to Login
          </Link>
        </div>
      </main>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#f8f8f6] flex flex-col items-center justify-center px-4">
        <Link to="/" className="mb-10">
          <img src={logo} alt="Hopeville Eye Clinic" className="h-16 w-auto" />
        </Link>
        <div className="bg-white border border-[#e8e8e8] w-full max-w-md p-10 text-center">
          <div className="w-16 h-16 bg-[#4A7E96]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#4A7E96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-light text-[#1a1a1a] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Password Reset!
          </h2>
          <p className="text-[#888] text-sm mb-2">
            Your password has been successfully updated.
          </p>
          <p className="text-[#aaa] text-xs mb-6">
            Redirecting you to login...
          </p>
          <Link to="/login"
            className="bg-[#1a1a1a] text-white px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#4A7E96] transition-all inline-block"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Sign In Now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f6] flex flex-col items-center justify-center px-4 py-16">
      <Link to="/" className="mb-10">
        <img src={logo} alt="Hopeville Eye Clinic" className="h-16 w-auto" />
      </Link>

      <div className="bg-white border border-[#e8e8e8] w-full max-w-md p-8 md:p-10">
        <div className="text-center mb-8">
          <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Reset Password
          </p>
          <h1 className="text-3xl font-light text-[#1a1a1a] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Create New Password
          </h1>
          <p className="text-[#888] text-sm font-light">
            Enter your new password below.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
              New Password *
            </label>
            <div className="relative">
              <Lock size={15} strokeWidth={1.5}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Min. 8 characters"
                className="w-full border border-[#e8e8e8] pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-[#4A7E96] transition-colors" />
              <button type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#1a1a1a]">
                {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
              </button>
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                    password.length >= i * 2
                      ? password.length >= 8
                        ? "bg-emerald-400"
                        : "bg-[#C9A84C]"
                      : "bg-[#e8e8e8]"
                  }`} />
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock size={15} strokeWidth={1.5}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Repeat new password"
                className={`w-full border pl-10 pr-4 py-3 text-sm focus:outline-none transition-colors ${
                  confirm && confirm !== password
                    ? "border-red-300 focus:border-red-400"
                    : "border-[#e8e8e8] focus:border-[#4A7E96]"
                }`} />
            </div>
            {confirm && confirm !== password && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
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
                Resetting...
              </>
            ) : "Reset Password"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default ResetPassword;