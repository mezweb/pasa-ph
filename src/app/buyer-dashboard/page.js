'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Modal from '../../components/Modal';

export default function BuyerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [myCheckoutOrders, setMyCheckoutOrders] = useState([]);
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

      // Query for old requests
      const requestsQuery = query(
        collection(db, "requests"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, type: 'request', ...doc.data() }));
        setMyOrders(items);
        setLoading(false);
      });

      // Query for new checkout orders
      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribeCheckoutOrders = onSnapshot(ordersQuery, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, type: 'order', ...doc.data() }));
        setMyCheckoutOrders(items);
      });

      return () => {
        unsubscribeRequests();
        unsubscribeCheckoutOrders();
      };
    });

    return () => unsubscribeAuth();
  }, [router]);

  // Combine both types of orders
  const allOrders = [...myOrders, ...myCheckoutOrders].sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0;
    const bTime = b.createdAt?.seconds || 0;
    return bTime - aTime;
  });

  const openTracking = (order) => {
    setSelectedOrder(order);
    setIsTrackingOpen(true);
  };

  // --- CONFIRM RECEIPT LOGIC ---
  const handleConfirmReceipt = async (orderId) => {
    if(!confirm("Are you sure you have received this item? This will release payment to the seller.")) return;

    try {
        await updateDoc(doc(db, "requests", orderId), {
            status: 'Received', // Changed to 'Received' to match new flow
            receivedAt: serverTimestamp()
        });
        alert("Item received! Seller has been notified.");
        setIsTrackingOpen(false);
    } catch (error) {
        console.error("Error confirming receipt:", error);
        alert("Failed to update status.");
    }
  };

  // SIMPLIFIED TIMELINE
  const getTimelineEvents = (order) => {
    const date = order.createdAt ? new Date(order.createdAt.seconds * 1000) : new Date();
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    
    // Check status progression
    const isConfirmed = ['Confirmed', 'Shipped', 'Received', 'Completed'].includes(order.status);
    const isShipped = ['Shipped', 'Received', 'Completed'].includes(order.status);
    const isReceived = ['Received', 'Completed'].includes(order.status);

    return [
      { 
        status: 'Order Placed', 
        date: date.toLocaleString('en-US', options), 
        active: true, 
        icon: '📝' 
      },
      { 
        status: 'Seller Confirmed Request', 
        date: isConfirmed ? 'Confirmed' : 'Pending...', 
        active: isConfirmed, 
        icon: '✅' 
      },
      { 
        status: 'Seller has Shipped Item', 
        date: isShipped ? 'Shipped' : 'Pending...', 
        active: isShipped, 
        icon: '🚚',
        // Show Tracking Number if Shipped
        details: isShipped ? (
             <div style={{ marginTop: '5px', padding: '10px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px', display: 'inline-block' }}>
                <span style={{ fontSize: '0.8rem', color: '#0070f3', marginRight: '5px', fontWeight: 'bold' }}>TRACKING #:</span>
                <strong style={{ fontSize: '0.9rem', color: '#333', fontFamily: 'monospace' }}>TRK-{order.id.slice(0, 8).toUpperCase()}</strong>
            </div>
        ) : null
      },
      { 
        status: 'Item Received', 
        date: isReceived ? 'Completed' : 'Pending Confirmation', 
        active: isReceived, 
        icon: '🏠',
        // Only show button if Shipped but NOT yet Received
        isAction: !isReceived && isShipped 
      } 
    ];
  };

  const getStatusColor = (status) => {
    if (status === 'Received' || status === 'Completed') return '#2e7d32'; 
    if (status === 'Shipped') return '#0070f3'; 
    if (status === 'Confirmed') return '#f09433';
    return '#666'; 
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
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0070f3', marginBottom: '5px' }}>{allOrders.length}</div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Orders</div>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#2e7d32', marginBottom: '5px' }}>
                        {allOrders.filter(o => o.status === 'Received' || o.status === 'Completed' || o.status === 'delivered').length}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Completed Deliveries</div>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f97316', marginBottom: '5px' }}>
                        ₱{allOrders.reduce((acc, item) => acc + (item.type === 'order' ? item.totalAmount || 0 : item.price || 0), 0).toLocaleString()}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Value (Est.)</div>
                </div>
            </div>

            {/* Orders List */}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>My Orders & Requests</h2>

            {allOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
                    <p style={{ color: '#666', marginBottom: '20px' }}>You haven't made any requests yet.</p>
                    <Link href="/shop" className="btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {allOrders.map(order => (
                        <div key={order.id} style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: '250px' }}>
                                <div style={{ width: '80px', height: '80px', background: '#f9f9f9', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee' }}>
                                    {(order.type === 'order' ? order.items?.[0]?.images?.[0] : order.image) ? (
                                        <img src={order.type === 'order' ? order.items?.[0]?.images?.[0] : order.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '2rem' }}>📦</span>
                                    )}
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 5px', fontSize: '1.1rem' }}>
                                        {order.type === 'order'
                                            ? `Order #${order.id.substring(0, 8).toUpperCase()}`
                                            : order.title}
                                    </h3>
                                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                        {order.type === 'order'
                                            ? `${order.items?.length || 0} item(s) • ${order.paymentMethod?.toUpperCase()}`
                                            : `From: ${order.from} • To: ${order.to}`}
                                    </p>
                                    <p style={{ margin: '5px 0 0', color: '#0070f3', fontWeight: 'bold' }}>
                                        ₱{order.type === 'order' ? order.totalAmount?.toLocaleString() : order.price?.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                <div style={{ 
                                    padding: '6px 12px', 
                                    borderRadius: '20px', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 'bold',
                                    background: getStatusColor(order.status || 'Pending') + '20', 
                                    color: getStatusColor(order.status || 'Pending'),
                                    border: `1px solid ${getStatusColor(order.status || 'Pending')}40`
                                }}>
                                    {order.status || 'Awaiting Seller'}
                                </div>
                                
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {order.type === 'order' ? (
                                        <Link href={`/orders/${order.id}`}>
                                            <button
                                                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #0070f3', background: '#0070f3', color: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
                                            >
                                                View Order
                                            </button>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => openTracking(order)}
                                            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
                                        >
                                            Track Package
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
      <Footer />

      {/* SIMPLIFIED TRACKING MODAL */}
      <Modal isOpen={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} title="Order Status">
        {selectedOrder && (
            <div style={{ padding: '0 10px' }}>
                
                {/* Guaranteed Delivery Banner */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', gap: '10px', alignItems: 'start' }}>
                    <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#15803d', fontSize: '0.9rem' }}>Payment Protection Active</div>
                        <div style={{ fontSize: '0.8rem', color: '#166534' }}>Your payment is held in escrow until you confirm receipt.</div>
                    </div>
                </div>

                {/* Order Info Header */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', border: '1px solid #eee' }}>
                        {selectedOrder.image ? (
                            <img src={selectedOrder.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '1.5rem' }}>📦</span>
                        )}
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 5px' }}>{selectedOrder.title}</h4>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>ID: {selectedOrder.id.slice(0, 12).toUpperCase()}</div>
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
                            {event.details}
                            
                            {/* Confirm Receipt Button inside timeline */}
                            {event.isAction && (
                                <div style={{ marginTop: '15px' }}>
                                    <button 
                                        onClick={() => handleConfirmReceipt(selectedOrder.id)}
                                        className="btn-primary"
                                        style={{ fontSize: '0.85rem', padding: '10px 20px', width: '100%' }}
                                    >
                                        Confirm Item Received
                                    </button>
                                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '8px', textAlign:'center' }}>
                                        Only click this if you have physically received the item.
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        )}
      </Modal>
    </>
  );
}