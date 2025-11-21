'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
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
  const [userTier, setUserTier] = useState('Standard'); // Mock Tier
  const [focusCountry, setFocusCountry] = useState('Japan');
  const [secondaryCountry, setSecondaryCountry] = useState('USA'); // For Gold tier

  // Mock logic to determine accessible countries based on tier
  // Standard: Focus Country only
  // Gold: Focus + Secondary
  // Diamond: All
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      
      // Fetch Seller Profile to get Focus Country
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFocusCountry(docSnap.data().focusCountry || 'Japan');
        // For demo, we assume secondary is USA if not set
      }
    });

    // Fetch ALL requests (filtering happens in UI for this MVP)
    // In a real app with massive data, you'd query Firestore directly for specific countries
    const q = query(collection(db, "requests"));
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

  // Filter Logic Based on Tier
  const getFilteredRequests = () => {
    if (userTier === 'Diamond') return requests; // Unlimited access
    if (userTier === 'Gold') {
        return requests.filter(req => req.from === focusCountry || req.from === secondaryCountry);
    }
    // Standard
    return requests.filter(req => req.from === focusCountry);
  };

  const filteredRequests = getFilteredRequests();

  return (
    <>
      <Navbar />
      
      {/* Header */}
      <div style={{ background: '#111', color: 'white', padding: '40px 0' }}>
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', margin: 0 }}>Active Buyers</h1>
                    <p style={{ opacity: 0.7, marginTop: '5px' }}>
                        People looking for items from <strong>{userTier === 'Diamond' ? 'Everywhere' : focusCountry}</strong>
                        {userTier === 'Gold' && <span> & {secondaryCountry}</span>}
                    </p>
                </div>
                
                {/* Tier Simulator */}
                <div style={{ background: '#333', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#ccc' }}>View as:</span>
                    <select 
                        value={userTier} 
                        onChange={(e) => setUserTier(e.target.value)}
                        style={{ background: 'black', color: 'white', border: '1px solid #555', padding: '5px 10px', borderRadius: '4px' }}
                    >
                        <option value="Standard">Standard (1 Country)</option>
                        <option value="Gold">Gold (2 Countries)</option>
                        <option value="Diamond">Diamond (Unlimited)</option>
                    </select>
                </div>
            </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px', minHeight: '60vh' }}>
        
        {/* Tier Upsell Banner */}
        {userTier === 'Standard' && (
            <div style={{ background: '#f0f0f0', border: '1px solid #ccc', padding: '15px 20px', borderRadius: '8px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
                    <div>
                        <strong>Standard View:</strong> Showing buyers for <u>{focusCountry}</u> only.
                        <span style={{ display: 'block', fontSize: '0.85rem', color: '#666' }}>Upgrade to Gold to unlock a second destination, or Diamond for worldwide access.</span>
                    </div>
                </div>
                <Link href="/how-it-works" className="btn-primary" style={{ fontSize: '0.85rem', padding: '8px 15px' }}>Upgrade</Link>
            </div>
        )}

        <div className="card-grid">
            {loading && <p>Loading buyers...</p>}

            {!loading && filteredRequests.map(req => (
                <Link href={`/requests/${req.id}`} key={req.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Card 
                        title={req.title}
                        subtitle={`${req.from} → ${req.to}`}
                        price={`Willing to Pay: ₱${req.price}`}
                        image={req.image}
                        type="request"
                        badge="Buyer Request"
                    />
                </Link>
            ))}

            {!loading && filteredRequests.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#888' }}>
                    No active buyers found for {focusCountry}. Try changing your focus country in Profile or upgrading your tier.
                </div>
            )}
        </div>

      </div>
      <Footer />
    </>
  );
}