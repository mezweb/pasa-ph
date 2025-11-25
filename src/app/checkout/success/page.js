'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useCart } from '../../../context/CartContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    setSessionId(session_id);

    // Clear cart after successful payment
    clearCart();
  }, [searchParams, clearCart]);

  return (
    <div className="container" style={{ padding: '80px 20px', maxWidth: '600px', minHeight: '70vh', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#2e7d32' }}>Payment Successful!</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px' }}>
        Thank you for your order! Your payment has been processed successfully.
      </p>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '10px' }}>What's Next?</h3>
        <ul style={{ textAlign: 'left', lineHeight: '1.8', color: '#666' }}>
          <li>You will receive an email confirmation shortly</li>
          <li>The seller will be notified of your order</li>
          <li>Track your order status in your dashboard</li>
          <li>You'll be notified when your item ships</li>
        </ul>
      </div>

      {sessionId && (
        <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '30px' }}>
          Transaction ID: {sessionId.substring(0, 20)}...
        </div>
      )}

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/buyer-dashboard" className="btn-primary">
          View My Orders
        </Link>
        <Link href="/shop" style={{ padding: '12px 24px', border: '1px solid #0070f3', borderRadius: '6px', color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
