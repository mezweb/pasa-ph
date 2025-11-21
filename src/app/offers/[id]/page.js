'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Added useRouter
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [seller, setSeller] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      const tripRef = doc(db, "trips", id);
      const tripSnap = await getDoc(tripRef);

      if (tripSnap.exists()) {
        const tripData = { id: tripSnap.id, ...tripSnap.data() };
        setTrip(tripData);

        if (tripData.userId) {
            const userRef = doc(db, "users", tripData.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setSeller(userSnap.data());
            }
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading details...</div>;
  if (!trip) return <div style={{ padding: '50px', textAlign: 'center' }}>Trip not found!</div>;

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '40px 20px', maxWidth: '900px' }}>
        
        <Link href="/offers" style={{ color: '#666', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '20px' }}>
          &larr; Back to Sellers
        </Link>

        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eaeaea', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            
            {/* Banner Image */}
            <div style={{ height: '180px', background: 'linear-gradient(to right, #f0f0f0, #e3f2fd)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '3rem' }}>
                ✈️ 🛍️
            </div>

            <div style={{ padding: '30px' }}>
                {/* Trip Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Active Seller
                        </span>
                        <h1 style={{ fontSize: '2rem', margin: '15px 0 10px' }}>{trip.title || "Untitled Trip"}</h1>
                        <p style={{ color: '#666', fontSize: '1.1rem' }}>
                            Flying from <strong>{trip.from}</strong> to <strong>{trip.to}</strong>
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Service Fee</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0070f3' }}>{trip.fee}</div>
                    </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '30px 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                    
                    {/* LEFT COLUMN: Details */}
                    <div>
                        <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>Itinerary</h3>
                        <ul style={{ listStyle: 'none', color: '#555', padding: 0, background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                            <li style={{ marginBottom: '10px' }}>📅 <strong>Date:</strong> {trip.date}</li>
                            <li style={{ marginBottom: '10px' }}>📍 <strong>Origin:</strong> {trip.from}</li>
                            <li style={{ marginBottom: '10px' }}>🏁 <strong>Destination:</strong> {trip.to}</li>
                        </ul>

                        {/* TIKTOK EMBED */}
                        {seller?.socials?.tiktokVideoId && (
                            <div style={{ marginTop: '30px' }}>
                                <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Intro Video</h3>
                                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                                    <iframe 
                                        src={`https://www.tiktok.com/embed/v2/${seller.socials.tiktokVideoId}`} 
                                        style={{ width: '100%', height: '400px', border: 'none' }}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Seller Profile */}
                    <div>
                        <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>About the Seller</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                            <img 
                                src={seller?.photoURL || trip.userPhoto || "https://placehold.co/60x60/0070f3/ffffff?text=U"} 
                                alt="User" 
                                style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} 
                            />
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{seller?.displayName || trip.userName || "Seller"}</div>
                                <div style={{ fontSize: '0.85rem', color: '#2e7d32' }}>✅ Identity Verified</div>
                            </div>
                        </div>

                        <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.6', marginBottom: '20px', fontStyle: 'italic' }}>
                            "{seller?.bio || "No bio provided yet."}"
                        </p>

                        {/* SOCIAL LINKS */}
                        {seller?.socials && (
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                                {seller.socials.instagram && (
                                    <a href={`https://instagram.com/${seller.socials.instagram.replace('@','')}`} target="_blank" style={{ flex: 1, textAlign: 'center', background: '#f09433', background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', color: 'white', padding: '8px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' }}>
                                        Instagram
                                    </a>
                                )}
                                {seller.socials.facebook && (
                                    <a href={seller.socials.facebook} target="_blank" style={{ flex: 1, textAlign: 'center', background: '#1877F2', color: 'white', padding: '8px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' }}>
                                        Facebook
                                    </a>
                                )}
                            </div>
                        )}

                        <div>
                            <button 
                                className="btn-primary" 
                                style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1.1rem' }}
                                onClick={() => router.push('/support')} // REDIRECT TO SUPPORT
                            >
                                Contact Support to Order
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
      <Footer />
    </>
  );
}