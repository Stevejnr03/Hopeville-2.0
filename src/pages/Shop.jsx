import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
const allProducts = products;

import { Link } from "react-router-dom";

const shapes = ["Aviator", "Cat Eye", "Rectangle", "Round"];
const categories = ["Eyeglasses", "Sunglasses"];

function Shop() {
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  function toggleShape(shape) {
    setSelectedShapes((prev) =>
      prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape],
    );
  }

  function toggleCategory(cat) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  function clearFilters() {
    setSelectedShapes([]);
    setSelectedCategories([]);
  }

  const filtered = allProducts.filter((p) => {
    const shapeMatch =
      selectedShapes.length === 0 || selectedShapes.includes(p.shape);
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category);
    return shapeMatch && categoryMatch;
  });

  return (
    <main className="bg-white min-h-screen pt-24">
      {/* Page Header */}
      <div className="bg-[#f8f8f6] py-14 text-center border-b border-[#e8e8e8]">
        <p
          className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Our Collection
        </p>
        <h1
          className="text-4xl md:text-5xl font-light text-[#1a1a1a]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Luxury Eyewear
        </h1>
      </div>

      {/* Category Nav */}
      <div className="border-b border-[#e8e8e8] bg-white sticky top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-6 md:gap-8 py-4 overflow-x-auto">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() =>
                cat === "All" ? setSelectedCategories([]) : toggleCategory(cat)
              }
              className={`text-xs md:text-sm tracking-[0.15em] uppercase font-medium transition-colors duration-200 pb-1 border-b-2 whitespace-nowrap ${
                (cat === "All" && selectedCategories.length === 0) ||
                selectedCategories.includes(cat)
                  ? "border-[#1a1a1a] text-[#1a1a1a]"
                  : "border-transparent text-[#888] hover:text-[#1a1a1a]"
              }`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {cat}
            </button>
          ))}
          <button
            className="ml-auto flex items-center gap-2 text-xs md:text-sm text-[#1a1a1a] whitespace-nowrap"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12 flex gap-8 md:gap-12">
        {/* Sidebar Filters */}
        <aside
          className={`w-56 md:w-64 shrink-0 ${showFilters ? "block" : "hidden"} md:block`}
        >
          <div className="sticky top-48">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl md:text-2xl font-light text-[#1a1a1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Filters
              </h2>
              {(selectedShapes.length > 0 || selectedCategories.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#B5685A] tracking-wide hover:underline flex items-center gap-1"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
            <div className="h-[1px] bg-[#e8e8e8] mb-6" />

            {/* Category */}
            <div className="mb-6">
              <h3 className="text-sm md:text-base font-medium text-[#1a1a1a] mb-4 tracking-wide">
                Category
              </h3>
              <div className="flex flex-col gap-3">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      onClick={() => toggleCategory(cat)}
                      className={`w-4 h-4 border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                        selectedCategories.includes(cat)
                          ? "bg-[#1a1a1a] border-[#1a1a1a]"
                          : "border-[#d0d0d0] group-hover:border-[#1a1a1a]"
                      }`}
                    >
                      {selectedCategories.includes(cat) && (
                        <div className="w-2 h-2 bg-white" />
                      )}
                    </div>
                    <span className="text-xs md:text-sm text-[#444] group-hover:text-[#1a1a1a] transition-colors">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-[#e8e8e8] mb-6" />

            {/* Shape */}
            <div className="mb-6">
              <h3 className="text-sm md:text-base font-medium text-[#1a1a1a] mb-4 tracking-wide">
                Shape
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {shapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => toggleShape(shape)}
                    className={`border py-3 px-2 text-xs tracking-wide transition-all duration-200 flex flex-col items-center gap-2 ${
                      selectedShapes.includes(shape)
                        ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                        : "border-[#e8e8e8] text-[#444] hover:border-[#1a1a1a]"
                    }`}
                  >
                    <span className="text-base">👓</span>
                    <span>{shape}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-[#e8e8e8] mb-6" />

            {/* Price */}
            <div>
              <h3 className="text-sm md:text-base font-medium text-[#1a1a1a] mb-4 tracking-wide">
                Price Range
              </h3>
              <div className="flex flex-col gap-3">
                {["Under ₦80,000", "₦80,000 - ₦120,000", "Above ₦120,000"].map(
                  (range) => (
                    <label
                      key={range}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="w-4 h-4 border border-[#d0d0d0] group-hover:border-[#1a1a1a] transition-all duration-200 shrink-0" />
                      <span className="text-xs md:text-sm text-[#444] group-hover:text-[#1a1a1a] transition-colors">
                        {range}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <p className="text-xs md:text-sm text-[#888]">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </p>
            <select className="text-xs md:text-sm text-[#444] border border-[#e8e8e8] px-3 py-2 focus:outline-none focus:border-[#1a1a1a]">
              <option>Sort: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-y-14">
            {filtered.map((product) => (
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

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-[#888] text-base md:text-lg">
                No products match your filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-[#4A7E96] text-sm underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Shop;
