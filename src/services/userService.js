import { api } from "./api.js";

export const userService = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (formData) => api.putForm("/users/profile", formData),
  updatePassword: (data) => api.put("/users/password", data),
  getAllUsers: () => api.get("/users"),
   deleteUser: (id) => api.delete(`/users/${id}`),
};