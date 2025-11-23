'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function StartSellingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(0); // 0: Intro, 1: Basics, 2: Trust, 3: Tiers
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    focusCountry: 'Japan',
    city: '',
    bio: '',
    instagram: '',
    facebook: '',
    tiktokVideoId: '',
    bannerUrl: '',
    membership: 'Standard'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Save intended destination if needed, but for now just redirect
        router.push('/login');
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompleteSetup = async (selectedTier) => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        isSeller: true, // ACTIVATE SELLER MODE
        role: 'Seller',
        // Save Wizard Data
        focusCountry: formData.focusCountry,
        city: formData.city,
        bio: formData.bio,
        bannerUrl: formData.bannerUrl,
        socials: {
            instagram: formData.instagram,
            facebook: formData.facebook,
            tiktokVideoId: formData.tiktokVideoId
        },
        membershipTier: selectedTier, // Save selected tier
        isProfileComplete: true,
        updatedAt: serverTimestamp()
      }, { merge: true });

      alert(`Welcome to Pasa.ph as a ${selectedTier} Seller!`);
      router.push('/seller-dashboard'); // Go to dashboard
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
      <div className="container" style={{ padding: '60px 20px', maxWidth: '800px', minHeight: '80vh' }}>
        
        {/* PROGRESS BAR */}
        {step > 0 && (
            <div style={{ marginBottom: '40px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100px', height: '6px', borderRadius: '4px', background: step >= 1 ? '#0070f3' : '#eee' }}></div>
                <div style={{ width: '100px', height: '6px', borderRadius: '4px', background: step >= 2 ? '#0070f3' : '#eee' }}></div>
                <div style={{ width: '100px', height: '6px', borderRadius: '4px', background: step >= 3 ? '#0070f3' : '#eee' }}></div>
            </div>
        )}

        {/* STEP 0: INTRO */}
        {step === 0 && (
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px' }}>Become a Pasa Seller</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
                    Turn your travels into earnings. Help people get the items they love from around the world.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px', textAlign: 'left' }}>
                    <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
                        <h3 style={{ fontSize: '1.1rem' }}>Earn Extra Cash</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Offset your travel costs by fulfilling orders.</p>
                    </div>
                    <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔒</div>
                        <h3 style={{ fontSize: '1.1rem' }}>Secure Payments</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Payments are held in escrow until delivery.</p>
                    </div>
                    <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌟</div>
                        <h3 style={{ fontSize: '1.1rem' }}>Build Reputation</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Unlock tiers and exclusive requests.</p>
                    </div>
                </div>
                <button onClick={handleNext} className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
                    Start Setup
                </button>
            </div>
        )}

        {/* STEP 1: BASICS */}
        {step === 1 && (
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '20px' }}>Where do you travel?</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Primary Focus Country</label>
                        <select 
                            name="focusCountry"
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                            value={formData.focusCountry}
                            onChange={handleChange}
                        >
                            <option value="Japan">Japan</option>
                            <option value="USA">USA</option>
                            <option value="South Korea">South Korea</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Hong Kong">Hong Kong</option>
                            <option value="Indonesia">Indonesia</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Your Base City (Philippines)</label>
                        <input 
                            name="city"
                            type="text" 
                            placeholder="e.g. Quezon City"
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>Back</button>
                        <button onClick={handleNext} className="btn-primary" disabled={!formData.city}>Next</button>
                    </div>
                </div>
            </div>
        )}

        {/* STEP 2: TRUST & BIO */}
        {step === 2 && (
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '20px' }}>Build Trust</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Short Bio</label>
                        <textarea 
                            name="bio"
                            placeholder="Tell buyers about your travel frequency and what items you specialize in..."
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', minHeight: '100px', fontFamily: 'inherit' }}
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Instagram (Optional)</label>
                        <input 
                            name="instagram"
                            type="text" 
                            placeholder="@username"
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                            value={formData.instagram}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Shop Banner URL (Optional)</label>
                        <input 
                            name="bannerUrl"
                            type="url" 
                            placeholder="https://..."
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                            value={formData.bannerUrl}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>Back</button>
                        <button onClick={handleNext} className="btn-primary">Next</button>
                    </div>
                </div>
            </div>
        )}

        {/* STEP 3: SELECT TIER */}
        {step === 3 && (
            <div>
                <h2 style={{ marginBottom: '10px' }}>Select Your Membership</h2>
                <p style={{ color: '#666', marginBottom: '40px' }}>Choose a plan to maximize your earnings.</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
                    
                    {/* Standard */}
                    <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '30px', width: '280px', textAlign: 'center', position: 'relative' }}>
                        <h3 style={{ marginBottom: '10px' }}>Standard</h3>
                        <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '20px' }}>Free</div>
                        <ul style={{ listStyle: 'none', textAlign: 'left', fontSize: '0.9rem', color: '#666', marginBottom: '20px', lineHeight: '2' }}>
                            <li>✅ Access Basic Requests</li>
                            <li>✅ Standard Profile</li>
                            <li>✅ 5% Platform Fee</li>
                        </ul>
                        <button 
                            onClick={() => handleCompleteSetup('Standard')}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                            disabled={isSaving}
                        >
                            Select Standard
                        </button>
                    </div>

                    {/* Gold */}
                    <div style={{ border: '2px solid #d4af37', borderRadius: '12px', padding: '30px', width: '280px', textAlign: 'center', position: 'relative', background: '#fffbf2' }}>
                        <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#d4af37', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>POPULAR</div>
                        <h3 style={{ marginBottom: '10px' }}>Gold</h3>
                        <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '20px', color: '#d4af37' }}>₱199<span style={{fontSize: '0.9rem', color:'#666', fontWeight:'normal'}}>/mo</span></div>
                        <ul style={{ listStyle: 'none', textAlign: 'left', fontSize: '0.9rem', color: '#666', marginBottom: '20px', lineHeight: '2' }}>
                            <li>✅ <strong>Priority Access</strong> to Requests</li>
                            <li>✅ Gold Seller Badge</li>
                            <li>✅ 0% Fee (First 5)</li>
                        </ul>
                        <button 
                            onClick={() => handleCompleteSetup('Gold')}
                            className="btn-primary"
                            style={{ width: '100%', padding: '12px', background: '#d4af37', border: 'none' }}
                            disabled={isSaving}
                        >
                            {isSaving ? "Setting up..." : "Select Gold"}
                        </button>
                    </div>

                    {/* Diamond */}
                    <div style={{ border: '1px solid #00c3ff', borderRadius: '12px', padding: '30px', width: '280px', textAlign: 'center', position: 'relative' }}>
                        <h3 style={{ marginBottom: '10px' }}>Diamond</h3>
                        <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '20px', color: '#00c3ff' }}>₱499<span style={{fontSize: '0.9rem', color:'#666', fontWeight:'normal'}}>/mo</span></div>
                        <ul style={{ listStyle: 'none', textAlign: 'left', fontSize: '0.9rem', color: '#666', marginBottom: '20px', lineHeight: '2' }}>
                            <li>💎 <strong>First Dibs</strong> on ALL Requests</li>
                            <li>💎 Unlimited 0% Fee</li>
                            <li>💎 TikTok Live Support</li>
                        </ul>
                        <button 
                            onClick={() => handleCompleteSetup('Diamond')}
                            className="btn-primary"
                            style={{ width: '100%', padding: '12px', background: '#00c3ff', border: 'none' }}
                            disabled={isSaving}
                        >
                            Select Diamond
                        </button>
                    </div>
                </div>
                
                <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>Back</button>
            </div>
        )}

      </div>
      <Footer />
    </>
  );
} 