'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BuyerOnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(0); // 0: Intro, 1: Basic Info, 2: Complete
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    deliveryAddress: '',
    city: '',
    phoneNumber: '',
    interests: ['Food']
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Only redirect if profile is already complete
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().isProfileComplete) {
            router.push('/');
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
            setLoading(false);
        }
      } else {
        // If logged out, redirect to login
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleStart = () => setStep(prev => prev + 1);
  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
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
        isSeller: false,
        role: 'Buyer',

        // Buyer Information
        fullName: formData.fullName,
        deliveryAddress: formData.deliveryAddress,
        city: formData.city,
        phoneNumber: formData.phoneNumber,
        interests: formData.interests,

        // Profile complete
        isProfileComplete: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      router.push('/');
    } catch (error) {
      console.error("Error saving buyer profile:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: 'clamp(40px, 8vw, 60px) 20px', maxWidth: '700px', minHeight: '80vh' }}>

        {/* PROGRESS BAR */}
        {step > 0 && (
            <div style={{ marginBottom: 'clamp(30px, 6vw, 40px)', display: 'flex', gap: 'clamp(8px, 2vw, 10px)', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ flex: 1, maxWidth: '100px', height: '6px', borderRadius: '4px', background: step >= 1 ? '#0070f3' : '#eee' }}></div>
                <div style={{ flex: 1, maxWidth: '100px', height: '6px', borderRadius: '4px', background: step >= 2 ? '#0070f3' : '#eee' }}></div>
            </div>
        )}

        {/* STEP 0: INTRO */}
        {step === 0 && (
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: '800', marginBottom: '20px' }}>Welcome to Pasa.ph! 🎉</h1>
                <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', color: '#666', marginBottom: 'clamp(30px, 6vw, 40px)' }}>
                    Let's set up your account so you can start shopping from around the world.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'clamp(15px, 4vw, 20px)', marginBottom: 'clamp(30px, 6vw, 40px)', textAlign: 'left' }}>
                    <div style={{ padding: 'clamp(15px, 4vw, 20px)', background: '#f9f9f9', borderRadius: '12px' }}>
                        <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '10px' }}>🌍</div>
                        <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Shop Globally</h3>
                        <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', color: '#666' }}>Access products from Japan, USA, Korea, and more.</p>
                    </div>
                    <div style={{ padding: 'clamp(15px, 4vw, 20px)', background: '#f9f9f9', borderRadius: '12px' }}>
                        <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '10px' }}>🛡️</div>
                        <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Safe & Secure</h3>
                        <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', color: '#666' }}>Your payments are protected until delivery.</p>
                    </div>
                    <div style={{ padding: 'clamp(15px, 4vw, 20px)', background: '#f9f9f9', borderRadius: '12px' }}>
                        <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '10px' }}>📦</div>
                        <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Easy Tracking</h3>
                        <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', color: '#666' }}>Track every order from purchase to delivery.</p>
                    </div>
                </div>
                <button onClick={handleStart} className="btn-primary" style={{ padding: 'clamp(12px, 3vw, 15px) clamp(30px, 8vw, 40px)', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>
                    Get Started
                </button>
            </div>
        )}

        {/* STEP 1: BASIC INFO & DELIVERY ADDRESS */}
        {step === 1 && (
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '10px', fontSize: 'clamp(1.5rem, 4vw, 1.75rem)' }}>Your Information</h2>
                <p style={{ color: '#666', marginBottom: '20px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>We need this for delivery and order tracking</p>
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>City *</label>
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Complete Delivery Address *</label>
                        <textarea
                            name="deliveryAddress"
                            placeholder="Street, Barangay, City, Province, Postal Code"
                            required
                            style={{ width: '100%', padding: 'clamp(10px, 2.5vw, 12px)', border: '1px solid #ccc', borderRadius: '8px', minHeight: '80px', fontFamily: 'inherit', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                            value={formData.deliveryAddress}
                            onChange={handleChange}
                        />
                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>💡 This is where sellers will deliver your items</div>
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

                    {/* Interests */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                            What are you interested in? <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#666' }}>(Optional)</span>
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                            {['Food', 'Beauty', 'Electronics', 'Fashion', 'Toys', 'Books', 'Sports'].map(interest => (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => toggleInterest(interest)}
                                    style={{
                                        padding: 'clamp(8px, 2vw, 10px)',
                                        border: `2px solid ${formData.interests.includes(interest) ? '#0070f3' : '#ddd'}`,
                                        background: formData.interests.includes(interest) ? '#f0f9ff' : 'white',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: formData.interests.includes(interest) ? 'bold' : 'normal',
                                        color: formData.interests.includes(interest) ? '#0070f3' : '#333',
                                        fontSize: 'clamp(0.8rem, 2vw, 0.85rem)',
                                        transition: '0.2s'
                                    }}
                                >
                                    {formData.interests.includes(interest) ? '✓ ' : ''}{interest}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '10px' }}>
                        <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Back</button>
                        <button
                            onClick={handleNext}
                            className="btn-primary"
                            disabled={!formData.fullName || !formData.city || !formData.deliveryAddress || !formData.phoneNumber}
                            style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* STEP 2: REVIEW & COMPLETE */}
        {step === 2 && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '10px', fontSize: 'clamp(1.5rem, 4vw, 1.75rem)', textAlign: 'center' }}>You're All Set! 🎉</h2>
                <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Review your information below</p>

                <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: 'clamp(20px, 5vw, 30px)', marginBottom: '30px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', marginBottom: '10px', color: '#0070f3' }}>Your Details</h3>
                        <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: '1.8' }}>
                            <div><strong>Name:</strong> {formData.fullName}</div>
                            <div><strong>City:</strong> {formData.city}</div>
                            <div><strong>Delivery Address:</strong> {formData.deliveryAddress}</div>
                            <div><strong>Phone:</strong> {formData.phoneNumber}</div>
                            {formData.interests.length > 0 && (
                                <div><strong>Interests:</strong> {formData.interests.join(', ')}</div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ background: '#e3f2fd', borderRadius: '12px', padding: 'clamp(15px, 4vw, 20px)', marginBottom: '30px', fontSize: 'clamp(0.85rem, 2vw, 0.9rem)' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>ℹ️ What's next?</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                        <li>Browse products from verified sellers</li>
                        <li>Make requests for items you can't find</li>
                        <li>Track all your orders in one place</li>
                        <li>Update your profile anytime in settings</li>
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
                        {isSaving ? 'Setting Up...' : 'Complete Setup & Start Shopping'}
                    </button>
                </div>
            </div>
        )}

      </div>
      <Footer />
    </>
  );
}
