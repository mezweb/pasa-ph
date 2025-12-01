'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // --- BUYER STATE ---
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // --- SELLER STATE ---
  const [pasaBag, setPasaBag] = useState([]);

  // --- UI STATE ---
  const [viewMode, setViewMode] = useState('buyer'); // 'buyer' or 'seller'
  const [showCartPopup, setShowCartPopup] = useState(false); // Cart popup visibility
  const [showWishlistPopup, setShowWishlistPopup] = useState(false); // Wishlist popup visibility

  // Load data from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('pasaCart');
    const savedBag = localStorage.getItem('pasaBag');
    const savedMode = localStorage.getItem('pasaViewMode');
    const savedWishlist = localStorage.getItem('pasaWishlist');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedBag) setPasaBag(JSON.parse(savedBag));
    if (savedMode) setViewMode(savedMode);
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save data to local storage
  useEffect(() => { localStorage.setItem('pasaCart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('pasaBag', JSON.stringify(pasaBag)); }, [pasaBag]);
  useEffect(() => { localStorage.setItem('pasaViewMode', viewMode); }, [viewMode]);
  useEffect(() => { localStorage.setItem('pasaWishlist', JSON.stringify(wishlist)); }, [wishlist]);

  // --- BUYER ACTIONS ---
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Show cart popup
    setShowCartPopup(true);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Don't allow quantity less than 1
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const increaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // --- WISHLIST ACTIONS ---
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev; // Already in wishlist
      setShowWishlistPopup(true);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    if (isInWishlist) {
      removeFromWishlist(product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const clearWishlist = () => setWishlist([]);

  // --- SELLER ACTIONS ---
  const addToBag = (product) => {
    // Sellers usually just add 1 instance of a request to fulfill, but logic can be same
    setPasaBag((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev; // Prevent duplicate fulfillment of same item ID for MVP
      return [...prev, { ...product, quantity: 1 }];
    });
    // Success - no alert popup
  };

  const removeFromBag = (productId) => {
    setPasaBag((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearBag = () => setPasaBag([]);

  // --- MODE ACTIONS ---
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'buyer' ? 'seller' : 'buyer'));
  };

  return (
    <CartContext.Provider value={{
        cart, addToCart, removeFromCart, updateQuantity, increaseQuantity, decreaseQuantity, clearCart,
        wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist,
        pasaBag, addToBag, removeFromBag, clearBag,
        viewMode, setViewMode, toggleViewMode,
        showCartPopup, setShowCartPopup,
        showWishlistPopup, setShowWishlistPopup
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}