'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../lib/firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'; // Import signInWithEmailAndPassword
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRedirect = async (user) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().isProfileComplete) {
      router.push('/');
    } else {
      router.push('/profile');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await handleRedirect(userCredential.user);

    } catch (error) {
        console.error("Email Login failed:", error);
        alert("Login Failed: " + error.message);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleRedirect(result.user);

    } catch (error) {
        console.error("Google Login failed:", error);
        alert("Login Failed: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', maxWidth: '400px', width: '100%' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px', color: '#0070f3' }}>Welcome Back</h1>
            <p style={{ color: '#666', marginBottom: '30px', fontSize: '0.95rem' }}>
                Login to Pasa.ph to continue your journey.
            </p>
            
            {/* EMAIL/PASSWORD LOGIN FORM */}
            <form onSubmit={handleEmailLogin} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                <input 
                    type="email" placeholder="Email Address" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '8px' }}
                />
                <input 
                    type="password" placeholder="Password" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '8px' }}
                />
                <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isProcessing}
                    style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                >
                    {isProcessing ? 'Logging in...' : 'Log In'}
                </button>
            </form>

            <div style={{ margin: '0 auto 20px', textAlign: 'center', borderBottom: '1px solid #eee', position: 'relative', height: '20px' }}>
                <span style={{ position: 'absolute', top: '0', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '0 10px', fontSize: '0.8rem', color: '#666' }}>OR</span>
            </div>

            {/* GOOGLE LOGIN BUTTON */}
            <button 
                onClick={handleGoogleLogin}
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

            <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
                Don't have an account? <Link href="/signup" style={{ color: '#0070f3' }}>Sign Up</Link>
            </p>
        </div>
      </div>
      <Footer />
    </>
  );
}