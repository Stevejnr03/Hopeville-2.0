import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  Shield,
  RotateCcw,
  Truck,
  Check,
  Plus,
  Minus,
  Camera,
} from "lucide-react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import TryOn from "../components/TryOn";

function ProductDetail() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedLens, setSelectedLens] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [showTryOn, setShowTryOn] = useState(false);

  const suggested = products
    .filter(
      (p) =>
        p.slug !== slug &&
        (p.category === product?.category || p.shape === product?.shape),
    )
    .slice(0, 4);

  const fallbackSuggested = products.filter((p) => p.slug !== slug).slice(0, 4);
  const relatedProducts = suggested.length >= 2 ? suggested : fallbackSuggested;

  function handleAddToCart() {
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  if (!product) {
    return (
      <main className="bg-white min-h-screen pt-40 text-center px-4">
        <h1
          className="text-3xl font-light text-[#1a1a1a] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Product Not Found
        </h1>
        <Link to="/shop" className="text-[#4A7E96] text-sm underline">
          Back to Shop
        </Link>
      </main>
    );
  }

  const accordionSections = [
    {
      title: "Lens Type & Add-Ons",
      content: (
        <div className="flex flex-col gap-3">
          {product.lensOptions.map((lens, i) => (
            <label
              key={i}
              onClick={() => setSelectedLens(i)}
              className={`flex items-center justify-between p-4 border cursor-pointer transition-all duration-200 ${
                selectedLens === i
                  ? "border-[#1a1a1a] bg-[#f8f8f6]"
                  : "border-[#e8e8e8] hover:border-[#1a1a1a]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedLens === i ? "border-[#1a1a1a]" : "border-[#d0d0d0]"
                  }`}
                >
                  {selectedLens === i && (
                    <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
                  )}
                </div>
                <span className="text-sm text-[#1a1a1a]">{lens}</span>
              </div>
              {lens === "Prescription" && (
                <span className="text-xs text-[#4A7E96] tracking-wide">
                  + Consultation
                </span>
              )}
            </label>
          ))}
        </div>
      ),
    },
    {
      title: "Frame Measurements",
      content: (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Lens Width", value: product.lensWidth },
            { label: "Bridge Width", value: product.bridgeWidth },
            { label: "Temple Length", value: product.templeLength },
          ].map((m) => (
            <div
              key={m.label}
              className="text-center border border-[#e8e8e8] p-4"
            >
              <p
                className="text-lg font-light text-[#1a1a1a] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {m.value}
              </p>
              <p className="text-xs text-[#888] tracking-wide">{m.label}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Materials & Craftsmanship",
      content: (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between py-2 border-b border-[#f0f0f0]">
            <span className="text-sm text-[#888]">Frame Material</span>
            <span className="text-sm text-[#1a1a1a] font-medium">
              {product.material}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[#f0f0f0]">
            <span className="text-sm text-[#888]">Origin</span>
            <span className="text-sm text-[#1a1a1a] font-medium">
              {product.origin}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-[#888]">UV Protection</span>
            <span className="text-sm text-[#1a1a1a] font-medium">UV400</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="bg-white pt-24">
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <button
                onClick={() => setShowTryOn(true)}
                className="inline-flex py-4 mb-8 text-sm tracking-[0.15em] uppercase font-medium border border-[#e8e8e8] text-[#1a1a1a] hover:border-[#4A7E96] hover:text-[#4A7E96] transition-all duration-300 flex items-center justify-left gap-3 px-8 cursor-pointer"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <Camera size={16} strokeWidth={1.5} />
                Live Try-On
              </button>
        <div className="flex items-center gap-2 text-xs text-[#888] tracking-wide">
          <Link to="/" className="hover:text-[#4A7E96] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#4A7E96] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-[#1a1a1a]">{product.name}</span>
        </div>
      </div>

      {/* ── MAIN PRODUCT SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* LEFT — Images */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative bg-[#f8f8f6] aspect-square flex items-center justify-center overflow-hidden">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="text-8xl opacity-10">👓</div>
                  <p className="text-xs text-[#ccc] tracking-widest uppercase">
                    Product Image {selectedImage + 1}
                  </p>
                </div>
              )}

              {/* Nav arrows */}
              <button
                onClick={() =>
                  setSelectedImage(
                    (prev) =>
                      (prev - 1 + product.images.length) %
                      product.images.length,
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md flex items-center justify-center hover:bg-[#1a1a1a] hover:text-white transition-all duration-200"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setSelectedImage((prev) => (prev + 1) % product.images.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md flex items-center justify-center hover:bg-[#1a1a1a] hover:text-white transition-all duration-200"
              >
                <ChevronRight size={18} />
              </button>

              {/* New badge */}
              {product.isNew && (
                <div className="absolute top-4 left-4 border border-[#4A7E96] text-[#4A7E96] text-xs px-3 py-1 tracking-[0.15em] uppercase bg-white">
                  New
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 w-20 h-20 bg-[#f8f8f6] flex items-center justify-center border-2 transition-all duration-200 ${
                    selectedImage === i
                      ? "border-[#1a1a1a]"
                      : "border-transparent hover:border-[#d0d0d0]"
                  }`}
                >
                  {img ? (
                    <img
                      src={img}
                      alt={`View ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl opacity-20">👓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div className="flex flex-col">
            {/* Rating + Sold */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(product.rating)
                        ? "text-[#C9A84C] fill-[#C9A84C]"
                        : "text-[#e0e0e0] fill-[#e0e0e0]"
                    }
                  />
                ))}
                <span className="text-sm font-medium text-[#1a1a1a] ml-1">
                  {product.rating}
                </span>
                <span className="text-sm text-[#888] ml-1">
                  · {product.reviews} Reviews
                </span>
              </div>
            </div>

            {/* Sold this month */}
            <div className="inline-flex mb-4">
              <span className="bg-[#f0f0f0] text-[#555] text-xs px-3 py-1 tracking-wide">
                {product.soldThisMonth}
              </span>
            </div>

            {/* Name */}
            <h1
              className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-1">
              <p
                className="text-2xl text-[#1a1a1a] font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ₦{product.price.toLocaleString()}
              </p>
              {product.prescriptionAvailable && (
                <span className="text-sm text-[#666]">
                  · Prescription available
                </span>
              )}
            </div>

            {/* Installment */}
            <p className="text-sm text-[#888] mb-6">
              or 4 payments of{" "}
              <span className="text-[#1a1a1a] font-medium">
                ₦{Math.round(product.price / 4).toLocaleString()}
              </span>{" "}
              ·{" "}
              <span className="text-[#4A7E96] cursor-pointer hover:underline">
                Learn more
              </span>
            </p>

            <div className="h-[1px] bg-[#e8e8e8] mb-6" />

            {/* Description */}
            <p className="text-[#555] text-sm md:text-base leading-relaxed font-light mb-6">
              {product.description}
            </p>

            {/* Color selector */}
            <div className="mb-6">
              <p className="text-sm font-medium text-[#1a1a1a] mb-3 tracking-wide">
                {product.colors[selectedColor].name}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    title={color.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === i
                        ? "border-[#1a1a1a] scale-110"
                        : "border-transparent hover:border-[#d0d0d0]"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Key features */}
            <div className="flex flex-col gap-2 mb-6">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check
                    size={14}
                    className="text-[#4A7E96] shrink-0"
                    strokeWidth={2}
                  />
                  <span className="text-sm text-[#555]">{feature}</span>
                </div>
              ))}
            </div>

            <div className="h-[1px] bg-[#e8e8e8] mb-6" />

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-3 ${
                  added
                    ? "bg-[#4A7E96] text-white"
                    : "bg-[#1a1a1a] text-white hover:bg-[#4A7E96]"
                }`}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <ShoppingBag size={16} strokeWidth={1.5} />
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>

              <button
                onClick={() => setWishlist(!wishlist)}
                className={`w-full py-4 text-sm tracking-[0.15em] uppercase font-medium border transition-all duration-300 flex items-center justify-center gap-3 ${
                  wishlist
                    ? "border-[#B5685A] text-[#B5685A] bg-[#B5685A]/5"
                    : "border-[#1a1a1a] text-[#1a1a1a] hover:border-[#B5685A] hover:text-[#B5685A]"
                }`}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <Heart
                  size={16}
                  strokeWidth={1.5}
                  className={wishlist ? "fill-[#B5685A]" : ""}
                />
                {wishlist ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>

              <button
                onClick={() => setShowTryOn(true)}
                className="w-full py-4 text-sm tracking-[0.15em] uppercase font-medium border border-[#e8e8e8] text-[#1a1a1a] hover:border-[#4A7E96] hover:text-[#4A7E96] transition-all duration-300 flex items-center justify-center gap-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <Camera size={16} strokeWidth={1.5} />
                Live Try-On
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                {
                  icon: <Shield size={20} strokeWidth={1.2} />,
                  label: "Secure Payments",
                },
                {
                  icon: <RotateCcw size={20} strokeWidth={1.2} />,
                  label: "30-Day Returns",
                },
                {
                  icon: <Truck size={20} strokeWidth={1.2} />,
                  label: "Free Delivery",
                },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-2 text-center border border-[#e8e8e8] py-4 px-2"
                >
                  <div className="text-[#4A7E96]">{badge.icon}</div>
                  <span className="text-xs text-[#666] leading-tight">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-[1px] bg-[#e8e8e8] mb-4" />

            {/* Accordion sections */}
            <div className="flex flex-col">
              {accordionSections.map((section, i) => (
                <div key={i} className="border-b border-[#e8e8e8]">
                  <button
                    onClick={() => setOpenSection(openSection === i ? null : i)}
                    className="w-full flex items-center justify-between py-4 text-left group"
                  >
                    <span className="text-sm font-medium text-[#1a1a1a] tracking-wide group-hover:text-[#4A7E96] transition-colors">
                      {section.title}
                    </span>
                    {openSection === i ? (
                      <Minus
                        size={16}
                        strokeWidth={1.5}
                        className="text-[#4A7E96] shrink-0"
                      />
                    ) : (
                      <Plus
                        size={16}
                        strokeWidth={1.5}
                        className="text-[#888] shrink-0"
                      />
                    )}
                  </button>
                  {openSection === i && (
                    <div className="pb-6">{section.content}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SUGGESTED PRODUCTS ── */}
      <section className="bg-[#f8f8f6] py-16 md:py-24 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p
                className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                You May Also Like
              </p>
              <h2
                className="text-2xl md:text-3xl font-light text-[#1a1a1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Similar Styles
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs tracking-[0.15em] uppercase text-[#4A7E96] hover:text-[#B5685A] transition-colors font-medium hidden md:block"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {relatedProducts.map((product) => (
              <Link key={product.id} to={`/shop/${product.slug}`}>
                <ProductCard
                  name={product.name}
                  variant={product.variant}
                  price={product.price}
                  isNew={product.isNew}
                  image={product.images[0]}
                  hoverImage={product.hoverImage}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {showTryOn && (
        <TryOn product={product} onClose={() => setShowTryOn(false)} />
      )}
    </main>
  );
}

export default ProductDetail;
