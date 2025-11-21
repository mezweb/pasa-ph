'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 
import { db, auth } from '../../lib/firebase'; 
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Modal from '../../components/Modal'; 

export default function RequestsPage() {
  const router = useRouter(); 
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState('All');
  const [user, setUser] = useState(null); 
  
  // Expanded Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ 
    title: '', 
    from: 'Bulacan', 
    to: 'Manila', 
    price: '',
    category: 'Food',
    image: '',
    quantity: 1,
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. CHECK LOGIN STATUS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. FETCH DATA ---
  useEffect(() => {
    const q = query(collection(db, "requests"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setRequests(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 3. HANDLE ACTIONS ---
  
  const handleOpenPostModal = () => {
    if (!user) {
        router.push('/login'); 
        return;
    }
    setIsModalOpen(true);
  };

  const handleCardClick = (id) => {
    if (!user) {
        router.push('/login'); 
        return;
    }
    router.push(`/requests/${id}`);
  };

  const handlePostRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use placeholder if no image link provided
      const finalImage = newItem.image || `https://placehold.co/600x400/e3f2fd/0070f3?text=${encodeURIComponent(newItem.title)}`;

      await addDoc(collection(db, "requests"), {
        ...newItem,
        price: parseFloat(newItem.price),
        quantity: parseInt(newItem.quantity),
        image: finalImage,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        createdAt: serverTimestamp()
      });
      
      setNewItem({ 
        title: '', from: 'Bulacan', to: 'Manila', price: '', 
        category: 'Food', image: '', quantity: 1, description: '' 
      });
      setIsModalOpen(false);
      alert("Request posted successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error posting request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. FILTER LOGIC ---
  const filteredRequests = locationFilter === 'All' 
    ? requests 
    : requests.filter(item => item.from === locationFilter || item.to === locationFilter);

  return (
    <>
      <Navbar />
      <div className="container">
        
        <div style={{ marginTop: '40px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Marketplace Requests</h1>
          <button className="btn-primary" onClick={handleOpenPostModal}>
            + Post a Request
          </button>
        </div>

        {/* Filters */}
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #eee' }}>
          <span style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Origin:</span>
          <select 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="All">All Locations</option>
            <optgroup label="Philippines">
                <option value="Bulacan">Bulacan</option>
                <option value="Pampanga">Pampanga</option>
                <option value="Manila">Manila</option>
            </optgroup>
            <optgroup label="International">
                <option value="Japan">Japan</option>
                <option value="USA">USA</option>
                <option value="South Korea">South Korea</option>
                <option value="Singapore">Singapore</option>
            </optgroup>
          </select>
        </div>

        {/* Grid */}
        <div className="card-grid">
          {loading && <p>Loading requests...</p>}
          
          {!loading && filteredRequests.map(req => (
            <div 
                key={req.id} 
                onClick={() => handleCardClick(req.id)} 
                style={{ cursor: 'pointer' }}
            >
                <Card 
                title={req.title}
                subtitle={`${req.from} → ${req.to}`}
                image={req.image} // Pass the specific image
                price={
                    user 
                    ? `₱${req.price}` 
                    : <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'normal' }}>Sign up or log in to view price</span>
                } 
                type="request"
                badge={req.category} // Show category as badge
                />
            </div>
          ))}
        </div>
      </div>
      
      <Footer />

      {/* EXPANDED POST REQUEST MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post a Request">
        <form onSubmit={handlePostRequest} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '5px' }}>
          
          {/* Item Name */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Item Name</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Good Shepherd Ube Jam"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
            />
          </div>

          {/* Category & Quantity */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 2 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Category</label>
                <select 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                >
                    <option>Food</option>
                    <option>Beauty</option>
                    <option>Electronics</option>
                    <option>Furniture</option>
                    <option>Clothing</option>
                    <option>Other</option>
                </select>
            </div>
            <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Quantity</label>
                <input 
                    type="number" 
                    min="1"
                    required 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                />
            </div>
          </div>

          {/* Locations */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Buy From</label>
              <select 
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                value={newItem.from}
                onChange={(e) => setNewItem({...newItem, from: e.target.value})}
              >
                <optgroup label="Philippines">
                    <option value="Bulacan">Bulacan</option>
                    <option value="Pampanga">Pampanga</option>
                    <option value="Manila">Manila</option>
                </optgroup>
                <optgroup label="International">
                    <option value="Japan">Japan</option>
                    <option value="USA">USA</option>
                    <option value="South Korea">South Korea</option>
                </optgroup>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Deliver To</label>
              <select 
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                value={newItem.to}
                onChange={(e) => setNewItem({...newItem, to: e.target.value})}
              >
                 <option value="Manila">Metro Manila</option>
                 <option value="Bulacan">Bulacan</option>
                 <option value="Pampanga">Pampanga</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Willing to Pay (Total ₱)</label>
            <input 
              type="number" 
              required 
              placeholder="e.g. 500"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
            />
          </div>

          {/* Image URL */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Image Link (Optional)</label>
            <input 
              type="url" 
              placeholder="https://example.com/image.jpg"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              value={newItem.image}
              onChange={(e) => setNewItem({...newItem, image: e.target.value})}
            />
            <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '5px' }}>
                Paste a link to the item image from Google or an online store.
            </p>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Details / Notes</label>
            <textarea 
              placeholder="Specific flavor, size, color, or store location..."
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px', fontFamily: 'inherit' }}
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: '10px', justifyContent: 'center', padding: '12px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Submit Request"}
          </button>
        </form>
      </Modal>
    </>
  );
}