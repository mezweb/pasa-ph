'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../lib/firebase'; // Import db
import { doc, getDoc } from 'firebase/firestore'; // Import firestore functions
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function LoginPage() {
  const router = useRouter();

  // We handle redirection manually after sign-in action
  // Removing the auto-redirect in useEffect to prevent double-firing before we check Firestore

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists in database
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().isProfileComplete) {
        // User exists and has setup profile -> Go Home
        router.push('/');
      } else {
        // User is new OR hasn't finished setup -> Go to Profile
        router.push('/profile');
      }

    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', maxWidth: '400px', width: '100%' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px', color: '#0070f3' }}>Welcome Back</h1>
            <p style={{ color: '#666', marginBottom: '30px', fontSize: '0.95rem' }}>
                Login to Pasa.ph to post requests, manage trips, and chat with the community.
            </p>
            
            <button 
                onClick={handleLogin}
                style={{ 
                    width: '100%',
                    padding: '12px', 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    background: 'white',
                    color: '#333',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                Continue with Google
            </button>
        </div>
      </div>
      <Footer />
    </>
  );
}