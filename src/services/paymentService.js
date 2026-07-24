import { api } from "./api.js";

export const paymentService = {
  initialize: (data) => api.post("/payments/initialize", data),
  verify: (reference) => api.get(`/payments/verify/${reference}`),
};