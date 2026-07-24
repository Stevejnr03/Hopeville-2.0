import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { useShop } from "../../context/ShopContext";

function DashboardCart() {
  const { cart, removeFromCart, updateQuantity, cartSubtotal, deliveryFee, cartTotal } = useShop();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            My Cart
          </p>
          <h1 className="text-3xl font-light text-[#1a1a1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Shopping Cart
          </h1>
        </div>
        <div className="bg-white border border-[#e8e8e8] p-16 text-center">
          <ShoppingCart size={48} strokeWidth={0.8} className="text-[#d0d0d0] mx-auto mb-5" />
          <h2 className="text-2xl font-light text-[#1a1a1a] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Your Cart is Empty
          </h2>
          <p className="text-[#888] text-sm font-light mb-8">
            Browse our collection and add items you love.
          </p>
          <Link to="/shop"
            className="bg-[#1a1a1a] text-white px-10 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300 inline-block"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Shop Eyewear
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-1"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          My Cart
        </p>
        <h1 className="text-3xl font-light text-[#1a1a1a]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Shopping Cart
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">

        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map((item, index) => (
            <div key={index} className="bg-white border border-[#e8e8e8] p-5 flex gap-5">
              <Link to={`/shop/${item.slug}`} className="shrink-0">
                <div className="w-20 h-20 bg-[#f8f8f6] flex items-center justify-center overflow-hidden">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl opacity-20">👓</span>
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/shop/${item.slug}`}>
                      <h3 className="text-base font-medium text-[#1a1a1a] hover:text-[#4A7E96] transition-colors"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#888] italic mt-0.5">{item.variant}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs text-[#666] bg-[#f8f8f6] px-2 py-0.5 border border-[#e8e8e8]">
                        {item.selectedColor}
                      </span>
                      <span className="text-xs text-[#666] bg-[#f8f8f6] px-2 py-0.5 border border-[#e8e8e8]">
                        {item.selectedLens}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedLens)}
                    className="text-[#ccc] hover:text-[#B5685A] transition-colors shrink-0">
                    <Trash2 size={15} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-[#e8e8e8]">
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedLens, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-[#1a1a1a] hover:bg-[#f8f8f6] transition-all">
                      <Minus size={12} strokeWidth={1.5} />
                    </button>
                    <span className="w-8 text-center text-sm text-[#1a1a1a]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedLens, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-[#1a1a1a] hover:bg-[#f8f8f6] transition-all">
                      <Plus size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                  <p className="text-base font-light text-[#1a1a1a]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <Link to="/shop"
            className="text-xs tracking-[0.15em] uppercase text-[#4A7E96] hover:text-[#B5685A] transition-colors font-medium"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            ← Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="bg-white border border-[#e8e8e8] p-6">
          <h2 className="text-lg font-medium text-[#1a1a1a] mb-5 pb-4 border-b border-[#e8e8e8]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Order Summary
          </h2>
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#666]">Subtotal</span>
              <span className="text-sm text-[#1a1a1a]">₦{cartSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#666]">Delivery Fee</span>
              <span className="text-sm text-[#1a1a1a]">₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="h-[1px] bg-[#e8e8e8]" />
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-[#1a1a1a]">Total</span>
              <span className="text-xl font-light text-[#1a1a1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                ₦{cartTotal.toLocaleString()}
              </span>
            </div>
          </div>
          <Link to="/checkout"
            className="w-full bg-[#1a1a1a] text-white py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300 flex items-center justify-center gap-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Checkout
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardCart;