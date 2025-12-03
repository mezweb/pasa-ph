'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { POPULAR_PRODUCTS } from '../../../lib/products';
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState('mint');
  const imageRef = useRef(null);

  useEffect(() => {
    if (id) {
      const foundProduct = POPULAR_PRODUCTS.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
      setLoading(false);
    }
  }, [id]);

  // Pinch-to-zoom handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      imageRef.current = { distance };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && imageRef.current) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const scale = distance / imageRef.current.distance;
      setImageZoom(prev => Math.min(Math.max(prev * scale, 1), 3));
      imageRef.current = { distance };
    }
  };

  const handleTouchEnd = () => {
    imageRef.current = null;
  };

  // Copy link function
  const copyProductLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    });
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: '#888' }}>Loading product...</div>;
  if (!product) return <div style={{ padding: '100px', textAlign: 'center' }}>Product not found.</div>;

  const getFlag = (country) => {
    if (country === 'Japan') return '🇯🇵';
    if (country === 'USA') return '🇺🇸';
    if (country === 'South Korea') return '🇰🇷';
    if (country === 'Singapore') return '🇸🇬';
    if (country === 'Hong Kong') return '🇭🇰';
    if (country === 'Indonesia') return '🇮🇩';
    if (country === 'Vietnam') return '🇻🇳';
    return '🇵🇭';
  };

  const productImages = product.images || [product.image];
  const isStockPhoto = product.isStockPhoto !== false; // Default to true if not specified
  const isFoodItem = product.category?.toLowerCase().includes('food') || product.category?.toLowerCase().includes('snack');

  // Calculate service fee (10% of price)
  const serviceFee = Math.round(product.price * 0.10);
  const totalPrice = product.price + serviceFee;

  // Mock traveler data (would come from backend in production)
  const travelerData = {
    name: product.topSellers?.[0] || 'TravelerPH',
    responseRate: 98,
    cancellationRate: 2,
    rating: 4.9,
    totalTrips: 47
  };

  // Calculate order cutoff (mock - would be dynamic)
  const daysUntilCutoff = 2;

  // Similar items from this traveler (filtered from POPULAR_PRODUCTS)
  const similarItems = POPULAR_PRODUCTS.filter(p =>
    p.id !== product.id &&
    p.topSellers?.includes(travelerData.name)
  ).slice(0, 4);

  // Item-specific FAQs
  const itemFAQs = [
    { question: 'Is this heat sensitive?', answer: 'This item should be kept at room temperature. The traveler will pack it appropriately for transport.' },
    { question: 'How is authenticity guaranteed?', answer: 'All items are purchased from verified retailers. Receipts are provided upon request. Our escrow system protects you 100%.' },
    { question: 'Can I request a different variant?', answer: 'Yes! Message the traveler directly to discuss alternative sizes, colors, or flavors.' },
    { question: 'What if the item is damaged during transport?', answer: 'You have 24 hours after delivery to report any damage. Full refunds are issued for damaged items.' }
  ];

  return (
    <>
      <Navbar />
      <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>

            {/* Breadcrumb */}
            <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
                <Link href="/" style={{ textDecoration: 'none', color: '#999' }}>Shop</Link>
                <span style={{ margin: '0 10px' }}>/</span>
                <span style={{ color: '#333', fontWeight: '500' }}>{product.title}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>

                {/* LEFT: Image Section (Gallery) - 4:5 ASPECT RATIO */}
                <div>
                    <div
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      style={{
                        width: '100%',
                        aspectRatio: '4 / 5', // 4:5 aspect ratio (taller)
                        background: 'white',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid #eee',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        marginBottom: '15px',
                        position: 'relative',
                        touchAction: 'none'
                      }}
                    >
                        <img
                            src={productImages[activeImageIndex]}
                            alt={product.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transform: `scale(${imageZoom})`,
                              transition: imageZoom === 1 ? 'transform 0.3s' : 'none'
                            }}
                        />

                        {/* Stock Photo Badge */}
                        {isStockPhoto && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            background: 'rgba(255, 152, 0, 0.95)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                            📸 Stock Photo
                          </div>
                        )}
                    </div>

                    {/* Request Real Photo Button */}
                    {isStockPhoto && (
                      <button
                        onClick={() => router.push(`/messages/${travelerData.name}`)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'white',
                          border: '2px dashed #ff9800',
                          borderRadius: '10px',
                          color: '#ff9800',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          marginBottom: '15px',
                          fontSize: '0.95rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#fff3e0';
                          e.target.style.borderStyle = 'solid';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.borderStyle = 'dashed';
                        }}
                      >
                        📷 Request Real Photo from Traveler
                      </button>
                    )}

                    {/* Thumbnail Gallery */}
                    {productImages.length > 1 && (
                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                            {productImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: activeImageIndex === idx ? '2px solid #0070f3' : '1px solid #ddd',
                                        cursor: 'pointer',
                                        opacity: activeImageIndex === idx ? 1 : 0.6,
                                        transition: 'all 0.2s',
                                        flexShrink: 0
                                    }}
                                >
                                    <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Box Condition Selector */}
                    <div style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid #eee',
                      marginTop: '15px'
                    }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📦 Box Condition
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => setSelectedCondition('mint')}
                          style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: selectedCondition === 'mint' ? '2px solid #2e7d32' : '1px solid #ddd',
                            background: selectedCondition === 'mint' ? '#e8f5e9' : 'white',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: selectedCondition === 'mint' ? 'bold' : 'normal',
                            color: selectedCondition === 'mint' ? '#2e7d32' : '#666'
                          }}
                        >
                          ✨ Mint<br/><span style={{ fontSize: '0.7rem' }}>Perfect box</span>
                        </button>
                        <button
                          onClick={() => setSelectedCondition('travel')}
                          style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: selectedCondition === 'travel' ? '2px solid #ff9800' : '1px solid #ddd',
                            background: selectedCondition === 'travel' ? '#fff3e0' : 'white',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: selectedCondition === 'travel' ? 'bold' : 'normal',
                            color: selectedCondition === 'travel' ? '#ff9800' : '#666'
                          }}
                        >
                          ✈️ Travel Worn<br/><span style={{ fontSize: '0.7rem' }}>May have wear</span>
                        </button>
                      </div>
                      <div style={{
                        marginTop: '12px',
                        fontSize: '0.75rem',
                        color: '#888',
                        padding: '10px',
                        background: '#f9f9f9',
                        borderRadius: '6px'
                      }}>
                        {selectedCondition === 'mint'
                          ? '💚 Product box will be in pristine condition. Ideal for gifts.'
                          : '📦 Box may show minor wear from travel. Product inside is always perfect.'}
                      </div>
                    </div>

                    {/* Best Before Date for Food Items */}
                    {isFoodItem && (
                      <div style={{
                        background: '#fff3cd',
                        border: '1px solid #ffc107',
                        padding: '15px',
                        borderRadius: '10px',
                        marginTop: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>🗓️</span>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#856404' }}>Best Before</div>
                          <div style={{ fontSize: '0.85rem', color: '#856404' }}>
                            {new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#856404', marginTop: '3px' }}>~6 months shelf life</div>
                        </div>
                      </div>
                    )}

                    {/* Origin & Destination Map */}
                    <div style={{
                      background: 'white',
                      border: '1px solid #eee',
                      borderRadius: '12px',
                      padding: '20px',
                      marginTop: '15px'
                    }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '15px' }}>📍 Journey Map</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{getFlag(product.from)}</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#333' }}>{product.from}</div>
                          <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '3px' }}>Origin (Purchase)</div>
                        </div>
                        <div style={{ flex: 0.5, textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem' }}>✈️</div>
                          <div style={{ fontSize: '0.7rem', color: '#888' }}>In Transit</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🇵🇭</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#333' }}>Manila</div>
                          <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '3px' }}>Destination (Delivery)</div>
                        </div>
                      </div>
                      <div style={{
                        marginTop: '15px',
                        padding: '10px',
                        background: '#f0f7ff',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        color: '#0070f3'
                      }}>
                        📦 Meetup locations: BGC, Makati, Quezon City, or courier delivery available
                      </div>
                    </div>
                </div>

                {/* RIGHT: Details Section */}
                <div>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: '#888', fontWeight: 'bold', letterSpacing: '1px' }}>
                                {product.category}
                            </span>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              {product.isHot && (
                                  <span style={{ background: '#ff4d4f', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                      🔥 HOT ITEM
                                  </span>
                              )}
                              {/* Copy Link Button */}
                              <button
                                onClick={copyProductLink}
                                style={{
                                  background: showCopySuccess ? '#4caf50' : '#f0f0f0',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '20px',
                                  fontSize: '0.7rem',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  color: showCopySuccess ? 'white' : '#333',
                                  transition: 'all 0.3s'
                                }}
                              >
                                {showCopySuccess ? '✓ Copied!' : '🔗 Copy Link'}
                              </button>
                            </div>
                        </div>

                        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '15px', color: '#111' }}>
                            {product.title}
                        </h1>

                        {/* Urgency Banner */}
                        <div style={{
                          background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
                          color: 'white',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          marginBottom: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}>
                          <span style={{ fontSize: '1.3rem' }}>⏰</span>
                          <div>
                            <div>Order cutoff is in {daysUntilCutoff} days</div>
                            <div style={{ fontSize: '0.75rem', opacity: '0.9', fontWeight: 'normal' }}>Traveler departs soon - order now to secure your item!</div>
                          </div>
                        </div>

                        {/* Price with Service Fee Breakdown */}
                        <div style={{ marginBottom: '25px' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0070f3' }}>₱{product.price}</span>
                            <span style={{ background: '#f0f0f0', padding: '5px 12px', borderRadius: '8px', fontSize: '0.9rem', color: '#555' }}>
                                {getFlag(product.from)} From {product.from}
                            </span>
                          </div>

                          {/* Service Fee Breakdown */}
                          <div style={{
                            background: '#f9f9f9',
                            padding: '12px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            border: '1px solid #eee'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <span style={{ color: '#666' }}>Item Price:</span>
                              <span style={{ fontWeight: 'bold' }}>₱{product.price}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <span style={{ color: '#666' }}>Service Fee (10%):</span>
                              <span style={{ fontWeight: 'bold' }}>₱{serviceFee}</span>
                            </div>
                            <div style={{
                              borderTop: '1px solid #ddd',
                              marginTop: '8px',
                              paddingTop: '8px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '1rem'
                            }}>
                              <span style={{ fontWeight: 'bold' }}>Total:</span>
                              <span style={{ fontWeight: 'bold', color: '#0070f3' }}>₱{totalPrice}</span>
                            </div>
                          </div>
                        </div>

                        {/* Social Proof - Number of People Requesting */}
                        <div style={{
                          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                          padding: '15px',
                          borderRadius: '10px',
                          marginBottom: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <span style={{ fontSize: '2rem' }}>👥</span>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0070f3' }}>
                              {product.requests} people requesting this item
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#1976d2' }}>
                              High demand - order now before it's claimed!
                            </div>
                          </div>
                        </div>

                        {/* Traveler Stats */}
                        <div style={{
                          background: '#f0f7ff',
                          padding: '20px',
                          borderRadius: '12px',
                          border: '1px solid #bbdefb',
                          marginBottom: '20px'
                        }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '15px', color: '#0070f3' }}>
                            ✈️ About the Traveler
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                            <div style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '1.2rem'
                            }}>
                              {travelerData.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>@{travelerData.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#666' }}>⭐ {travelerData.rating} • {travelerData.totalTrips} trips completed</div>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ background: 'white', padding: '12px', borderRadius: '8px' }}>
                              <div style={{ fontSize: '0.75rem', color: '#888' }}>Response Rate</div>
                              <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#2e7d32' }}>{travelerData.responseRate}%</div>
                              <div style={{ fontSize: '0.7rem', color: '#2e7d32', marginTop: '3px' }}>✓ Very Responsive</div>
                            </div>
                            <div style={{ background: 'white', padding: '12px', borderRadius: '8px' }}>
                              <div style={{ fontSize: '0.75rem', color: '#888' }}>Cancellation Rate</div>
                              <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#2e7d32' }}>{travelerData.cancellationRate}%</div>
                              <div style={{ fontSize: '0.7rem', color: '#2e7d32', marginTop: '3px' }}>✓ Very Reliable</div>
                            </div>
                          </div>
                        </div>

                        {/* Customs/Tax Note */}
                        <div style={{
                          background: '#fff9e6',
                          border: '1px solid #ffd700',
                          borderRadius: '10px',
                          padding: '15px',
                          marginBottom: '20px',
                          fontSize: '0.85rem'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#d97706', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>🛃</span>
                            Customs & Tax Information
                          </div>
                          <div style={{ color: '#92400e', lineHeight: '1.5' }}>
                            Items under ₱10,000 are typically duty-free. For higher values, customs duties may apply (usually 5-15%). The traveler will provide all receipts for customs declaration.
                          </div>
                        </div>

                        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>📊 Pasabuy Insights</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Active Requests</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{product.requests} People</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Active Sellers</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{product.sellers} Travelers</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Est. Delivery</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{product.estimatedDelivery || '3-7 Days'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Success Rate</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#2e7d32' }}>98%</div>
                                </div>
                            </div>
                        </div>

                        {/* Top Sellers */}
                        {product.topSellers && (
                            <div style={{ marginBottom: '25px' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>Top Sellers for this item:</div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {product.topSellers.map((seller, idx) => (
                                        <Link
                                            key={idx}
                                            href={`/seller/${seller}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <span style={{ background: '#e3f2fd', color: '#0070f3', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', transition: '0.2s', border: '1px solid transparent' }}
                                                  onMouseOver={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = '#0070f3'; }}
                                                  onMouseOut={(e) => { e.target.style.background = '#e3f2fd'; e.target.style.borderColor = 'transparent'; }}
                                            >
                                                @{seller}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                          <button
                              className="btn-primary"
                              style={{ flex: 1, padding: '18px', fontSize: '1.1rem', justifyContent: 'center', borderRadius: '10px' }}
                              onClick={() => addToCart(product)}
                          >
                              🛒 Add to Cart
                          </button>
                          <button
                              onClick={() => toggleWishlist(product)}
                              style={{
                                padding: '18px',
                                background: isInWishlist(product.id) ? '#ff4d4f' : 'white',
                                border: `2px solid ${isInWishlist(product.id) ? '#ff4d4f' : '#ddd'}`,
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '1.5rem',
                                transition: 'all 0.2s'
                              }}
                          >
                            {isInWishlist(product.id) ? '❤️' : '🤍'}
                          </button>
                        </div>

                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#999', marginBottom: '0' }}>
                            🔒 Secure payment via Pasa.ph Escrow. 100% Authentic Guarantee.
                        </p>

                    </div>

                    {/* Message Traveler Button - Sticky on Mobile */}
                    <button
                      onClick={() => router.push(`/messages/${travelerData.name}`)}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        position: 'sticky',
                        bottom: '20px',
                        zIndex: 100
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      <span style={{ fontSize: '1.3rem' }}>💬</span>
                      Message Traveler
                    </button>

                    {/* Item-Specific FAQ */}
                    <div style={{
                      background: 'white',
                      border: '1px solid #eee',
                      borderRadius: '12px',
                      padding: '25px',
                      marginTop: '20px'
                    }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>❓</span>
                        Frequently Asked Questions
                      </h3>
                      {itemFAQs.map((faq, idx) => (
                        <div key={idx} style={{ marginBottom: '20px', paddingBottom: idx < itemFAQs.length - 1 ? '20px' : '0', borderBottom: idx < itemFAQs.length - 1 ? '1px solid #eee' : 'none' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>{faq.question}</div>
                          <div style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>{faq.answer}</div>
                        </div>
                      ))}
                    </div>
                </div>
            </div>

            {/* Similar Items from This Traveler Carousel */}
            {similarItems.length > 0 && (
              <div style={{ marginTop: '60px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '25px' }}>
                  ✈️ More from @{travelerData.name}
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '20px'
                }}>
                  {similarItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #eee',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        height: '100%'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        <div style={{ aspectRatio: '4 / 5', overflow: 'hidden' }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ padding: '15px' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0070f3' }}>
                            ₱{item.price}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '5px' }}>
                            {getFlag(item.from)} From {item.from}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
      <Footer />
    </>
  );
}
