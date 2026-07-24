import { api } from "./api.js";

export const productService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/products${query ? `?${query}` : ""}`);
  },
  getBySlug: (slug) => api.get(`/products/${slug}`),
  create: (formData) => api.postForm("/products", formData),
  update: (id, formData) => api.putForm(`/products/${id}`, formData),
  delete: (id) => api.delete(`/products/${id}`),
  toggleStock: (id) => api.patch(`/products/${id}/toggle-stock`),
};