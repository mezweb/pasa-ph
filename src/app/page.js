'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { POPULAR_PRODUCTS } from '../lib/products';
import { POPULAR_SELLERS } from '../lib/sellers';
import { useCart } from '../context/CartContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

// Country data with flags
const COUNTRY_DATA = {
  'Philippines': { flag: '🇵🇭' },
  'Japan': { flag: '🇯🇵' },
  'USA': { flag: '🇺🇸' },
  'South Korea': { flag: '🇰🇷' },
  'Singapore': { flag: '🇸🇬' },
  'Hong Kong': { flag: '🇭🇰' },
  'Vietnam': { flag: '🇻🇳' }
};

// Popular search suggestions with trending badges
const SEARCH_SUGGESTIONS = [
  { term: 'Chocolates', category: 'Food', trending: true },
  { term: 'iPhone', category: 'Electronics', trending: true },
  { term: 'Glossier', category: 'Beauty', trending: false },
  { term: 'Skincare', category: 'Beauty', trending: true },
  { term: 'Snacks', category: 'Food', trending: false },
  { term: 'Tokyo Banana', category: 'Food', trending: false },
  { term: 'Melano CC', category: 'Beauty', trending: true },
  { term: 'Korean Beauty', category: 'Beauty', trending: false },
  { term: 'Office Snacks', category: 'Food', trending: false },
  { term: 'Pasalubong', category: 'Food', trending: false }
];

// Pasalubong Collections
const PASALUBONG_COLLECTIONS = [
  { id: 'office', name: 'Office Snacks', emoji: '🏢', description: 'Perfect for sharing at work' },
  { id: 'skincare', name: 'Skincare Haul', emoji: '✨', description: 'K-Beauty & J-Beauty essentials' },
  { id: 'gifts', name: 'Gift Sets', emoji: '🎁', description: 'Ready-to-give presents' },
  { id: 'foodie', name: 'Foodie Favorites', emoji: '🍜', description: 'Must-try international treats' }
];

export default function Home() {
  const [category, setCategory] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All'); // New Country Filter State
  const [sellerCategory, setSellerCategory] = useState('All');
  const { addToCart, viewMode } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('items'); // 'items' or 'travelers'
  const [activeCollection, setActiveCollection] = useState('viral'); // 'viral', 'preorder', 'onhand'
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [arrivalFilter, setArrivalFilter] = useState('all'); // 'all', 'week', 'month'
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all', 'pasabuy', 'onhand'
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);

  // --- CHECK AUTH STATUS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // --- PERSISTENT REDIRECT LOGIC ---
  useEffect(() => {
    if (isLoggedIn && viewMode === 'seller') {
        router.push('/seller-dashboard');
    }
  }, [viewMode, router, isLoggedIn]);
  // ---------------------------------

  // --- SCROLL EFFECT FOR NAVBAR ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- LOAD RECENT SEARCHES FROM LOCALSTORAGE ---
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Auto-suggest matching
  const suggestions = searchQuery.length > 0
    ? SEARCH_SUGGESTIONS.filter(s => s.term.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  // Handle search submission
  const handleSearch = (term) => {
    setSearchQuery(term);
    setShowSuggestions(false);
    setShowRecentSearches(false);

    // Add to recent searches
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    if (searchMode === 'travelers') {
      router.push('/offers');
    } else {
      document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'});
    }
  };

  // Save search for alerts
  const saveSearch = () => {
    if (!searchQuery) return;
    const newSearch = { term: searchQuery, savedAt: new Date().toISOString() };
    const updated = [newSearch, ...savedSearches].slice(0, 10);
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
    alert(`You'll be notified when new "${searchQuery}" items are available!`);
  };

  // Filter Products (Category + Country + Search + Arrival + Availability)
  const filteredProducts = POPULAR_PRODUCTS.filter(p => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesCountry = countryFilter === 'All' || p.from === countryFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.from.toLowerCase().includes(searchQuery.toLowerCase());

    // Arrival date filter (based on estimated delivery)
    const matchesArrival = arrivalFilter === 'all' ||
      (arrivalFilter === 'week' && p.estimatedDelivery.includes('Days') && parseInt(p.estimatedDelivery) <= 7) ||
      (arrivalFilter === 'month' && p.estimatedDelivery.includes('Days'));

    // Availability filter (simulate pasabuy vs on-hand)
    const matchesAvailability = availabilityFilter === 'all' ||
      (availabilityFilter === 'onhand' && p.sellers > 10) || // More sellers = likely on-hand
      (availabilityFilter === 'pasabuy' && p.sellers <= 10); // Fewer sellers = pre-order/pasabuy

    return matchesCategory && matchesCountry && matchesSearch && matchesArrival && matchesAvailability;
  });

  const displayedProducts = filteredProducts.slice(0, 8);
  const totalResults = filteredProducts.length; 

  const filteredSellers = sellerCategory === 'All' ? POPULAR_SELLERS : POPULAR_SELLERS.filter(s => s.countries.includes(sellerCategory));

  if (isLoggedIn && viewMode === 'seller') return null;

  return (
    <>
      <Navbar />
      
      {/* --- HERO BANNER --- */}
      <div style={{
        minHeight: 'clamp(250px, 40vh, 350px)',
        background: 'linear-gradient(135deg, #0070f3 0%, #0051cc 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: 'clamp(30px, 8vw, 60px) 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: '900',
          marginBottom: 'clamp(10px, 2vh, 15px)',
          lineHeight: 1.2
        }}>
          Shop the World, Delivered by Travelers
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
          marginBottom: 'clamp(20px, 4vh, 30px)',
          opacity: 0.95,
          maxWidth: '700px',
          lineHeight: 1.5
        }}>
          Get your favorite items from around the world at better prices—brought to the Philippines by trusted travelers.
        </p>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => document.getElementById('shop').scrollIntoView({behavior: 'smooth'})}
            style={{
              padding: 'clamp(12px, 2vh, 15px) clamp(28px, 5vw, 40px)',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
              fontWeight: 'bold',
              borderRadius: '30px',
              border: 'none',
              background: 'white',
              color: '#0070f3',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            🛍️ Shop Items
          </button>
          <button
            onClick={() => router.push('/start-selling')}
            style={{
              padding: 'clamp(12px, 2vh, 15px) clamp(28px, 5vw, 40px)',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
              fontWeight: 'bold',
              borderRadius: '30px',
              border: '2px solid white',
              background: 'transparent',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.2s, background 0.2s',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ✈️ Post a Trip
          </button>
          <button
            onClick={() => setShowVideoModal(true)}
            style={{
              padding: 'clamp(10px, 2vh, 12px) clamp(20px, 4vw, 28px)',
              fontSize: 'clamp(0.85rem, 2.2vw, 1rem)',
              fontWeight: '600',
              borderRadius: '30px',
              border: '1px solid rgba(255,255,255,0.5)',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              cursor: 'pointer',
              transition: 'background 0.2s',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            }}
          >
            ▶️ How It Works
          </button>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {showVideoModal && (
        <div
          onClick={() => setShowVideoModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '800px',
              width: '100%',
              padding: '30px',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
            <h2 style={{ marginBottom: '20px', fontSize: '1.8rem', fontWeight: '800' }}>How Pasa.ph Works</h2>
            <div style={{ aspectRatio: '16/9', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', color: '#999' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎥</div>
                <div style={{ fontSize: '1rem' }}>Video Coming Soon</div>
                <div style={{ fontSize: '0.85rem', marginTop: '5px' }}>Watch how travelers deliver items worldwide</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', fontSize: '0.85rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📝</div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>1. Request</div>
                <div style={{ color: '#666' }}>Post what you need</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✈️</div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>2. Match</div>
                <div style={{ color: '#666' }}>Get matched with travelers</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>3. Receive</div>
                <div style={{ color: '#666' }}>Delivered to your door</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE TRAVELER TICKER */}
      <div style={{ background: '#fff3cd', borderBottom: '1px solid #ffc107', padding: '12px 20px', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>✈️</span>
            <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#856404' }}>
              5 travelers arriving from Japan this week
            </span>
          </div>
          <div style={{ height: '20px', width: '1px', background: '#ffc107' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🇺🇸</span>
            <span style={{ fontSize: '0.85rem', color: '#856404' }}>
              3 from USA next week
            </span>
          </div>
          <div style={{ height: '20px', width: '1px', background: '#ffc107' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🇰🇷</span>
            <span style={{ fontSize: '0.85rem', color: '#856404' }}>
              8 from South Korea this month
            </span>
          </div>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div style={{ background: '#f8f9fa', padding: '40px 20px', borderBottom: '1px solid #eaeaea' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
            {/* Search Mode Toggle */}
            <div style={{ display: 'inline-flex', background: 'white', borderRadius: '30px', padding: '4px', marginBottom: '25px', border: '1px solid #ddd' }}>
                <button
                    onClick={() => setSearchMode('items')}
                    style={{
                        padding: '8px 24px',
                        borderRadius: '30px',
                        border: 'none',
                        background: searchMode === 'items' ? '#0070f3' : 'transparent',
                        color: searchMode === 'items' ? 'white' : '#666',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.9rem'
                    }}
                >
                    🛍️ Find Items
                </button>
                <button
                    onClick={() => setSearchMode('travelers')}
                    style={{
                        padding: '8px 24px',
                        borderRadius: '30px',
                        border: 'none',
                        background: searchMode === 'travelers' ? '#0070f3' : 'transparent',
                        color: searchMode === 'travelers' ? 'white' : '#666',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.9rem'
                    }}
                >
                    ✈️ Find a Traveler
                </button>
            </div>

            <h2 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: '400' }}>
                {searchMode === 'items' ? (
                    <>You're one search away from your <span style={{ fontWeight: '800' }}>favorite item</span></>
                ) : (
                    <>Find travelers coming from <span style={{ fontWeight: '800' }}>your destination</span></>
                )}
            </h2>
            <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
              <div style={{ display: 'flex', background: 'white', borderRadius: '50px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid #eaeaea' }}>
                <input
                    type="text"
                    placeholder={searchMode === 'items' ? "🇯🇵 🇺🇸 🇰🇷  Search items from Japan, USA, Korea..." : "🌍 Find travelers from Japan, USA, Singapore..."}
                    style={{ flex: 1, padding: '15px 25px', border: 'none', fontSize: '1rem', outline: 'none' }}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                      setShowRecentSearches(false);
                      if(e.target.value.length === 1) document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'});
                    }}
                    onFocus={() => {
                      if (searchQuery.length === 0 && recentSearches.length > 0) {
                        setShowRecentSearches(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowSuggestions(false);
                        setShowRecentSearches(false);
                      }, 200);
                    }}
                />
                {searchQuery && (
                  <button
                    onClick={saveSearch}
                    style={{ background: 'none', border: 'none', padding: '0 15px', color: '#0070f3', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}
                    title="Save search for alerts"
                  >
                    🔔
                  </button>
                )}
                <button
                    onClick={() => handleSearch(searchQuery)}
                    style={{ background: 'black', color: 'white', border: 'none', padding: '0 30px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    Search &rarr;
                </button>
              </div>

              {/* AUTO-SUGGEST DROPDOWN */}
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  marginTop: '8px',
                  zIndex: 100,
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {suggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSearch(sug.term)}
                      style={{
                        padding: '12px 20px',
                        borderBottom: idx < suggestions.length - 1 ? '1px solid #eee' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.95rem' }}>🔍</span>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{sug.term}</div>
                          <div style={{ fontSize: '0.75rem', color: '#999' }}>{sug.category}</div>
                        </div>
                      </div>
                      {sug.trending && (
                        <span style={{
                          background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                          color: 'white',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}>
                          🔥 Trending
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* RECENT SEARCHES DROPDOWN */}
              {showRecentSearches && recentSearches.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  marginTop: '8px',
                  zIndex: 100
                }}>
                  <div style={{ padding: '12px 20px', borderBottom: '1px solid #eee', fontWeight: 'bold', fontSize: '0.85rem', color: '#666' }}>
                    Recent Searches
                  </div>
                  {recentSearches.map((term, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSearch(term)}
                      style={{
                        padding: '12px 20px',
                        borderBottom: idx < recentSearches.length - 1 ? '1px solid #eee' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <span style={{ fontSize: '0.9rem' }}>🕐</span>
                      <span style={{ fontSize: '0.95rem' }}>{term}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                {searchMode === 'items' ? (
                    ['Food', 'Beauty', 'Electronics', 'Japan', 'USA'].map(tag => (
                        <button key={tag} onClick={() => { setCategory(tag === 'Japan' || tag === 'USA' ? 'All' : tag); setSearchQuery(tag === 'Japan' || tag === 'USA' ? tag : ''); document.getElementById('shop').scrollIntoView({behavior: 'smooth'}); }} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '20px', padding: '6px 16px', fontSize: '0.85rem', color: '#666', cursor: 'pointer', transition: '0.2s' }} onMouseOver={(e) => e.target.style.borderColor = '#000'} onMouseOut={(e) => e.target.style.borderColor = '#ddd'}>{tag}</button>
                    ))
                ) : (
                    ['Japan', 'USA', 'South Korea', 'Singapore', 'This Week'].map(tag => (
                        <button key={tag} onClick={() => router.push('/offers')} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '20px', padding: '6px 16px', fontSize: '0.85rem', color: '#666', cursor: 'pointer', transition: '0.2s' }} onMouseOver={(e) => e.target.style.borderColor = '#000'} onMouseOut={(e) => e.target.style.borderColor = '#ddd'}>{tag}</button>
                    ))
                )}
            </div>
        </div>
      </div>

      {/* SELLER ACTIVATION TEASER */}
      {!isLoggedIn && (
        <div style={{ background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', padding: '30px 20px', borderBottom: '2px solid #1b5e20' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', margin: '0 0 8px' }}>
                ✈️ Flying Soon?
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', margin: 0 }}>
                Offset your flight costs. See how much you can earn delivering items.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', padding: '12px 20px', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: '900' }}>₱5,000+</div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem' }}>Avg. per trip</div>
              </div>
              <Link href="/start-selling" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'white',
                  color: '#2e7d32',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '30px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Calculate My Earnings →
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* DEAL OF THE DAY BANNER */}
      <div style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)', padding: '20px', borderBottom: '2px solid #c92a2a' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1, minWidth: '250px' }}>
              <div style={{ fontSize: '2.5rem' }}>⚡</div>
              <div>
                <div style={{ color: 'white', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                  Deal of the Day
                </div>
                <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '800', margin: 0 }}>
                  Premium Confectionery - Only ₱75 today!
                </h3>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: '8px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '900', lineHeight: 1 }}>40%</div>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.7rem', marginTop: '2px' }}>OFF</div>
              </div>
              <Link href="/product/p1" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'white',
                  color: '#ee5a6f',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '30px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Grab Deal →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SHOP SECTION */}
      <div id="shop" className="container" style={{ padding: '40px 20px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
            
            {/* 1. CATEGORY FILTERS */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666', marginRight: '5px' }}>Category:</span>
                {['All', 'Food', 'Beauty', 'Electronics'].map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => { setCategory(cat); setSearchQuery(''); }} 
                        style={{ 
                            padding: '8px 16px', 
                            borderRadius: '20px', 
                            border: 'none', 
                            background: category === cat ? '#0070f3' : '#f0f0f0', 
                            color: category === cat ? 'white' : '#333', 
                            cursor: 'pointer', 
                            fontWeight: 'bold', 
                            whiteSpace: 'nowrap' 
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* 2. COUNTRY FILTERS (New Section) */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666', marginRight: '5px' }}>Country:</span>
                {['All', 'Philippines', 'Japan', 'USA', 'South Korea', 'Singapore', 'Hong Kong', 'Vietnam'].map(cou => (
                    <button
                        key={cou}
                        onClick={() => setCountryFilter(cou)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: '1px solid #ddd', // Outline style for secondary filters
                            background: countryFilter === cou ? '#333' : 'white',
                            color: countryFilter === cou ? 'white' : '#666',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {cou === 'All' ? 'All' : `${COUNTRY_DATA[cou]?.flag || ''} ${cou}`}
                    </button>
                ))}
            </div>

            {/* 3. ARRIVAL DATE FILTER */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666', marginRight: '5px' }}>Arrival:</span>
                {[
                  { value: 'all', label: 'All' },
                  { value: 'week', label: '< 7 Days' },
                  { value: 'month', label: 'This Month' }
                ].map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => setArrivalFilter(opt.value)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            background: arrivalFilter === opt.value ? '#ff6b6b' : 'white',
                            color: arrivalFilter === opt.value ? 'white' : '#666',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* 4. PASABUY VS ON-HAND TOGGLE */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666', marginRight: '5px' }}>Availability:</span>
                {[
                  { value: 'all', label: 'All Items', emoji: '📦' },
                  { value: 'onhand', label: 'On-Hand (No Wait)', emoji: '✅' },
                  { value: 'pasabuy', label: 'Pre-Order (Pasabuy)', emoji: '⏰' }
                ].map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => setAvailabilityFilter(opt.value)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            background: availabilityFilter === opt.value ? '#2e7d32' : 'white',
                            color: availabilityFilter === opt.value ? 'white' : '#666',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <span>{opt.emoji}</span>
                        <span>{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* RESULTS COUNT & PASALUBONG COLLECTIONS */}
        <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Results Count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ fontSize: '0.95rem', color: '#666' }}>
              Showing <span style={{ fontWeight: 'bold', color: '#333' }}>{totalResults}</span> items
              {countryFilter !== 'All' && <span> from <span style={{ fontWeight: 'bold', color: '#333' }}>{COUNTRY_DATA[countryFilter]?.flag} {countryFilter}</span></span>}
            </div>
            {/* Sort by */}
            <select
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <option value="hot">Sort by: Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="reliability">Traveler Reliability</option>
              <option value="delivery">Fastest Delivery</option>
            </select>
          </div>

          {/* Pasalubong Collections */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#666', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🎁 Pasalubong Collections
            </div>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
              {PASALUBONG_COLLECTIONS.map(col => (
                <button
                  key={col.id}
                  onClick={() => {
                    setSearchQuery(col.name);
                    document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'});
                  }}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    background: 'white',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    minWidth: '200px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#0070f3';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,112,243,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{col.emoji}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{col.name}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#999', paddingLeft: '32px' }}>
                    {col.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LOGISTICS-BASED COLLECTIONS TABS */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', borderBottom: '2px solid #eee' }}>
            <button
              onClick={() => {
                setActiveCollection('viral');
                setCountryFilter('Japan');
                setCategory('All');
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeCollection === 'viral' ? '#0070f3' : '#f5f5f5',
                color: activeCollection === 'viral' ? 'white' : '#333',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              🔥 Viral Tokyo Snacks
            </button>
            <button
              onClick={() => {
                setActiveCollection('preorder');
                setCategory('All');
                setCountryFilter('All');
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeCollection === 'preorder' ? '#0070f3' : '#f5f5f5',
                color: activeCollection === 'preorder' ? 'white' : '#333',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              ⏰ Arriving Next Week (Pre-order)
            </button>
            <button
              onClick={() => {
                setActiveCollection('onhand');
                setCategory('All');
                setCountryFilter('All');
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeCollection === 'onhand' ? '#0070f3' : '#f5f5f5',
                color: activeCollection === 'onhand' ? 'white' : '#333',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              ✅ Verified On-Hand (No Waiting)
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Collection</h3>
              <h2 style={{ margin: '5px 0 0', fontSize: '1.8rem', fontWeight: '800' }}>
                {activeCollection === 'viral' && '🔥 Viral Tokyo Snacks'}
                {activeCollection === 'preorder' && '⏰ Arriving Next Week (Pre-order)'}
                {activeCollection === 'onhand' && '✅ Verified On-Hand (No Waiting)'}
              </h2>
            </div>
            <Link href="/shop" style={{ fontSize: '0.9rem', color: '#0070f3', fontWeight: '600' }}>View All &rarr;</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px', marginBottom: '60px' }}>
            {displayedProducts.length > 0 ? displayedProducts.map(product => {
                // Calculate availability type (on-hand vs pre-order)
                const isOnHand = product.sellers > 10;
                const buttonText = isOnHand ? '✅ Buy Now' : '📝 Request';

                // Calculate "All-in Price" (price + 10% service fee)
                const serviceFee = Math.round(product.price * 0.10);
                const allInPrice = product.price + serviceFee;

                // Calculate luggage space (as percentage based on requests vs capacity)
                const luggageCapacity = 50; // assume 50 slots available
                const luggageUsed = Math.min(product.requests, luggageCapacity);
                const luggagePercentage = Math.round((luggageUsed / luggageCapacity) * 100);

                // Simulate "New Listing" tag (for demo, mark products with id containing 'p9' or 'p1' as new)
                const isNewListing = ['p1', 'p9', 'p9a', 'p9b', 'p9c', 'p9d'].includes(product.id);

                // Get top seller avatar (simulate with emoji based on seller name)
                const sellerAvatar = product.topSellers && product.topSellers[0]
                  ? `https://ui-avatars.com/api/?name=${product.topSellers[0]}&background=0070f3&color=fff&size=40&bold=true`
                  : 'https://ui-avatars.com/api/?name=Seller&background=999&color=fff&size=40';

                return (
                    <Link href={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'white', position: 'relative', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                        }} onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}>
                            {/* NEW LISTING TAG */}
                            {isNewListing && (
                                <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#52c41a', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 10 }}>
                                    ✨ New Listing
                                </div>
                            )}

                            {/* HOT ITEM TAG */}
                            {product.isHot && !isNewListing && (
                                <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#ff4d4f', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 10 }}>
                                    🔥 HOT ITEM
                                </div>
                            )}

                            {/* WISHLIST HEART ICON */}
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('Added to wishlist!'); }}
                                style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 10, fontSize: '1.1rem', transition: 'transform 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                ♡
                            </button>

                            {/* PRODUCT IMAGE WITH COUNTRY FLAG */}
                            <div style={{ height: '200px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                <img src={product.images ? product.images[0] : product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                                {/* COUNTRY FLAG */}
                                <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '1rem' }}>{COUNTRY_DATA[product.from]?.flag || '🌍'}</span>
                                    <span style={{ fontSize: '0.65rem' }}>{product.from}</span>
                                </div>

                                {/* TRAVELER AVATAR */}
                                <div style={{ position: 'absolute', bottom: '8px', left: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <img src={sellerAvatar} alt="Traveler" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
                                    <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '3px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 'bold', backdropFilter: 'blur(10px)' }}>
                                        {product.topSellers && product.topSellers[0] ? product.topSellers[0] : 'Seller'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {/* ESTIMATED ARRIVAL DATE */}
                                <div style={{ fontSize: '0.75rem', color: '#52c41a', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span>📅</span>
                                    <span>Arrives in {product.estimatedDelivery}</span>
                                </div>

                                {/* PRODUCT TITLE (TRUNCATED TO 2 LINES) */}
                                <h3 style={{
                                    fontSize: '1.05rem',
                                    fontWeight: 'bold',
                                    marginBottom: '8px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    lineHeight: '1.4',
                                    minHeight: '2.8em'
                                }}>
                                    {product.title}
                                </h3>

                                {/* LUGGAGE SPACE PROGRESS BAR */}
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: '600' }}>🧳 Luggage Space</span>
                                        <span style={{ fontSize: '0.7rem', color: luggagePercentage > 80 ? '#ff4d4f' : '#52c41a', fontWeight: 'bold' }}>
                                            {luggagePercentage}%
                                        </span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${luggagePercentage}%`,
                                            height: '100%',
                                            background: luggagePercentage > 80 ? 'linear-gradient(90deg, #ff6b6b, #ff4d4f)' : 'linear-gradient(90deg, #52c41a, #73d13d)',
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>
                                    {luggagePercentage > 80 && (
                                        <span style={{ fontSize: '0.65rem', color: '#ff4d4f', fontWeight: '600', marginTop: '2px', display: 'block' }}>
                                            ⚠️ Limited space!
                                        </span>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: '#666', marginBottom: '15px' }}>
                                    <span style={{ background: '#e3f2fd', color: '#0070f3', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
                                        {product.requests} Requests
                                    </span>
                                    <span style={{ background: isOnHand ? '#e8f5e9' : '#fff3e0', color: isOnHand ? '#2e7d32' : '#f57c00', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
                                        {isOnHand ? '✅ On-Hand' : '⏰ Pre-order'}
                                    </span>
                                </div>

                                {/* ALL-IN PRICE */}
                                <div style={{ marginTop: 'auto' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#000' }}>₱{allInPrice}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#999', textDecoration: 'line-through' }}>₱{product.price}</div>
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '10px' }}>
                                        All-in Price (includes ₱{serviceFee} service fee)
                                    </div>

                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                                        style={{
                                            background: isOnHand ? '#2e7d32' : '#0070f3',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            width: '100%',
                                            transition: 'transform 0.2s, opacity 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                    >
                                        {buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            }) : <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#888' }}><h3>No items found for "{searchQuery}"</h3><p>Try searching for "Food", "Japan", or specific items like "Irvins".</p><button onClick={() => setSearchQuery('')} style={{ marginTop: '10px', color: '#0070f3', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear Search</button></div>}
        </div>

        {/* TOP SELLERS SECTION */}
        <div style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Meet Our Top Sellers</h2>
                <Link href="/offers" style={{ color: '#0070f3', fontWeight: '600', fontSize: '0.9rem' }}>View All Sellers &rarr;</Link>
            </div>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
                {['All', 'Japan', 'USA', 'South Korea', 'Singapore'].map(cat => (
                    <button key={cat} onClick={() => setSellerCategory(cat)} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #ddd', background: sellerCategory === cat ? '#333' : 'white', color: sellerCategory === cat ? 'white' : '#666', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', whiteSpace: 'nowrap' }}>{cat}</button>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                {filteredSellers.map(seller => (
                    <Link href={`/seller/${seller.name}`} key={seller.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden', background: 'white', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ height: '100px', width: '100%', background: '#eee' }}><img src={seller.banner} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                            <div style={{ padding: '0 20px 20px 20px', position: 'relative', marginTop: '-40px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                                    <img src={seller.avatar} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid white', background:'white' }} />
                                    <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '5px' }}>{seller.level}</div>
                                </div>
                                <h3 style={{ margin: '0 0 5px', fontSize: '1.2rem' }}>{seller.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 15px', fontStyle: 'italic' }}>"{seller.tagline}"</p>
                                <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#333', fontWeight: '500' }}><span>⭐ {seller.rating} ({seller.reviews})</span><span>📍 {seller.countries.join(', ')}</span></div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

        {/* --- HOW IT WORKS PREVIEW --- */}
        <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '60px 40px', margin: '60px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>How does Pasa.ph work?</h2>
                <p style={{ color: '#666' }}>Simple, secure, and fast peer-to-peer shopping.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '30px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📝</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>1. Post a Request</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Tell us what item you need from abroad.</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>✈️</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>2. Get Matched</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Verified travelers accept your order.</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📦</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>3. Receive & Pay</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Payment is released only upon delivery.</p>
                </div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <Link href="/how-it-works" className="btn-primary" style={{ padding: '12px 30px', textDecoration: 'none' }}>Learn More</Link>
            </div>
        </div>

      </div>

      <Footer />
    </>
  );
}