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

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, pasaBag, removeFromBag, clearBag, viewMode } = useCart();
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

  // Calculate fees for buyer cart
  const subtotal = currentList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = isSellerMode ? 0 : 150; // Placeholder shipping fee
  const taxRate = 0.12; // 12% VAT (placeholder)
  const taxAmount = isSellerMode ? 0 : Math.round(subtotal * taxRate);
  const total = isSellerMode ? subtotal : subtotal + shippingFee + taxAmount;

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

      // Redirect to Stripe Checkout using the session URL
      console.log('Redirecting to Stripe checkout...');

      if (!data.url) {
        throw new Error('No checkout URL received from Stripe');
      }

      // Direct redirect to Stripe checkout page
      window.location.href = data.url;
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
      <div className="container" style={{ padding: 'clamp(40px, 8vw, 60px) 20px', maxWidth: '800px', minHeight: '70vh' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>{isSellerMode ? '🛍️' : '🛒'}</span>
            <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>{isSellerMode ? 'My Pasa Bag (Fulfillment List)' : 'Shopping Cart'}</h1>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {currentList.map(item => (
                    <div key={item.id} style={{ background: 'white', padding: 'clamp(12px, 3vw, 20px)', borderRadius: '8px', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px', flexWrap: 'wrap' }}>
                            {/* Image and Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1, minWidth: '200px' }}>
                                <div style={{ width: 'clamp(60px, 12vw, 80px)', height: 'clamp(60px, 12vw, 80px)', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={item.image || item.images?.[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', wordBreak: 'break-word', marginBottom: '5px' }}>{item.title}</div>
                                    <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: '#888', marginBottom: '8px' }}>₱{item.price.toLocaleString()} each</div>

                                    {!isSellerMode && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                            <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: '#666', fontWeight: '500' }}>Quantity:</span>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                                                <button
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    disabled={item.quantity <= 1}
                                                    style={{
                                                        background: item.quantity <= 1 ? '#f5f5f5' : 'white',
                                                        border: 'none',
                                                        padding: '6px 12px',
                                                        cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                                        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                                                        color: item.quantity <= 1 ? '#ccc' : '#333',
                                                        fontWeight: 'bold',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onMouseOver={(e) => item.quantity > 1 && (e.currentTarget.style.background = '#f5f5f5')}
                                                    onMouseOut={(e) => item.quantity > 1 && (e.currentTarget.style.background = 'white')}
                                                >
                                                    −
                                                </button>
                                                <span style={{
                                                    padding: '6px 16px',
                                                    borderLeft: '1px solid #ddd',
                                                    borderRight: '1px solid #ddd',
                                                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                                    fontWeight: 'bold',
                                                    minWidth: '40px',
                                                    textAlign: 'center'
                                                }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => increaseQuantity(item.id)}
                                                    style={{
                                                        background: 'white',
                                                        border: 'none',
                                                        padding: '6px 12px',
                                                        cursor: 'pointer',
                                                        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                                                        color: '#333',
                                                        fontWeight: 'bold',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {isSellerMode && (
                                        <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: '#2e7d32' }}>Earnings: ₱{(item.price * 0.15).toFixed(0)} (Service Fee)</div>
                                    )}
                                </div>
                            </div>

                            {/* Price and Remove */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                <div style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: 'bold', color: '#0070f3' }}>
                                    ₱{(item.price * item.quantity).toLocaleString()}
                                </div>
                                <button
                                    onClick={() => removeFunc(item.id)}
                                    style={{
                                        color: '#ef5350',
                                        background: 'none',
                                        border: '1px solid #ef5350',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: 'clamp(0.8rem, 2vw, 0.85rem)',
                                        padding: '6px 12px',
                                        transition: 'all 0.2s',
                                        fontWeight: '500'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = '#ef5350';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'none';
                                        e.currentTarget.style.color = '#ef5350';
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {!isSellerMode && (
                    <div style={{ marginTop: '20px', padding: 'clamp(15px, 4vw, 20px)', background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
                        <h3 style={{ marginBottom: '15px', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Payment Method</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', padding: 'clamp(10px, 3vw, 12px)', border: `2px solid ${paymentMethod === 'card' ? '#0070f3' : '#ddd'}`, borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '10px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>💳 Credit/Debit Card</div>
                                    <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', color: '#666' }}>Secure payment via Stripe</div>
                                </div>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', padding: 'clamp(10px, 3vw, 12px)', border: `2px solid ${paymentMethod === 'gcash' ? '#0070f3' : '#ddd'}`, borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                <input type="radio" name="payment" value="gcash" checked={paymentMethod === 'gcash'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '10px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>📱 GCash</div>
                                    <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', color: '#666' }}>Pay with GCash wallet</div>
                                </div>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', padding: 'clamp(10px, 3vw, 12px)', border: `2px solid ${paymentMethod === 'paymaya' ? '#0070f3' : '#ddd'}`, borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                <input type="radio" name="payment" value="paymaya" checked={paymentMethod === 'paymaya'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '10px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>💰 PayMaya</div>
                                    <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', color: '#666' }}>Pay with PayMaya wallet</div>
                                </div>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', padding: 'clamp(10px, 3vw, 12px)', border: `2px solid ${paymentMethod === 'cod' ? '#0070f3' : '#ddd'}`, borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '10px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>🏠 Cash on Delivery</div>
                                    <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', color: '#666' }}>Pay when you receive your order</div>
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

                {/* Order Summary / Fee Breakdown */}
                <div style={{ marginTop: '20px', padding: 'clamp(15px, 4vw, 20px)', background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
                    <h3 style={{ marginBottom: '15px', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 'bold' }}>
                        {isSellerMode ? 'Earnings Summary' : 'Order Summary'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Subtotal */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
                            <span style={{ color: '#666' }}>Subtotal ({currentList.reduce((sum, item) => sum + item.quantity, 0)} {currentList.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'})</span>
                            <span style={{ fontWeight: '500' }}>₱{subtotal.toLocaleString()}</span>
                        </div>

                        {!isSellerMode && (
                            <>
                                {/* Shipping Fee */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
                                    <span style={{ color: '#666' }}>Shipping Fee</span>
                                    <span style={{ fontWeight: '500' }}>₱{shippingFee.toLocaleString()}</span>
                                </div>

                                {/* Tax/VAT */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
                                    <span style={{ color: '#666' }}>Tax (VAT 12%)</span>
                                    <span style={{ fontWeight: '500' }}>₱{taxAmount.toLocaleString()}</span>
                                </div>
                            </>
                        )}

                        {/* Divider */}
                        <div style={{ borderTop: '2px solid #eee', marginTop: '8px', paddingTop: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', fontWeight: 'bold' }}>
                                    {isSellerMode ? 'Total Earnings:' : 'Total:'}
                                </span>
                                <span style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: 'bold', color: '#0070f3' }}>
                                    ₱{isSellerMode ? (subtotal * 0.15).toFixed(0) : total.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                        onClick={handleCheckout}
                        className="btn-primary"
                        disabled={isProcessing}
                        style={{
                            width: '100%',
                            marginTop: '20px',
                            fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
                            padding: 'clamp(12px, 3vw, 14px) clamp(20px, 5vw, 24px)'
                        }}
                    >
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