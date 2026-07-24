import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";

function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useShop();

  function handleMoveToCart(product) {
  const colorName = product.colors?.[0]?.name || "Default";
  const lensName = product.lensOptions?.[0] || "Standard";
  addToCart(product, colorName, lensName);
  removeFromWishlist(product.id);
}

  if (wishlist.length === 0) {
    return (
      <main className="bg-white min-h-screen pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <Heart size={64} strokeWidth={0.8} className="text-[#d0d0d0] mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Your Wishlist is Empty
          </h1>
          <p className="text-[#888] text-base font-light mb-10">
            Save items you love and come back to them later.
          </p>
          <Link to="/shop"
            className="bg-[#1a1a1a] text-white px-10 py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300 inline-block"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Explore Eyewear
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f8f8f6] min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Saved Items
            </p>
            <h1 className="text-3xl md:text-4xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              My Wishlist
            </h1>
          </div>
          <p className="text-sm text-[#888]">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {wishlist.map((product) => (
            <div key={product.id} className="flex flex-col gap-3">
              <Link to={`/shop/${product.slug}`}>
                <ProductCard
                  name={product.name}
                  variant={product.variant}
                  price={product.price}
                  isNew={product.isNew}
                  image={product.images?.[0]}
                  hoverImage={product.hoverImage}
                  showWishlist={false}
                />
              </Link>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-3 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <ShoppingBag size={14} strokeWidth={1.5} />
                  Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="w-11 flex items-center justify-center border border-[#e8e8e8] text-[#888] hover:border-[#B5685A] hover:text-[#B5685A] transition-all duration-200">
                  <Heart size={14} strokeWidth={1.5} className="fill-[#B5685A] text-[#B5685A]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Wishlist;