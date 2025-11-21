'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function StartSellingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const handleStart = () => {
    // Logic to start the setup process (e.g., redirect to profile setup or a wizard)
    router.push('/profile'); 
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '60px 20px', maxWidth: '800px', textAlign: 'center' }}>
        
        {/* Hero Section */}
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px' }}>Become a Pasa Seller</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
          Turn your travels into earnings. Help people get the items they love from around the world.
        </p>

        {/* Benefits Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '50px' }}>
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
                <h3 style={{ marginBottom: '10px' }}>Earn Extra Cash</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Make money by fulfilling requests or selling items you bring back.</p>
            </div>
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔒</div>
                <h3 style={{ marginBottom: '10px' }}>Secure Payments</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Payments are held in escrow until you successfully deliver the item.</p>
            </div>
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌟</div>
                <h3 style={{ marginBottom: '10px' }}>Build Your Reputation</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Get rated and reviewed to unlock higher seller tiers and exclusive perks.</p>
            </div>
        </div>

        {/* Dashboard Preview (Visual Representation) */}
        <div style={{ marginBottom: '50px', border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ background: '#333', color: 'white', padding: '15px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c940' }}></div>
                <span style={{ marginLeft: '10px', fontSize: '0.8rem', opacity: 0.7 }}>Seller Dashboard Preview</span>
            </div>
            <div style={{ padding: '30px', background: 'white', textAlign: 'left' }}>
                <h3 style={{ marginBottom: '20px' }}>Live Request Feed</h3>
                
                {/* Mock Request Item (Gold Exclusive) */}
                <div style={{ border: '2px solid #d4af37', borderRadius: '8px', padding: '15px', marginBottom: '15px', position: 'relative', background: '#fffbe6' }}>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#d4af37', color: 'white', fontSize: '0.6rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>GOLD EXCLUSIVE</div>
                    <h4 style={{ margin: '0 0 5px' }}>iPhone 15 Pro Max</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>USA &rarr; Manila • Budget: ₱75,000</p>
                </div>

                {/* Mock Request Item (Standard) */}
                <div style={{ border: '1px solid #eaeaea', borderRadius: '8px', padding: '15px' }}>
                    <h4 style={{ margin: '0 0 5px' }}>Tokyo Banana</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Japan &rarr; Quezon City • Budget: ₱800</p>
                </div>
            </div>
        </div>

        {/* CTA */}
        <button onClick={handleStart} className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>
            Set Up Seller Profile
        </button>

        <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
            Already a seller? <Link href="/seller-dashboard" style={{ color: '#0070f3' }}>Go to Dashboard</Link>
        </p>

      </div>
      <Footer />
    </>
  );
}