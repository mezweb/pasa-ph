'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function StartSellingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Delivery Info
    city: '',
    deliveryAddress: '',

    // Step 2: Travel & Categories
    focusCountries: [],
    categories: [],

    // Step 3: First Item (optional)
    items: [],

    // Step 4: Profile Details (optional)
    bio: '',
    bannerURL: '',

    // Step 5: Social Media (optional)
    instagram: '',
    facebook: '',
    tiktok: ''
  });

  // New Item Form (for Step 3)
  const [newItem, setNewItem] = useState({
    title: '',
    from: 'Japan',
    to: 'Manila',
    category: 'Food',
    price: '',
    quantity: 1,
    description: '',
    image: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Check if already a seller with complete profile
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().isSeller && docSnap.data().isProfileComplete) {
          router.push('/seller-dashboard');
        } else {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const toggleCountry = (country) => {
    setFormData(prev => ({
      ...prev,
      focusCountries: prev.focusCountries.includes(country)
        ? prev.focusCountries.filter(c => c !== country)
        : [...prev.focusCountries, country]
    }));
  };

  const toggleCategory = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleAddItem = () => {
    if (newItem.title && newItem.price) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem }]
      }));
      // Reset form
      setNewItem({
        title: '',
        from: 'Japan',
        to: 'Manila',
        category: 'Food',
        price: '',
        quantity: 1,
        description: '',
        image: ''
      });
    }
  };

  const handleSkipItems = () => {
    handleNext();
  };

  const handleCompleteSetup = async () => {
    if (!user) {
      alert('Please log in to complete setup');
      return;
    }

    setIsSaving(true);
    try {
      // Save seller profile
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || 'https://placehold.co/32x32?text=U',
        isSeller: true,
        role: 'Seller',

        // Delivery Info
        city: formData.city,
        deliveryAddress: formData.deliveryAddress,

        // Selling Preferences
        focusCountries: formData.focusCountries,
        categories: formData.categories,

        // Profile Details
        bio: formData.bio || '',
        bannerURL: formData.bannerURL || '',

        // Socials
        socials: {
          instagram: formData.instagram || '',
          facebook: formData.facebook || '',
          tiktok: formData.tiktok || ''
        },

        // Profile completion status
        isProfileComplete: false, // Will complete in seller dashboard
        isVisible: false, // Will be visible after completing profile in dashboard
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Add items to Firestore if any
      if (formData.items.length > 0) {
        for (const item of formData.items) {
          const finalImage = item.image || `https://placehold.co/600x400/e3f2fd/0070f3?text=${encodeURIComponent(item.title)}`;

          await addDoc(collection(db, "requests"), {
            title: item.title,
            from: item.from,
            to: item.to,
            category: item.category,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity),
            description: item.description || '',
            image: finalImage,
            userId: user.uid,
            userName: user.displayName || 'Anonymous',
            userPhoto: user.photoURL || 'https://placehold.co/32x32?text=U',
            createdAt: serverTimestamp()
          });
        }
      }

      // Redirect to seller dashboard
      router.push('/seller-dashboard');
    } catch (error) {
      console.error("Error saving seller profile:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h1>Please log in to continue</h1>
          <button onClick={() => router.push('/login')} className="btn-primary" style={{ marginTop: '20px' }}>
            Go to Login
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: 'clamp(40px, 8vw, 60px) 20px', maxWidth: '800px', minHeight: '80vh' }}>

        {/* PROGRESS BAR */}
        <div style={{ marginBottom: 'clamp(30px, 6vw, 40px)', display: 'flex', gap: 'clamp(8px, 2vw, 10px)', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ flex: 1, maxWidth: '80px', height: '6px', borderRadius: '4px', background: step >= 1 ? '#0070f3' : '#eee' }}></div>
          <div style={{ flex: 1, maxWidth: '80px', height: '6px', borderRadius: '4px', background: step >= 2 ? '#0070f3' : '#eee' }}></div>
          <div style={{ flex: 1, maxWidth: '80px', height: '6px', borderRadius: '4px', background: step >= 3 ? '#0070f3' : '#eee' }}></div>
          <div style={{ flex: 1, maxWidth: '80px', height: '6px', borderRadius: '4px', background: step >= 4 ? '#0070f3' : '#eee' }}></div>
          <div style={{ flex: 1, maxWidth: '80px', height: '6px', borderRadius: '4px', background: step >= 5 ? '#0070f3' : '#eee' }}></div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px', color: '#666', fontSize: '0.9rem' }}>
          Step {step} of 5
        </div>

        {/* STEP 1: DELIVERY INFO */}
        {step === 1 && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '10px', fontSize: 'clamp(1.5rem, 4vw, 1.75rem)' }}>📍 Where do you deliver?</h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Let buyers know where you can deliver items</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>City (Philippines) *</label>
                <input
                  name="city"
                  type="text"
                  placeholder="e.g. Quezon City, Manila, Cebu"
                  required
                  style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Delivery Address *</label>
                <textarea
                  name="deliveryAddress"
                  placeholder="Full address where you'll hand off items to buyers or couriers"
                  required
                  style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', minHeight: '80px', fontFamily: 'inherit', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  onClick={handleNext}
                  className="btn-primary"
                  disabled={!formData.city || !formData.deliveryAddress}
                  style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TRAVEL & CATEGORIES */}
        {step === 2 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '10px', fontSize: 'clamp(1.5rem, 4vw, 1.75rem)' }}>✈️ What do you sell?</h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Select countries you travel to and product categories</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {/* Countries */}
              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                  Countries You Source From * <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#666' }}>(Select at least one)</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                  {['Philippines', 'Japan', 'USA', 'South Korea', 'Singapore', 'Hong Kong', 'Vietnam', 'Thailand', 'Taiwan'].map(country => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => toggleCountry(country)}
                      style={{
                        padding: 'clamp(10px, 2.5vw, 12px)',
                        border: `2px solid ${formData.focusCountries.includes(country) ? '#0070f3' : '#ddd'}`,
                        background: formData.focusCountries.includes(country) ? '#f0f9ff' : 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: formData.focusCountries.includes(country) ? 'bold' : 'normal',
                        color: formData.focusCountries.includes(country) ? '#0070f3' : '#333',
                        fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                        transition: '0.2s'
                      }}
                    >
                      {formData.focusCountries.includes(country) ? '✓ ' : ''}{country}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                  Product Categories * <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#666' }}>(Select at least one)</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                  {['Food', 'Beauty', 'Electronics', 'Fashion', 'Toys', 'Books', 'Sports', 'Health', 'Other'].map(category => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      style={{
                        padding: 'clamp(10px, 2.5vw, 12px)',
                        border: `2px solid ${formData.categories.includes(category) ? '#0070f3' : '#ddd'}`,
                        background: formData.categories.includes(category) ? '#f0f9ff' : 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: formData.categories.includes(category) ? 'bold' : 'normal',
                        color: formData.categories.includes(category) ? '#0070f3' : '#333',
                        fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                        transition: '0.2s'
                      }}
                    >
                      {formData.categories.includes(category) ? '✓ ' : ''}{category}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '10px' }}>
                <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>← Back</button>
                <button
                  onClick={handleNext}
                  className="btn-primary"
                  disabled={formData.focusCountries.length === 0 || formData.categories.length === 0}
                  style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ADD ITEMS */}
        {step === 3 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '10px', fontSize: 'clamp(1.5rem, 4vw, 1.75rem)' }}>📦 Add your first item</h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              Start listing items you can source for buyers. You can add more later.
            </p>

            {/* Items Added */}
            {formData.items.length > 0 && (
              <div style={{ marginBottom: '20px', background: '#f0f9ff', padding: '15px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#0070f3' }}>✓ Items Added ({formData.items.length})</div>
                {formData.items.map((item, idx) => (
                  <div key={idx} style={{ padding: '10px', background: 'white', borderRadius: '6px', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <strong>{item.title}</strong> - ${item.price} ({item.from} → {item.to})
                  </div>
                ))}
              </div>
            )}

            {/* Add Item Form */}
            <div style={{ background: '#f9f9f9', padding: 'clamp(20px, 5vw, 25px)', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>Item Name</label>
                  <input
                    name="title"
                    type="text"
                    placeholder="e.g. Tokyo Banana, Royce Chocolate"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.9rem' }}
                    value={newItem.title}
                    onChange={handleItemChange}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>From</label>
                    <select
                      name="from"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.9rem' }}
                      value={newItem.from}
                      onChange={handleItemChange}
                    >
                      {['Japan', 'USA', 'South Korea', 'Singapore', 'Hong Kong', 'Vietnam', 'Thailand', 'Taiwan'].map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>To</label>
                    <select
                      name="to"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.9rem' }}
                      value={newItem.to}
                      onChange={handleItemChange}
                    >
                      {['Manila', 'Quezon City', 'Cebu', 'Davao', 'Makati'].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>Category</label>
                    <select
                      name="category"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.9rem' }}
                      value={newItem.category}
                      onChange={handleItemChange}
                    >
                      {['Food', 'Beauty', 'Electronics', 'Fashion', 'Toys', 'Books', 'Sports', 'Health', 'Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>Price ($)</label>
                    <input
                      name="price"
                      type="number"
                      placeholder="25.00"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.9rem' }}
                      value={newItem.price}
                      onChange={handleItemChange}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>Image URL (optional)</label>
                  <input
                    name="image"
                    type="text"
                    placeholder="https://..."
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.9rem' }}
                    value={newItem.image}
                    onChange={handleItemChange}
                  />
                </div>
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.title || !newItem.price}
                  style={{
                    padding: '12px',
                    background: !newItem.title || !newItem.price ? '#ccc' : '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: !newItem.title || !newItem.price ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  + Add Item
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>← Back</button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSkipItems}
                  style={{
                    padding: '12px 20px',
                    background: 'white',
                    color: '#666',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Skip for now
                </button>
                <button
                  onClick={handleNext}
                  className="btn-primary"
                  style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                >
                  {formData.items.length > 0 ? 'Continue' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PROFILE DETAILS */}
        {step === 4 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '10px', fontSize: 'clamp(1.5rem, 4vw, 1.75rem)' }}>👤 Tell buyers about yourself</h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              Share your story and make your shop stand out (optional)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Bio (optional)</label>
                <textarea
                  name="bio"
                  placeholder="Tell buyers about your travel frequency, sourcing experience, or what makes you a reliable seller..."
                  style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', minHeight: '100px', fontFamily: 'inherit', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Shop Banner URL (optional)</label>
                <input
                  name="bannerURL"
                  type="text"
                  placeholder="https://..."
                  style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                  value={formData.bannerURL}
                  onChange={handleChange}
                />
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                  Add a banner image to personalize your shop
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '10px' }}>
                <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>← Back</button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleNext}
                    style={{
                      padding: '12px 20px',
                      background: 'white',
                      color: '#666',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={handleNext}
                    className="btn-primary"
                    style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: SOCIAL MEDIA */}
        {step === 5 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '10px', fontSize: 'clamp(1.5rem, 4vw, 1.75rem)' }}>🔗 Build trust with social media</h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              Link your social accounts to show buyers you're trustworthy (optional)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>📷 Instagram</label>
                <input
                  name="instagram"
                  type="text"
                  placeholder="@username"
                  style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                  value={formData.instagram}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>📘 Facebook</label>
                <input
                  name="facebook"
                  type="text"
                  placeholder="facebook.com/yourprofile"
                  style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                  value={formData.facebook}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>🎵 TikTok</label>
                <input
                  name="tiktok"
                  type="text"
                  placeholder="@username"
                  style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                  value={formData.tiktok}
                  onChange={handleChange}
                />
              </div>

              <div style={{ background: '#f0f9ff', borderRadius: '12px', padding: '15px', marginTop: '10px', fontSize: '0.9rem' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#0070f3' }}>✨ Almost done!</div>
                <p style={{ margin: 0, color: '#666' }}>
                  After completing setup, you'll be redirected to your seller dashboard where you can manage items, view requests, and complete your profile.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>← Back</button>
                <button
                  onClick={handleCompleteSetup}
                  className="btn-primary"
                  disabled={isSaving}
                  style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', padding: 'clamp(12px, 3vw, 15px) clamp(30px, 8vw, 40px)' }}
                >
                  {isSaving ? 'Setting up...' : '🎉 Complete Setup'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </>
  );
}
