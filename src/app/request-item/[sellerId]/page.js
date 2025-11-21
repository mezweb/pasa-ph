'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function RequestItemPage() {
  const { sellerId } = useParams(); // This is the seller's name/ID
  const router = useRouter();
  const sellerName = decodeURIComponent(sellerId);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Food',
    quantity: 1,
    price: '',
    image: '',
    description: '',
    deliveryCity: 'Metro Manila'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check login
  useEffect(() => {
    if (!auth.currentUser) {
        // Ideally use onAuthStateChanged, but simple check for MVP form load
        // We will check again on submit
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
        alert("Please login to send a request.");
        router.push('/login');
        return;
    }

    setIsSubmitting(true);

    try {
        // Use placeholder if no image provided
        const finalImage = formData.image || `https://placehold.co/600x600/e3f2fd/0070f3?text=${encodeURIComponent(formData.title)}`;

        await addDoc(collection(db, "requests"), {
            ...formData,
            targetSeller: sellerName, // Specific field for targeted requests
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity),
            image: finalImage,
            userId: auth.currentUser.uid,
            userName: auth.currentUser.displayName,
            userPhoto: auth.currentUser.photoURL,
            createdAt: serverTimestamp(),
            status: 'pending_seller_approval' // Status tracking
        });

        alert(`Request sent to ${sellerName}!`);
        router.push('/requests');
    } catch (error) {
        console.error("Error sending request:", error);
        alert("Failed to send request.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '40px 20px' }}>
        <div className="container" style={{ maxWidth: '600px', background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            
            <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Request Item</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
                You are requesting an item specifically from <strong style={{ color: '#0070f3' }}>{sellerName}</strong>.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Item Name</label>
                    <input 
                        type="text" 
                        required 
                        placeholder="e.g. Tokyo Banana 8pc Box"
                        style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Category</label>
                        <select 
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option>Food</option>
                            <option>Beauty</option>
                            <option>Electronics</option>
                            <option>Clothing</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Quantity</label>
                        <input 
                            type="number" 
                            min="1"
                            required 
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                            value={formData.quantity}
                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Target Price / Budget (₱)</label>
                    <input 
                        type="number" 
                        required 
                        placeholder="e.g. 1000"
                        style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Include estimated service fee in your budget.</p>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Reference Image URL (Optional)</label>
                    <input 
                        type="url" 
                        placeholder="https://example.com/item.jpg"
                        style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Specific Details</label>
                    <textarea 
                        placeholder="Please specify size, color, flavor, or preferred store location..."
                        style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', minHeight: '100px', fontFamily: 'inherit' }}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Delivery City</label>
                    <select 
                        style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                        value={formData.deliveryCity}
                        onChange={(e) => setFormData({...formData, deliveryCity: e.target.value})}
                    >
                        <option>Metro Manila</option>
                        <option>Bulacan</option>
                        <option>Pampanga</option>
                        <option>Cavite</option>
                        <option>Laguna</option>
                        <option>Rizal</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ width: '100%', padding: '15px', marginTop: '10px', fontSize: '1rem', justifyContent: 'center' }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Sending Request..." : "Submit Request"}
                </button>

            </form>
        </div>
      </div>
      <Footer />
    </>
  );
}