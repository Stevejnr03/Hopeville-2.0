import { api } from "./api.js";

export const wishlistService = {
  get: () => api.get("/wishlist"),
  add: (product_id) => api.post("/wishlist", { product_id }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};