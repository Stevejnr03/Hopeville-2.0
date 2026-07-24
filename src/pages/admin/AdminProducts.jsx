import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, X, Upload, Eye, EyeOff } from "lucide-react";
import { productService } from "../../services/productService";
import Pagination from "../../components/Pagination";

const emptyProduct = {
  name: "",
  variant: "",
  price: "",
  category: "Eyeglasses",
  shape: "Rectangle",
  isNew: false,
  inStock: true,
  description: "",
  material: "",
  origin: "",
  lensWidth: "",
  bridgeWidth: "",
  templeLength: "",
};

const ITEMS_PER_PAGE = 5;

function AdminProducts() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagePreviews, setImagePreviews] = useState({
    image: null,
    image2: null,
    image3: null,
    hoverImage: null,
    tryonImage: null,
  });

  // ✅ All refs at the top
  const imageRef = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);
  const hoverImageRef = useRef(null);
  const tryonRef = useRef(null);


  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const data = await productService.getAll();
      setProductList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = productList.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ✅ Single openAdd function
  function openAdd() {
    setEditing(null);
    setForm(emptyProduct);
    setImagePreviews({
      image: null,
      image2: null,
      image3: null,
      hoverImage: null,
    });
    setShowModal(true);
  }

  function openEdit(product) {
    setEditing(product.id);
    setForm({
      name: product.name || "",
      variant: product.variant || "",
      price: product.price || "",
      category: product.category || "Eyeglasses",
      shape: product.shape || "Rectangle",
      isNew: product.is_new || false,
      inStock: product.in_stock ?? true,
      description: product.description || "",
      material: product.material || "",
      origin: product.origin || "",
      lensWidth: product.lens_width || "",
      bridgeWidth: product.bridge_width || "",
      templeLength: product.temple_length || "",
    });
    setImagePreviews({
      image: product.images?.[0] || null,
      image2: product.images?.[1] || null,
      image3: product.images?.[2] || null,
      hoverImage: product.hoverImage || null,
      tryonImage: product.tryonImage || null,
    });
    setShowModal(true);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageFile(e, key) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setImagePreviews((prev) => ({ ...prev, [key]: reader.result }));
    reader.readAsDataURL(file);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("variant", form.variant);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("shape", form.shape);
      formData.append("is_new", form.isNew);
      formData.append("in_stock", form.inStock);
      formData.append("description", form.description);
      formData.append("material", form.material);
      formData.append("origin", form.origin);
      formData.append("lens_width", form.lensWidth);
      formData.append("bridge_width", form.bridgeWidth);
      formData.append("temple_length", form.templeLength);

      if (imageRef.current?.files[0])
        formData.append("image", imageRef.current.files[0]);
      if (image2Ref.current?.files[0])
        formData.append("image2", image2Ref.current.files[0]);
      if (image3Ref.current?.files[0])
        formData.append("image3", image3Ref.current.files[0]);
      if (hoverImageRef.current?.files[0])
        formData.append("hoverImage", hoverImageRef.current.files[0]);
      if (tryonRef.current?.files[0]) {
        formData.append("tryonImage", tryonRef.current.files[0]);
      }

      if (editing) {
        const updated = await productService.update(editing, formData);
        setProductList((prev) =>
          prev.map((p) => (p.id === editing ? updated : p)),
        );
      } else {
        const created = await productService.create(formData);
        setProductList((prev) => [created, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await productService.delete(id);
      setProductList((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
  }

  async function toggleStock(id) {
    try {
      const result = await productService.toggleStock(id);
      setProductList((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, in_stock: result.in_stock } : p,
        ),
      );
    } catch (err) {
      alert(err.message || "Failed to update stock");
    }
  }

  const inputClass =
    "w-full border border-[#e8e8e8] px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7E96] transition-colors bg-white";
  const labelClass =
    "text-xs tracking-[0.1em] uppercase text-[#888] mb-1.5 block";

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <svg
          className="animate-spin w-8 h-8 text-[#4A7E96]"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p
            className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Manage
          </p>
          <h1
            className="text-3xl font-light text-[#1a1a1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Products
          </h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#4A7E96] transition-all duration-300"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          <Plus size={14} strokeWidth={2} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-[#e8e8e8] pl-4 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#4A7E96] bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e8e8e8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f8f6] border-b border-[#e8e8e8]">
              <tr>
                {[
                  "Product",
                  "Category",
                  "Price",
                  "Status",
                  "Stock",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs tracking-[0.15em] uppercase text-[#888] font-medium whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8]">
              {paginated.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-[#fafafa] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#f8f8f6] flex items-center justify-center shrink-0 overflow-hidden">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl opacity-20">👓</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1a1a1a]">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#888] italic">
                          {product.variant}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#666]">
                    {product.category}
                  </td>
                  <td
                    className="px-5 py-4 text-sm font-light text-[#1a1a1a]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    ₦{Number(product.price).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    {product.is_new && (
                      <span className="text-xs border border-[#4A7E96] text-[#4A7E96] px-2 py-0.5">
                        New
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleStock(product.id)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1 border transition-all duration-200 ${
                        product.in_stock
                          ? "border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                          : "border-[#e8e8e8] text-[#888] hover:border-[#1a1a1a]"
                      }`}
                    >
                      {product.in_stock ? (
                        <Eye size={11} />
                      ) : (
                        <EyeOff size={11} />
                      )}
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="w-8 h-8 flex items-center justify-center border border-[#e8e8e8] text-[#888] hover:border-[#4A7E96] hover:text-[#4A7E96] transition-all duration-200"
                      >
                        <Pencil size={13} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="w-8 h-8 flex items-center justify-center border border-[#e8e8e8] text-[#888] hover:border-[#B5685A] hover:text-[#B5685A] transition-all duration-200"
                      >
                        <Trash2 size={13} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div className="text-center py-12 text-[#888] text-sm">
              No products found.
            </div>
          )}
        </div>

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#e8e8e8]">
            <p className="text-xs text-[#888]">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} products
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center border border-[#e8e8e8] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center border text-xs transition-all ${
                      currentPage === page
                        ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                        : "border-[#e8e8e8] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center border border-[#e8e8e8] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
              <h2
                className="text-xl font-light text-[#1a1a1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {editing ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center border border-[#e8e8e8] hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Classic Aviator"
                  />
                </div>
                <div>
                  <label className={labelClass}>Variant / Color *</label>
                  <input
                    type="text"
                    name="variant"
                    value={form.variant}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Gold Frame"
                  />
                </div>
                <div>
                  <label className={labelClass}>Price (₦) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="85000"
                  />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Eyeglasses</option>
                    <option>Sunglasses</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Shape</label>
                  <select
                    name="shape"
                    value={form.shape}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Rectangle</option>
                    <option>Round</option>
                    <option>Aviator</option>
                    <option>Cat Eye</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Material</label>
                  <input
                    type="text"
                    name="material"
                    value={form.material}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Premium Acetate"
                  />
                </div>
                <div>
                  <label className={labelClass}>Origin</label>
                  <input
                    type="text"
                    name="origin"
                    value={form.origin}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Italian Craftsmanship"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Product description..."
                />
              </div>

              <div>
                <label className={`${labelClass} mb-3`}>
                  Frame Measurements
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Main Image *", key: "image", ref: imageRef },
                    { label: "Image 2", key: "image2", ref: image2Ref },
                    { label: "Image 3", key: "image3", ref: image3Ref },
                    {
                      label: "Hover / Model Image",
                      key: "hoverImage",
                      ref: hoverImageRef,
                    },
                    {
                      label: "Try-On PNG (transparent bg)",
                      key: "tryonImage",
                      ref: tryonRef,
                    }, // ✅
                  ].map(({ label, key, ref }) => (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      <div
                        onClick={() => ref.current.click()}
                        className="border-2 border-dashed border-[#e8e8e8] h-28 flex items-center justify-center cursor-pointer hover:border-[#4A7E96] transition-colors overflow-hidden"
                      >
                        {imagePreviews[key] ? (
                          <img
                            src={imagePreviews[key]}
                            alt={label}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-[#aaa]">
                            <Upload size={18} strokeWidth={1.5} />
                            <span className="text-xs">Click to upload</span>
                          </div>
                        )}
                      </div>
                      <input
                        ref={ref}
                        type="file"
                        accept={key === "tryonImage" ? "image/png" : "image/*"} // ✅ PNG only for tryon
                        onChange={(e) => handleImageFile(e, key)}
                        className="hidden"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Images — 4 slots */}
              <div>
                <label className={`${labelClass} mb-3`}>Product Images</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Main Image *", key: "image", ref: imageRef },
                    { label: "Image 2", key: "image2", ref: image2Ref },
                    { label: "Image 3", key: "image3", ref: image3Ref },
                    {
                      label: "Hover / Model Image",
                      key: "hoverImage",
                      ref: hoverImageRef,
                    },
                  ].map(({ label, key, ref }) => (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      <div
                        onClick={() => ref.current.click()}
                        className="border-2 border-dashed border-[#e8e8e8] h-28 flex items-center justify-center cursor-pointer hover:border-[#4A7E96] transition-colors overflow-hidden"
                      >
                        {imagePreviews[key] ? (
                          <img
                            src={imagePreviews[key]}
                            alt={label}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-[#aaa]">
                            <Upload size={18} strokeWidth={1.5} />
                            <span className="text-xs">Click to upload</span>
                          </div>
                        )}
                      </div>
                      <input
                        ref={ref}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFile(e, key)}
                        className="hidden"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#888] mt-2">
                  Main image is required. Additional images show in the product
                  gallery.
                </p>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                {[
                  { label: "Mark as New", name: "isNew" },
                  { label: "In Stock", name: "inStock" },
                ].map((toggle) => (
                  <label
                    key={toggle.name}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          [toggle.name]: !prev[toggle.name],
                        }))
                      }
                      className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
                        form[toggle.name] ? "bg-[#4A7E96]" : "bg-[#e8e8e8]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                          form[toggle.name] ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                    <span className="text-sm text-[#555]">{toggle.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-[#e8e8e8]">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#1a1a1a] text-white px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300 disabled:opacity-60 flex items-center gap-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {saving && (
                    <svg
                      className="animate-spin w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                  )}
                  {editing ? "Save Changes" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border border-[#e8e8e8] text-[#888] px-8 py-3 text-xs tracking-[0.2em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-300"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-sm w-full text-center">
            <h3
              className="text-xl font-light text-[#1a1a1a] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Delete Product?
            </h3>
            <p className="text-[#888] text-sm mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-[#B5685A] text-white py-3 text-xs tracking-[0.15em] uppercase hover:bg-red-700 transition-all"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-[#e8e8e8] text-[#888] py-3 text-xs tracking-[0.15em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
