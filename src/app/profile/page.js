'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form State
  const [role, setRole] = useState('Buyer');
  const [isSellerMode, setIsSellerMode] = useState(false);
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [locations, setLocations] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [tiktokVideoId, setTiktokVideoId] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [focusCountry, setFocusCountry] = useState('Japan'); // Load focus country

  // Item Form State
  const [myItems, setMyItems] = useState([]);
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Food',
    price: '',
    description: '',
    image1: '',
    image2: '',
    videoUrl: ''
  });
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setBio(data.bio || '');
        setRole(data.role || 'Buyer');
        setIsSellerMode(data.isSeller || false);
        setCity(data.city || '');
        setDeliveryAddress(data.deliveryAddress || '');
        setLocations(data.locations || '');
        setInstagram(data.socials?.instagram || '');
        setFacebook(data.socials?.facebook || '');
        setTiktokVideoId(data.socials?.tiktokVideoId || '');
        setBannerUrl(data.bannerUrl || '');
        setFocusCountry(data.focusCountry || 'Japan'); 

        if (data.isSeller) {
            const itemsRef = collection(db, "users", currentUser.uid, "items");
            const itemsSnap = await getDocs(itemsRef);
            const itemsList = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMyItems(itemsList);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        bio,
        city,
        deliveryAddress,
        locations,
        bannerUrl,
        focusCountry, // Save Focus Country
        socials: { instagram, facebook, tiktokVideoId },
        isProfileComplete: true,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Success - no alert popup
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBecomeSeller = async () => {
    if (!confirm("Are you ready to start selling? This will enable your seller dashboard.")) return;

    try {
        await setDoc(doc(db, "users", user.uid), { isSeller: true, role: 'Seller' }, { merge: true });
        setIsSellerMode(true);
        setRole('Seller');
        // Success - no alert popup
    } catch (error) {
        console.error("Error upgrading:", error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsAddingItem(true);

    try {
      if(!newItem.title || !newItem.price) {
        return;
      }

      const docRef = await addDoc(collection(db, "users", user.uid, "items"), {
        ...newItem,
        price: parseFloat(newItem.price),
        createdAt: serverTimestamp()
      });

      setMyItems([...myItems, { id: docRef.id, ...newItem }]);
      setNewItem({ title: '', category: 'Food', price: '', description: '', image1: '', image2: '', videoUrl: '' });
      // Success - no alert popup

    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item.");
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if(!confirm("Are you sure you want to delete this item?")) return;
    try {
        await deleteDoc(doc(db, "users", user.uid, "items", itemId));
        setMyItems(myItems.filter(item => item.id !== itemId));
    } catch (error) {
        console.error("Error deleting item:", error);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading profile...</div>;

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '60px 20px', maxWidth: '800px' }}>
        
        <h1 style={{ marginBottom: '10px' }}>
            {isSellerMode ? "Seller Profile & Shop" : "My Buyer Profile"}
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
            Manage your account settings and preferences.
        </p>
        
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Profile Settings</h2>
            
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Base City</label>
                        <input
                            type="text" placeholder="e.g. Quezon City" required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
                            value={city} onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>
                        Delivery Address <span style={{ color: 'red' }}>*</span>
                    </label>
                    <textarea
                        placeholder="Full delivery address including street, barangay, city, postal code"
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', minHeight: '80px' }}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                        This address will be used for deliveries when you place orders
                    </p>
                </div>

                {isSellerMode && (
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Primary Country Focus</label>
                        <select 
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
                            value={focusCountry} onChange={(e) => setFocusCountry(e.target.value)}
                        >
                            <option value="Philippines">Philippines (Local)</option> {/* ADDED */}
                            <option value="Japan">Japan</option>
                            <option value="USA">USA</option>
                            <option value="South Korea">South Korea</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Hong Kong">Hong Kong</option>
                            <option value="Indonesia">Indonesia</option>
                        </select>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                            This determines the default products you see in the Seller Dashboard.
                        </p>
                    </div>
                )}

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Bio</label>
                    <textarea 
                        placeholder="Tell us about yourself..."
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', minHeight: '100px' }}
                        value={bio} onChange={(e) => setBio(e.target.value)}
                    />
                </div>

                {isSellerMode && (
                    <>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Shop Banner URL</label>
                            <input 
                                type="url" placeholder="https://example.com/banner.jpg"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
                                value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)}
                            />
                        </div>

                        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Social Media Trust</h3>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                <input 
                                    type="text" placeholder="Instagram Username"
                                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '6px' }}
                                    value={instagram} onChange={(e) => setInstagram(e.target.value)}
                                />
                                <input 
                                    type="text" placeholder="Facebook Link"
                                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '6px' }}
                                    value={facebook} onChange={(e) => setFacebook(e.target.value)}
                                />
                            </div>
                            <input 
                                type="text" placeholder="TikTok Video ID (e.g. 72948...)"
                                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '6px' }}
                                value={tiktokVideoId} onChange={(e) => setTiktokVideoId(e.target.value)}
                            />
                        </div>
                    </>
                )}

                <button 
                    type="submit" className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
        
        {!isSellerMode && (
            <div style={{ background: '#e3f2fd', padding: '30px', borderRadius: '12px', textAlign: 'center', border: '1px solid #bbdefb' }}>
                <h2 style={{ color: '#0070f3', marginBottom: '10px' }}>Want to sell on Pasa.ph?</h2>
                <p style={{ color: '#555', marginBottom: '20px' }}>Start earning money by fulfilling requests or selling items from your travels.</p>
                <button 
                    onClick={handleBecomeSeller}
                    className="btn-primary"
                    style={{ padding: '12px 30px', fontSize: '1rem' }}
                >
                    Start Selling
                </button>
            </div>
        )}

        {isSellerMode && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>My Pasa Shop Items</h2>
                
                {myItems.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                        {myItems.map(item => (
                            <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                                <img src={item.image1 || 'https://placehold.co/400?text=Item'} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                                <div style={{ padding: '10px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.title}</div>
                                    <div style={{ color: '#0070f3', fontWeight: 'bold' }}>₱{item.price}</div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteItem(item.id)}
                                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ background: '#f5f7ff', padding: '20px', borderRadius: '8px', border: '1px solid #dce6ff' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: '#0070f3' }}>+ Add New Item to Shop</h3>
                    <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <input 
                                type="text" placeholder="Item Name" required
                                style={{ flex: 2, padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
                                value={newItem.title} onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                            />
                            <select 
                                style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
                                value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                            >
                                <option>Food</option>
                                <option>Beauty</option>
                                <option>Electronics</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <input 
                                type="number" placeholder="Price (₱)" required
                                style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
                                value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                            />
                            <input 
                                type="url" placeholder="Image URL"
                                style={{ flex: 2, padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
                                value={newItem.image1} onChange={(e) => setNewItem({...newItem, image1: e.target.value})}
                            />
                        </div>
                        <button 
                            type="submit" className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', marginTop: '5px' }}
                            disabled={isAddingItem}
                        >
                            {isAddingItem ? "Adding..." : "List Item"}
                        </button>
                    </form>
                </div>
            </div>
        )}

      </div>
      <Footer />
    </>
  );
}