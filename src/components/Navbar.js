'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContext'; 
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false); 
  const [isSellerMode, setIsSellerMode] = useState(false); 
  const { cart } = useCart(); 
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setIsSeller(data.isSeller);
            setIsSellerMode(data.isSeller); 
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const toggleMode = () => {
    setIsSellerMode(!isSellerMode);
  };

  // Determine Count to show
  const itemCount = isSellerMode ? 0 : cart.length; // Bag logic handled differently or add pasaBag.length if you want

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, zIndex: 50, padding: '0.8rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0070f3', letterSpacing: '-0.5px' }}>
          📦 Pasa.ph
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '20px', fontWeight: '500', color: '#666', fontSize: '0.9rem', alignItems: 'center' }}>
            
            {/* CONDITIONAL LINKS BASED ON MODE */}
            {isSellerMode ? (
                // SELLER MODE LINKS
                <>
                    <Link href="/products" style={{ color: '#333', fontWeight: 'bold' }}>Products</Link>
                    <Link href="/seller-dashboard" style={{ color: '#0070f3', fontWeight: 'bold' }}>Dashboard</Link>
                </>
            ) : (
                // BUYER MODE LINKS
                <>
                    <div 
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setIsShopHovered(true)}
                        onMouseLeave={() => setIsShopHovered(false)}
                    >
                        <Link href="/shop" style={{ padding: '10px 0', display: 'block' }}>
                            Shop ▾
                        </Link>
                        {isShopHovered && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '150px', padding: '10px 0', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
                                <Link href="/shop" style={{ padding: '8px 15px', color: '#333', fontSize: '0.9rem', fontWeight: 'bold' }}>All Items</Link>
                                <Link href="/shop?category=Food" style={{ padding: '8px 15px', color: '#666', fontSize: '0.9rem' }}>Food</Link>
                                <Link href="/shop?category=Beauty" style={{ padding: '8px 15px', color: '#666', fontSize: '0.9rem' }}>Beauty</Link>
                                <Link href="/shop?category=Electronics" style={{ padding: '8px 15px', color: '#666', fontSize: '0.9rem' }}>Electronics</Link>
                            </div>
                        )}
                    </div>

                    <Link href="/offers">Sellers</Link>
                    <Link href="/start-selling" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Start Selling</Link>
                </>
            )}

            <Link href="/how-it-works">How it Works</Link>
            <Link href="/support">Support</Link>
            
            {/* DYNAMIC CART/BAG ICON */}
            <Link href="/cart" style={{ position: 'relative', fontSize: '1.2rem' }}>
                {isSellerMode ? '🛍️' : '🛒'} 
                {itemCount > 0 && (
                    <span style={{ position: 'absolute', top: '-5px', right: '-10px', background: 'red', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                        {itemCount}
                    </span>
                )}
            </Link>
          </div>
          
          {/* PROFILE DROPDOWN */}
          {user ? (
            <div style={{ position: 'relative' }} onMouseEnter={() => setIsProfileHovered(true)} onMouseLeave={() => setIsProfileHovered(false)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <img src={user.photoURL || "https://placehold.co/32x32?text=U"} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #eaeaea', objectFit: 'cover' }} />
                </div>
                {isProfileHovered && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, background: 'white', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '200px', padding: '10px 0', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
                        <Link href="/profile" style={{ padding: '10px 15px', color: '#333', fontSize: '0.9rem', fontWeight: 'bold' }}>My Profile</Link>
                        
                        {/* SWITCH MODE OPTION */}
                        {isSeller && (
                            <button 
                                onClick={toggleMode}
                                style={{ background: 'none', border: 'none', padding: '10px 15px', textAlign: 'left', cursor: 'pointer', color: '#0070f3', fontSize: '0.9rem', borderTop: '1px solid #eee', width: '100%' }}
                            >
                                {isSellerMode ? 'Switch to Buying' : 'Switch to Selling'}
                            </button>
                        )}
                        
                        <div style={{ borderTop: '1px solid #eee', margin: '5px 0' }}></div>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', padding: '10px 15px', textAlign: 'left', cursor: 'pointer', color: 'red', fontSize: '0.9rem', width: '100%' }}>Logout</button>
                    </div>
                )}
            </div>
          ) : (
            <button onClick={handleLogin} className="btn-login">Login</button>
          )}
        </div>
      </div>
    </nav>
  );
}