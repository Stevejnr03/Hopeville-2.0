import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, User, ArrowRight } from "lucide-react";
import { blogService } from "../services/blogService";
import doc from "../assets/doc.png";

function BlogDetail() {
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const [post, all] = await Promise.all([
          blogService.getBySlug(slug),
          blogService.getAll(),
        ]);
        setBlog(post);
        setAllBlogs(all);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBlog(false);
      }
    }
    fetchData();
  }, [slug]);

  const relatedPosts = allBlogs
    .filter((b) => b.slug !== slug && b.category === blog?.category)
    .slice(0, 3);

  const displayRelated =
    relatedPosts.length > 0
      ? relatedPosts
      : allBlogs.filter((b) => b.slug !== slug).slice(0, 3);
  if (!blog) {
    return (
      <main className="bg-white min-h-screen pt-40 text-center px-4">
        <h1
          className="text-3xl font-light text-[#1a1a1a] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Post Not Found
        </h1>
        <Link to="/blog" className="text-[#4A7E96] text-sm underline">
          Back to Blog
        </Link>
      </main>
    );
  }

  // related.length > 0 ? related : fallbackRelated;

  return (
    <main className="bg-white">
      {/* ── HERO IMAGE ── */}
      <section className="relative min-h-[65vh] flex items-end overflow-hidden">
        {/* Real image background */}
        <div className="absolute inset-0">
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f2d] via-[#0d1f2d]/50 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 pt-40 relative z-10 w-full">
          <Link
            to="/blog"
            className="flex items-center gap-2 text-white/60 text-xs tracking-[0.15em] uppercase mb-8 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <span className="inline-block bg-[#B5685A] text-white text-xs px-3 py-1 tracking-[0.1em] uppercase mb-5">
            {blog.category}
          </span>
          <h1
            className="text-3xl md:text-5xl font-light text-white leading-tight max-w-3xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {blog.title}
          </h1>
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <User size={12} strokeWidth={1.5} />
              {blog.author}
            </div>
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <Clock size={12} strokeWidth={1.5} />
              {blog.readTime}
            </div>
            <span className="text-white/60 text-xs">{blog.date}</span>
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-3 gap-12 md:gap-16">
          {/* Main Content */}
          <div className="md:col-span-2">
            <p
              className="text-[#444] text-base  leading-relaxed font-light mb-12 border-l-4 border-[#4A7E96] pl-6 italic"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {blog.excerpt}
            </p>

            <div dangerouslySetInnerHTML={{ __html: blog.content }} />

            {/* CTA */}
            <div className="border-t border-[#e8e8e8] pt-10 mt-10">
              <p className="text-[#888] text-sm mb-4">
                Have questions about your eye health? Our specialists are here
                to help.
              </p>
              <Link
                to="/book"
                className="inline-block bg-[#4A7E96] text-white px-8 py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#B5685A] transition-all duration-300 font-medium"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Book an Appointment
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Author */}
            <div className="bg-[#f8f8f6] p-8 border border-[#e8e8e8]">
              <div className="w-16 h-16 bg-[#4A7E96]/10 rounded-full flex items-center justify-center mb-4">
                <img
                  src={doc}
                  alt="Hopeville Eye Clinic"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <h3
                className="text-lg font-medium text-[#1a1a1a] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {blog.author}
              </h3>
              <p className="text-[#B5685A] text-xs tracking-[0.15em] uppercase mb-3">
                Medical Director & Consultant Optometrist
              </p>
              <p className="text-[#666] text-sm font-light leading-relaxed">
                A dedicated member of the Hopeville Eye Clinic team, committed
                to evidence-based eye care and patient education.
              </p>
            </div>

            {/* Related posts */}
            <div className="border border-[#e8e8e8] p-8">
              <h3
                className="text-lg font-medium text-[#1a1a1a] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Related Posts
              </h3>
              <div className="flex flex-col gap-5">
                {displayRelated.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group flex gap-4 items-start border-b border-[#e8e8e8] pb-5 last:border-0 last:pb-0"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 shrink-0 overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <span className="text-[#B5685A] text-xs tracking-[0.1em] uppercase">
                        {post.category}
                      </span>
                      <p
                        className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#4A7E96] transition-colors leading-snug mt-1"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {post.title}
                      </p>
                      <span className="text-xs text-[#aaa] mt-1 block">
                        {post.date}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Book CTA */}
            <div className="bg-[#0d1f2d] p-8">
              <p
                className="text-[#B5685A] text-xs tracking-[0.2em] uppercase mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Take Action
              </p>
              <h3
                className="text-xl font-light text-white mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Schedule Your Eye Exam
              </h3>
              <p className="text-white/60 text-sm font-light mb-6 leading-relaxed">
                Don't wait for symptoms. Book a comprehensive eye examination
                today.
              </p>
              <Link
                to="/book"
                className="block text-center bg-[#4A7E96] text-white py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#B5685A] transition-all duration-300 font-medium"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MORE POSTS ── */}
      <section className="bg-[#f8f8f6] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1a1a1a] mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            More Articles
          </h2>
          <div className="flex flex-col divide-y divide-[#e8e8e8]">
            {displayRelated.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center py-10"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div>
                  <span className="text-[#B5685A] text-xs tracking-[0.1em] uppercase">
                    {post.category}
                  </span>
                  <h3
                    className="text-xl md:text-2xl font-medium text-[#1a1a1a] mt-2 mb-3 group-hover:text-[#4A7E96] transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed font-light mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-[#4A7E96] text-xs tracking-[0.1em] uppercase font-medium group-hover:text-[#B5685A] transition-colors">
                    Read More <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default BlogDetail;
