import { api } from "./api.js";

export const appointmentService = {
  create: (data) => api.post("/appointments", data),
  getMyAppointments: () => api.get("/appointments/my"),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/appointments${query ? `?${query}` : ""}`);
  },
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  cancel: (id) => api.patch(`/appointments/${id}/cancel`, {}), 
};