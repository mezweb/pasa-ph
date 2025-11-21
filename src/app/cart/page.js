'use client';

import { useCart } from '../../context/CartContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { auth, db } from '../../lib/firebase'; 
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, pasaBag, removeFromBag, clearBag, viewMode } = useCart();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  
  const isSellerMode = viewMode === 'seller';
  const currentList = isSellerMode ? pasaBag : cart;
  const removeFunc = isSellerMode ? removeFromBag : removeFromCart;
  const clearFunc = isSellerMode ? clearBag : clearCart;

  const total = currentList.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!user) {
        alert("Please login to checkout.");
        router.push('/login');
        return;
    }

    if (isSellerMode) {
        alert("Items confirmed for fulfillment! Buyers will be notified.");
        clearFunc();
    } else {
        if(!confirm(`Confirm order for ₱${total}? (Simulated Payment)`)) return;

        try {
            const promises = currentList.map(item => {
                return addDoc(collection(db, "requests"), {
                    title: item.title,
                    category: item.category || 'General',
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image || item.images?.[0] || '',
                    from: item.from || 'General',
                    to: 'Manila',
                    userId: user.uid,
                    userName: user.displayName,
                    userPhoto: user.photoURL,
                    status: 'Shipped', // MOCK: Set to Shipped so tracking UI is visible
                    createdAt: serverTimestamp()
                });
            });

            await Promise.all(promises);
            
            alert("Order placed successfully! Check your Dashboard.");
            clearFunc();
            router.push('/buyer-dashboard');

        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '60px 20px', maxWidth: '800px', minHeight: '70vh' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <span style={{ fontSize: '2rem' }}>{isSellerMode ? '🛍️' : '🛒'}</span>
            <h1 style={{ margin: 0 }}>{isSellerMode ? 'My Pasa Bag (Fulfillment List)' : 'Shopping Cart'}</h1>
        </div>

        {isSellerMode && (
            <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#0070f3', fontSize: '0.9rem' }}>
                ℹ️ These are items you have agreed to buy for others. Confirming this list notifies the buyers.
            </div>
        )}

        {currentList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', background: '#f9f9f9', borderRadius: '12px' }}>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    {isSellerMode ? 'Your bag is empty. Browse requests to fill it up!' : 'Your cart is empty.'}
                </p>
                <Link href={isSellerMode ? "/products" : "/"} className="btn-primary">
                    {isSellerMode ? 'Find Products to Sell' : 'Go Shopping'}
                </Link>
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {currentList.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={item.image || item.images?.[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                                {isSellerMode ? (
                                    <div style={{ fontSize: '0.9rem', color: '#2e7d32' }}>Earnings: ₱{(item.price * 0.15).toFixed(0)} (Service Fee)</div>
                                ) : (
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>₱{item.price} x {item.quantity}</div>
                                )}
                            </div>
                        </div>
                        <button onClick={() => removeFunc(item.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                    </div>
                ))}

                <div style={{ marginTop: '20px', padding: '20px', background: '#f0f9ff', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {isSellerMode ? 'Total Potential Earnings:' : 'Total:'} 
                        <span style={{ color: '#0070f3', marginLeft: '10px' }}>
                            ₱{isSellerMode ? (total * 0.15).toFixed(0) : total}
                        </span>
                    </div>
                    <button onClick={handleCheckout} className="btn-primary">
                        {isSellerMode ? 'Confirm Fulfillment' : 'Checkout'}
                    </button>
                </div>
            </div>
        )}
      </div>
      <Footer />
    </>
  );
}