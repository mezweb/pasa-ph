'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!params.id || !user) return;

      try {
        const orderDoc = await getDoc(doc(db, 'orders', params.id));
        if (orderDoc.exists()) {
          const orderData = { id: orderDoc.id, ...orderDoc.data() };

          // Check if user owns this order
          if (orderData.userId !== user.uid) {
            alert('You do not have permission to view this order');
            router.push('/buyer-dashboard');
            return;
          }

          setOrder(orderData);
        } else {
          alert('Order not found');
          router.push('/buyer-dashboard');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        alert('Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, user, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <p>Loading order details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <p>Order not found</p>
        </div>
        <Footer />
      </>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#2e7d32';
      case 'pending_payment': return '#ed6c02';
      case 'processing': return '#0288d1';
      case 'shipped': return '#7b1fa2';
      case 'delivered': return '#2e7d32';
      case 'cancelled': return '#d32f2f';
      default: return '#666';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid': return 'Payment Confirmed';
      case 'pending_payment': return 'Pending Payment (COD)';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '60px 20px', maxWidth: '900px' }}>
        <Link href="/buyer-dashboard" style={{ color: '#0070f3', marginBottom: '20px', display: 'inline-block' }}>
          ← Back to Orders
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Order #{order.id.substring(0, 8).toUpperCase()}</h1>
          <div style={{
            background: getStatusColor(order.status),
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            {getStatusLabel(order.status)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>Order Information</h3>
            <div style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.8' }}>
              <div><strong>Order Date:</strong> {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</div>
              <div><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase() || 'N/A'}</div>
              <div><strong>Total Amount:</strong> ₱{order.totalAmount}</div>
            </div>
          </div>

          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>Customer Information</h3>
            <div style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.8' }}>
              <div><strong>Name:</strong> {order.userName || 'N/A'}</div>
              <div><strong>Email:</strong> {order.userEmail || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ marginBottom: '20px' }}>Order Items</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {order.items?.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '60px', height: '60px', background: '#f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
                    {item.images?.[0] && <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>From: {item.from}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Qty: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold' }}>₱{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0070f3' }}>₱{order.totalAmount}</div>
          </div>
        </div>

        {order.paymentMethod === 'cod' && order.status === 'pending_payment' && (
          <div style={{ marginTop: '20px', background: '#fff3cd', border: '1px solid #ffc107', padding: '15px', borderRadius: '8px', color: '#856404' }}>
            ⚠️ This is a Cash on Delivery order. Payment will be collected upon delivery.
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
