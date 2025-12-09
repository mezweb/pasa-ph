'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { POPULAR_PRODUCTS } from '../../../lib/products';
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { addToBag } = useCart();

  const productId = params.id;
  const product = POPULAR_PRODUCTS.find(p => p.id === productId);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Allow guest browsing - don't redirect to login
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  // Handle share functionality
  const handleShare = async (method) => {
    const shareUrl = window.location.href;
    const shareText = `Check out ${product.title} on PASA.PH - ₱${product.price?.toLocaleString()}`;

    if (method === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } else if (method === 'native' && navigator.share) {
      await navigator.share({
        title: product.title,
        text: shareText,
        url: shareUrl
      });
    } else if (method === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (method === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    }
    setShowShareMenu(false);
  };

  // Calculate currency conversions (approximate rates)
  const usdPrice = product.price ? (product.price / 56).toFixed(2) : 0; // PHP to USD
  const jpyPrice = product.price ? (product.price * 2.7).toFixed(0) : 0; // PHP to JPY

  // Determine stock status (simulate based on sellers count)
  const stockStatus = product.sellers > 10 ? 'on-hand' : 'pre-order';
  const isOnHand = stockStatus === 'on-hand';

  // Max quantity limit
  const MAX_QUANTITY = 5;

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>❌</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '15px' }}>Product Not Found</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <button className="btn-primary" style={{ padding: '12px 30px' }}>
              ← Back to Marketplace
            </button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const images = product.images || [product.image];

  return (
    <>
      <Navbar />

      <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px' }}>
        {/* Urgency Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
          fontWeight: '600',
          fontSize: '0.95rem'
        }}>
          <span style={{ fontSize: '1.3rem' }}>⏰</span>
          <span>Order cutoff in 2 days — Travelers leaving soon!</span>
        </div>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '30px', fontSize: '0.9rem', color: '#666' }}>
          <Link href="/products" style={{ color: '#0070f3', textDecoration: 'none' }}>← Marketplace</Link>
          <span style={{ margin: '0 10px' }}>/</span>
          <span>{product.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', marginBottom: '60px' }}>

          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div style={{
              width: '100%',
              height: '450px',
              background: '#f9f9f9',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '20px',
              border: '1px solid #eaeaea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={images[selectedImage]}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: `2px solid ${selectedImage === index ? '#0070f3' : '#eaeaea'}`,
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.2s'
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div>
            {/* Hot Badge */}
            {product.isHot && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #ff4d4f 0%, #ff6b6b 100%)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '25px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(255,77,79,0.4)'
              }}>
                <span>🔥</span>
                <span>TRENDING</span>
              </div>
            )}

            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '900', marginBottom: '15px', color: '#333', lineHeight: '1.2' }}>
              {product.title}
            </h1>

            {/* Category, Country & Stock Status */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
              <div style={{ padding: '6px 14px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                {product.category}
              </div>
              <div style={{ padding: '6px 14px', background: '#e3f2fd', color: '#0070f3', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                📍 {product.from}
              </div>
              <div style={{
                padding: '6px 14px',
                background: isOnHand ? '#e8f5e9' : '#fff3e0',
                color: isOnHand ? '#2e7d32' : '#e65100',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: `1px solid ${isOnHand ? '#2e7d32' : '#ff9800'}`
              }}>
                {isOnHand ? '✅ On-Hand' : '📦 Pre-Order'}
              </div>
            </div>

            {/* Price with Currency Conversion */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px' }}>Average Price</div>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', color: '#0070f3', lineHeight: '1', marginBottom: '10px' }}>
                ₱{product.price?.toLocaleString() || '0'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#999', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <span>≈ ${usdPrice} USD</span>
                <span>≈ ¥{jpyPrice} JPY</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', marginBottom: '30px' }}>
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0070f3', marginBottom: '5px' }}>
                  {product.requests || 0}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>Active Requests</div>
              </div>

              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2e7d32', marginBottom: '5px' }}>
                  {product.sellers || 0}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>Sellers</div>
              </div>

              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#333', marginBottom: '5px' }}>
                  {product.estimatedDelivery || 'N/A'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>Est. Delivery</div>
              </div>
            </div>

            {/* Top Sellers */}
            {product.topSellers && product.topSellers.length > 0 && (
              <div style={{ background: 'linear-gradient(135deg, #fff9e6 0%, #fff 100%)', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #ffd54f' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#666', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ⭐ Top Sellers for this Item
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.topSellers.map((seller, index) => (
                    <div key={index} style={{ padding: '8px 14px', background: 'white', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600', color: '#333', border: '1px solid #e0e0e0' }}>
                      {seller}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px', fontWeight: '600' }}>
                Quantity (Max {MAX_QUANTITY})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    background: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  −
                </button>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  minWidth: '40px',
                  textAlign: 'center',
                  color: '#333'
                }}>
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(Math.min(MAX_QUANTITY, quantity + 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '2px solid #0070f3',
                    background: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: '#0070f3'
                  }}
                >
                  +
                </button>
                {quantity >= MAX_QUANTITY && (
                  <span style={{ fontSize: '0.8rem', color: '#ff9800', fontWeight: '600' }}>
                    Maximum reached
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', position: 'relative' }}>
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToBag(product);
                  }
                  alert(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to your Pasa Bag! ✅`);
                }}
                className="btn-primary"
                id="add-to-cart-btn"
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '18px 30px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span>🛒</span>
                <span>Add to Pasa Bag</span>
              </button>

              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                style={{
                  padding: '18px 30px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  borderRadius: '12px',
                  border: '2px solid #0070f3',
                  background: 'white',
                  color: '#0070f3',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f0f9ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                <span>📤</span>
                <span>Share</span>
              </button>

              {/* Share Menu */}
              {showShareMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  marginTop: '10px',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  padding: '12px',
                  zIndex: 1000,
                  minWidth: '200px'
                }}>
                  <button
                    onClick={() => handleShare('copy')}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      background: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.95rem',
                      marginBottom: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f0f9ff'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <span>🔗</span>
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      background: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.95rem',
                      marginBottom: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f0f9ff'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <span>📘</span>
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      background: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f0f9ff'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <span>🐦</span>
                    <span>Twitter</span>
                  </button>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div style={{ marginTop: '30px', padding: '20px', background: '#e3f2fd', borderRadius: '12px', border: '1px solid #90caf9' }}>
              <div style={{ fontSize: '0.95rem', color: '#0d47a1', lineHeight: '1.7' }}>
                <strong>💡 Tip:</strong> Add this item to your Pasa Bag and fulfill requests when you travel to {product.from}. You'll earn money while helping shoppers get what they want!
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px', color: '#333' }}>
            🌟 Other Travelers Also Bought
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '30px' }}>
            From {product.from} • Trusted by hundreds of buyers
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {POPULAR_PRODUCTS
              .filter(p => p.from === product.from && p.id !== product.id)
              .slice(0, 4)
              .map(similarProduct => (
                <Link key={similarProduct.id} href={`/products/${similarProduct.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    background: 'white',
                    border: '1px solid #eaeaea',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
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
                    <div style={{ height: '150px', background: '#f9f9f9' }}>
                      <img
                        src={similarProduct.images ? similarProduct.images[0] : similarProduct.image}
                        alt={similarProduct.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '15px' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '8px', color: '#333' }}>
                        {similarProduct.title}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0070f3' }}>
                        ₱{similarProduct.price?.toLocaleString() || '0'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* Sticky Add to Cart for Mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          #add-to-cart-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0, 112, 243, 0.4) !important;
            animation: slideUp 0.3s ease-out;
          }

          @keyframes slideUp {
            from {
              transform: translateY(100px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        }
      `}</style>
    </>
  );
}
