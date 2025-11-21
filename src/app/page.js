'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { POPULAR_PRODUCTS } from '../lib/products';
import { POPULAR_SELLERS } from '../lib/sellers'; 
import { useCart } from '../context/CartContext';

export default function Home() {
  const [category, setCategory] = useState('All');
  const [sellerCategory, setSellerCategory] = useState('All'); 
  
  // Use viewMode from Context for persistence
  const { addToCart, viewMode } = useCart(); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter(); 

  // --- PERSISTENT REDIRECT LOGIC ---
  useEffect(() => {
    // Only redirect if the user has explicitly switched to "Seller Mode"
    if (viewMode === 'seller') {
        router.push('/seller-dashboard');
    }
  }, [viewMode, router]);
  // ---------------------------------

  const slides = [
    { 
        id: 1, bg: 'linear-gradient(135deg, #111, #333)', text: 'BLACK FRIDAY SALE', sub: 'Get up to 50% OFF on Electronics from USA', color: '#fff', btnColor: '#d4af37', btnText: '#000'
    },
    { 
        id: 2, bg: 'linear-gradient(135deg, #c62828, #b71c1c)', text: 'HOLIDAY SPECIALS', sub: 'Send gifts to your loved ones in the Philippines', color: '#fff', btnColor: '#fff', btnText: '#b71c1c'
    },
    { 
        id: 3, bg: 'linear-gradient(135deg, #f8bbd0, #f48fb1)', text: 'SKINCARE DEALS', sub: 'Top Korean & Japanese Beauty Products on Sale', color: '#880e4f', btnColor: '#880e4f', btnText: '#fff'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  const filteredProducts = POPULAR_PRODUCTS.filter(p => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.from.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).slice(0, 8); 

  const filteredSellers = sellerCategory === 'All' ? POPULAR_SELLERS : POPULAR_SELLERS.filter(s => s.countries.includes(sellerCategory));

  // Prevent flash of content if redirecting
  if (viewMode === 'seller') return null; 

  return (
    <>
      <Navbar />
      
      {/* --- PROMO SLIDER --- */}
      <div style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
        {slides.map((slide, index) => (
            <div key={slide.id} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: slide.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: slide.color, opacity: index === currentSlide ? 1 : 0, transition: 'opacity 0.8s ease-in-out', zIndex: index === currentSlide ? 1 : 0 }}>
                <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '10px', textAlign: 'center' }}>{slide.text}</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '20px', opacity: 0.9 }}>{slide.sub}</p>
                <button onClick={() => document.getElementById('shop').scrollIntoView({behavior: 'smooth'})} style={{ padding: '12px 30px', fontSize: '1rem', fontWeight: 'bold', borderRadius: '30px', border: 'none', background: slide.btnColor, color: slide.btnText, cursor: 'pointer' }}>Shop Now</button>
            </div>
        ))}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 10 }}>
            {slides.map((_, idx) => (
                <div key={idx} onClick={() => setCurrentSlide(idx)} style={{ width: '10px', height: '10px', borderRadius: '50%', background: idx === currentSlide ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }}></div>
            ))}
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div style={{ background: '#f8f9fa', padding: '40px 20px', borderBottom: '1px solid #eaeaea' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: '400' }}>
                You're one search away from your <span style={{ fontWeight: '800' }}>favorite item</span>
            </h2>
            <div style={{ display: 'flex', background: 'white', borderRadius: '50px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid #eaeaea', maxWidth: '700px', margin: '0 auto' }}>
                <input type="text" placeholder="Search items (e.g. Tokyo Banana, iPhone, Glossier)..." style={{ flex: 1, padding: '15px 25px', border: 'none', fontSize: '1rem', outline: 'none' }} value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); if(e.target.value.length === 1) document.getElementById('shop').scrollIntoView({behavior: 'smooth'}); }} />
                <button onClick={() => document.getElementById('shop').scrollIntoView({behavior: 'smooth'})} style={{ background: 'black', color: 'white', border: 'none', padding: '0 30px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>Search &rarr;</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                {['Food', 'Beauty', 'Electronics', 'Japan', 'USA'].map(tag => (
                    <button key={tag} onClick={() => { setCategory(tag === 'Japan' || tag === 'USA' ? 'All' : tag); setSearchQuery(tag === 'Japan' || tag === 'USA' ? tag : ''); document.getElementById('shop').scrollIntoView({behavior: 'smooth'}); }} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '20px', padding: '6px 16px', fontSize: '0.85rem', color: '#666', cursor: 'pointer', transition: '0.2s' }} onMouseOver={(e) => e.target.style.borderColor = '#000'} onMouseOut={(e) => e.target.style.borderColor = '#ddd'}>{tag}</button>
                ))}
            </div>
        </div>
      </div>

      {/* SHOP SECTION */}
      <div id="shop" className="container" style={{ padding: '40px 20px' }}>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid #eee' }}>
            {['All', 'Food', 'Beauty', 'Electronics'].map(cat => (
                <button key={cat} onClick={() => { setCategory(cat); setSearchQuery(''); }} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: category === cat ? '#0070f3' : '#f0f0f0', color: category === cat ? 'white' : '#333', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{cat}</button>
            ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px', marginBottom: '60px' }}>
            {filteredProducts.length > 0 ? filteredProducts.map(product => (
                <Link href={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'white', position: 'relative', height: '100%', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        {product.isHot && <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#ff4d4f', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 10 }}>🔥 HOT ITEM</div>}
                        <div style={{ height: '200px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={product.images ? product.images[0] : product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                        <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>{product.from}</div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px' }}>{product.title}</h3>
                            <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', color: '#666', marginBottom: '15px' }}>
                                <span style={{ background: '#e3f2fd', color: '#0070f3', padding: '2px 6px', borderRadius: '4px' }}>{product.requests} Requests</span>
                                <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 6px', borderRadius: '4px' }}>{product.sellers} Sellers</span>
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₱{product.price}</div>
                                <button onClick={(e) => { e.preventDefault(); addToCart(product); }} style={{ background: '#0070f3', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </Link>
            )) : <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#888' }}><h3>No items found for "{searchQuery}"</h3><p>Try searching for "Food", "Japan", or specific items like "Irvins".</p><button onClick={() => setSearchQuery('')} style={{ marginTop: '10px', color: '#0070f3', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear Search</button></div>}
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