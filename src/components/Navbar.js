'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContext'; 
// FIX: Added 'signOut' to the imports list
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'; 
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isSellerAccount, setIsSellerAccount] = useState(false);
  const { cart, pasaBag, viewMode, toggleViewMode } = useCart();
  const isSellerMode = viewMode === 'seller';
  const router = useRouter();

  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Notifications data (can be populated with real data from Firebase later)
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter(n => n.unread).length;

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
      } else {
        setIsSellerAccount(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-dropdown')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    await signOut(auth); 
    router.push('/');
  };

  const toggleMode = () => {
    const newMode = viewMode === 'buyer' ? 'seller' : 'buyer';

    // Save to localStorage first
    localStorage.setItem('pasaViewMode', newMode);

    // Force full page reload to the appropriate page
    if (newMode === 'buyer') {
      window.location.replace('/');
    } else {
      window.location.replace('/seller-dashboard');
    }
  };

  const itemCount = (!user || !isSellerMode) ? cart.length : pasaBag.length;

  return (
    <nav style={{
      background: isScrolled ? 'white' : 'rgba(255,255,255,0.95)',
      borderBottom: '1px solid #eaeaea',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: 'clamp(0.6rem, 2vw, 0.8rem) 0',
      boxShadow: isScrolled ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <Link href="/" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: '800', color: '#0070f3', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          📦 Pasa.ph
          <span style={{
            background: '#2e7d32',
            color: 'white',
            fontSize: '0.5rem',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            ✓ Verified
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '8px' }}
          className="mobile-menu-btn"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 20px)' }} className="desktop-nav">

          <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 20px)', fontWeight: '500', color: '#666', fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', alignItems: 'center' }}>
            
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
                                    <Link href="/shop?country=Singapore" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇸🇬 Singapore</Link>
                                    <Link href="/shop?country=Hong Kong" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇭🇰 Hong Kong</Link>
                                    <Link href="/shop?country=Vietnam" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇻🇳 Vietnam</Link>
                                </div>

                            </div>
                        )}
                    </div>
                    <Link href="/offers">Sellers</Link>
                    <Link href="/how-it-works">How it Works</Link>
                    <Link href="/support">Support</Link>
                    {/* CHANGED: Link directly to /start-selling instead of login */}
                    <Link href="/start-selling" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Start Selling</Link>
                </>
            ) : (
                /* --- LOGGED IN STATE (ROLE BASED) --- */
                <>
                    {isSellerMode ? (
                        // Seller Mode (Already a seller, hide Start Selling)
                        <>
                            <Link href="/products" style={{ color: '#333', fontWeight: 'bold' }}>Marketplace</Link>
                            <Link href="/buyers">Buyers</Link>
                            <Link href="/seller-dashboard" style={{ color: '#0070f3', fontWeight: 'bold' }}>Dashboard</Link>
                            <Link href="/support">Support</Link>
                        </>
                    ) : (
                        // Buyer Mode (Check if they are a seller account or not)
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
                                        <div><div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Categories</div><Link href="/shop" style={{ display:'block', padding: '4px 0', color: '#333', fontSize: '0.9rem', fontWeight: 'bold' }}>All Items</Link><Link href="/shop?category=Food" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>Food</Link><Link href="/shop?category=Beauty" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>Beauty</Link><Link href="/shop?category=Electronics" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>Electronics</Link></div>
                                        <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}><div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Shop by Country</div><Link href="/shop?country=Philippines" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇵🇭 Philippines (Local)</Link><Link href="/shop?country=Japan" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇯🇵 Japan</Link><Link href="/shop?country=USA" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇺🇸 USA</Link><Link href="/shop?country=South Korea" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇰🇷 Korea</Link><Link href="/shop?country=Singapore" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇸🇬 Singapore</Link><Link href="/shop?country=Hong Kong" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇭🇰 Hong Kong</Link><Link href="/shop?country=Vietnam" style={{ display:'block', padding: '4px 0', color: '#666', fontSize: '0.9rem' }}>🇻🇳 Vietnam</Link></div>
                                    </div>
                                )}
                            </div>
                            
                            <Link href="/offers">Sellers</Link>
                            <Link href="/how-it-works">How it Works</Link>
                            <Link href="/support">Support</Link>
                            
                            {/* NEW BUYER DASHBOARD LINK */}
                            <Link href="/buyer-dashboard" style={{ color: '#0070f3', fontWeight: 'bold' }}>Dashboard</Link>
                            
                            {/* Start Selling link only visible if account exists but IS NOT a seller */}
                            {!isSellerAccount && (
                                <Link href="/start-selling" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Start Selling</Link>
                            )}
                        </>
                    )}
                </>
            )}

            {/* NOTIFICATION BELL ICON */}
            {user && (
              <div
                style={{ position: 'relative' }}
                className="notifications-dropdown"
              >
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    fontSize: '1.2rem',
                    padding: '5px'
                  }}
                >
                  🔔
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '3px',
                      right: '3px',
                      background: '#ff4d4f',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: '2px solid white'
                    }}></span>
                  )}
                </button>

                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: 'white',
                    border: '1px solid #eaeaea',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    width: '320px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: 100,
                    marginTop: '8px'
                  }}>
                    <div style={{
                      padding: '12px 15px',
                      borderBottom: '1px solid #eee',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span style={{
                          background: '#ff4d4f',
                          color: 'white',
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          fontWeight: 'bold'
                        }}>
                          {unreadCount} new
                        </span>
                      )}
                    </div>

                    {notifications.length > 0 ? (
                      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            onClick={() => {
                              // Mark as read when clicked
                              setNotifications(notifications.map(n =>
                                n.id === notification.id ? { ...n, unread: false } : n
                              ));
                            }}
                            style={{
                              padding: '12px 15px',
                              borderBottom: '1px solid #f5f5f5',
                              cursor: 'pointer',
                              background: notification.unread ? '#f0f8ff' : 'white',
                              transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f9f9f9'}
                            onMouseOut={(e) => e.currentTarget.style.background = notification.unread ? '#f0f8ff' : 'white'}
                          >
                            <div style={{
                              fontSize: '0.85rem',
                              color: '#333',
                              marginBottom: '4px',
                              fontWeight: notification.unread ? '600' : 'normal'
                            }}>
                              {notification.message}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#999'
                            }}>
                              {notification.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: '#999',
                        fontSize: '0.9rem'
                      }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔕</div>
                        <div>No notifications</div>
                      </div>
                    )}

                    {notifications.length > 0 && (
                      <div style={{
                        padding: '10px 15px',
                        borderTop: '1px solid #eee',
                        textAlign: 'center'
                      }}>
                        <button
                          onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#0070f3',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            padding: '5px'
                          }}
                        >
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            borderBottom: '1px solid #eaeaea',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '20px',
            display: 'none'
          }} className="mobile-nav">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '1rem' }}>
              {!user ? (
                <>
                  <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>Shop</Link>
                  <Link href="/offers" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>Sellers</Link>
                  <Link href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>How it Works</Link>
                  <Link href="/support" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>Support</Link>
                  <Link href="/start-selling" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', color: '#2e7d32', fontWeight: 'bold', borderBottom: '1px solid #f0f0f0' }}>Start Selling</Link>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary" style={{ marginTop: '10px', textAlign: 'center' }}>Login</Link>
                </>
              ) : isSellerMode ? (
                <>
                  <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>Marketplace</Link>
                  <Link href="/buyers" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>Buyers</Link>
                  <Link href="/seller-dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', color: '#0070f3', fontWeight: 'bold', borderBottom: '1px solid #f0f0f0' }}>Dashboard</Link>
                  <Link href="/support" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>Support</Link>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>My Profile</Link>
                  {isSellerAccount && (
                    <button onClick={() => { toggleMode(); setIsMobileMenuOpen(false); }} style={{ padding: '10px 0', textAlign: 'left', background: 'none', border: 'none', color: '#0070f3', fontSize: '1rem', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>
                      Switch to Buying
                    </button>
                  )}
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} style={{ padding: '10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>Shop</Link>
                  <Link href="/offers" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>Sellers</Link>
                  <Link href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>How it Works</Link>
                  <Link href="/support" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>Support</Link>
                  <Link href="/buyer-dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', color: '#0070f3', fontWeight: 'bold', borderBottom: '1px solid #f0f0f0' }}>Dashboard</Link>
                  {!isSellerAccount && (
                    <Link href="/start-selling" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', color: '#2e7d32', fontWeight: 'bold', borderBottom: '1px solid #f0f0f0' }}>Start Selling</Link>
                  )}
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>My Profile</Link>
                  {isSellerAccount && (
                    <button onClick={() => { toggleMode(); setIsMobileMenuOpen(false); }} style={{ padding: '10px 0', textAlign: 'left', background: 'none', border: 'none', color: '#0070f3', fontSize: '1rem', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>
                      Switch to Selling
                    </button>
                  )}
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} style={{ padding: '10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CSS for responsive navbar */}
      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-nav {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}