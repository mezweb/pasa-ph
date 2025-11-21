'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { POPULAR_PRODUCTS } from '../../lib/products';
import { useCart } from '../../context/CartContext';

export default function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // Get params from URL
  const initialCategory = searchParams.get('category') || 'All';
  const initialCountry = searchParams.get('country') || 'All'; 

  const [category, setCategory] = useState(initialCategory);
  const [country, setCountry] = useState(initialCountry); 
  const [sort, setSort] = useState('hot'); 

  // Update state if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    const cou = searchParams.get('country');
    if (cat) setCategory(cat);
    if (cou) setCountry(cou);
    
    if (!cou && !cat) { 
        // Optional: Reset if neither exists
    }
  }, [searchParams]);

  // Filter & Sort Logic
  let displayedProducts = POPULAR_PRODUCTS.filter(p => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesCountry = country === 'All' || p.from === country; // Filter by Country
    return matchesCategory && matchesCountry;
  });

  if (sort === 'hot') {
    displayedProducts.sort((a, b) => (b.isHot === a.isHot ? 0 : b.isHot ? 1 : -1) || b.requests - a.requests);
  } else if (sort === 'price-low') {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    displayedProducts.sort((a, b) => b.price - a.price);
  }

  const updateFilters = (newCat, newCou) => {
    setCategory(newCat);
    setCountry(newCou);
    
    // Build URL params
    const params = new URLSearchParams();
    if (newCat !== 'All') params.set('category', newCat);
    if (newCou !== 'All') params.set('country', newCou);
    
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    {/* Category Filters */}
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>Category:</span>
                        {['All', 'Food', 'Beauty', 'Electronics', 'Clothing', 'Other'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => updateFilters(cat, country)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid #ddd',
                                    background: category === cat ? '#333' : 'white',
                                    color: category === cat ? 'white' : '#666',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Country Filters */}
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', alignItems: 'center' }}>
                         <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>Country:</span>
                        {['All', 'Philippines', 'Japan', 'USA', 'South Korea', 'Singapore', 'Hong Kong'].map(cou => (
                            <button 
                                key={cou}
                                onClick={() => updateFilters(category, cou)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid #ddd',
                                    background: country === cou ? '#0070f3' : 'white', // Blue for active country
                                    color: country === cou ? 'white' : '#666',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {cou === 'Philippines' ? '🇵🇭 Philippines' : cou}
                            </button>
                        ))}
                    </div>
                </div>

                <select 
                    value={sort} 
                    onChange={(e) => setSort(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer', height: '40px' }}
                >
                    <option value="hot">Sort by: Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                </select>
            </div>

            {/* Active Filter Display */}
            {(category !== 'All' || country !== 'All') && (
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Showing results for 
                    {category !== 'All' && <span style={{ fontWeight: 'bold', color: '#333' }}> {category}</span>}
                    {category !== 'All' && country !== 'All' && ' from '}
                    {country !== 'All' && <span style={{ fontWeight: 'bold', color: '#333' }}> {country === 'Philippines' ? 'Philippines (Local)' : country}</span>}
                    <button 
                        onClick={() => updateFilters('All', 'All')}
                        style={{ marginLeft: '15px', color: 'red', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem' }}
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
                {displayedProducts.map(product => (
                    <Link href={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'white', position: 'relative', height: '100%', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            
                            {product.isHot && (
                                <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#ff4d4f', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 10 }}>
                                    🔥 HOT
                                </div>
                            )}

                            <div style={{ height: '220px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={product.images ? product.images[0] : product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>

                            <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>{product.from}</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px' }}>{product.title}</h3>
                                
                                <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', color: '#666', marginBottom: '15px' }}>
                                    <span style={{ background: '#e3f2fd', color: '#0070f3', padding: '2px 6px', borderRadius: '4px' }}>
                                        {product.requests} Requests
                                    </span>
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₱{product.price}</div>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault(); 
                                            addToCart(product);
                                        }}
                                        style={{ background: '#0070f3', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
                
                {displayedProducts.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#888' }}>
                        No products found matching your filters.
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}