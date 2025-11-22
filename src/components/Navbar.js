'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContext'; 
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isSellerAccount, setIsSellerAccount] = useState(false); 
  const { cart, pasaBag, viewMode, toggleViewMode } = useCart(); 
  const isSellerMode = viewMode === 'seller';
  const router = useRouter(); // Initialize router

  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().isSeller) {
            setIsSellerAccount(true);
        } else {
            setIsSellerAccount(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // --- CHANGED ---
  const handleLoginRedirect = () => {
    // Send user to the dedicated login page to handle authentication there.
    router.push('/login');
  };
  // ---------------
  
  const handleLogout = async () => {
    await signOut(auth);
  };

  const itemCount = (!user || !isSellerMode) ? cart.length : pasaBag.length;

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, zIndex: 50, padding: '0.8rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0070f3', letterSpacing: '-0.5px' }}>
          📦 Pasa.ph
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '20px', fontWeight: '500', color: '#666', fontSize: '0.9rem', alignItems: 'center' }}>
            
            {/* --- LOGGED OUT STATE (NEUTRAL) --- */}
            {!user ? (
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
                            <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '200px', padding: '15px', display: 'flex', flexDirection: 'column', zIndex: 100, gap: '15px' }}>
                                
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Categories</div>
                                    <Link href="/shop" style={{ display:'block', padding: '4px 0', color: '#333', fontSize: '0.9rem', fontWeight: 'bold' }}>All Items</Link>
                                    <Link href="/shop?category=Food" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>Food</Link>
                                    <Link href="/shop?category=Beauty" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>Beauty</Link>
                                    <Link href="/shop?category=Electronics" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>Electronics</Link>
                                </div>

                                <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Shop by Country</div>
                                    <Link href="/shop?country=Philippines" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇵🇭 Philippines (Local)</Link>
                                    <Link href="/shop?country=Japan" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇯🇵 Japan</Link>
                                    <Link href="/shop?country=USA" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇺🇸 USA</Link>
                                    <Link href="/shop?country=South Korea" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇰🇷 Korea</Link>
                                </div>

                            </div>
                        )}
                    </div>
                    <Link href="/offers">Sellers</Link>
                    <Link href="/how-it-works">How it Works</Link>
                    <Link href="/support">Support</Link>
                </>
            ) : (
                /* --- LOGGED IN STATE (ROLE BASED) --- */
                <>
                    {isSellerMode ? (
                        // Seller Mode
                        <>
                            <Link href="/products" style={{ color: '#333', fontWeight: 'bold' }}>Marketplace</Link>
                            <Link href="/buyers">Buyers</Link>
                            <Link href="/seller-dashboard" style={{ color: '#0070f3', fontWeight: 'bold' }}>Dashboard</Link>
                        </>
                    ) : (
                        // Buyer Mode
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
                                    <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '200px', padding: '15px', display: 'flex', flexDirection: 'column', zIndex: 100, gap: '15px' }}>
                                
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Categories</div>
                                            <Link href="/shop" style={{ display:'block', padding: '4px 0', color: '#333', fontSize: '0.9rem', fontWeight: 'bold' }}>All Items</Link>
                                            <Link href="/shop?category=Food" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>Food</Link>
                                            <Link href="/shop?category=Beauty" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>Beauty</Link>
                                            <Link href="/shop?category=Electronics" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>Electronics</Link>
                                        </div>

                                        <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Shop by Country</div>
                                            <Link href="/shop?country=Philippines" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇵🇭 Philippines (Local)</Link>
                                            <Link href="/shop?country=Japan" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇯🇵 Japan</Link>
                                            <Link href="/shop?country=USA" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇺🇸 USA</Link>
                                            <Link href="/shop?country=South Korea" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇰🇷 Korea</Link>
                                        </div>

                                    </div>
                                )}
                            </div>
                            
                            <Link href="/offers">Sellers</Link>
                            <Link href="/how-it-works">How it Works</Link>
                            
                            {/* NEW BUYER DASHBOARD LINK */}
                            <Link href="/buyer-dashboard" style={{ color: '#0070f3', fontWeight: 'bold' }}>Dashboard</Link>
                            
                            {/* Start Selling link only visible if account exists but IS NOT a seller */}
                            {!isSellerAccount && user && (
                                <Link href="/start-selling" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Start Selling</Link>
                            )}
                            <Link href="/support">Support</Link>
                        </>
                    )}
                </>
            )}
            
            {/* CART ICON */}
            <Link href="/cart" style={{ position: 'relative', fontSize: '1.2rem' }}>
                {isSellerMode && user ? '🛍️' : '🛒'} 
                {itemCount > 0 && (
                    <span style={{ position: 'absolute', top: '-5px', right: '-10px', background: 'red', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                        {itemCount}
                    </span>
                )}
            </Link>
          </div>
          
          {/* AUTH BUTTONS */}
          {user ? (
            <div style={{ position: 'relative' }} onMouseEnter={() => setIsProfileHovered(true)} onMouseLeave={() => setIsProfileHovered(false)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <img src={user.photoURL || "https://placehold.co/32x32?text=U"} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #eaeaea', objectFit: 'cover' }} />
                </div>
                {isProfileHovered && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, background: 'white', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '200px', padding: '10px 0', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
                        <Link href="/profile" style={{ padding: '10px 15px', color: '#333', fontSize: '0.9rem', fontWeight: 'bold' }}>My Profile</Link>
                        
                        {isSellerAccount && (
                            <button 
                                onClick={toggleViewMode}
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
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleLoginRedirect} style={{ background: 'none', border: 'none', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '600' }}>
                    Login
                </button>
                <Link href="/signup" className="btn-login" style={{ textDecoration: 'none' }}>
                    Sign Up
                </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}