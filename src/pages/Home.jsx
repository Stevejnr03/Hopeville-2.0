import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  ArrowRight,
  Phone,
  Award,
  Users,
  Clock,
  Star,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ProductCard from "../components/ProductCard";

import { slides, steps, testimonials, partners, ctaSlides } from "../data/home";
import aboutImg from "../assets/building.jpg";
import services from "../data/services";
import ServiceIcon from "../components/ServiceIcon";
import { productService } from "../services/productService";
import { blogService } from "../services/blogService";

function Home() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Mini shop state

  const [products, setProducts] = useState([]);

  // Testimonial slider state
  const [tCurrent, setTCurrent] = useState(0);
  const [tAnimating, setTAnimating] = useState(false);

  // Mini Blog

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      tGoNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [tCurrent]);

  function tGoNext() {
    setTAnimating(true);
    setTimeout(() => {
      setTCurrent((prev) => (prev + 1) % testimonials.length);
      setTAnimating(false);
    }, 400);
  }

  function tGoPrev() {
    setTAnimating(true);
    setTimeout(() => {
      setTCurrent(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length,
      );
      setTAnimating(false);
    }, 400);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 12000);
    return () => clearInterval(timer);
  }, [current]);

  function goNext() {
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setAnimating(false);
    }, 400);
  }

  function goPrev() {
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
      setAnimating(false);
    }, 400);
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await blogService.getAll();
        setBlogs(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchBlogs();
  }, []);

  const slide = slides[current];

  return (
    <main>
      {/* ── 1. HERO WITH SLIDER ── */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        {/* Placeholder background - replace with real image later */}
        <div className="absolute inset-0">
          <img
            src={slide.image}
            alt={slide.heading}
            className="w-full h-full object-cover transition-opacity duration-700"
          />

          <div className="absolute inset-0 bg-black/50" />

          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full pt-50 md:pt-0">
          <div className="max-w-3xl">
            <div
              className={`transition-all duration-500 ${animating ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"}`}
            >
              <p
                className="text-[#B5685A] text-sm tracking-[0.35em] uppercase mb-5 font-medium"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {slide.tag}
              </p>
              <h1
                className="text-5xl md:text-6xl font-light text-white leading-[1.1] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {slide.heading}
                <span className="italic text-[#4A7E96]">
                  {" "}
                  {slide.highlight}
                </span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-lg font-light">
                {slide.sub}
              </p>
              <div className="flex items-center gap-5 flex-wrap">
                <Link
                  to="/shop"
                  className="bg-white text-[#0d1f2d] px-8 py-4 text-sm tracking-[0.15em] uppercase font-semibold hover:bg-[#B5685A] hover:text-white transition-all duration-300"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Shop Eyewear
                </Link>
                <Link
                  to="/book"
                  className="border border-white text-white px-8 py-4 text-sm tracking-[0.15em] uppercase hover:bg-white hover:text-[#0d1f2d] transition-all duration-300"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Book Eye Exam
                </Link>
              </div>
            </div>

            {/* Slider controls */}
            <div className="flex items-center gap-6 mt-14">
              <button
                onClick={goPrev}
                className="w-11 h-11 border border-white/30 flex items-center justify-center text-white hover:border-[#4A7E96] hover:bg-[#4A7E96] transition-all duration-200"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2 items-center">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-[2px] transition-all duration-400 ${i === current ? "w-10 bg-[#4A7E96]" : "w-5 bg-white/30"}`}
                  />
                ))}
              </div>
              <button
                onClick={goNext}
                className="w-11 h-11 border border-white/30 flex items-center justify-center text-white hover:border-[#4A7E96] hover:bg-[#4A7E96] transition-all duration-200"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24" />
      </section>

      {/* ── 3. MINI ABOUT ── */}
      <section className="bg-white py-28">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-20 items-center">
          <div className="relative hidden md:block">
            <img
              src={aboutImg} // Replace with your image path
              alt="Hopeville Eye Clinic"
              className="w-full h-[480px] object-cover rounded-sm "
            />

            <div className="absolute top-8 left-8 border border-[#4A7E96]/40 w-full h-[480px] rounded-sm -z-10" />
          </div>
          <div>
            <p
              className="text-[#B5685A] text-sm tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              About Hopeville
            </p>
            <h2
              className="text-4xl font-light text-[#1a1a1a] leading-tight mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Where Precision Meets Luxury Vision Care
            </h2>
            <p className="text-[#444] text-base leading-relaxed mb-6 font-light">
              At Hopeville Eye Clinic, we believe exceptional eye care should be
              both medically rigorous and elegantly delivered. For over 15
              years, we have served the Port Harcourt community with clinical
              excellence and a warm, patient-first approach.
            </p>
            <p className="text-[#444] text-base leading-relaxed mb-10 font-light">
              Our team of dedicated vision specialists combines cutting-edge
              diagnostics with a genuine passion for preserving and enhancing
              your sight.
            </p>
            <div className="flex flex-col gap-3 mb-10">
              {[
                "Certified Vision Specialists",
                "Top Notch Diagnostic Equipment",
                "Luxury Eyewear Boutique On-site",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle
                    size={18}
                    className="text-[#4A7E96]"
                    strokeWidth={1.5}
                  />
                  <span className="text-[#1a1a1a] text-base font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="border border-[#4A7E96] text-[#4A7E96] px-8 py-3 text-sm tracking-[0.15em] uppercase hover:bg-[#4A7E96] hover:text-white transition-all duration-300 inline-block font-medium"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. SERVICES ── */}
      <section className="bg-[#f8f8f6] py-28">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p
              className="text-[#B5685A] text-sm tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              What We Offer
            </p>
            <h2
              className="text-4xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Our Services
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-[#e8e8e8] p-8 md:p-10 hover:border-[#4A7E96] hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                <span className="text-4xl mb-6 block">
                  <ServiceIcon slug={service.slug} size={40} color="#4A7E96" />
                </span>
                <h3
                  className="text-xl md:text-2xl font-medium text-[#1a1a1a] mb-4 group-hover:text-[#4A7E96] transition-colors duration-200"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {service.title}
                </h3>
                <Link
                  to={`/services/${service.slug}`}
                  className="flex items-center gap-2 text-[#4A7E96] text-sm tracking-[0.1em] uppercase font-medium hover:text-[#B5685A] transition-colors duration-200 group/link"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Read More
                  <ArrowRight
                    size={16}
                    className="group-hover/link:translate-x-1 transition-transform duration-200"
                  />
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link
              to="/services"
              className="border border-[#4A7E96] text-[#4A7E96] px-10 py-4 text-sm tracking-[0.15em] uppercase hover:bg-[#4A7E96] hover:text-white transition-all duration-300 inline-block font-medium"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. HOW WE WORK ── */}
      <section className="bg-white py-28">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p
              className="text-[#B5685A] text-sm tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Our Process
            </p>
            <h2
              className="text-4xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              How We Work
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-[1px] bg-[#4A7E96]/30" />
                )}
                <div className="w-20 h-20 rounded-full border-2 border-[#4A7E96] flex items-center justify-center mx-auto mb-6 relative z-10 bg-white">
                  <span
                    className="text-2xl font-light text-[#4A7E96]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {step.step}
                  </span>
                </div>
                <h3
                  className="text-xl font-medium text-[#1a1a1a] mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-[#555] text-base leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. MINI SHOP ── */}
      <section className="bg-[#f8f8f6] py-28">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p
              className="text-[#B5685A] text-sm tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Our Collection
            </p>
            <h2
              className="text-4xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Luxury Eyewear
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
            {products.slice(0, 4).map((product) => (
              <Link key={product.name} to={`/shop/${product.slug}`}>
                <ProductCard
                  name={product.name}
                  variant={product.variant}
                  price={product.price}
                  isNew={product.isNew}
                  image={product.images[0]}
                  hoverImage={product.hoverImage}
                  showWishlist={false}
                />
              </Link>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              to="/shop"
              className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-4 text-sm tracking-[0.15em] uppercase hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 inline-block font-medium"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Visit Our Shop
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. BOOK APPOINTMENT CTA SLIDER ── */}
      <section className="bg-[#0d1f2d] py-24 overflow-hidden relative">
        {/* CTA Slides */}
        {(() => {
          const [ctaCurrent, setCtaCurrent] = useState(0);
          const [ctaAnimating, setCtaAnimating] = useState(false);

          useEffect(() => {
            const timer = setInterval(() => {
              setCtaAnimating(true);
              setTimeout(() => {
                setCtaCurrent((prev) => (prev + 1) % ctaSlides.length);
                setCtaAnimating(false);
              }, 400);
            }, 5000);
            return () => clearInterval(timer);
          }, [ctaCurrent]);

          const ctaSlide = ctaSlides[ctaCurrent];

          return (
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div
                className={`transition-all duration-500 ${ctaAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
              >
                <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
                  <div>
                    <p
                      className="text-[#B5685A] text-xs md:text-sm tracking-[0.3em] uppercase mb-4"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {ctaSlide.tag}
                    </p>
                    <h2
                      className="text-3xl md:text-4xl font-light text-white leading-tight"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {ctaSlide.heading}
                    </h2>
                  </div>
                  <div className="flex flex-col gap-6">
                    <p className="text-white/80 text-base  font-light leading-relaxed">
                      {ctaSlide.sub}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Link
                        to={ctaSlide.link}
                        className="bg-[#4A7E96] text-white px-8 md:px-10 py-3 md:py-4 text-xs md:text-sm tracking-[0.15em] uppercase hover:bg-[#B5685A] transition-all duration-300 font-medium"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {ctaSlide.cta}
                      </Link>
                      <a
                        href="tel:+2348133300378"
                        className="flex items-center gap-2 text-white text-xs md:text-sm tracking-wide hover:text-[#4A7E96] transition-colors"
                      >
                        <Phone size={16} strokeWidth={1.5} />
                        +234 813 330 0378
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide indicators */}
              <div className="flex items-center gap-3 mt-12">
                {ctaSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCtaCurrent(i)}
                    className={`h-[2px] transition-all duration-300 ${i === ctaCurrent ? "w-10 bg-[#4A7E96]" : "w-5 bg-white/20"}`}
                  />
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── 8. TESTIMONIALS SLIDER ── */}
      <section className="bg-white py-28">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p
              className="text-[#B5685A] text-sm tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Patient Stories
            </p>
            <h2
              className="text-4xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              What Our Patients Say
            </h2>
          </div>

          {/* Slider */}
          <div className="relative">
            <div
              className={`transition-all duration-500 ${tAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}
            >
              <div className="border border-[#d5cdc4] p-14 max-w-3xl mx-auto text-center">
                <div className="flex gap-1 justify-center mb-8">
                  {[...Array(testimonials[tCurrent].rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-[#B5685A] fill-[#B5685A]"
                    />
                  ))}
                </div>
                <p
                  className="text-[#444] text-2xl leading-relaxed mb-10 font-light italic"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  "{testimonials[tCurrent].text}"
                </p>
                <div>
                  <p className="text-[#1a1a1a] font-semibold text-base">
                    {testimonials[tCurrent].name}
                  </p>
                  <p className="text-[#B5685A] text-sm tracking-wide mt-1">
                    {testimonials[tCurrent].title}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-10">
              <button
                onClick={tGoPrev}
                className="w-11 h-11 border border-[#d5cdc4] flex items-center justify-center text-[#4A7E96] hover:border-[#4A7E96] hover:bg-[#4A7E96] hover:text-white transition-all duration-200"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTCurrent(i)}
                    className={`h-[2px] transition-all duration-300 ${i === tCurrent ? "w-10 bg-[#4A7E96]" : "w-5 bg-[#d5cdc4]"}`}
                  />
                ))}
              </div>
              <button
                onClick={tGoNext}
                className="w-11 h-11 border border-[#d5cdc4] flex items-center justify-center text-[#4A7E96] hover:border-[#4A7E96] hover:bg-[#4A7E96] hover:text-white transition-all duration-200"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. BLOGS ── */}
      <section className="bg-[#f8f8f6] py-16 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p
              className="text-[#B5685A] text-sm tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Eye Health Insights
            </p>
            <h2
              className="text-3xl md:text-4xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Latest From Our Blog
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className="group bg-white hover:shadow-lg transition-all duration-300"
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
                <div className="p-6 md:p-8 border border-t-0 border-[#e8e8e8]">
                  <p className="text-[#aaa] text-xs mb-3">{blog.date}</p>
                  <h3
                    className="text-xl md:text-2xl font-light text-[#1a1a1a] leading-snug mb-3 group-hover:text-[#4A7E96] transition-colors duration-300"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {blog.title}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed font-light mb-5 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <div
                    className="flex items-center gap-2 text-[#4A7E96] text-xs tracking-[0.1em] uppercase font-medium group-hover:text-[#B5685A] transition-colors duration-200"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Read More
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              to="/blog"
              className="border border-[#4A7E96] text-[#4A7E96] px-10 py-4 text-sm tracking-[0.15em] uppercase hover:bg-[#4A7E96] hover:text-white transition-all duration-300 inline-block font-medium"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10. FEATURED PARTNERS ── */}

      <section className="bg-white py-16 border-t border-[#e8e8e8] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-14 text-center">
          <p
            className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Trusted Brands
          </p>
          <h2
            className="text-3xl md:text-4xl font-light text-[#1a1a1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Our Partners
          </h2>
        </div>

        {/* Marquee */}
        <div className="relative flex overflow-hidden">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...partners, ...partners].map((partner, i) => (
              <img
                key={i}
                src={partner}
                alt={`Partner logo ${i + 1}`}
                className="h-9 md:h-11 w-auto object-contain shrink-0 opacity-70 hover:grayscale-0 hover:opacity-100 transition-opacity duration-300"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
