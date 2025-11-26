'use client';

import { useCart } from '../../context/CartContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CartPage() {
  const { cart, removeFromCart, clearCart, pasaBag, removeFromBag, clearBag, viewMode } = useCart();
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  
  const isSellerMode = viewMode === 'seller';
  const currentList = isSellerMode ? pasaBag : cart;
  const removeFunc = isSellerMode ? removeFromBag : removeFromCart;
  const clearFunc = isSellerMode ? clearBag : clearCart;

  const total = currentList.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!user) {
        router.push('/login');
        return;
    }

    if (isSellerMode) {
        clearFunc();
        return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('Starting checkout process...');

      // Prepare items for checkout
      const items = currentList.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
        from: item.from,
        category: item.category,
        images: item.images || [item.image],
      }));

      console.log('Items prepared:', items);
      console.log('Payment method:', paymentMethod);

      // Handle Cash on Delivery
      if (paymentMethod === 'cod') {
        console.log('Processing COD order...');
        const orderResponse = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName,
            items,
            totalAmount: total,
            paymentMethod: 'cod',
            sessionId: null,
          }),
        });

        const orderData = await orderResponse.json();
        console.log('COD Order response:', orderData);

        if (orderData.success) {
          clearCart();
          router.push(`/orders/${orderData.orderId}`);
        } else {
          throw new Error(orderData.error || 'Failed to create order');
        }
        return;
      }

      // Handle Stripe payments (card, gcash, paymaya)
      console.log('Creating Stripe checkout session...');
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          userId: user.uid,
          userEmail: user.email,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      console.log('Stripe session response:', data);

      if (!data.sessionId) {
        throw new Error('No session ID received from Stripe');
      }

      // Create order in Firebase before redirecting to Stripe
      console.log('Creating order in Firebase...');
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName,
          items,
          totalAmount: total,
          paymentMethod,
          sessionId: data.sessionId,
        }),
      });

      const orderData = await orderResponse.json();
      console.log('Firebase order response:', orderData);

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order in database');
      }

      // Clear cart before redirecting to Stripe
      clearCart();

      // Redirect to Stripe Checkout
      console.log('Redirecting to Stripe checkout...');
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to initialize. Please check your Stripe publishable key.');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Stripe redirect failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.message || 'An error occurred during checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '60px 20px', maxWidth: '800px', minHeight: '70vh' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <span style={{ fontSize: '2rem' }}>{isSellerMode ? '🛍️' : '🛒'}</span>
            <h1 style={{ margin: 0 }}>{isSellerMode ? 'My Pasa Bag (Fulfillment List)' : 'Shopping Cart'}</h1>
        </div>

        {isSellerMode && (
            <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#0070f3', fontSize: '0.9rem' }}>
                ℹ️ These are items you have agreed to buy for others. Confirming this list notifies the buyers.
            </div>
        )}

        {currentList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', background: '#f9f9f9', borderRadius: '12px' }}>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    {isSellerMode ? 'Your bag is empty. Browse requests to fill it up!' : 'Your cart is empty.'}
                </p>
                <Link href={isSellerMode ? "/products" : "/"} className="btn-primary">
                    {isSellerMode ? 'Find Products to Sell' : 'Go Shopping'}
                </Link>
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {currentList.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={item.image || item.images?.[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                                {isSellerMode ? (
                                    <div style={{ fontSize: '0.9rem', color: '#2e7d32' }}>Earnings: ₱{(item.price * 0.15).toFixed(0)} (Service Fee)</div>
                                ) : (
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>₱{item.price} x {item.quantity}</div>
                                )}
                            </div>
                        </div>
                        <button onClick={() => removeFunc(item.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                    </div>
                ))}

                {!isSellerMode && (
                    <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
                        <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Payment Method</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: `2px solid ${paymentMethod === 'card' ? '#0070f3' : '#ddd'}`, borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '10px' }} />
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>💳 Credit/Debit Card</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Secure payment via Stripe</div>
                                </div>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: `2px solid ${paymentMethod === 'gcash' ? '#0070f3' : '#ddd'}`, borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                <input type="radio" name="payment" value="gcash" checked={paymentMethod === 'gcash'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '10px' }} />
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>📱 GCash</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Pay with GCash wallet</div>
                                </div>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: `2px solid ${paymentMethod === 'paymaya' ? '#0070f3' : '#ddd'}`, borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                <input type="radio" name="payment" value="paymaya" checked={paymentMethod === 'paymaya'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '10px' }} />
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>💰 PayMaya</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Pay with PayMaya wallet</div>
                                </div>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: `2px solid ${paymentMethod === 'cod' ? '#0070f3' : '#ddd'}`, borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '10px' }} />
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>🏠 Cash on Delivery</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Pay when you receive your order</div>
                                </div>
                            </label>
                        </div>
                    </div>
                )}

                {error && (
                    <div style={{ marginTop: '20px', padding: '15px', background: '#ffebee', border: '1px solid #ef5350', borderRadius: '8px', color: '#c62828' }}>
                        <strong>Error:</strong> {error}
                    </div>
                )}

                <div style={{ marginTop: '20px', padding: '20px', background: '#f0f9ff', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {isSellerMode ? 'Total Potential Earnings:' : 'Total:'}
                        <span style={{ color: '#0070f3', marginLeft: '10px' }}>
                            ₱{isSellerMode ? (total * 0.15).toFixed(0) : total}
                        </span>
                    </div>
                    <button onClick={handleCheckout} className="btn-primary" disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : (isSellerMode ? 'Confirm Fulfillment' : 'Proceed to Payment')}
                    </button>
                </div>
            </div>
        )}
      </div>
      <Footer />
    </>
  );
}