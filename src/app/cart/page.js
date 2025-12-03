'use client';

import { useCart } from '../../context/CartContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, pasaBag, removeFromBag, clearBag, viewMode, addToCart } = useCart();
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('gcash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Details, 3: Payment
  const [guestEmail, setGuestEmail] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [itemNotes, setItemNotes] = useState({});
  const [itemFallbacks, setItemFallbacks] = useState({});
  const [pastOrders, setPastOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadPastOrders(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load past orders for one-click reorder
  const loadPastOrders = async (userId) => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      setPastOrders(orders.slice(0, 3)); // Show last 3 orders
    } catch (error) {
      console.error('Error loading past orders:', error);
    }
  };

  // One-click reorder function
  const handleReorder = (order) => {
    clearCart();
    order.items.forEach(item => {
      addToCart(item);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSellerMode = viewMode === 'seller';
  const currentList = isSellerMode ? pasaBag : cart;
  const removeFunc = isSellerMode ? removeFromBag : removeFromCart;
  const clearFunc = isSellerMode ? clearBag : clearCart;

  // Calculate fees for buyer cart
  const subtotal = currentList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = isSellerMode ? 0 : 150; // Placeholder shipping fee
  const serviceFee = Math.round(subtotal * 0.10); // 10% service fee
  const originalSubtotal = subtotal + 500; // Mock original price for discount calculation
  const totalSavings = 500; // Mock savings
  const taxRate = 0.00; // No tax shown separately, included in service fee
  const taxAmount = isSellerMode ? 0 : Math.round(subtotal * taxRate);
  const total = isSellerMode ? subtotal : subtotal + shippingFee + serviceFee;

  // Estimated delivery range
  const minDeliveryDays = 3;
  const maxDeliveryDays = 7;
  const estimatedDeliveryStart = new Date(Date.now() + minDeliveryDays * 24 * 60 * 60 * 1000);
  const estimatedDeliveryEnd = new Date(Date.now() + maxDeliveryDays * 24 * 60 * 60 * 1000);

  const handleCheckout = async () => {
    if (checkoutStep === 1) {
      setCheckoutStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (checkoutStep === 2) {
      setCheckoutStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Final checkout (step 3)
    if (!user && !isGuest) {
        router.push('/login');
        return;
    }

    if (isGuest && !guestEmail) {
      setError('Please provide your email address for guest checkout');
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

      // Prepare items for checkout with notes and fallback options
      const items = currentList.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
        from: item.from,
        category: item.category,
        images: item.images || [item.image],
        note: itemNotes[item.id] || '',
        fallbackOption: itemFallbacks[item.id] || 'cancel'
      }));

      const userEmail = user ? user.email : guestEmail;
      const userName = user ? user.displayName : 'Guest';
      const userId = user ? user.uid : `guest_${Date.now()}`;

      console.log('Items prepared:', items);
      console.log('Payment method:', paymentMethod);

      // Handle Cash on Delivery
      if (paymentMethod === 'cod') {
        console.log('Processing COD order...');
        const orderResponse = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            userEmail,
            userName,
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
          userId,
          userEmail,
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
          userId,
          userEmail,
          userName,
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

  // Progress Bar Component
  const ProgressBar = () => {
    const steps = ['Cart', 'Details', 'Payment'];
    return (
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === checkoutStep;
            const isCompleted = stepNumber < checkoutStep;

            return (
              <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isCompleted ? '#2e7d32' : isActive ? '#0070f3' : '#e0e0e0',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  marginBottom: '8px',
                  transition: 'all 0.3s',
                  border: isActive ? '3px solid #bbdefb' : 'none'
                }}>
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive ? '#0070f3' : isCompleted ? '#2e7d32' : '#888'
                }}>
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: 'calc(50% + 20px)',
                    width: 'calc(100% - 40px)',
                    height: '3px',
                    background: stepNumber < checkoutStep ? '#2e7d32' : '#e0e0e0',
                    zIndex: 1,
                    transition: 'all 0.3s'
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: 'clamp(40px, 8vw, 60px) 20px', maxWidth: '900px', minHeight: '70vh' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>{isSellerMode ? '🛍️' : '🛒'}</span>
            <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>{isSellerMode ? 'My Pasa Bag (Fulfillment List)' : 'Shopping Cart'}</h1>
        </div>

        {!isSellerMode && currentList.length > 0 && <ProgressBar />}

        {isSellerMode && (
            <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#0070f3', fontSize: '0.9rem' }}>
                ℹ️ These are items you have agreed to buy for others. Confirming this list notifies the buyers.
            </div>
        )}

        {/* One-Click Reorder Section */}
        {!isSellerMode && currentList.length === 0 && pastOrders.length > 0 && (
          <div style={{ marginBottom: '30px', background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eee' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🔄</span>
              Quick Reorder
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {pastOrders.map((order) => (
                <div key={order.id} style={{
                  background: '#f9f9f9',
                  padding: '15px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '0.95rem' }}>
                      Order from {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {order.items?.length || 0} items • ₱{order.totalAmount?.toLocaleString() || 0}
                    </div>
                  </div>
                  <button
                    onClick={() => handleReorder(order)}
                    style={{
                      background: '#0070f3',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#0051cc'}
                    onMouseOut={(e) => e.target.style.background = '#0070f3'}
                  >
                    Reorder
                  </button>
                </div>
              ))}
            </div>
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
                {/* STEP 1: Cart Items */}
                {checkoutStep === 1 && currentList.map(item => (
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

                {/* STEP 2: Details (Notes & Fallback Options) */}
                {checkoutStep === 2 && (
                  <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eee' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Order Details</h3>

                    {/* Guest Checkout Option */}
                    {!user && (
                      <div style={{ marginBottom: '25px', background: '#f0f7ff', padding: '20px', borderRadius: '10px', border: '1px solid #bbdefb' }}>
                        <h4 style={{ marginBottom: '15px', fontSize: '1rem', color: '#0070f3' }}>Continue as Guest</h4>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => {
                            setGuestEmail(e.target.value);
                            setIsGuest(true);
                          }}
                          placeholder="your@email.com"
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '1rem',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#0070f3'}
                          onBlur={(e) => e.target.style.borderColor = '#ddd'}
                        />
                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '8px' }}>
                          We'll send your order confirmation here
                        </div>
                      </div>
                    )}

                    {currentList.map((item, idx) => (
                      <div key={item.id} style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: idx < currentList.length - 1 ? '1px solid #eee' : 'none' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '1rem' }}>
                          {item.title}
                        </div>

                        {/* Note to Traveler */}
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
                            💬 Note to Traveler (Optional)
                          </label>
                          <textarea
                            value={itemNotes[item.id] || ''}
                            onChange={(e) => setItemNotes({ ...itemNotes, [item.id]: e.target.value })}
                            placeholder="E.g., 'Please get the blue variant' or 'Extra bubble wrap please'"
                            style={{
                              width: '100%',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid #ddd',
                              fontSize: '0.9rem',
                              minHeight: '80px',
                              resize: 'vertical',
                              fontFamily: 'inherit',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#0070f3'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                          />
                        </div>

                        {/* Fallback Option */}
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
                            🔄 If item is out of stock:
                          </label>
                          <select
                            value={itemFallbacks[item.id] || 'cancel'}
                            onChange={(e) => setItemFallbacks({ ...itemFallbacks, [item.id]: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid #ddd',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              background: 'white',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#0070f3'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                          >
                            <option value="cancel">Cancel this item only</option>
                            <option value="cancel_all">Cancel entire order</option>
                            <option value="contact">Contact me first</option>
                            <option value="substitute">Get similar substitute</option>
                          </select>
                        </div>
                      </div>
                    ))}

                    {/* Estimated Delivery */}
                    <div style={{
                      background: '#e8f5e9',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '1px solid #2e7d32',
                      marginTop: '20px'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>📦</span>
                        Estimated Delivery
                      </div>
                      <div style={{ color: '#1b5e20', fontSize: '0.9rem' }}>
                        {estimatedDeliveryStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {estimatedDeliveryEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        <span style={{ display: 'block', fontSize: '0.8rem', marginTop: '5px', opacity: 0.8 }}>
                          ({minDeliveryDays}-{maxDeliveryDays} business days)
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                      <button
                        onClick={() => setCheckoutStep(1)}
                        style={{
                          flex: 1,
                          padding: '14px',
                          background: 'white',
                          border: '2px solid #ddd',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '1rem'
                        }}
                      >
                        ← Back to Cart
                      </button>
                      <button
                        onClick={() => setCheckoutStep(3)}
                        style={{
                          flex: 2,
                          padding: '14px',
                          background: '#0070f3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '1rem'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#0051cc'}
                        onMouseOut={(e) => e.target.style.background = '#0070f3'}
                      >
                        Continue to Payment →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Payment */}
                {checkoutStep === 3 && !isSellerMode && (
                    <div style={{ marginTop: '20px', padding: 'clamp(15px, 4vw, 25px)', background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>Select Payment Method</h3>

                        {/* Payment Icons Preview */}
                        <div style={{
                          background: '#f9f9f9',
                          padding: '15px',
                          borderRadius: '10px',
                          marginBottom: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px',
                          flexWrap: 'wrap',
                          justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>We accept:</span>
                          <div style={{
                            background: '#007DFF',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                          }}>GCash</div>
                          <div style={{
                            background: '#00D632',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                          }}>Maya</div>
                          <div style={{
                            background: '#004A9C',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                          }}>BDO</div>
                          <div style={{
                            background: '#6772E5',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                          }}>Cards</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', padding: 'clamp(12px, 3vw, 15px)', border: `2px solid ${paymentMethod === 'gcash' ? '#0070f3' : '#ddd'}`, borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                <input type="radio" name="payment" value="gcash" checked={paymentMethod === 'gcash'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '12px', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ background: '#007DFF', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>GCash</span>
                                      Pay with GCash
                                    </div>
                                    <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', color: '#666', marginTop: '4px' }}>Most popular • Instant confirmation</div>
                                </div>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', padding: 'clamp(12px, 3vw, 15px)', border: `2px solid ${paymentMethod === 'paymaya' ? '#0070f3' : '#ddd'}`, borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                <input type="radio" name="payment" value="paymaya" checked={paymentMethod === 'paymaya'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '12px', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ background: '#00D632', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>Maya</span>
                                      Pay with Maya
                                    </div>
                                    <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', color: '#666', marginTop: '4px' }}>PayMaya wallet</div>
                                </div>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', padding: 'clamp(12px, 3vw, 15px)', border: `2px solid ${paymentMethod === 'card' ? '#0070f3' : '#ddd'}`, borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '12px', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      💳 Credit/Debit Card
                                    </div>
                                    <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', color: '#666', marginTop: '4px' }}>Visa, Mastercard, BDO, BPI</div>
                                </div>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', padding: 'clamp(12px, 3vw, 15px)', border: `2px solid ${paymentMethod === 'cod' ? '#0070f3' : '#ddd'}`, borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '12px', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)' }}>🏠 Cash on Delivery</div>
                                    <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', color: '#666', marginTop: '4px' }}>Pay when you receive</div>
                                </div>
                            </label>
                        </div>

                        {/* Escrow Explanation */}
                        <div style={{
                          background: 'linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%)',
                          padding: '20px',
                          borderRadius: '10px',
                          marginTop: '20px',
                          border: '1px solid #ffd700'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <span style={{ fontSize: '2rem' }}>🔒</span>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '8px', color: '#856404' }}>
                                Your Payment is Protected
                              </div>
                              <div style={{ fontSize: '0.85rem', color: '#856404', lineHeight: '1.6' }}>
                                We hold your payment in escrow until you confirm you've received your item. The traveler only gets paid after you're satisfied. 100% safe and secure.
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => setCheckoutStep(2)}
                            style={{
                              flex: 1,
                              padding: '14px',
                              background: 'white',
                              border: '2px solid #ddd',
                              borderRadius: '8px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              fontSize: '1rem'
                            }}
                          >
                            ← Back
                          </button>
                        </div>
                    </div>
                )}

                {error && (
                    <div style={{ marginTop: '20px', padding: '15px', background: '#ffebee', border: '1px solid #ef5350', borderRadius: '8px', color: '#c62828' }}>
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* Order Summary / Fee Breakdown */}
                <div style={{ marginTop: '20px', padding: 'clamp(15px, 4vw, 25px)', background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
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

                                {/* Service Fee */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
                                    <span style={{ color: '#666' }}>Service Fee (10%)</span>
                                    <span style={{ fontWeight: '500' }}>₱{serviceFee.toLocaleString()}</span>
                                </div>

                                {/* Total Savings */}
                                {totalSavings > 0 && (
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                    background: '#e8f5e9',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    margin: '5px 0'
                                  }}>
                                      <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>💰 Total Savings</span>
                                      <span style={{ fontWeight: 'bold', color: '#2e7d32' }}>-₱{totalSavings.toLocaleString()}</span>
                                  </div>
                                )}
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
                            fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                            padding: 'clamp(14px, 3vw, 16px) clamp(20px, 5vw, 24px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            fontWeight: 'bold'
                        }}
                    >
                        {isProcessing ? (
                          '⏳ Processing...'
                        ) : checkoutStep === 3 ? (
                          <>
                            <span style={{ fontSize: '1.3rem' }}>🔒</span>
                            Secure Checkout • ₱{total.toLocaleString()}
                          </>
                        ) : (
                          isSellerMode ? 'Confirm Fulfillment' : (checkoutStep === 1 ? 'Continue' : 'Continue to Payment')
                        )}
                    </button>

                    {checkoutStep === 3 && (
                      <div style={{
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        color: '#888',
                        marginTop: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                        <span>🔒</span>
                        SSL Encrypted • 100% Secure Payment via Pasa.ph Escrow
                      </div>
                    )}
                </div>
            </div>
        )}
      </div>
      <Footer />
    </>
  );
}
