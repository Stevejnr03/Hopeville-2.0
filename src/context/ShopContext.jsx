import { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();

function getCartKey(userId) {
  return userId ? `hopeville_cart_${userId}` : "hopeville_cart_guest";
}

function getWishlistKey(userId) {
  return userId ? `hopeville_wishlist_${userId}` : "hopeville_wishlist_guest";
}

function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage write failed:", e);
  }
}

export function ShopProvider({ children }) {
  // userId from localStorage token — available immediately
  const [userId, setUserId] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.exp * 1000 > Date.now() ? decoded.id : null;
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState(() => loadFromStorage(getCartKey(userId)));
  const [wishlist, setWishlist] = useState(() => loadFromStorage(getWishlistKey(userId)));

  // When userId changes (login/logout), load that user's cart
  useEffect(() => {
    setCart(loadFromStorage(getCartKey(userId)));
    setWishlist(loadFromStorage(getWishlistKey(userId)));
  }, [userId]);

  // Save cart whenever it changes
  useEffect(() => {
    saveToStorage(getCartKey(userId), cart);
  }, [cart, userId]);

  // Save wishlist whenever it changes
  useEffect(() => {
    saveToStorage(getWishlistKey(userId), wishlist);
  }, [wishlist, userId]);

  // Listen for login/logout events
  useEffect(() => {
    function handleStorageChange() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUserId(null);
          return;
        }
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const newId = decoded.exp * 1000 > Date.now() ? decoded.id : null;
        setUserId(prev => prev !== newId ? newId : prev);
      } catch {
        setUserId(null);
      }
    }

    window.addEventListener("storage", handleStorageChange);
    // Also poll for token changes within same tab
    const interval = setInterval(() => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUserId(prev => prev !== null ? null : prev);
          return;
        }
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const newId = decoded.exp * 1000 > Date.now() ? decoded.id : null;
        setUserId(prev => prev !== newId ? newId : prev);
      } catch {
        setUserId(prev => prev !== null ? null : prev);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  function addToCart(product, selectedColor, selectedLens) {
    if (!product?.id) {
      console.error("addToCart: invalid product", product);
      return;
    }
    const normalized = { ...product, price: Number(product.price) };
    setCart(prev => {
      const exists = prev.find(
        i => i.id === normalized.id &&
             i.selectedColor === selectedColor &&
             i.selectedLens === selectedLens
      );
      if (exists) {
        return prev.map(i =>
          i.id === normalized.id &&
          i.selectedColor === selectedColor &&
          i.selectedLens === selectedLens
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...normalized, selectedColor, selectedLens, quantity: 1 }];
    });
  }

  function removeFromCart(id, selectedColor, selectedLens) {
    setCart(prev => prev.filter(
      i => !(i.id === id &&
             i.selectedColor === selectedColor &&
             i.selectedLens === selectedLens)
    ));
  }

  function updateQuantity(id, selectedColor, selectedLens, quantity) {
    if (quantity < 1) {
      removeFromCart(id, selectedColor, selectedLens);
      return;
    }
    setCart(prev => prev.map(i =>
      i.id === id &&
      i.selectedColor === selectedColor &&
      i.selectedLens === selectedLens
        ? { ...i, quantity }
        : i
    ));
  }

  function clearCart() {
    setCart([]);
    saveToStorage(getCartKey(userId), []);
  }

  function addToWishlist(product) {
    if (!product?.id) return;
    setWishlist(prev => {
      if (prev.find(i => i.id === product.id)) return prev;
      return [...prev, { ...product, price: Number(product.price) }];
    });
  }

  function removeFromWishlist(id) {
    setWishlist(prev => prev.filter(i => i.id !== id));
  }

  function isInWishlist(id) { return wishlist.some(i => i.id === id); }
  function isInCart(id) { return cart.some(i => i.id === id); }

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const cartSubtotal = cart.reduce((acc, i) => acc + Number(i.price) * i.quantity, 0);
  const deliveryFee = cartSubtotal > 0 ? 5000 : 0;
  const cartTotal = cartSubtotal + deliveryFee;

  return (
    <ShopContext.Provider value={{
      cart, wishlist, userId,
      addToCart, removeFromCart, updateQuantity, clearCart,
      addToWishlist, removeFromWishlist, isInWishlist, isInCart,
      cartCount, cartSubtotal, deliveryFee, cartTotal,
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
