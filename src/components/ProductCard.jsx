import { useState } from "react";
import { Heart } from "lucide-react";

function ProductCard({ name, variant, price, isNew, image, hoverImage, showWishlist = true }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group cursor-pointer transition-all duration-300  ${
        hovered
          ? "shadow-[0_8px_30px_rgba(0,0,0,0.12)] -translate-y-1"
          : "shadow-none translate-y-0"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div className="relative bg-[#f8f8f6] aspect-square overflow-hidden mb-4">

        {/* New Badge */}
        {isNew && (
          <span className="absolute top-3 left-3 z-10 text-[10px] border border-[#4A7E96] text-[#4A7E96] px-3 py-1 tracking-[0.15em] uppercase bg-white">
            New
          </span>
        )}

        {/* Wishlist */}
        {showWishlist && (
          <button className="absolute top-3 right-3 z-10 bg-white p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#1a1a1a] hover:text-white shadow-sm">
            <Heart size={14} strokeWidth={1.5} />
          </button>
        )}

        {/* Main Image */}
        {image ? (
          <img
            src={image}
            alt={name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-0" : "opacity-100"}`}
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${hovered ? "opacity-0" : "opacity-100"}`}>
            <div className="flex flex-col items-center gap-3">
              <div className="text-6xl opacity-20">👓</div>
              <p className="text-xs text-[#aaa] tracking-widest uppercase">Product Image</p>
            </div>
          </div>
        )}

        {/* Hover Image */}
        {hoverImage ? (
          <img
            src={hoverImage}
            alt={`${name} on model`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
          />
        ) : (
          <div className={`absolute inset-0 bg-[#e8e4df] flex items-center justify-center transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}>
            <div className="flex flex-col items-center gap-3">
              <div className="text-6xl opacity-30">🕶️</div>
              <p className="text-xs text-[#888] tracking-widest uppercase">Model View</p>
            </div>
          </div>
        )}

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button className="bg-white text-[#1a1a1a] px-6 py-2 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 shadow-md">
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-3 p-3">
        <h3
          className="text-base md:text-lg font-medium text-[#1a1a1a] mb-1 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {name}
        </h3>
        <p
          className="text-xs md:text-sm text-[#888] mb-2 italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {variant}
        </p>
        <p
          className="text-sm md:text-base text-[#1a1a1a] font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {typeof price === "number" ? `₦${price.toLocaleString()}` : price}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;