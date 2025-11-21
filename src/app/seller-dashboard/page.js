'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userTier, setUserTier] = useState('Standard'); // Default tier
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      
      // In a real app, we would fetch the user's tier from their profile in Firestore
      // For this demo, we keep it as local state so you can toggle it easily
    });

    // Fetch ALL pending requests
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

  // Mock logic to separate "High Value" requests
  // In real life, this could be based on price > ₱5000 or 'isUrgent' flag
  const highValueRequests = requests.filter(req => req.price >= 2000);
  const standardRequests = requests.filter(req => req.price < 2000);

  const handleAcceptRequest = (id) => {
    alert(`You have accepted request #${id.slice(0,5)}! The buyer will be notified.`);
    // In real app: updateDoc(doc(db, "requests", id), { status: 'accepted', sellerId: user.uid });
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
        
        {/* Dashboard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
                <h1 style={{ margin: 0 }}>Seller Dashboard</h1>
                <p style={{ color: '#666' }}>Welcome back, {user?.displayName || 'Traveler'}</p>
            </div>
            
            {/* Tier Toggler for Demo Purposes */}
            <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
                <span style={{ marginRight: '10px' }}>Current Tier: <strong>{userTier}</strong></span>
                {userTier === 'Standard' ? (
                    <button onClick={() => setUserTier('Gold')} style={{ cursor: 'pointer', color: '#d4af37', fontWeight: 'bold', border: 'none', background: 'none' }}>Simulate Upgrade to Gold ↗</button>
                ) : (
                    <button onClick={() => setUserTier('Standard')} style={{ cursor: 'pointer', color: '#666', fontWeight: 'bold', border: 'none', background: 'none' }}>Downgrade to Standard</button>
                )}
            </div>
        </div>

        {/* 1. EXCLUSIVE REQUESTS SECTION */}
        <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>💎 Gold/Diamond Exclusive Requests</h2>
                <span style={{ background: '#d4af37', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>HIGH VALUE</span>
            </div>

            {/* Gated Content Logic */}
            {userTier === 'Standard' ? (
                <div style={{ 
                    background: 'linear-gradient(135deg, #fff9e6 0%, #fff 100%)', 
                    border: '1px solid #d4af37', 
                    borderRadius: '12px', 
                    padding: '40px', 
                    textAlign: 'center',
                    color: '#856404'
                }}>
                    <h3 style={{ marginBottom: '10px' }}>🔒 Locked Access</h3>
                    <p style={{ marginBottom: '20px' }}>
                        There are <strong>{highValueRequests.length} high-value requests</strong> waiting. 
                        <br/>Only Gold and Diamond members can accept these orders.
                    </p>
                    <button 
                        onClick={() => router.push('/how-it-works')}
                        className="btn-primary" 
                        style={{ background: '#d4af37', border: 'none' }}
                    >
                        Upgrade Membership
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {highValueRequests.map(req => (
                        <div key={req.id} style={{ background: '#fff', border: '2px solid #d4af37', borderRadius: '12px', padding: '20px', position: 'relative', boxShadow: '0 4px 12px rgba(212, 175, 55, 0.1)' }}>
                            <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#d4af37', color: 'white', fontSize: '0.6rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>EXCLUSIVE</div>
                            <h4 style={{ margin: '0 0 5px' }}>{req.title}</h4>
                            <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 15px' }}>{req.from} &rarr; {req.to}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#d4af37' }}>₱{req.price}</span>
                                <button onClick={() => handleAcceptRequest(req.id)} style={{ background: '#d4af37', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Accept</button>
                            </div>
                        </div>
                    ))}
                    {highValueRequests.length === 0 && <p style={{ color: '#999' }}>No exclusive requests available right now.</p>}
                </div>
            )}
        </div>

        {/* 2. STANDARD REQUESTS SECTION */}
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Standard Requests</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {standardRequests.map(req => (
                    <div key={req.id} style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', padding: '20px' }}>
                        <h4 style={{ margin: '0 0 5px' }}>{req.title}</h4>
                        <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 15px' }}>{req.from} &rarr; {req.to}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>₱{req.price}</span>
                            <button onClick={() => handleAcceptRequest(req.id)} style={{ background: '#fff', border: '1px solid #0070f3', color: '#0070f3', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Accept</button>
                        </div>
                    </div>
                ))}
                {standardRequests.length === 0 && <p style={{ color: '#999' }}>No standard requests available.</p>}
            </div>
        </div>

      </div>
      <Footer />
    </>
  );
}