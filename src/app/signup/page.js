'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

function SignupContent() {
  const router = useRouter();
  const nameInputRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Auto-focus name field when component loads
  useEffect(() => {
    setTimeout(() => nameInputRef.current?.focus(), 100);
  }, []);

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
        role: 'Buyer', // Default to buyer, can be changed in onboarding
        isSeller: false, // Will be set in onboarding if they choose seller
        referralCode: referralCode || '',
        createdAt: serverTimestamp(),
        isProfileComplete: false,
        isVisible: false
      });
    }

    // Redirect all users to onboarding wizard
    router.push('/onboarding');
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      setIsProcessing(false);
      return;
    }

    if (!agreedToTerms) {
      alert("Please agree to the Terms and Conditions.");
      setIsProcessing(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: displayName });

      // Save to Firestore and redirect to onboarding
      await saveUserToFirestore(user, displayName);

    } catch (error) {
      console.error("Email Signup failed:", error);
      alert(error.message);
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
      <div className="container" style={{ padding: '60px 20px', maxWidth: '500px', textAlign: 'center', minHeight: 'calc(100vh - 200px)' }}>

        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>Join Pasa.ph</h1>
        <p style={{ color: '#666', marginBottom: '40px', fontSize: '1.1rem' }}>
          Create your account to get started
        </p>

        {/* EMAIL/PASSWORD SIGNUP FORM */}
        <form onSubmit={handleEmailSignup} style={{ margin: '0 auto 30px', textAlign: 'left', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', textAlign: 'center', fontWeight: '700' }}>Sign Up with Email</h3>

          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>Full Name</label>
          <input
            ref={nameInputRef}
            type="text"
            placeholder="Enter your full name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' }}
          />

          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>Email Address</label>
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type="email"
              placeholder="your.email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', paddingRight: '40px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' }}
            />
            {email && isValidEmail(email) && (
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2e7d32', fontSize: '1.2rem' }}>✓</span>
            )}
          </div>

          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>Password</label>
          <div style={{ position: 'relative', marginBottom: '5px' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', paddingRight: '40px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: '#666'
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '15px', marginLeft: '2px' }}>
            Minimum 6 characters
          </p>

          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>Referral Code (Optional)</label>
          <input
            type="text"
            placeholder="Enter referral code if you have one"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' }}
          />

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'start', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ marginTop: '3px', cursor: 'pointer', width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '0.85rem', color: '#333', lineHeight: '1.5', textAlign: 'left' }}>
                I agree to the <Link href="/terms" style={{ color: '#0070f3', textDecoration: 'underline' }}>Terms and Conditions</Link> and <Link href="/privacy" style={{ color: '#0070f3', textDecoration: 'underline' }}>Privacy Policy</Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isProcessing || !email || !password || !displayName || !agreedToTerms}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: '700' }}
          >
            {isProcessing ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ margin: '0 auto 20px', textAlign: 'center', borderBottom: '1px solid #eee', position: 'relative', height: '20px' }}>
          <span style={{ position: 'absolute', top: '0', left: '50%', transform: 'translate(-50%, -50%)', background: '#f8f8f8', padding: '0 10px', fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>OR</span>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="btn-primary"
          style={{
            padding: '15px 40px',
            fontSize: '1rem',
            fontWeight: '700',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            margin: '0 auto',
            background: 'white',
            color: '#333',
            border: '1px solid #ddd'
          }}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
          Sign up with Google
        </button>

        <p style={{ marginTop: '30px', fontSize: '0.9rem', color: '#666' }}>
          Already have an account? <Link href="/login" style={{ color: '#0070f3', fontWeight: '600' }}>Log in</Link>
        </p>

      </div>
      <Footer />
    </>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '60px 20px', textAlign: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: '2rem' }}>Loading...</div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
