import { api } from "./api.js";

export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (data) => api.post("/auth/register", data),
  resetPassword: (email) => api.post("/auth/reset-password", { email }),
  getMe: () => api.get("/auth/me"),
};