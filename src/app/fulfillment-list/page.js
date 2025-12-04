'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FulfillmentItem from '../../components/FulfillmentItem';
import CustomsTracker from '../../components/CustomsTracker';
import Link from 'next/link';

export default function FulfillmentList() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupByBuyer, setGroupByBuyer] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    // Fetch accepted requests for this seller
    const q = query(
      collection(db, "requests"),
      where("sellerId", "==", user.uid),
      where("status", "==", "Accepted")
    );

    const unsubscribeRequests = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Mock enhanced fields if not present
          buyerId: data.buyerId || 'buyer123',
          buyerName: data.buyerName || 'John Doe',
          deliveryMethod: data.deliveryMethod || (Math.random() > 0.5 ? 'meetup' : 'shipping'),
          deliveryLocation: data.deliveryLocation || 'Makati',
          color: data.color || null,
          capacity: data.capacity || null,
          quantity: data.quantity || 1,
          weight: data.weight || (Math.random() * 2 + 0.5).toFixed(1),
          targetPrice: data.targetPrice || data.price,
          estimatedProfit: data.estimatedProfit || Math.floor((data.price || 0) * 0.1),
          neededBy: data.neededBy || null,
          status: data.itemStatus || 'to-buy', // Internal status: to-buy, purchased, delivered
          isBought: data.isBought || false
        };
      });
      setAcceptedRequests(items);
      setLoading(false);
    });

    return () => unsubscribeRequests();
  }, [user]);

  // Filter by status
  const filteredRequests = useMemo(() => {
    if (filterStatus === 'all') return acceptedRequests;
    return acceptedRequests.filter(item => item.status === filterStatus);
  }, [acceptedRequests, filterStatus]);

  // Group by buyer
  const groupedByBuyer = useMemo(() => {
    if (!groupByBuyer) return { 'All Items': filteredRequests };

    const groups = {};
    filteredRequests.forEach(item => {
      const buyerName = item.buyerName || 'Unknown Buyer';
      if (!groups[buyerName]) {
        groups[buyerName] = [];
      }
      groups[buyerName].push(item);
    });
    return groups;
  }, [filteredRequests, groupByBuyer]);

  // Calculate totals
  const totals = useMemo(() => {
    const toBuyCount = acceptedRequests.filter(i => i.status === 'to-buy').length;
    const purchasedCount = acceptedRequests.filter(i => i.status === 'purchased').length;
    const deliveredCount = acceptedRequests.filter(i => i.status === 'delivered').length;
    const totalPayout = acceptedRequests
      .filter(i => i.status !== 'delivered')
      .reduce((sum, item) => {
        const buyPrice = item.targetPrice || item.price || 0;
        const fee = item.estimatedProfit || Math.floor(buyPrice * 0.1);
        return sum + buyPrice + fee;
      }, 0);

    return { toBuyCount, purchasedCount, deliveredCount, totalPayout };
  }, [acceptedRequests]);

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await updateDoc(doc(db, "requests", itemId), {
        itemStatus: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleRemoveItem = async (itemId, reason) => {
    try {
      // In production, you might want to archive instead of delete
      await updateDoc(doc(db, "requests", itemId), {
        status: 'Cancelled',
        cancellationReason: reason,
        cancelledAt: new Date(),
        cancelledBy: 'seller'
      });
      alert('Item removed from your fulfillment list');
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    }
  };

  const handleMessageBuyer = (buyerId, buyerName) => {
    // Navigate to messages with buyer
    router.push(`/messages?userId=${buyerId}&name=${encodeURIComponent(buyerName)}`);
  };

  const handleToggleBought = async (itemId) => {
    const item = acceptedRequests.find(i => i.id === itemId);
    try {
      await updateDoc(doc(db, "requests", itemId), {
        isBought: !item.isBought,
        boughtAt: !item.isBought ? new Date() : null
      });
    } catch (error) {
      console.error("Error toggling bought status:", error);
    }
  };

  const handleExportShoppingList = () => {
    // Generate printable shopping list
    const toBuyItems = acceptedRequests.filter(item => item.status === 'to-buy');

    if (toBuyItems.length === 0) {
      alert('No items to buy yet!');
      return;
    }

    // Create text content
    let content = `PASA.PH SHOPPING LIST\n`;
    content += `Generated: ${new Date().toLocaleDateString()}\n`;
    content += `Traveler: ${user?.displayName || 'N/A'}\n`;
    content += `\n${'='.repeat(60)}\n\n`;

    // Group by buyer for the export
    const grouped = {};
    toBuyItems.forEach(item => {
      const buyer = item.buyerName || 'Unknown';
      if (!grouped[buyer]) grouped[buyer] = [];
      grouped[buyer].push(item);
    });

    Object.entries(grouped).forEach(([buyer, items]) => {
      content += `BUYER: ${buyer}\n`;
      content += `-`.repeat(60) + `\n`;

      items.forEach((item, idx) => {
        content += `\n${idx + 1}. ${item.title}\n`;
        if (item.color) content += `   Color: ${item.color}\n`;
        if (item.capacity) content += `   Capacity: ${item.capacity}\n`;
        if (item.quantity > 1) content += `   Quantity: ${item.quantity}\n`;
        content += `   Max Price: ₱${(item.targetPrice || item.price || 0).toLocaleString()}\n`;
        content += `   Delivery: ${item.deliveryMethod === 'shipping' ? '📦 Shipping' : '🤝 Meetup'} - ${item.deliveryLocation}\n`;
        if (item.neededBy) content += `   Needed by: ${new Date(item.neededBy).toLocaleDateString()}\n`;
        content += `   [ ] Bought\n`;
      });
      content += `\n`;
    });

    content += `\n${'='.repeat(60)}\n`;
    content += `TOTAL ITEMS TO BUY: ${toBuyItems.length}\n`;
    content += `ESTIMATED PAYOUT: ₱${totals.totalPayout.toLocaleString()}\n`;

    // Create downloadable file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pasa-shopping-list-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Shopping list downloaded! You can print it from your files.');
  };

  return (
    <>
      <Navbar />
      <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
        <div className="container" style={{ padding: '40px 20px' }}>

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <Link href="/seller-dashboard" style={{ textDecoration: 'none', color: '#0070f3', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>
                ← Back to Dashboard
              </Link>
              <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                📋 Fulfillment List
              </h1>
              <p style={{ margin: 0, color: '#666' }}>
                Manage your accepted requests and track deliveries
              </p>
            </div>

            {/* Export button */}
            <button
              onClick={handleExportShoppingList}
              style={{
                padding: '12px 24px',
                background: '#2e7d32',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span>📄</span>
              <span>Export Shopping List</span>
            </button>
          </div>

          {/* Summary cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #eaeaea'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '8px' }}>
                🛒 To Buy
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800' }}>
                {totals.toBuyCount}
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #eaeaea'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '8px' }}>
                ✅ Purchased
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2196f3' }}>
                {totals.purchasedCount}
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #eaeaea'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '8px' }}>
                🎉 Delivered
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50' }}>
                {totals.deliveredCount}
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
              padding: '20px',
              borderRadius: '12px',
              color: 'white'
            }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '8px' }}>
                💰 Pending Payout
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                ₱{totals.totalPayout.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Customs tracker */}
          <CustomsTracker items={acceptedRequests} />

          {/* Controls */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #eaeaea',
            marginBottom: '20px',
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Group by buyer toggle */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}>
              <input
                type="checkbox"
                checked={groupByBuyer}
                onChange={(e) => setGroupByBuyer(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  accentColor: '#0070f3'
                }}
              />
              <span>👥 Group by Buyer</span>
            </label>

            {/* Status filter */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>Filter:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Items ({acceptedRequests.length})</option>
                <option value="to-buy">🛒 To Buy ({totals.toBuyCount})</option>
                <option value="purchased">✅ Purchased ({totals.purchasedCount})</option>
                <option value="delivered">🎉 Delivered ({totals.deliveredCount})</option>
              </select>
            </div>
          </div>

          {/* Items list */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
              <p style={{ color: '#666' }}>Loading your fulfillment list...</p>
            </div>
          ) : acceptedRequests.length === 0 ? (
            <div style={{
              background: 'white',
              padding: '60px 20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📦</div>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.3rem' }}>
                No items yet
              </h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Visit the marketplace to accept buyer requests!
              </p>
              <Link href="/seller-dashboard">
                <button style={{
                  padding: '12px 24px',
                  background: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}>
                  Go to Marketplace
                </button>
              </Link>
            </div>
          ) : (
            <div>
              {Object.entries(groupedByBuyer).map(([buyerName, items]) => (
                <div key={buyerName} style={{ marginBottom: '30px' }}>
                  {/* Buyer header (only if grouped) */}
                  {groupByBuyer && (
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      marginBottom: '15px',
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px' }}>
                          👤 {buyerName}
                        </div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                          {items.length} {items.length === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const firstItem = items[0];
                          handleMessageBuyer(firstItem.buyerId, buyerName);
                        }}
                        style={{
                          padding: '8px 16px',
                          background: 'white',
                          color: '#667eea',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>💬</span>
                        <span>Message {buyerName.split(' ')[0]}</span>
                      </button>
                    </div>
                  )}

                  {/* Items */}
                  <div>
                    {items.map(item => (
                      <FulfillmentItem
                        key={item.id}
                        item={item}
                        onStatusChange={handleStatusChange}
                        onRemove={handleRemoveItem}
                        onMessageBuyer={handleMessageBuyer}
                        onToggleBought={handleToggleBought}
                        showBuyerName={!groupByBuyer}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}
