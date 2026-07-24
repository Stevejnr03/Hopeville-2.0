import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    const role = params.get("role");
    const error = params.get("error");

    if (error) {
      navigate("/login?error=google_failed");
      return;
    }

    if (token) {
      loginWithToken(token);
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin w-8 h-8 text-[#4A7E96]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-[#888] text-sm font-light tracking-wide">Signing you in...</p>
      </div>
    </main>
  );
}

export default AuthCallback;