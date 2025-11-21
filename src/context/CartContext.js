'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // --- BUYER STATE ---
  const [cart, setCart] = useState([]);
  
  // --- SELLER STATE ---
  const [pasaBag, setPasaBag] = useState([]);
  
  // --- UI STATE ---
  const [viewMode, setViewMode] = useState('buyer'); // 'buyer' or 'seller'

  // Load data from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('pasaCart');
    const savedBag = localStorage.getItem('pasaBag');
    const savedMode = localStorage.getItem('pasaViewMode');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedBag) setPasaBag(JSON.parse(savedBag));
    if (savedMode) setViewMode(savedMode);
  }, []);

  // Save data to local storage
  useEffect(() => { localStorage.setItem('pasaCart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('pasaBag', JSON.stringify(pasaBag)); }, [pasaBag]);
  useEffect(() => { localStorage.setItem('pasaViewMode', viewMode); }, [viewMode]);

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
    alert(`Added ${product.title} to Buyer Cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  // --- SELLER ACTIONS ---
  const addToBag = (product) => {
    // Sellers usually just add 1 instance of a request to fulfill, but logic can be same
    setPasaBag((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev; // Prevent duplicate fulfillment of same item ID for MVP
      return [...prev, { ...product, quantity: 1 }];
    });
    alert(`Added ${product.title} to Pasa Bag (Fulfillment)!`);
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
        cart, addToCart, removeFromCart, clearCart,
        pasaBag, addToBag, removeFromBag, clearBag,
        viewMode, setViewMode, toggleViewMode
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}