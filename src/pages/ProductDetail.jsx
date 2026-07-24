import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "../services/productService";
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
import ProductCard from "../components/ProductCard";
import TryOn from "../components/TryOn";
import { useShop } from "../context/ShopContext";

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedLens, setSelectedLens] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [showTryOn, setShowTryOn] = useState(false);

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useShop();

  useEffect(() => {
    async function fetchProduct() {
      setLoadingProduct(true);
      try {
        const data = await productService.getBySlug(slug);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoadingProduct(false);
      }
    }
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!product) return;

    async function fetchRelated() {
      try {
        const all = await productService.getAll();
        const suggested = all
          .filter(
            (p) =>
              p.slug !== slug &&
              (p.category === product.category || p.shape === product.shape),
          )
          .slice(0, 4);
        const fallback = all.filter((p) => p.slug !== slug).slice(0, 4);
        setRelatedProducts(suggested.length >= 2 ? suggested : fallback);
      } catch (err) {
        console.error(err);
      }
    }
    fetchRelated();
  }, [product, slug]);

  if (loadingProduct) {
    return (
      <main className="bg-white min-h-screen pt-24 flex items-center justify-center">
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
      </main>
    );
  }

  // Null check SECOND — before anything tries to use product.id
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

  // ✅ Now it's SAFE to use product.id — product is guaranteed to exist here
  const inWishlist = isInWishlist(product.id);

  function handleAddToCart() {
    const colorName = product.colors?.[0]?.name || "Default";
  const lensName = product.lensOptions?.[0] || "Standard";
    addToCart(
      product,
      colorName,
      lensName
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  function handleWishlist() {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
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
  <main className="bg-white pt-24 md:pt-10">

    {/* Breadcrumb — compact, at very top */}
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 border-b border-[#f0f0f0]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#888] tracking-wide">
          <Link to="/" className="hover:text-[#4A7E96] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#4A7E96] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#1a1a1a] truncate max-w-[200px]">{product.name}</span>
        </div>
        {/* Try-On button moved to breadcrumb row */}
        <button
          onClick={() => setShowTryOn(true)}
          className="hidden sm:flex items-center gap-2 text-xs tracking-[0.15em] uppercase border border-[#e8e8e8] text-[#1a1a1a] hover:border-[#4A7E96] hover:text-[#4A7E96] transition-all duration-300 px-4 py-2">
          <Camera size={13} strokeWidth={1.5} />
          Live Try-On
        </button>
      </div>
    </div>

    {/* ── MAIN PRODUCT SECTION — starts immediately after breadcrumb ── */}
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* LEFT — Images */}
        <div className="flex flex-col gap-3">
          {/* Main image */}
          <div className="relative bg-[#f8f8f6] aspect-square flex items-center justify-center overflow-hidden rounded-sm">
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="text-8xl opacity-10">👓</div>
                <p className="text-xs text-[#ccc] tracking-widest uppercase">
                  No Image
                </p>
              </div>
            )}

            {/* Nav arrows — only show if multiple images */}
            {product.images?.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(prev =>
                    (prev - 1 + product.images.length) % product.images.length
                  )}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 shadow-md flex items-center justify-center hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 backdrop-blur-sm">
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setSelectedImage(prev =>
                    (prev + 1) % product.images.length
                  )}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 shadow-md flex items-center justify-center hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 backdrop-blur-sm">
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* New badge */}
            {product.is_new && (
              <div className="absolute top-3 left-3 border border-[#4A7E96] text-[#4A7E96] text-xs px-3 py-1 tracking-[0.15em] uppercase bg-white">
                New
              </div>
            )}

            {/* Image counter */}
            {product.images?.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                {selectedImage + 1} / {product.images.length}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 w-16 h-16 md:w-20 md:h-20 bg-[#f8f8f6] flex items-center justify-center border-2 transition-all duration-200 overflow-hidden ${
                    selectedImage === i
                      ? "border-[#1a1a1a]"
                      : "border-transparent hover:border-[#d0d0d0]"
                  }`}>
                  {img ? (
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl opacity-20">👓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Product Info */}
        <div className="flex flex-col">
          {/* Category + shape tags */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs border border-[#e8e8e8] text-[#888] px-3 py-1 tracking-wide">
              {product.category}
            </span>
            {product.shape && (
              <span className="text-xs border border-[#e8e8e8] text-[#888] px-3 py-1 tracking-wide">
                {product.shape}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#1a1a1a] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {product.name}
          </h1>

          {product.variant && (
            <p className="text-sm text-[#888] italic mb-4">{product.variant}</p>
          )}

          <div className="flex items-center gap-3 mb-6">
            <p className="text-2xl md:text-3xl text-[#1a1a1a] font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              ₦{Number(product.price).toLocaleString()}
            </p>
            
          </div>

          <div className="h-[1px] bg-[#e8e8e8] mb-5" />

          <p className="text-[#555] text-sm md:text-base leading-relaxed font-light mb-6">
            {product.description}
          </p>

          {/* Color selector */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs tracking-[0.15em] uppercase text-[#888] mb-3">
                Color — <span className="text-[#1a1a1a] font-medium normal-case tracking-normal">
                  {product.colors[selectedColor]?.name}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    title={color.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === i
                        ? "border-[#1a1a1a] scale-110 shadow-md"
                        : "border-transparent hover:border-[#d0d0d0]"
                    }`}
                    style={{ backgroundColor: color.hex }} />
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {product.features?.length > 0 && (
            <div className="flex flex-col gap-2 mb-6">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={13} className="text-[#4A7E96] shrink-0" strokeWidth={2.5} />
                  <span className="text-sm text-[#555]">{feature}</span>
                </div>
              ))}
            </div>
          )}

          <div className="h-[1px] bg-[#e8e8e8] mb-5" />

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-3 ${
                added
                  ? "bg-[#4A7E96] text-white"
                  : "bg-[#1a1a1a] text-white hover:bg-[#4A7E96]"
              }`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <ShoppingBag size={16} strokeWidth={1.5} />
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>

            <button
              onClick={handleWishlist}
              className={`w-full py-4 text-sm tracking-[0.15em] uppercase font-medium border transition-all duration-300 flex items-center justify-center gap-3 ${
                inWishlist
                  ? "border-[#B5685A] text-[#B5685A] bg-[#B5685A]/5"
                  : "border-[#1a1a1a] text-[#1a1a1a] hover:border-[#B5685A] hover:text-[#B5685A]"
              }`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <Heart size={16} strokeWidth={1.5} className={inWishlist ? "fill-[#B5685A]" : ""} />
              {inWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>

            {/* Mobile Try-On button */}
            <button
              onClick={() => setShowTryOn(true)}
              className="sm:hidden w-full py-4 text-sm tracking-[0.15em] uppercase font-medium border border-[#e8e8e8] text-[#1a1a1a] hover:border-[#4A7E96] hover:text-[#4A7E96] transition-all duration-300 flex items-center justify-center gap-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <Camera size={16} strokeWidth={1.5} />
              Live Try-On
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: <Shield size={18} strokeWidth={1.2} />, label: "Secure Payments" },
              { icon: <RotateCcw size={18} strokeWidth={1.2} />, label: "30-Day Returns" },
              { icon: <Truck size={18} strokeWidth={1.2} />, label: "Fast Delivery" },
            ].map(badge => (
              <div key={badge.label}
                className="flex flex-col items-center gap-2 text-center border border-[#e8e8e8] py-3 px-2">
                <div className="text-[#4A7E96]">{badge.icon}</div>
                <span className="text-xs text-[#666] leading-tight">{badge.label}</span>
              </div>
            ))}
          </div>

          <div className="h-[1px] bg-[#e8e8e8] mb-4" />

          {/* Accordion */}
          <div className="flex flex-col">
            {accordionSections.map((section, i) => (
              <div key={i} className="border-b border-[#e8e8e8]">
                <button
                  onClick={() => setOpenSection(openSection === i ? null : i)}
                  className="w-full flex items-center justify-between py-4 text-left group">
                  <span className="text-sm font-medium text-[#1a1a1a] tracking-wide group-hover:text-[#4A7E96] transition-colors">
                    {section.title}
                  </span>
                  {openSection === i
                    ? <Minus size={15} strokeWidth={1.5} className="text-[#4A7E96] shrink-0" />
                    : <Plus size={15} strokeWidth={1.5} className="text-[#888] shrink-0" />
                  }
                </button>
                {openSection === i && <div className="pb-6">{section.content}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Related Products */}
    <section className="bg-[#f8f8f6] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              You May Also Like
            </p>
            <h2 className="text-2xl md:text-3xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Similar Styles
            </h2>
          </div>
          <Link to="/shop"
            className="text-xs tracking-[0.15em] uppercase text-[#4A7E96] hover:text-[#B5685A] transition-colors font-medium hidden md:block"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {relatedProducts.map(p => (
            <Link key={p.id} to={`/shop/${p.slug}`}>
              <ProductCard
                name={p.name}
                variant={p.variant}
                price={p.price}
                isNew={p.is_new}
                image={p.images?.[0]}
                hoverImage={p.hoverImage}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>

    {showTryOn && <TryOn product={product} onClose={() => setShowTryOn(false)} />}
  </main>
  );
}

export default ProductDetail;
