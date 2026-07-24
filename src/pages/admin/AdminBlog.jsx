import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, X, Upload, Eye } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { blogService } from "../../services/blogService";
import Pagination from "../../components/Pagination";

const categories = [
  "Eye Health",
  "Eyewear",
  "Health",
  "Pediatric",
  "Digital Health",
  "Nutrition",
];

const emptyPost = {
  title: "",
  category: "Eye Health",
  excerpt: "",
  content: "",
  readTime: "4 min read",
  featured: false,
};

function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeStatus, setActiveStatus] = useState("All");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPost);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const imageRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus]);

  async function fetchPosts() {
    try {
      const data = await blogService.getAll();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = posts.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  function openAdd() {
    setEditing(null);
    setForm(emptyPost);
    setImagePreview(null);
    setShowPreview(false);
    setShowModal(true);
  }

  function openEdit(post) {
    setEditing(post.id);
    setForm({
      title: post.title || "",
      category: post.category || "Eye Health",
      excerpt: post.excerpt || "",
      content: post.content || "",
      readTime: post.read_time || "4 min read",
      featured: post.featured || false,
    });
    setImagePreview(post.image_url || null);
    setShowPreview(false);
    setShowModal(true);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content);
      formData.append("read_time", form.readTime);
      formData.append("featured", form.featured);
      if (imageRef.current?.files[0]) {
        formData.append("image", imageRef.current.files[0]);
      }

      if (editing) {
        const updated = await blogService.update(editing, formData);
        setPosts((prev) => prev.map((p) => (p.id === editing ? updated : p)));
      } else {
        const created = await blogService.create(formData);
        setPosts((prev) => [created, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await blogService.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.message || "Failed to delete post");
    }
  }

  const inputClass =
    "w-full border border-[#e8e8e8] px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7E96] transition-colors bg-white";
  const labelClass =
    "text-xs tracking-[0.1em] uppercase text-[#888] mb-1.5 block";

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

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
            Blog Posts
          </h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#4A7E96] transition-all duration-300"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          <Plus size={14} strokeWidth={2} />
          New Post
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search posts..."
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
                  "Post",
                  "Category",
                  "Author",
                  "Date",
                  "Featured",
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
              {paginated.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-[#fafafa] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#f8f8f6] flex items-center justify-center shrink-0 overflow-hidden">
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg opacity-20">📰</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-[#1a1a1a] max-w-[200px] line-clamp-2">
                        {post.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs border border-[#B5685A] text-[#B5685A] px-2 py-0.5">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#666]">
                    {post.author}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#666] whitespace-nowrap">
                    {new Date(post.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    {post.featured && (
                      <span className="text-xs text-[#4A7E96] bg-[#4A7E96]/10 px-2 py-0.5">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(post)}
                        className="w-8 h-8 flex items-center justify-center border border-[#e8e8e8] text-[#888] hover:border-[#4A7E96] hover:text-[#4A7E96] transition-all"
                      >
                        <Pencil size={13} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="w-8 h-8 flex items-center justify-center border border-[#e8e8e8] text-[#888] hover:border-[#B5685A] hover:text-[#B5685A] transition-all"
                      >
                        <Trash2 size={13} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            label="orders"
          />
          {filtered.length === 0 && !loading && (
            <div className="text-center py-12 text-[#888] text-sm">
              No posts found.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
              <h2
                className="text-xl font-light text-[#1a1a1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {editing ? "Edit Post" : "New Blog Post"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1.5 text-xs text-[#4A7E96] border border-[#4A7E96] px-3 py-1.5 hover:bg-[#4A7E96] hover:text-white transition-all"
                >
                  <Eye size={12} /> {showPreview ? "Edit" : "Preview"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center border border-[#e8e8e8] hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {showPreview ? (
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Cover"
                    className="w-full h-48 object-cover mb-6"
                  />
                )}
                <span className="text-xs border border-[#B5685A] text-[#B5685A] px-2 py-0.5 mb-4 inline-block">
                  {form.category}
                </span>
                <h1
                  className="text-3xl font-light text-[#1a1a1a] mb-3 mt-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {form.title || "Untitled Post"}
                </h1>
                <p className="text-[#888] text-sm mb-6 italic">
                  {form.excerpt}
                </p>
                <div
                  className="prose prose-sm max-w-none text-[#555]"
                  dangerouslySetInnerHTML={{ __html: form.content }}
                />
              </div>
            ) : (
              <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelClass}>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Post title..."
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
                      {categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Read Time</label>
                    <input
                      type="text"
                      name="readTime"
                      value={form.readTime}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="4 min read"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Excerpt *</label>
                    <textarea
                      name="excerpt"
                      value={form.excerpt}
                      onChange={handleChange}
                      required
                      rows={2}
                      className={`${inputClass} resize-none`}
                      placeholder="Short summary shown on blog listing..."
                    />
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className={labelClass}>Cover Image</label>
                  <div
                    onClick={() => imageRef.current.click()}
                    className="border-2 border-dashed border-[#e8e8e8] h-36 flex items-center justify-center cursor-pointer hover:border-[#4A7E96] transition-colors overflow-hidden"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-[#aaa]">
                        <Upload size={24} strokeWidth={1.5} />
                        <span className="text-xs">
                          Click to upload cover image
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Rich Text Editor */}
                <div>
                  <label className={`${labelClass} mb-2`}>Content *</label>
                  <ReactQuill
                    value={form.content}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, content: value }))
                    }
                    modules={quillModules}
                    className="bg-white"
                    style={{ height: "250px", marginBottom: "42px" }}
                  />
                </div>

                {/* Featured Toggle */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                    <div
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          featured: !prev.featured,
                        }))
                      }
                      className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
                        form.featured ? "bg-[#4A7E96]" : "bg-[#e8e8e8]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                          form.featured ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                    <span className="text-sm text-[#555]">
                      Mark as Featured Post
                    </span>
                  </label>
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
                    {editing ? "Save Changes" : "Publish Post"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="border border-[#e8e8e8] text-[#888] px-8 py-3 text-xs tracking-[0.2em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
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
              Delete Post?
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

export default AdminBlog;
