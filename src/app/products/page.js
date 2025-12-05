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
  const [loading, setLoading] = useState(true);
  const [focusCountry, setFocusCountry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const { addToBag } = useCart();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Fetch user preferences (Focus Country) - but allow browsing all
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userCountry = docSnap.data().focusCountry || 'All';
        setFocusCountry(userCountry);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = POPULAR_PRODUCTS;

    // Filter by country
    if (focusCountry !== 'All') {
      filtered = filtered.filter(p => p.from === focusCountry);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.from?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => (b.requests || 0) - (a.requests || 0));
    } else if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const countries = ['All', 'Japan', 'USA', 'South Korea', 'Singapore', 'Hong Kong', 'Vietnam'];

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

      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '60px 20px' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: '900', margin: '0 0 15px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            🛍️ Marketplace
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', opacity: 0.95, maxWidth: '700px', margin: 0, lineHeight: '1.6' }}>
            Discover trending products shoppers want. Add items to your bag and fulfill orders on your next trip!
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div className="container" style={{ padding: '20px' }}>

          {/* Search Box */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '1rem',
                border: '2px solid #eaeaea',
                borderRadius: '12px',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#0070f3'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#eaeaea'}
            />
          </div>

          {/* Filters Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>

            {/* Country Filter Tabs */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px', flex: 1 }}>
              {countries.map(country => (
                <button
                  key={country}
                  onClick={() => setFocusCountry(country)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '25px',
                    border: 'none',
                    background: focusCountry === country ? '#0070f3' : '#f8f9fa',
                    color: focusCountry === country ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    boxShadow: focusCountry === country ? '0 4px 12px rgba(0,112,243,0.3)' : 'none'
                  }}
                >
                  {country}
                </button>
              ))}
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
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container" style={{ padding: '40px 20px', minHeight: '60vh' }}>

        {/* Results Count */}
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 5px', color: '#333' }}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Available
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem', margin: 0 }}>
              {focusCountry === 'All' ? 'Showing all products' : `Showing products from ${focusCountry}`}
            </p>
          </div>

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

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              style={{
                border: '1px solid #eaeaea',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'white',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
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

              {/* Product Info */}
              <div style={{ padding: '18px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px', color: '#333', minHeight: '50px' }}>
                  {product.title}
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>📊</span>
                    <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>{product.requests || 0} requests</span>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0070f3' }}>
                    ₱{product.price?.toLocaleString() || '0'}
                  </div>
                </div>

                {/* Add to Bag Button */}
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
                    gap: '8px'
                  }}
                  onClick={() => {
                    addToBag(product);
                    // Optional: Show success feedback
                  }}
                >
                  <span>🛒</span>
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
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
              {(searchQuery || focusCountry !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFocusCountry('All');
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
