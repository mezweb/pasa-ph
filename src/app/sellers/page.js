'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function OffersPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch sellers from Firestore
  useEffect(() => {
    const sellersQuery = query(
      collection(db, 'users'),
      where('isSeller', '==', true),
      where('isVisible', '==', true)
    );

    const unsubscribe = onSnapshot(sellersQuery, (snapshot) => {
      const sellersData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.displayName || 'Anonymous Seller',
          avatar: data.photoURL || 'https://placehold.co/80x80?text=S',
          banner: data.bannerURL || 'https://placehold.co/400x100/0070f3/ffffff?text=Banner',
          rating: data.rating || 5.0,
          countries: data.travelCountries || [],
          level: data.level || 'Standard',
          bio: data.bio || '',
          city: data.city || '',
          phoneNumber: data.phoneNumber || '',
          languages: data.languages || [],
          responseRate: data.responseRate || 95,
          completedTrips: data.completedTrips || 0,
          uid: doc.id
        };
      });
      setSellers(sellersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // FILTER LOGIC
  const filteredTopSellers = filter === 'All'
    ? sellers
    : sellers.filter(s => s.countries.includes(filter));

  return (
    <>
      <Navbar />
      
      {/* HEADER & FILTERS */}
      <div style={{ background: '#f8f9fa', borderBottom: '1px solid #eaeaea', padding: '40px 0' }}>
        <div className="container">
            <h1 style={{ marginBottom: '20px' }}>Browse Top Sellers</h1>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                {['All', 'Japan', 'USA', 'South Korea', 'Singapore', 'Hong Kong', 'Vietnam'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            background: filter === cat ? '#333' : 'white',
                            color: filter === cat ? 'white' : '#666',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px', minHeight: '50vh' }}>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⏳</div>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading sellers...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && sellers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px', border: '1px solid #eaeaea' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👥</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#333' }}>No Sellers Available Yet</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Be the first seller! Complete your profile to become visible to buyers.
            </p>
            <Link href="/signup">
              <button style={{
                padding: '12px 24px',
                background: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                Become a Seller
              </button>
            </Link>
          </div>
        )}

        {/* SECTION 1: VISIBLE SELLERS FROM FIRESTORE */}
        {!loading && sellers.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '50px' }}>
            {filteredTopSellers.map(seller => (
                <Link href={`/seller/${seller.uid}`} key={seller.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden', background: 'white', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ height: '100px', width: '100%', background: '#eee' }}>
                            <img src={seller.banner} alt={`${seller.name} banner`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '0 20px 20px 20px', position: 'relative', marginTop: '-40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                                <img src={seller.avatar} alt={seller.name} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid white', background:'white' }} />
                                <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '5px' }}>{seller.level}</div>
                            </div>
                            <h3 style={{ margin: '0 0 5px', fontSize: '1.2rem' }}>{seller.name}</h3>
                            <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#333', fontWeight: '500' }}>
                                <span>⭐ {seller.rating.toFixed(1)}</span>
                                <span>📍 {seller.countries.length > 0 ? seller.countries[0] : seller.city || 'Philippines'}</span>
                            </div>
                            {seller.bio && (
                              <p style={{
                                margin: '10px 0 0',
                                fontSize: '0.8rem',
                                color: '#666',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {seller.bio}
                              </p>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
            {filteredTopSellers.length === 0 && !loading && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ color: '#999', fontSize: '1.1rem' }}>No sellers found for "{filter}". Try a different country filter.</p>
              </div>
            )}
          </div>
        )}

        {/* Removed Active Travelers Section */}
      </div>
      <Footer />
    </>
  );
}