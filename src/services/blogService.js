import { api } from "./api.js";

export const blogService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/blog${query ? `?${query}` : ""}`);
  },
  getBySlug: (slug) => api.get(`/blog/${slug}`),
  create: (formData) => api.postForm("/blog", formData),
  update: (id, formData) => api.putForm(`/blog/${id}`, formData),
  delete: (id) => api.delete(`/blog/${id}`),
};