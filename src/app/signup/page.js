'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameInputRef = useRef(null);

  const [step, setStep] = useState(1); // 1: Role selection, 2: Email form or Profile creation
  const [selectedRole, setSelectedRole] = useState('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Seller profile fields
  const [photoURL, setPhotoURL] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  // Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Auto-focus name field when step 2 loads
  useEffect(() => {
    if (step === 2 && nameInputRef.current) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [step]);

  // Check for role param and pre-select
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'buyer' || roleParam === 'seller') {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/');
    });
    return () => unsubscribe();
  }, [router]);

  const saveUserToFirestore = async (user, name, skipRedirect = false) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        await setDoc(docRef, {
            uid: user.uid,
            displayName: name || user.email.split('@')[0],
            email: user.email,
            photoURL: user.photoURL || photoURL || 'https://placehold.co/32x32?text=U',
            role: selectedRole === 'seller' ? 'Seller' : 'Buyer',
            isSeller: selectedRole === 'seller',
            homeCity: homeCity || '',
            phoneNumber: phoneNumber || '',
            referralCode: referralCode || '',
            createdAt: serverTimestamp(),
            isProfileComplete: false
        });
    }

    if (skipRedirect) return;

    // Auto-login and redirect
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

        setCreatedUser(user);

        // If seller, show profile creation step
        if (selectedRole === 'seller') {
            setStep(3); // Profile creation step
            setIsProcessing(false);
        } else {
            // For buyers, save and auto-login
            await saveUserToFirestore(user, displayName);
            // User is auto-logged in via createUserWithEmailAndPassword
        }

    } catch (error) {
        console.error("Email Signup failed:", error);
        alert(error.message);
        setIsProcessing(false);
    }
  };

  const handleProfileCreation = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!homeCity) {
        alert("Please enter your home city.");
        setIsProcessing(false);
        return;
    }

    try {
        // Save user with profile data
        await saveUserToFirestore(createdUser, displayName);
        // User is already logged in, just redirect
    } catch (error) {
        console.error("Profile creation failed:", error);
        alert(error.message);
        setIsProcessing(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // If seller, show profile creation step
      if (selectedRole === 'seller') {
        setCreatedUser(result.user);
        setDisplayName(result.user.displayName || '');
        setPhotoURL(result.user.photoURL || '');
        setStep(3);
      } else {
        await saveUserToFirestore(result.user, result.user.displayName);
      }

    } catch (error) {
      console.error("Google Signup failed:", error);
      alert(error.message);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  // Progress dots
  const totalSteps = selectedRole === 'seller' ? 3 : 2;
  const currentStep = step;

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '60px 20px', maxWidth: '900px', textAlign: 'center', minHeight: 'calc(100vh - 200px)' }}>

        {/* Progress Stepper */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              style={{
                width: index + 1 === currentStep ? '40px' : '12px',
                height: '12px',
                borderRadius: '6px',
                background: index + 1 <= currentStep ? '#0070f3' : '#e0e0e0',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>Join Pasa.ph</h1>
            <p style={{ color: '#666', marginBottom: '50px', fontSize: '1.1rem' }}>
                Choose how you want to get started. You can always change this later.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>

                {/* BUYER CARD */}
                <div
                    onClick={() => handleRoleSelect('buyer')}
                    style={{
                        border: selectedRole === 'buyer' ? '2px solid #0070f3' : '1px solid #eaeaea',
                        background: selectedRole === 'buyer' ? '#f0f9ff' : 'white',
                        borderRadius: '12px',
                        padding: '40px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: selectedRole === 'buyer' ? '0 4px 20px rgba(0,112,243,0.2)' : 'none'
                    }}
                >
                    <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>🛍️</div>
                    <h3 style={{ marginBottom: '10px', fontSize: '1.5rem' }}>I want to Buy</h3>
                    <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        Post requests for items you need from abroad or shop from verified traveler collections.
                    </p>
                </div>

                {/* SELLER CARD */}
                <div
                    onClick={() => handleRoleSelect('seller')}
                    style={{
                        border: selectedRole === 'seller' ? '2px solid #2e7d32' : '1px solid #eaeaea',
                        background: selectedRole === 'seller' ? '#f0fdf4' : 'white',
                        borderRadius: '12px',
                        padding: '40px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: selectedRole === 'seller' ? '0 4px 20px rgba(46,125,50,0.2)' : 'none'
                    }}
                >
                    <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>✈️</div>
                    <h3 style={{ marginBottom: '10px', fontSize: '1.5rem' }}>I want to Earn</h3>
                    <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        Earn up to ₱50k on your next trip. Fulfill requests and get paid while traveling.
                    </p>
                </div>

            </div>
          </>
        )}

        {/* Step 2: Sign Up Form */}
        {step === 2 && (
          <>
            <button
              onClick={handleBack}
              style={{
                position: 'absolute',
                left: '20px',
                top: '80px',
                background: 'transparent',
                border: 'none',
                color: '#0070f3',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: '600'
              }}
            >
              ← Back
            </button>

            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Create Your Account</h1>
            <p style={{ color: '#666', marginBottom: '40px', fontSize: '1rem' }}>
                Sign up to start {selectedRole === 'buyer' ? 'shopping' : 'earning'}
            </p>

            {/* EMAIL/PASSWORD SIGNUP FORM */}
            <form onSubmit={handleEmailSignup} style={{ margin: '0 auto 30px', maxWidth: '400px', textAlign: 'left', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
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

            <div style={{ margin: '0 auto 20px', maxWidth: '400px', textAlign: 'center', borderBottom: '1px solid #eee', position: 'relative', height: '20px' }}>
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
                    maxWidth: '400px',
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
          </>
        )}

        {/* Step 3: Seller Profile Creation */}
        {step === 3 && selectedRole === 'seller' && (
          <>
            <button
              onClick={handleBack}
              style={{
                position: 'absolute',
                left: '20px',
                top: '80px',
                background: 'transparent',
                border: 'none',
                color: '#0070f3',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: '600'
              }}
            >
              ← Back
            </button>

            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Create Your Seller Profile</h1>
            <p style={{ color: '#666', marginBottom: '40px', fontSize: '1rem' }}>
                Build trust with buyers by completing your profile
            </p>

            <form onSubmit={handleProfileCreation} style={{ margin: '0 auto', maxWidth: '400px', textAlign: 'left', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', textAlign: 'center', fontWeight: '700' }}>Profile Details</h3>

                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>
                  Profile Photo URL <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="url"
                    placeholder="https://example.com/your-photo.jpg"
                    required
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' }}
                />
                {photoURL && (
                  <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                    <img src={photoURL} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0070f3' }} onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}

                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>
                  Home City <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    placeholder="e.g., Manila, Quezon City, Cebu"
                    required
                    value={homeCity}
                    onChange={(e) => setHomeCity(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' }}
                />

                <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #b3e0ff' }}>
                  <p style={{ fontSize: '0.85rem', color: '#0070f3', margin: 0, lineHeight: '1.5' }}>
                    💡 <strong>Pro tip:</strong> A clear profile photo and accurate home city help buyers trust you more!
                  </p>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={isProcessing || !photoURL || !homeCity}
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: '700' }}
                >
                    {isProcessing ? 'Creating Profile...' : 'Complete Profile'}
                </button>
            </form>
          </>
        )}

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
