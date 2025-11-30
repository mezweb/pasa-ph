'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../lib/firebase'; 
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; 
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth'; // Import createUserWithEmailAndPassword
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('buyer'); // 'buyer' or 'seller'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/');
    });
    return () => unsubscribe();
  }, [router]);

  const saveUserToFirestore = async (user, name) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        await setDoc(docRef, {
            uid: user.uid,
            displayName: name || user.email.split('@')[0],
            email: user.email,
            photoURL: user.photoURL || 'https://placehold.co/32x32?text=U',
            role: selectedRole === 'seller' ? 'Seller' : 'Buyer',
            isSeller: false, // Don't set to true yet - let the onboarding wizard handle it
            createdAt: serverTimestamp(),
            isProfileComplete: false
        });
    }

    // Redirect to appropriate onboarding wizard
    if (selectedRole === 'seller') {
        router.push('/start-selling');
    } else {
        router.push('/buyer-onboarding');
    }
  };


  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        setIsProcessing(false);
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await saveUserToFirestore(user, displayName);

    } catch (error) {
        console.error("Email Signup failed:", error);
        alert(error.message);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user, result.user.displayName);

    } catch (error) {
      console.error("Google Signup failed:", error);
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '60px 20px', maxWidth: '900px', textAlign: 'center' }}>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>Join Pasa.ph</h1>
        <p style={{ color: '#666', marginBottom: '50px', fontSize: '1.1rem' }}>
            Choose how you want to get started. You can always change this later.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            
            {/* BUYER CARD */}
            <div 
                onClick={() => setSelectedRole('buyer')}
                style={{ 
                    border: selectedRole === 'buyer' ? '2px solid #0070f3' : '1px solid #eaeaea', 
                    background: selectedRole === 'buyer' ? '#f0f9ff' : 'white',
                    borderRadius: '12px', 
                    padding: '40px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛍️</div>
                <h3 style={{ marginBottom: '10px' }}>I want to Buy</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    Post requests for items you need from abroad or shop from verified traveler collections.
                </p>
            </div>

            {/* SELLER CARD */}
            <div 
                onClick={() => setSelectedRole('seller')}
                style={{ 
                    border: selectedRole === 'seller' ? '2px solid #2e7d32' : '1px solid #eaeaea', 
                    background: selectedRole === 'seller' ? '#f0fdf4' : 'white',
                    borderRadius: '12px', 
                    padding: '40px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✈️</div>
                <h3 style={{ marginBottom: '10px' }}>I want to Earn</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    Monetize your extra luggage space. Fulfill requests and earn money while traveling.
                </p>
            </div>

        </div>

        {selectedRole === 'seller' && (
            <div style={{ background: '#fff9c4', padding: '15px', borderRadius: '8px', marginBottom: '30px', fontSize: '0.9rem', color: '#856404', border: '1px solid #fbc02d' }}>
                <strong>✨ Seller Tip:</strong> You can upgrade to <b>Gold</b> or <b>Diamond</b> membership after signing up to see exclusive high-value requests!
            </div>
        )}
        
        {/* EMAIL/PASSWORD SIGNUP FORM */}
        <form onSubmit={handleEmailSignup} style={{ margin: '0 auto 30px', maxWidth: '400px', textAlign: 'left', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', textAlign: 'center' }}>Sign Up with Email</h3>

            <input 
                type="text" placeholder="Full Name" required
                value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '8px' }}
            />
            <input 
                type="email" placeholder="Email Address" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '8px' }}
            />
            <input 
                type="password" placeholder="Password (min 6 characters)" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '8px' }}
            />
            <button 
                type="submit" 
                className="btn-primary"
                disabled={isProcessing || !email || !password || !displayName}
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            >
                {isProcessing ? 'Creating Account...' : 'Create Account'}
            </button>
        </form>

        <div style={{ margin: '0 auto 20px', maxWidth: '400px', textAlign: 'center', borderBottom: '1px solid #eee', position: 'relative', height: '20px' }}>
            <span style={{ position: 'absolute', top: '0', left: '50%', transform: 'translate(-50%, -50%)', background: '#f8f8f8', padding: '0 10px', fontSize: '0.8rem', color: '#666' }}>OR</span>
        </div>


        <button 
            onClick={handleGoogleSignup}
            className="btn-primary"
            style={{ 
                padding: '15px 40px', 
                fontSize: '1.1rem', 
                width: '100%', 
                maxWidth: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                margin: '0 auto'
            }}
        >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
            Continue with Google
        </button>

        <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
            Already have an account? <a href="/login" style={{ color: '#0070f3' }}>Log in</a>
        </p>

      </div>
      <Footer />
    </>
  );
}