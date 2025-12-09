'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { POPULAR_PRODUCTS } from '../../lib/products';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function MarketplacePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);
  const [focusCountry, setFocusCountry] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [watchlist, setWatchlist] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const { addToBag } = useCart();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Fetch user preferences and seller status
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userCountry = userData.focusCountry || 'All';
        setFocusCountry(userCountry);
        setIsSeller(userData.isSeller || false);
        // Load watchlist from localStorage
        const savedWatchlist = localStorage.getItem(`watchlist_${currentUser.uid}`);
        if (savedWatchlist) {
          setWatchlist(JSON.parse(savedWatchlist));
        }
        // Load recent searches
        const savedSearches = localStorage.getItem(`recentSearches_${currentUser.uid}`);
        if (savedSearches) {
          setRecentSearches(JSON.parse(savedSearches));
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // Save search to recent searches
  const saveSearch = (query) => {
    if (!query.trim() || !user) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(`recentSearches_${user.uid}`, JSON.stringify(updated));
  };

  // Toggle watchlist
  const toggleWatchlist = (productId) => {
    const updated = watchlist.includes(productId)
      ? watchlist.filter(id => id !== productId)
      : [...watchlist, productId];
    setWatchlist(updated);
    if (user) {
      localStorage.setItem(`watchlist_${user.uid}`, JSON.stringify(updated));
    }
  };

  // Toggle compare
  const toggleCompare = (productId) => {
    if (compareItems.includes(productId)) {
      setCompareItems(compareItems.filter(id => id !== productId));
    } else if (compareItems.length < 2) {
      setCompareItems([...compareItems, productId]);
    } else {
      alert('You can only compare 2 items at a time');
    }
  };

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = POPULAR_PRODUCTS;

    // Filter by country
    if (focusCountry !== 'All') {
      filtered = filtered.filter(p => p.from === focusCountry);
    }

    // Filter by category
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => (b.requests || 0) - (a.requests || 0));
    } else if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'earning-high') {
      // Sort by highest earning (profit for sellers)
      filtered = [...filtered].sort((a, b) => {
        const profitA = calculateProfit(a);
        const profitB = calculateProfit(b);
        return profitB - profitA;
      });
    }

    return filtered;
  };

  // Calculate seller profit (price * 0.9 service fee)
  const calculateProfit = (product) => {
    const serviceFee = 0.10; // 10% service fee
    return Math.round(product.price * (1 - serviceFee));
  };

  const filteredProducts = getFilteredProducts();

  // Country data with flags
  const countries = [
    { name: 'All', flag: '🌎' },
    { name: 'Japan', flag: '🇯🇵' },
    { name: 'USA', flag: '🇺🇸' },
    { name: 'South Korea', flag: '🇰🇷' },
    { name: 'Singapore', flag: '🇸🇬' },
    { name: 'Hong Kong', flag: '🇭🇰' },
    { name: 'Vietnam', flag: '🇻🇳' }
  ];

  // Category data with icons
  const categories = [
    { name: 'All', icon: '📦' },
    { name: 'Food', icon: '🍱' },
    { name: 'Beauty', icon: '💄' },
    { name: 'Electronics', icon: '📱' },
    { name: 'Fashion', icon: '👗' }
  ];

  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
        <p style={{ color: '#999', fontSize: '1.2rem' }}>Loading marketplace...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* Breadcrumbs */}
      <div style={{ background: '#f8f9fa', borderBottom: '1px solid #eaeaea' }}>
        <div className="container" style={{ padding: '12px 20px' }}>
          <div style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <span>Marketplace</span>
            {focusCountry !== 'All' && (
              <>
                <span>›</span>
                <span style={{ fontWeight: '600' }}>{focusCountry}</span>
              </>
            )}
            {categoryFilter !== 'All' && (
              <>
                <span>›</span>
                <span style={{ fontWeight: '600' }}>{categoryFilter}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '60px 20px' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: '900', margin: '0 0 15px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            🛍️ Marketplace {isSeller && <span style={{ fontSize: '0.5em', opacity: 0.9 }}>- Seller View</span>}
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', opacity: 0.95, maxWidth: '700px', margin: 0, lineHeight: '1.6' }}>
            {isSeller
              ? 'Accept requests and earn on your next trip! Browse items buyers are requesting.'
              : 'Discover trending products shoppers want. Add items to your bag and fulfill orders on your next trip!'}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div className="container" style={{ padding: '20px' }}>

          {/* Search Box with Recent Searches */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchHistory(true)}
              onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  saveSearch(searchQuery);
                  setShowSearchHistory(false);
                }
              }}
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '1rem',
                border: '2px solid #eaeaea',
                borderRadius: '12px',
                transition: 'border-color 0.2s'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#999'
                }}
              >
                ×
              </button>
            )}
            {/* Recent Searches Dropdown */}
            {showSearchHistory && recentSearches.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid #eaeaea',
                borderRadius: '8px',
                marginTop: '5px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 1000
              }}>
                <div style={{ padding: '10px 15px', fontSize: '0.8rem', fontWeight: '600', color: '#666', borderBottom: '1px solid #eaeaea' }}>
                  Recent Searches
                </div>
                {recentSearches.map((search, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchQuery(search);
                      setShowSearchHistory(false);
                    }}
                    style={{
                      padding: '10px 15px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      borderBottom: idx < recentSearches.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f8f9fa'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <span style={{ color: '#999' }}>🕐</span>
                    <span>{search}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filters Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Country Filter Tabs with Flags */}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#666', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Country</div>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                  {countries.map(country => (
                    <button
                      key={country.name}
                      onClick={() => setFocusCountry(country.name)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '25px',
                        border: 'none',
                        background: focusCountry === country.name ? '#0070f3' : '#f8f9fa',
                        color: focusCountry === country.name ? 'white' : '#666',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                        boxShadow: focusCountry === country.name ? '0 4px 12px rgba(0,112,243,0.3)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter Tabs with Icons */}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#666', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</div>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                  {categories.map(category => (
                    <button
                      key={category.name}
                      onClick={() => setCategoryFilter(category.name)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '25px',
                        border: 'none',
                        background: categoryFilter === category.name ? '#2e7d32' : '#f8f9fa',
                        color: categoryFilter === category.name ? 'white' : '#666',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                        boxShadow: categoryFilter === category.name ? '0 4px 12px rgba(46,125,50,0.3)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort Dropdown and View Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              {/* View Toggle */}
              <div style={{ display: 'flex', gap: '5px', background: '#f8f9fa', borderRadius: '10px', padding: '5px' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    background: viewMode === 'grid' ? 'white' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    transition: 'all 0.2s',
                    boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                  title="Grid view"
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    background: viewMode === 'list' ? 'white' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    transition: 'all 0.2s',
                    boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                  title="List view"
                >
                  ☰
                </button>
              </div>

              {/* Sort Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '600', whiteSpace: 'nowrap' }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '10px',
                    border: '2px solid #eaeaea',
                    background: 'white',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: '#333'
                  }}
                >
                  <option value="popular">Most Popular</option>
                  {isSeller && <option value="earning-high">Highest Earning</option>}
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container" style={{ padding: '40px 20px', minHeight: '60vh' }}>

        {/* Comparison Bar */}
        {compareItems.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <span style={{ fontWeight: 'bold' }}>📊 Comparing {compareItems.length} item{compareItems.length > 1 ? 's' : ''}</span>
              {compareItems.length === 2 && (
                <span style={{ marginLeft: '15px', opacity: 0.9 }}>
                  {compareItems.map(id => POPULAR_PRODUCTS.find(p => p.id === id)?.title).join(' vs ')}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {compareItems.length === 2 && (
                <button
                  onClick={() => {
                    const items = compareItems.map(id => POPULAR_PRODUCTS.find(p => p.id === id));
                    const comparison = items.map(p => `${p.title}: ₱${p.price} (Earn: ₱${calculateProfit(p)})`).join('\n');
                    alert(`Comparison:\n\n${comparison}`);
                  }}
                  style={{
                    background: 'white',
                    color: '#667eea',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  View Comparison
                </button>
              )}
              <button
                onClick={() => setCompareItems([])}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Results Count and Custom Offer Button */}
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 5px', color: '#333' }}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Available
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem', margin: 0 }}>
              {focusCountry === 'All' ? 'Showing all products' : `Showing products from ${focusCountry}`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Custom Offer Button */}
            {isSeller && (
              <button
                onClick={() => alert('Post Custom Offer feature coming soon!')}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 12px rgba(255,152,0,0.3)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                💼 Post Custom Offer
              </button>
            )}

            {/* Quick Stats */}
            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0070f3' }}>{POPULAR_PRODUCTS.length}</div>
                <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Items</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2e7d32' }}>{filteredProducts.filter(p => p.isHot).length}</div>
                <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
          {filteredProducts.map(product => (
            <Link href={`/products/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  border: '1px solid #eaeaea',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'white',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                }}
              >

              {/* Hot Badge */}
              {product.isHot && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'linear-gradient(135deg, #ff4d4f 0%, #ff6b6b 100%)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(255,77,79,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>🔥</span>
                  <span>TRENDING</span>
                </div>
              )}

              {/* Product Image */}
              <div style={{ height: '220px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={product.images ? product.images[0] : product.image}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Country Flag */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }}>
                  {product.from}
                </div>
              </div>

              {/* Watchlist & Compare Buttons */}
              {isSeller && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  display: 'flex',
                  gap: '8px',
                  zIndex: 10
                }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWatchlist(product.id);
                    }}
                    style={{
                      background: watchlist.includes(product.id) ? '#ff9800' : 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                    title="Add to watchlist"
                  >
                    {watchlist.includes(product.id) ? '⭐' : '☆'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleCompare(product.id);
                    }}
                    style={{
                      background: compareItems.includes(product.id) ? '#667eea' : 'rgba(255,255,255,0.9)',
                      color: compareItems.includes(product.id) ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      fontWeight: 'bold'
                    }}
                    title="Add to compare"
                  >
                    ⚖
                  </button>
                </div>
              )}

              {/* Product Info */}
              <div style={{ padding: '18px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px', color: '#333', minHeight: '50px' }}>
                  {product.title}
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>📊</span>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: (product.requests || 0) >= 50 ? '#e53935' : '#666'
                    }}>
                      {product.requests || 0} requests
                      {(product.requests || 0) >= 50 && <span style={{ marginLeft: '4px' }}>🔥</span>}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0070f3' }}>
                    ₱{product.price?.toLocaleString() || '0'}
                  </div>
                </div>

                {/* Seller Profit Label */}
                {isSeller && (
                  <div style={{
                    background: '#e8f5e9',
                    border: '1px solid #2e7d32',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#2e7d32', fontWeight: '600' }}>
                      You earn
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2e7d32' }}>
                      ₱{calculateProfit(product).toLocaleString()}
                    </div>
                  </div>
                )}

                {/* Weight Info */}
                {(product.weight || product.category === 'Food' || product.category === 'Beauty') && (
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>⚖️</span>
                    <span>Est. {product.weight || (product.category === 'Food' ? '0.5kg' : '0.3kg')}</span>
                  </div>
                )}

                {/* Action Button */}
                <button
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.95rem',
                    justifyContent: 'center',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: isSeller ? 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)' : undefined
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToBag(product);
                    alert(isSeller ? 'Request accepted! ✅' : 'Added to your Pasa Bag! ✅');
                  }}
                >
                  <span>{isSeller ? '✓' : '🛒'}</span>
                  <span>{isSeller ? 'Accept Request' : 'Add to Bag'}</span>
                </button>
              </div>
            </div>
            </Link>
          ))}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div style={{
              gridColumn: '1/-1',
              textAlign: 'center',
              padding: '80px 20px',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '16px',
              border: '2px dashed #ddd'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📭</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px', color: '#333' }}>
                No Products Found
              </h3>
              <p style={{ color: '#666', fontSize: '1rem', marginBottom: '20px' }}>
                {searchQuery ?
                  `No products match "${searchQuery}". Try a different search term.` :
                  `No products from ${focusCountry === 'All' ? 'any country' : focusCountry} at the moment.`
                }
              </p>
              {(searchQuery || focusCountry !== 'All' || categoryFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFocusCountry('All');
                    setCategoryFilter('All');
                  }}
                  className="btn-primary"
                  style={{ padding: '12px 30px' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* CTA Section */}
        {filteredProducts.length > 0 && (
          <div style={{
            marginTop: '60px',
            padding: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            textAlign: 'center',
            color: 'white'
          }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px' }}>
              ✈️ Planning a Trip?
            </h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.95, marginBottom: '25px', maxWidth: '600px', margin: '0 auto 25px' }}>
              Add items to your Pasa Bag and fulfill orders on your next trip. It's that easy!
            </p>
            <Link href="/seller-dashboard">
              <button className="btn-primary" style={{
                background: 'white',
                color: '#667eea',
                padding: '16px 40px',
                fontSize: '1.1rem',
                fontWeight: '700',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}>
                Register Your Trip →
              </button>
            </Link>
          </div>
        )}

      </div>
      <Footer />
    </>
  );
}
