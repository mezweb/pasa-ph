'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Modal from '../../components/Modal'; // Reuse your existing Modal

export default function BuyerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tracking State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      const q = query(
        collection(db, "requests"), 
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribeOrders = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyOrders(items);
        setLoading(false);
      });

      return () => unsubscribeOrders();
    });

    return () => unsubscribeAuth();
  }, [router]);

  const openTracking = (order) => {
    setSelectedOrder(order);
    setIsTrackingOpen(true);
  };

  // Helper to generate mock timeline events based on order date
  const getTimelineEvents = (order) => {
    const date = order.createdAt ? new Date(order.createdAt.seconds * 1000) : new Date();
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    
    // Simulate a timeline
    return [
      { status: 'Order Placed', date: date.toLocaleString('en-US', options), active: true },
      { status: 'Seller has confirmed request', date: new Date(date.getTime() + 3600000).toLocaleString('en-US', options), active: true },
      { status: 'Parcel picked up by logistics', date: new Date(date.getTime() + 86400000).toLocaleString('en-US', options), active: true },
      { status: 'Arrived at Sorting Facility SOC 6', date: new Date(date.getTime() + 172800000).toLocaleString('en-US', options), active: true },
      { status: 'Departed to Delivery Hub', date: 'Estimated', active: false },
      { status: 'Out for Delivery', date: 'Estimated', active: false },
    ];
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <>
      <Navbar />
      <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
        <div className="container" style={{ padding: '40px 20px' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', margin: '0 0 10px' }}>Buyer Dashboard</h1>
                <p style={{ color: '#666' }}>Welcome back, {user?.displayName || 'Shopper'}! Track your pasabuys here.</p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0070f3', marginBottom: '5px' }}>{myOrders.length}</div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Orders</div>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#2e7d32', marginBottom: '5px' }}>0</div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>To Receive</div>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f97316', marginBottom: '5px' }}>₱{myOrders.reduce((acc, item) => acc + (item.price || 0), 0).toLocaleString()}</div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Value (Est.)</div>
                </div>
            </div>

            {/* Orders List */}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>My Orders & Requests</h2>
            
            {myOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
                    <p style={{ color: '#666', marginBottom: '20px' }}>You haven't made any requests yet.</p>
                    <Link href="/shop" className="btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {myOrders.map(order => (
                        <div key={order.id} style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: '250px' }}>
                                <div style={{ width: '80px', height: '80px', background: '#f9f9f9', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee' }}>
                                    <img src={order.image || 'https://placehold.co/100?text=Item'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 5px', fontSize: '1.1rem' }}>{order.title}</h3>
                                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                        From: <strong>{order.from}</strong> &bull; To: <strong>{order.to}</strong>
                                    </p>
                                    <p style={{ margin: '5px 0 0', color: '#0070f3', fontWeight: 'bold' }}>₱{order.price?.toLocaleString()}</p>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                <div style={{ 
                                    padding: '6px 12px', 
                                    borderRadius: '20px', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 'bold',
                                    background: '#fff3e0',
                                    color: '#f57c00',
                                    border: '1px solid #ffe0b2'
                                }}>
                                    {order.status || 'Processing'}
                                </div>
                                
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => openTracking(order)}
                                        style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
                                    >
                                        Track Package
                                    </button>
                                    <Link href={`/requests/${order.id}`} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #0070f3', background: 'white', color: '#0070f3', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                                        View Details
                                    </Link>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
      <Footer />

      {/* TRACKING MODAL */}
      <Modal isOpen={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} title="Shipment Status">
        {selectedOrder && (
            <div style={{ padding: '0 10px' }}>
                
                {/* Guaranteed Delivery Banner */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', gap: '10px', alignItems: 'start' }}>
                    <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#15803d', fontSize: '0.9rem' }}>Guaranteed On-Time Delivery</div>
                        <div style={{ fontSize: '0.8rem', color: '#166534' }}>Get a ₱50 voucher if no delivery was attempted by tomorrow.</div>
                    </div>
                </div>

                {/* Order Info Header */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                    <img src={selectedOrder.image || 'https://placehold.co/100'} style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div>
                        <h4 style={{ margin: '0 0 5px' }}>{selectedOrder.title}</h4>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>ID: {selectedOrder.id.slice(0, 12).toUpperCase()}</div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>Logistics: <strong>SPX Express</strong></div>
                    </div>
                </div>

                {/* Timeline */}
                <div style={{ paddingLeft: '10px', borderLeft: '2px solid #eee', marginLeft: '10px' }}>
                    {getTimelineEvents(selectedOrder).map((event, index) => (
                        <div key={index} style={{ position: 'relative', paddingLeft: '25px', paddingBottom: '30px' }}>
                            {/* Dot */}
                            <div style={{ 
                                position: 'absolute', 
                                left: '-7px', 
                                top: '0', 
                                width: '12px', 
                                height: '12px', 
                                borderRadius: '50%', 
                                background: event.active ? '#2e7d32' : '#ddd',
                                border: '2px solid white',
                                boxShadow: '0 0 0 2px ' + (event.active ? '#2e7d32' : '#eee')
                            }}></div>
                            
                            <div style={{ color: event.active ? '#2e7d32' : '#999', fontWeight: event.active ? 'bold' : 'normal', fontSize: '0.95rem' }}>
                                {event.status}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '4px' }}>
                                {event.date}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        )}
      </Modal>
    </>
  );
}