'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Link from 'next/link';

export default function BuyersPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
    });

    // Fetch all active buyer requests
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const unsubscribeRequests = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(items);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubscribeRequests();
    };
  }, [router]);

  // Filter requests by country and search query
  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'All' || req.from === filter;
    const matchesSearch = !searchQuery ||
      req.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.to?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const countries = ['All', 'Japan', 'USA', 'South Korea', 'Singapore', 'Hong Kong', 'Vietnam'];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '60px 20px' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: '900', margin: '0 0 15px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            🛍️ Active Buyer Requests
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', opacity: 0.95, maxWidth: '700px', margin: 0, lineHeight: '1.6' }}>
            Browse requests from shoppers looking for items from abroad. Accept orders and earn money on your next trip!
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ padding: '20px' }}>

          {/* Search Box */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="🔍 Search by item, country, or destination..."
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

          {/* Country Filter Tabs */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
            {countries.map(country => (
              <button
                key={country}
                onClick={() => setFilter(country)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '25px',
                  border: 'none',
                  background: filter === country ? '#0070f3' : '#f8f9fa',
                  color: filter === country ? 'white' : '#666',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  boxShadow: filter === country ? '0 4px 12px rgba(0,112,243,0.3)' : 'none'
                }}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container" style={{ padding: '40px 20px', minHeight: '60vh' }}>

        {/* Results Count */}
        <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 5px', color: '#333' }}>
              {filteredRequests.length} {filteredRequests.length === 1 ? 'Request' : 'Requests'} Available
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem', margin: 0 }}>
              {filter === 'All' ? 'Showing all countries' : `Showing requests from ${filter}`}
            </p>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0070f3' }}>{requests.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2e7d32' }}>{filteredRequests.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filtered</div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="card-grid">
          {loading && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⏳</div>
              <p style={{ color: '#999', fontSize: '1.1rem' }}>Loading buyer requests...</p>
            </div>
          )}

          {!loading && filteredRequests.map(req => (
            <Link href={`/requests/${req.id}`} key={req.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card
                title={req.title}
                subtitle={`${req.from} → ${req.to}`}
                price={`Willing to Pay: ₱${req.price?.toLocaleString() || '0'}`}
                image={req.image}
                type="request"
                badge="Buyer Request"
              />
            </Link>
          ))}

          {!loading && filteredRequests.length === 0 && (
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
                No Requests Found
              </h3>
              <p style={{ color: '#666', fontSize: '1rem', marginBottom: '20px' }}>
                {searchQuery ?
                  `No requests match "${searchQuery}". Try a different search term.` :
                  `No requests from ${filter === 'All' ? 'any country' : filter} at the moment. Check back soon!`
                }
              </p>
              {(searchQuery || filter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('All');
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
        {!loading && filteredRequests.length > 0 && (
          <div style={{
            marginTop: '60px',
            padding: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            textAlign: 'center',
            color: 'white'
          }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px' }}>
              💼 Ready to Start Earning?
            </h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.95, marginBottom: '25px', maxWidth: '600px', margin: '0 auto 25px' }}>
              Register your upcoming trip and start accepting orders. Turn your travel into income!
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
                Go to Dashboard →
              </button>
            </Link>
          </div>
        )}

      </div>
      <Footer />
    </>
  );
}
