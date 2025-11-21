'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase'; 
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import Link from 'next/link';
import { POPULAR_SELLERS } from '../../lib/sellers';

export default function OffersPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('All'); // Filter for both lists
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({ title: '', from: 'Japan', to: 'Manila', date: '', fee: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Removed fetching of "activeTravelers" since we are removing that section

  const handleOpenPostModal = () => {
    if (!auth.currentUser) {
        router.push('/login');
        return;
    }
    setIsModalOpen(true);
  };

  const handlePostTrip = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "trips"), {
        ...newTrip,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
        createdAt: serverTimestamp()
      });
      setNewTrip({ title: '', from: 'Japan', to: 'Manila', date: '', fee: '' });
      setIsModalOpen(false);
      alert("Trip posted successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error posting trip.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // FILTER LOGIC
  const filteredTopSellers = filter === 'All' 
    ? POPULAR_SELLERS 
    : POPULAR_SELLERS.filter(s => s.countries.includes(filter));

  return (
    <>
      <Navbar />
      
      {/* HEADER & FILTERS */}
      <div style={{ background: '#f8f9fa', borderBottom: '1px solid #eaeaea', padding: '40px 0' }}>
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>Browse Top Sellers</h1>
                <button className="btn-primary" onClick={handleOpenPostModal}>+ Post a Trip</button>
            </div>
            
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                {['All', 'Japan', 'USA', 'South Korea', 'Singapore'].map(cat => (
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
        
        {/* SECTION 1: TOP RATED SELLERS ONLY */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '50px' }}>
            {filteredTopSellers.map(seller => (
                <Link href={`/seller/${seller.name}`} key={seller.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden', background: 'white', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ height: '100px', width: '100%', background: '#eee' }}>
                            <img src={seller.banner} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '0 20px 20px 20px', position: 'relative', marginTop: '-40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                                <img src={seller.avatar} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid white', background:'white' }} />
                                <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '5px' }}>{seller.level}</div>
                            </div>
                            <h3 style={{ margin: '0 0 5px', fontSize: '1.2rem' }}>{seller.name}</h3>
                            <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#333', fontWeight: '500' }}>
                                <span>⭐ {seller.rating}</span>
                                <span>📍 {seller.countries[0]}</span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            {filteredTopSellers.length === 0 && <p style={{ color: '#999' }}>No top sellers found for this filter.</p>}
        </div>

        {/* Removed Active Travelers Section */}
      </div>
      <Footer />

      {/* POST TRIP MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post a Trip">
        <form onSubmit={handlePostTrip} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Trip Title</label>
            <input type="text" required placeholder="e.g. Christmas in Manila" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} value={newTrip.title} onChange={(e) => setNewTrip({...newTrip, title: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Flying From</label>
              <select style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} value={newTrip.from} onChange={(e) => setNewTrip({...newTrip, from: e.target.value})}>
                <option value="Japan">Japan</option>
                <option value="USA">USA</option>
                <option value="South Korea">South Korea</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Arrival City</label>
              <select style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} value={newTrip.to} onChange={(e) => setNewTrip({...newTrip, to: e.target.value})}>
                 <option value="Manila">Metro Manila</option>
                 <option value="Bulacan">Bulacan</option>
                 <option value="Pampanga">Pampanga</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Travel Date</label>
            <input type="date" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} value={newTrip.date} onChange={(e) => setNewTrip({...newTrip, date: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Service Fee</label>
            <input type="text" required placeholder="e.g. 10% or ₱500 flat" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} value={newTrip.fee} onChange={(e) => setNewTrip({...newTrip, fee: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '10px', justifyContent: 'center' }} disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Trip"}
          </button>
        </form>
      </Modal>
    </>
  );
}