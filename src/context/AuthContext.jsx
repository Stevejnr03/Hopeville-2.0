import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // start true
  const [error, setError] = useState("");

  // Restore session and fetch full profile on page load
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }
        // ✅ Fetch full profile so we have first_name, last_name, phone, avatar
        const res = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const profile = await res.json();
          setUser({ ...profile, token });
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(email, password) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return null;
      }
      localStorage.setItem("token", data.token);
      // ✅ Use full user object from login response
      setUser({ ...data.user, token: data.token });
      setLoading(false);
      return data.user;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
      return null;
    }
  }

  async function loginWithToken(token) {
    try {
      localStorage.setItem("token", token);
      // ✅ Fetch full profile after OAuth
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const profile = await res.json();
        setUser({ ...profile, token });
      }
    } catch {
      setError("Invalid token");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      login, loginWithToken, logout,
      isAdmin, isLoggedIn,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}