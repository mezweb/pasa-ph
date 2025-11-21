'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { POPULAR_PRODUCTS } from '../../../lib/products'; 
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const foundProduct = POPULAR_PRODUCTS.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: '#888' }}>Loading product...</div>;
  if (!product) return <div style={{ padding: '100px', textAlign: 'center' }}>Product not found.</div>;

  const getFlag = (country) => {
    if (country === 'Japan') return '🇯🇵';
    if (country === 'USA') return '🇺🇸';
    if (country === 'South Korea') return '🇰🇷';
    if (country === 'Singapore') return '🇸🇬';
    if (country === 'Hong Kong') return '🇭🇰';
    if (country === 'Indonesia') return '🇮🇩';
    return '🇵🇭';
  };

  const productImages = product.images || [product.image];

  return (
    <>
      <Navbar />
      <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
        <div className="container" style={{ padding: '40px 20px' }}>
            
            <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
                <Link href="/" style={{ textDecoration: 'none', color: '#999' }}>Shop</Link> 
                <span style={{ margin: '0 10px' }}>/</span> 
                <span style={{ color: '#333', fontWeight: '500' }}>{product.title}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
                
                {/* LEFT: Image Section (Gallery) */}
                <div>
                    <div style={{ 
                        width: '100%', 
                        height: '450px', 
                        background: 'white', 
                        borderRadius: '16px', 
                        overflow: 'hidden', 
                        border: '1px solid #eee',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        marginBottom: '15px'
                    }}>
                        <img 
                            src={productImages[activeImageIndex]} 
                            alt={product.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

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
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT: Details Section */}
                <div>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: '#888', fontWeight: 'bold', letterSpacing: '1px' }}>
                                {product.category}
                            </span>
                            {product.isHot && (
                                <span style={{ background: '#ff4d4f', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                    🔥 HOT ITEM
                                </span>
                            )}
                        </div>
                        
                        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '15px', color: '#111' }}>
                            {product.title}
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: '800', color: '#0070f3' }}>₱{product.price}</span>
                            <span style={{ background: '#f0f0f0', padding: '5px 12px', borderRadius: '8px', fontSize: '0.9rem', color: '#555' }}>
                                {getFlag(product.from)} From {product.from}
                            </span>
                        </div>

                        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Pasabuy Insights</h3>
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

                        {/* Top Sellers - CLICKABLE */}
                        {product.topSellers && (
                            <div style={{ marginBottom: '25px' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>Top Sellers for this item:</div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {product.topSellers.map((seller, idx) => (
                                        <Link 
                                            key={idx} 
                                            href={`/seller/${seller}`} // Linking to the new seller profile page
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

                        <button 
                            className="btn-primary" 
                            style={{ width: '100%', padding: '18px', fontSize: '1.1rem', justifyContent: 'center', borderRadius: '10px' }}
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                        
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#999', marginTop: '15px' }}>
                            Secure payment via Pasa.ph Escrow. 100% Authentic Guarantee.
                        </p>

                    </div>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
}