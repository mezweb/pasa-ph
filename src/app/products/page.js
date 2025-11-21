'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { POPULAR_PRODUCTS } from '../../lib/products';
import { useCart } from '../../context/CartContext'; // Import context

export default function SellerProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [focusCountry, setFocusCountry] = useState('Japan');
  
  // Membership Tier Simulation (Default Standard)
  const [membership, setMembership] = useState('Standard'); 
  const { addToBag } = useCart(); // Use addToBag

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Fetch user preferences (Focus Country)
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFocusCountry(docSnap.data().focusCountry || 'Japan');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // FILTER LOGIC: Only show products from the seller's focus country
  const filteredProducts = POPULAR_PRODUCTS.filter(p => p.from === focusCountry);

  // TIER LOGIC FOR "HOT ITEMS" TIMEFRAME TEXT
  const getTimeframeText = () => {
    if (membership === 'Platinum') return 'Today (Real-time)';
    if (membership === 'Gold') return 'This Week';
    return 'This Month';
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

  return (
    <>
      <Navbar />
      
      {/* HEADER */}
      <div style={{ background: '#111', color: 'white', padding: '40px 0' }}>
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', margin: 0 }}>Seller Market: {focusCountry}</h1>
                    <p style={{ opacity: 0.7, marginTop: '5px' }}>Top requested items you can fulfill.</p>
                </div>
                
                {/* Tier Simulator */}
                <div style={{ background: '#333', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#ccc' }}>View as:</span>
                    <select 
                        value={membership} 
                        onChange={(e) => setMembership(e.target.value)}
                        style={{ background: 'black', color: 'white', border: '1px solid #555', padding: '5px 10px', borderRadius: '4px' }}
                    >
                        <option value="Standard">Standard</option>
                        <option value="Gold">Gold Member</option>
                        <option value="Platinum">Platinum Member</option>
                    </select>
                </div>
            </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px', minHeight: '60vh' }}>
        
        {/* TIER NOTIFICATION BANNER */}
        <div style={{ background: membership === 'Standard' ? '#f0f0f0' : (membership === 'Gold' ? '#fff9e6' : '#e6f7ff'), border: `1px solid ${membership === 'Standard' ? '#ccc' : (membership === 'Gold' ? '#d4af37' : '#00c3ff')}`, padding: '15px 20px', borderRadius: '8px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>{membership === 'Standard' ? 'ℹ️' : (membership === 'Gold' ? '🏆' : '💎')}</span>
            <div>
                <strong>{membership} View:</strong> Showing hot items for <u>{getTimeframeText()}</u>.
                {membership === 'Standard' && <span style={{ display: 'block', fontSize: '0.85rem', color: '#666' }}>Upgrade to see faster trends and get ahead of other sellers.</span>}
            </div>
        </div>

        {/* PRODUCT LIST */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
            {filteredProducts.map(product => (
                <div key={product.id} style={{ border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden', background: 'white', position: 'relative' }}>
                    
                    {/* Hot Badge logic depending on tier (Simulated) */}
                    {product.isHot && (
                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#ff4d4f', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 10 }}>
                            🔥 {membership === 'Platinum' ? 'TRENDING NOW' : 'HOT ITEM'}
                        </div>
                    )}

                    <div style={{ height: '200px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={product.images ? product.images[0] : product.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ padding: '15px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px' }}>{product.title}</h3>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
                            <span>{product.requests} Requests</span>
                            <span>Avg Price: ₱{product.price}</span>
                        </div>

                        {/* ADD TO BAG BUTTON */}
                        <button 
                            className="btn-primary"
                            style={{ width: '100%', padding: '10px', fontSize: '0.9rem', justifyContent: 'center' }}
                            onClick={() => addToBag(product)}
                        >
                            + Add to Pasa Bag
                        </button>
                    </div>
                </div>
            ))}
            
            {filteredProducts.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#888' }}>
                    No hot items found for {focusCountry} right now. Try updating your focus country in your profile.
                </div>
            )}
        </div>

      </div>
      <Footer />
    </>
  );
}