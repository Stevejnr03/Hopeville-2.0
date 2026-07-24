import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useShop } from "../../context/ShopContext";
import ProductCard from "../../components/ProductCard";

function DashboardWishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useShop();

  function handleMoveToCart(product) {
    const colorName = product.colors?.[0]?.name || "Default";
    const lensName = product.lensOptions?.[0] || "Standard";
    addToCart(product, colorName, lensName);
    removeFromWishlist(product.id);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p
            className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Saved Items
          </p>
          <h1
            className="text-3xl font-light text-[#1a1a1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            My Wishlist
          </h1>
        </div>
        {wishlist.length > 0 && (
          <p className="text-sm text-[#888]">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
          </p>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#e8e8e8] p-16 text-center">
            <Heart
              size={48}
              strokeWidth={0.8}
              className="text-[#d0d0d0] mx-auto mb-5"
            />
            <h2
              className="text-2xl font-light text-[#1a1a1a] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Your Wishlist is Empty
            </h2>
            <p className="text-[#888] text-sm font-light mb-8">
              Browse our collection and add items you love.
            </p>
            <Link
              to="/shop"
              className="bg-[#1a1a1a] text-white px-10 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300 inline-block"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Browse Collections
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {wishlist.map((product) => (
            <div key={product.id} className="flex flex-col gap-3">
              <Link to={`/shop/${product.slug}`}>
                <ProductCard
                  product={product}
                  name={product.name}
                  variant={product.variant}
                  price={product.price}
                  isNew={product.isNew}
                  image={product.images?.[0]}
                  hoverImage={product.hoverImage}
                  showWishlist={true}
                  showQuickAdd={false}
                />
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-3 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  <ShoppingBag size={14} strokeWidth={1.5} />
                  Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="w-11 flex items-center justify-center border border-[#e8e8e8] text-[#B5685A] hover:border-[#B5685A] hover:bg-[#B5685A] hover:text-white transition-all duration-200"
                >
                  <Heart
                    size={14}
                    strokeWidth={1.5}
                    className="fill-[#B5685A]"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardWishlist;
