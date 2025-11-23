'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; 
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function RequestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [item, setItem] = useState(null);
  const [requester, setRequester] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;
      
      const docRef = doc(db, "requests", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setItem(data);

        if (data.userId) {
            const userRef = doc(db, "users", data.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setRequester(userSnap.data());
            }
        }
      }
      setLoading(false);
    };

    fetchRequest();
  }, [id]);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: '#888' }}>Loading product details...</div>;
  if (!item) return <div style={{ padding: '100px', textAlign: 'center' }}>Item not found.</div>;

  const getFlag = (country) => {
    if (country === 'Japan') return '🇯🇵';
    if (country === 'USA') return '🇺🇸';
    if (country === 'South Korea') return '🇰🇷';
    if (country === 'Singapore') return '🇸🇬';
    if (country === 'Hong Kong') return '🇭🇰';
    if (country === 'Indonesia') return '🇮🇩';
    return '🇵🇭';
  };

  const productImages = [
    item.image || `https://placehold.co/600x600/e3f2fd/0070f3?text=${encodeURIComponent(item.title)}`,
    `https://placehold.co/600x600/f0f0f0/999?text=Side+View`,
    `https://placehold.co/600x600/f0f0f0/999?text=Back+View`
  ];

  return (
    <>
      <Navbar />
      <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
        <div className="container" style={{ padding: '40px 20px' }}>
            
            <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
                <Link href="/" style={{ textDecoration: 'none', color: '#999' }}>Shop</Link> 
                <span style={{ margin: '0 10px' }}>/</span> 
                <Link href="/requests" style={{ textDecoration: 'none', color: '#999' }}>Requests</Link> 
                <span style={{ margin: '0 10px' }}>/</span> 
                <span style={{ color: '#333', fontWeight: '500' }}>{item.title}</span>
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
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        marginBottom: '15px'
                    }}>
                        <img 
                            src={productImages[activeImageIndex]} 
                            alt={item.title} 
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

                {/* RIGHT: DETAILS */}
                <div>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: '#888', fontWeight: 'bold', letterSpacing: '1px' }}>
                                {item.category || "General Item"}
                            </span>
                        </div>
                        
                        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '15px', color: '#111' }}>
                            {item.title}
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: '800', color: '#0070f3' }}>₱{item.price}</span>
                            <span style={{ background: '#e3f2fd', color: '#0070f3', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                Willing to Pay
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '30px', padding: '20px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', marginBottom: '25px' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Quantity</div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.quantity || 1} pc(s)</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Buy From</div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.from}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Deliver To</div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.to}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px' }}>Description / Notes</h3>
                            <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                {item.description || "No specific instructions provided. Please contact the buyer for more details regarding size, flavor, or specific store location."}
                            </p>
                        </div>

                        <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <img 
                                src={requester?.photoURL || item.userPhoto || "https://placehold.co/50x50?text=U"} 
                                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                            />
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                                    {requester?.displayName || item.userName || "Anonymous Buyer"}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                    Verified Request • {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}
                                </div>
                            </div>
                        </div>

                        <button 
                            className="btn-primary" 
                            style={{ width: '100%', padding: '18px', fontSize: '1.1rem', justifyContent: 'center', borderRadius: '10px' }}
                            onClick={() => router.push('/support')} // REDIRECT TO SUPPORT
                        >
                            Contact Support to Offer
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