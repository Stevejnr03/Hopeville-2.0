import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, User } from "lucide-react";
import pageBg from "../assets/page-bg.png";
import { blogService } from "../services/blogService";
import Pagination from "../components/Pagination";

const categories = [
  "All",
  "Eye Health",
  "Eyewear",
  "Health",
  "Pediatric",
  "Digital Health",
  "Nutrition",
];

function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await blogService.getAll();
        setBlogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBlogs(false);
      }
    }
    fetchBlogs();
  }, []);

  useEffect(() => {
  setCurrentPage(1);
}, [activeCategory]);

  const featured = blogs.find((b) => b.featured);
  const rest = blogs.filter((b) => !b.featured);

  const filtered =
    activeCategory === "All"
      ? rest
      : rest.filter((b) => b.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <main className="bg-white">
      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={pageBg}
            alt="Hopeville Eye Clinic"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/35" />
        </div>

        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-5" />

        <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full border border-[#4A7E96]/20 translate-x-1/3 -translate-y-1/4" />

        <div className="absolute right-24 top-12 w-[350px] h-[350px] rounded-full border border-[#B5685A]/10 translate-x-1/3" />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 pt-40 relative z-10 w-full">
          <h1
            className="text-4xl md:text-6xl font-light text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Our Blog
          </h1>
        </div>
      </section>

      {/* ── FEATURED POST ── */}
      {featured && (
        <section className="bg-white py-16 md:py-20 border-b border-[#e8e8e8]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <p
              className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Featured Post
            </p>
            <Link
              to={`/blog/${featured.slug}`}
              className="group grid md:grid-cols-2 gap-10 md:gap-16 items-center"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={featured.image_url}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#B5685A] text-white text-xs px-3 py-1 tracking-[0.1em] uppercase">
                    {featured.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center gap-2 text-[#888] text-xs">
                    <User size={12} strokeWidth={1.5} />
                    {featured.author}
                  </div>
                  <div className="flex items-center gap-2 text-[#888] text-xs">
                    <Clock size={12} strokeWidth={1.5} />
                    {featured.readTime}
                  </div>
                  <span className="text-[#ccc] text-xs">{featured.date}</span>
                </div>
                <h2
                  className="text-3xl md:text-4xl font-light text-[#1a1a1a] leading-tight mb-5 group-hover:text-[#4A7E96] transition-colors duration-300"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {featured.title}
                </h2>
                <p className="text-[#666] text-base leading-relaxed font-light mb-8">
                  {featured.excerpt}
                </p>
                <div
                  className="flex items-center gap-2 text-[#4A7E96] text-sm tracking-[0.1em] uppercase font-medium group-hover:text-[#B5685A] transition-colors duration-200"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Read Article
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── CATEGORY FILTER ── */}
      <div className="border-b border-[#e8e8e8] bg-white sticky top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-6 py-4 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-200 pb-1 border-b-2 whitespace-nowrap ${
                activeCategory === cat
                  ? "border-[#1a1a1a] text-[#1a1a1a]"
                  : "border-transparent text-[#888] hover:text-[#1a1a1a]"
              }`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── BLOG LIST — featured style ── */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col divide-y divide-[#e8e8e8]">
          {paginated.map((blog, index) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className={`group grid md:grid-cols-2 gap-10 md:gap-16 items-center py-16 ${
                index % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"
              }`}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-[#B5685A] text-xs px-3 py-1 tracking-[0.1em] uppercase border border-[#B5685A]">
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center gap-2 text-[#888] text-xs">
                    <User size={12} strokeWidth={1.5} />
                    {blog.author}
                  </div>
                  <div className="flex items-center gap-2 text-[#888] text-xs">
                    <Clock size={12} strokeWidth={1.5} />
                    {blog.readTime}
                  </div>
                  <span className="text-[#ccc] text-xs">{blog.date}</span>
                </div>
                <h2
                  className="text-2xl md:text-3xl font-light text-[#1a1a1a] leading-tight mb-4 group-hover:text-[#4A7E96] transition-colors duration-300"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {blog.title}
                </h2>
                <p className="text-[#666] text-base leading-relaxed font-light mb-8">
                  {blog.excerpt}
                </p>
                <div
                  className="flex items-center gap-2 text-[#4A7E96] text-sm tracking-[0.1em] uppercase font-medium group-hover:text-[#B5685A] transition-colors duration-200"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Read More
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </div>
              </div>
            </Link>
          ))}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top on page change
            }}
            label="products"
          />

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#888] text-lg">
                No posts in this category yet.
              </p>
              <button
                onClick={() => setActiveCategory("All")}
                className="mt-4 text-[#4A7E96] text-sm underline"
              >
                View all posts
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Blog;
