import { api } from "./api.js";

export const orderService = {
  create: (data) => api.post("/orders", data),
  getMyOrders: () => api.get("/orders/my"),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/orders${query ? `?${query}` : ""}`);
  },
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};