import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useShop } from "../context/ShopContext";

function Cart() {
  const { cart, removeFromCart, updateQuantity, cartSubtotal, deliveryFee, cartTotal } = useShop();

  if (cart.length === 0) {
    return (
      <main className="bg-white min-h-screen pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <ShoppingBag size={64} strokeWidth={0.8} className="text-[#d0d0d0] mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Your Cart is Empty
          </h1>
          <p className="text-[#888] text-base font-light mb-10">
            Looks like you haven't added anything yet.
          </p>
          <Link to="/shop"
            className="bg-[#1a1a1a] text-white px-10 py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300 inline-block"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Shop Eyewear
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f8f8f6] min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Review Your Order
          </p>
          <h1 className="text-3xl md:text-4xl font-light text-[#1a1a1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Shopping Cart
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map((item, index) => (
              <div key={index} className="bg-white border border-[#e8e8e8] p-6 flex gap-6">

                {/* Image */}
                <Link to={`/shop/${item.slug}`} className="shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-[#f8f8f6] flex items-center justify-center overflow-hidden">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl opacity-20">👓</span>
                    )}
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link to={`/shop/${item.slug}`}>
                        <h3 className="text-lg md:text-xl font-medium text-[#1a1a1a] hover:text-[#4A7E96] transition-colors"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-[#888] text-sm italic mt-1"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {item.variant}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-xs text-[#666] bg-[#f8f8f6] px-3 py-1 border border-[#e8e8e8]">
                          Color: {item.selectedColor}
                        </span>
                        <span className="text-xs text-[#666] bg-[#f8f8f6] px-3 py-1 border border-[#e8e8e8]">
                          Lens: {item.selectedLens}
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedLens)}
                      className="text-[#ccc] hover:text-[#B5685A] transition-colors duration-200 shrink-0">
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Price + Quantity */}
                  <div className="flex items-center justify-between mt-5">
                    {/* Quantity */}
                    <div className="flex items-center border border-[#e8e8e8]">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedLens, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-[#888] hover:text-[#1a1a1a] hover:bg-[#f8f8f6] transition-all">
                        <Minus size={14} strokeWidth={1.5} />
                      </button>
                      <span className="w-10 text-center text-sm text-[#1a1a1a] font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedLens, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-[#888] hover:text-[#1a1a1a] hover:bg-[#f8f8f6] transition-all">
                        <Plus size={14} strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Price */}
                    <p className="text-lg font-light text-[#1a1a1a]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link to="/shop"
              className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#4A7E96] hover:text-[#B5685A] transition-colors font-medium mt-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-[#e8e8e8] p-8">
              <h2 className="text-xl font-medium text-[#1a1a1a] mb-6 pb-4 border-b border-[#e8e8e8]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Order Summary
              </h2>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#666]">Subtotal</span>
                  <span className="text-sm text-[#1a1a1a] font-medium">
                    ₦{cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#666]">Delivery Fee</span>
                  <span className="text-sm text-[#1a1a1a] font-medium">
                    ₦{deliveryFee.toLocaleString()}
                  </span>
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
                className="w-full bg-[#1a1a1a] text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300 flex items-center justify-center gap-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Proceed to Checkout
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="bg-white border border-[#e8e8e8] p-6 flex flex-col gap-4">
              {[
                { label: "Secure Checkout", sub: "256-bit SSL encryption" },
                { label: "Free Returns", sub: "30-day return policy" },
                { label: "Authentic Products", sub: "100% genuine eyewear" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#4A7E96] mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">{badge.label}</p>
                    <p className="text-xs text-[#888]">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Cart;