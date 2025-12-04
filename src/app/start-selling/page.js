'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function StartSellingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(0); // 0: Intro, 1: Basic Info, 2: Preferences, 3: Complete
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: '',
    city: '',
    address: '',
    phoneNumber: '',

    // Step 2: Selling Preferences
    focusCountries: ['Japan'],
    categories: ['Food'],
    bio: '',
    instagram: '',
    languages: ['English', 'Filipino']
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Only redirect if already a seller AND profile is complete
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().isSeller && docSnap.data().isProfileComplete) {
            router.push('/seller-dashboard');
        } else {
            // Pre-populate form with existing user data if available
            if (docSnap.exists()) {
              const userData = docSnap.data();
              setFormData(prev => ({
                ...prev,
                fullName: userData.displayName || currentUser.displayName || '',
              }));
            } else if (currentUser.displayName) {
              setFormData(prev => ({
                ...prev,
                fullName: currentUser.displayName
              }));
            }
            setLoading(false); // Allow new users to see the wizard
        }
      } else {
        // If logged out, ALLOW viewing the page (don't redirect)
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleStart = () => {
    if (!user) {
        // Redirect to login if they try to start setup without account
        router.push('/login'); 
    } else {
        setStep(prev => prev + 1);
    }
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const toggleLanguage = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleCompleteSetup = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: formData.fullName || user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        isSeller: true,
        role: 'Seller',

        // Seller Information
        fullName: formData.fullName,
        city: formData.city,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio,
        languages: formData.languages,

        // Selling Preferences
        focusCountries: formData.focusCountries,
        categories: formData.categories,

        // Socials
        socials: {
          instagram: formData.instagram
        },

        // Defaults
        membershipTier: 'Standard',
        isProfileComplete: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      router.push('/seller-dashboard');
    } catch (error) {
      console.error("Error saving seller profile:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: 'clamp(40px, 8vw, 60px) 20px', maxWidth: '800px', minHeight: '80vh' }}>

        {/* PROGRESS BAR */}
        {step > 0 && (
            <div style={{ marginBottom: 'clamp(30px, 6vw, 40px)', display: 'flex', gap: 'clamp(8px, 2vw, 10px)', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ flex: 1, maxWidth: '100px', height: '6px', borderRadius: '4px', background: step >= 1 ? '#0070f3' : '#eee' }}></div>
                <div style={{ flex: 1, maxWidth: '100px', height: '6px', borderRadius: '4px', background: step >= 2 ? '#0070f3' : '#eee' }}></div>
                <div style={{ flex: 1, maxWidth: '100px', height: '6px', borderRadius: '4px', background: step >= 3 ? '#0070f3' : '#eee' }}></div>
            </div>
        )}

        {/* STEP 0: INTRO */}
        {step === 0 && (
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: '800', marginBottom: '20px' }}>Become a Pasa Seller</h1>
                <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', color: '#666', marginBottom: 'clamp(30px, 6vw, 40px)' }}>
                    Turn your travels into earnings. Help people get the items they love from around the world.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'clamp(15px, 4vw, 20px)', marginBottom: 'clamp(30px, 6vw, 40px)', textAlign: 'left' }}>
                    <div style={{ padding: 'clamp(15px, 4vw, 20px)', background: '#f9f9f9', borderRadius: '12px' }}>
                        <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '10px' }}>💰</div>
                        <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Earn Extra Cash</h3>
                        <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', color: '#666' }}>Offset your travel costs by fulfilling orders.</p>
                    </div>
                    <div style={{ padding: 'clamp(15px, 4vw, 20px)', background: '#f9f9f9', borderRadius: '12px' }}>
                        <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '10px' }}>🔒</div>
                        <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Secure Payments</h3>
                        <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', color: '#666' }}>Payments are held in escrow until delivery.</p>
                    </div>
                    <div style={{ padding: 'clamp(15px, 4vw, 20px)', background: '#f9f9f9', borderRadius: '12px' }}>
                        <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '10px' }}>🌟</div>
                        <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Build Reputation</h3>
                        <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', color: '#666' }}>Unlock tiers and exclusive requests.</p>
                    </div>
                </div>
                <button onClick={handleStart} className="btn-primary" style={{ padding: 'clamp(12px, 3vw, 15px) clamp(30px, 8vw, 40px)', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>
                    Start Setup
                </button>
            </div>
        )}

        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '10px', fontSize: 'clamp(1.5rem, 4vw, 1.75rem)' }}>Basic Information</h2>
                <p style={{ color: '#666', marginBottom: '20px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Let buyers know who you are</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Full Name *</label>
                        <input
                            name="fullName"
                            type="text"
                            placeholder="Juan Dela Cruz"
                            required
                            style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>City (Philippines) *</label>
                        <input
                            name="city"
                            type="text"
                            placeholder="e.g. Quezon City"
                            required
                            style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Complete Address *</label>
                        <textarea
                            name="address"
                            placeholder="Street, Barangay, City, Province, Postal Code"
                            required
                            style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', minHeight: '80px', fontFamily: 'inherit', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Phone Number *</label>
                        <input
                            name="phoneNumber"
                            type="tel"
                            placeholder="+63 912 345 6789"
                            required
                            style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '10px' }}>
                        <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Back</button>
                        <button
                            onClick={handleNext}
                            className="btn-primary"
                            disabled={!formData.fullName || !formData.city || !formData.address || !formData.phoneNumber}
                            style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* STEP 2: SELLING PREFERENCES */}
        {step === 2 && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '10px', fontSize: 'clamp(1.5rem, 4vw, 1.75rem)' }}>Selling Preferences</h2>
                <p style={{ color: '#666', marginBottom: '20px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>What countries and products do you focus on?</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {/* Countries */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                            Countries You Can Source From * <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#666' }}>(Select at least one)</span>
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                            {['Philippines', 'Japan', 'USA', 'South Korea', 'Singapore', 'Hong Kong', 'Vietnam'].map(country => (
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
                            {['Food', 'Beauty', 'Electronics', 'Fashion', 'Toys', 'Books', 'Sports', 'Other'].map(category => (
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

                    {/* Bio */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                            Short Bio <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#666' }}>(Optional)</span>
                        </label>
                        <textarea
                            name="bio"
                            placeholder="Tell buyers about your travel frequency, sourcing experience, or what makes you a reliable seller..."
                            style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', minHeight: '100px', fontFamily: 'inherit', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Instagram */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                            Instagram <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#666' }}>(Optional)</span>
                        </label>
                        <input
                            name="instagram"
                            type="text"
                            placeholder="@username"
                            style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                            value={formData.instagram}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Languages Spoken */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                            Languages Spoken <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#666' }}>(Select all that apply)</span>
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                            {['English', 'Filipino', 'Tagalog', 'Cebuano', 'Japanese', 'Korean', 'Mandarin', 'Spanish'].map(language => (
                                <button
                                    key={language}
                                    type="button"
                                    onClick={() => toggleLanguage(language)}
                                    style={{
                                        padding: 'clamp(10px, 2.5vw, 12px)',
                                        border: `2px solid ${formData.languages.includes(language) ? '#0070f3' : '#ddd'}`,
                                        background: formData.languages.includes(language) ? '#f0f9ff' : 'white',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: formData.languages.includes(language) ? 'bold' : 'normal',
                                        color: formData.languages.includes(language) ? '#0070f3' : '#333',
                                        fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                                        transition: '0.2s'
                                    }}
                                >
                                    {formData.languages.includes(language) ? '✓ ' : ''}{language}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '10px' }}>
                        <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Back</button>
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

        {/* STEP 3: REVIEW & COMPLETE */}
        {step === 3 && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '10px', fontSize: 'clamp(1.5rem, 4vw, 1.75rem)', textAlign: 'center' }}>Almost Done! 🎉</h2>
                <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Review your information below</p>

                <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: 'clamp(20px, 5vw, 30px)', marginBottom: '30px' }}>
                    {/* Basic Info */}
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', marginBottom: '10px', color: '#0070f3' }}>Basic Information</h3>
                        <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: '1.8' }}>
                            <div><strong>Name:</strong> {formData.fullName}</div>
                            <div><strong>City:</strong> {formData.city}</div>
                            <div><strong>Address:</strong> {formData.address}</div>
                            <div><strong>Phone:</strong> {formData.phoneNumber}</div>
                        </div>
                    </div>

                    {/* Selling Preferences */}
                    <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', marginBottom: '10px', color: '#0070f3' }}>Selling Preferences</h3>
                        <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: '1.8' }}>
                            <div><strong>Countries:</strong> {formData.focusCountries.join(', ')}</div>
                            <div><strong>Categories:</strong> {formData.categories.join(', ')}</div>
                            {formData.languages && formData.languages.length > 0 && <div><strong>Languages:</strong> {formData.languages.join(', ')}</div>}
                            {formData.bio && <div><strong>Bio:</strong> {formData.bio}</div>}
                            {formData.instagram && <div><strong>Instagram:</strong> @{formData.instagram.replace('@', '')}</div>}
                        </div>
                    </div>
                </div>

                <div style={{ background: '#e3f2fd', borderRadius: '12px', padding: 'clamp(15px, 4vw, 20px)', marginBottom: '30px', fontSize: 'clamp(0.85rem, 2vw, 0.9rem)' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>ℹ️ What happens next?</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                        <li>You'll be added as a Standard (Free) seller</li>
                        <li>Start browsing buyer requests immediately</li>
                        <li>Build your reputation and unlock benefits</li>
                        <li>You can update your profile anytime</li>
                    </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                        Back
                    </button>
                    <button
                        onClick={handleCompleteSetup}
                        className="btn-primary"
                        disabled={isSaving}
                        style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', padding: 'clamp(12px, 3vw, 15px) clamp(30px, 8vw, 40px)' }}
                    >
                        {isSaving ? 'Creating Your Account...' : 'Complete Setup & Start Selling'}
                    </button>
                </div>
            </div>
        )}

      </div>
      <Footer />
    </>
  );
}