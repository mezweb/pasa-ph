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
  const [showMapView, setShowMapView] = useState(false);

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

  const handlePrintShoppingList = () => {
    const toBuyItems = acceptedRequests.filter(item => item.status === 'to-buy');

    if (toBuyItems.length === 0) {
      alert('No items to buy yet!');
      return;
    }

    const printWindow = window.open('', '', 'width=800,height=600');
    let content = `
      <html>
        <head>
          <title>PASA.PH Shopping List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2e7d32; }
            .buyer-section { margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .item { margin: 15px 0; padding: 10px; background: #f9f9f9; }
            .checkbox { margin-right: 10px; }
          </style>
        </head>
        <body>
          <h1>🛒 PASA.PH Shopping List</h1>
          <p>Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          <p>Traveler: ${user?.displayName || 'N/A'}</p>
          <hr/>
    `;

    const grouped = {};
    toBuyItems.forEach(item => {
      const buyer = item.buyerName || 'Unknown';
      if (!grouped[buyer]) grouped[buyer] = [];
      grouped[buyer].push(item);
    });

    Object.entries(grouped).forEach(([buyer, items]) => {
      content += `<div class="buyer-section">`;
      content += `<h2>👤 ${buyer}</h2>`;
      items.forEach(item => {
        content += `<div class="item">`;
        content += `<input type="checkbox" class="checkbox"/> <strong>${item.title}</strong><br/>`;
        if (item.color) content += `&nbsp;&nbsp;&nbsp;Color: ${item.color}<br/>`;
        if (item.capacity) content += `&nbsp;&nbsp;&nbsp;Capacity: ${item.capacity}<br/>`;
        if (item.quantity > 1) content += `&nbsp;&nbsp;&nbsp;Quantity: ${item.quantity}<br/>`;
        content += `&nbsp;&nbsp;&nbsp;Max Price: ₱${(item.targetPrice || item.price || 0).toLocaleString()}<br/>`;
        content += `&nbsp;&nbsp;&nbsp;Delivery: ${item.deliveryMethod === 'shipping' ? '📦 Shipping' : '🤝 Meetup'} - ${item.deliveryLocation}<br/>`;
        content += `</div>`;
      });
      content += `</div>`;
    });

    content += `<hr/><p><strong>TOTAL ITEMS: ${toBuyItems.length}</strong></p>`;
    content += `<p><strong>ESTIMATED PAYOUT: ₱${totals.totalPayout.toLocaleString()}</strong></p>`;
    content += `</body></html>`;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportToNotes = (format) => {
    const toBuyItems = acceptedRequests.filter(item => item.status === 'to-buy');

    if (toBuyItems.length === 0) {
      alert('No items to buy yet!');
      return;
    }

    let content = `PASA.PH SHOPPING LIST\n`;
    content += `${new Date().toLocaleDateString()}\n\n`;

    const grouped = {};
    toBuyItems.forEach(item => {
      const buyer = item.buyerName || 'Unknown';
      if (!grouped[buyer]) grouped[buyer] = [];
      grouped[buyer].push(item);
    });

    Object.entries(grouped).forEach(([buyer, items]) => {
      content += `👤 ${buyer}\n`;
      items.forEach((item, idx) => {
        content += `☐ ${item.title}\n`;
        if (item.color) content += `   Color: ${item.color}\n`;
        if (item.capacity) content += `   Capacity: ${item.capacity}\n`;
        content += `   ₱${(item.targetPrice || item.price || 0).toLocaleString()}\n`;
      });
      content += `\n`;
    });

    content += `Total Items: ${toBuyItems.length}\n`;
    content += `Total Payout: ₱${totals.totalPayout.toLocaleString()}`;

    if (format === 'apple') {
      // Copy to clipboard for pasting into Notes
      navigator.clipboard.writeText(content).then(() => {
        alert('✅ Copied to clipboard! Paste into Apple Notes.');
      }).catch(() => {
        alert('Unable to copy. Please try the download option instead.');
      });
    } else if (format === 'google') {
      // For Google Keep, we'll create a shareable text
      const keepUrl = `https://keep.google.com/u/0/#create?text=${encodeURIComponent(content)}`;
      window.open(keepUrl, '_blank');
    }
  };

  const handleAcceptAllFromBuyer = async (buyerItems) => {
    const toBuyItems = buyerItems.filter(item => item.status === 'to-buy');

    if (toBuyItems.length === 0) {
      alert('All items from this buyer are already purchased or delivered!');
      return;
    }

    const confirmed = confirm(`Mark all ${toBuyItems.length} items from ${buyerItems[0].buyerName?.split(' ')[0] || 'this buyer'} as purchased?`);

    if (!confirmed) return;

    try {
      // Update all items to purchased status
      const updatePromises = toBuyItems.map(item =>
        updateDoc(doc(db, "requests", item.id), {
          itemStatus: 'purchased',
          isBought: true,
          boughtAt: new Date(),
          updatedAt: new Date()
        })
      );

      await Promise.all(updatePromises);
      alert(`✅ Marked ${toBuyItems.length} items as purchased!`);
    } catch (error) {
      console.error("Error updating items:", error);
      alert("Failed to update some items. Please try again.");
    }
  };

  const getFirstName = (fullName) => {
    if (!fullName) return 'Unknown';
    return fullName.split(' ')[0];
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                  📋 Fulfillment List
                </h1>
                <div style={{
                  background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)'
                }}>
                  <span>🔒</span>
                  <span>Protected by Escrow</span>
                </div>
              </div>
              <p style={{ margin: 0, color: '#666' }}>
                Manage your accepted requests and track deliveries
              </p>
            </div>

            {/* Export buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowMapView(true)}
                style={{
                  padding: '12px 20px',
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>🗺️</span>
                <span>Map View</span>
              </button>
              <button
                onClick={handlePrintShoppingList}
                style={{
                  padding: '12px 20px',
                  background: '#2e7d32',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>🖨️</span>
                <span>Print List</span>
              </button>
              <button
                onClick={() => handleExportToNotes('apple')}
                style={{
                  padding: '12px 20px',
                  background: '#000000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>🍎</span>
                <span>Apple Notes</span>
              </button>
              <button
                onClick={() => handleExportToNotes('google')}
                style={{
                  padding: '12px 20px',
                  background: '#fbbc04',
                  color: '#202124',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>📝</span>
                <span>Google Keep</span>
              </button>
            </div>
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
              color: 'white',
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)'
            }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '4px' }}>
                Subtotal
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '12px', opacity: 0.9 }}>
                ₱{acceptedRequests.reduce((sum, item) => sum + (item.targetPrice || item.price || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 'bold', opacity: 0.95, marginBottom: '6px', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '8px' }}>
                💰 TOTAL EARNINGS
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
                ₱{totals.totalPayout.toLocaleString()}
              </div>
            </div>
          </div>

          {/* De Minimis Tax Warning */}
          {totals.totalPayout > 10000 && (
            <div style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
              color: 'white',
              padding: '16px 20px',
              borderRadius: '12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'start',
              gap: '12px',
              boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
            }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '4px' }}>
                  De Minimis Tax Alert
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.95 }}>
                  Your total payout (₱{totals.totalPayout.toLocaleString()}) exceeds the ₱10,000 De Minimis threshold.
                  You may need to declare these items at customs and pay applicable duties/taxes.
                </div>
                <Link
                  href="/customs-info"
                  style={{
                    color: 'white',
                    textDecoration: 'underline',
                    fontSize: '0.85rem',
                    marginTop: '8px',
                    display: 'inline-block'
                  }}
                >
                  Learn more about customs regulations →
                </Link>
              </div>
            </div>
          )}

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
                          👤 {getFirstName(buyerName)}
                        </div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                          {items.length} {items.length === 1 ? 'item' : 'items'} •
                          {items.filter(i => i.status === 'to-buy').length > 0 &&
                            ` ${items.filter(i => i.status === 'to-buy').length} to buy`}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {items.filter(i => i.status === 'to-buy').length > 0 && (
                          <button
                            onClick={() => handleAcceptAllFromBuyer(items)}
                            style={{
                              padding: '8px 16px',
                              background: '#2e7d32',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <span>✓✓</span>
                            <span>Mark All Purchased</span>
                          </button>
                        )}
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
                          <span>Message {getFirstName(buyerName)}</span>
                        </button>
                      </div>
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

        {/* Map View Modal */}
        {showMapView && (
          <div
            onClick={() => setShowMapView(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>🗺️ Item Locations</h2>
                <button
                  onClick={() => setShowMapView(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Group items by location */}
              {(() => {
                const toBuyItems = acceptedRequests.filter(item => item.status === 'to-buy');
                const locationGroups = {};

                toBuyItems.forEach(item => {
                  const location = item.deliveryLocation || 'Unknown Location';
                  if (!locationGroups[location]) {
                    locationGroups[location] = [];
                  }
                  locationGroups[location].push(item);
                });

                // Create a Google Maps search query with all locations
                const locations = Object.keys(locationGroups).filter(loc => loc !== 'Unknown Location');
                const mapsQuery = locations.join(' OR ');
                const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(mapsQuery)}`;

                return (
                  <>
                    {locations.length > 0 && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          padding: '12px 20px',
                          background: '#1976d2',
                          color: 'white',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          marginBottom: '20px',
                          fontSize: '0.95rem'
                        }}
                      >
                        📍 Open in Google Maps
                      </a>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {Object.entries(locationGroups).map(([location, items]) => (
                        <div
                          key={location}
                          style={{
                            background: '#f8f9fa',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid #eaeaea'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                                📍 {location}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                {items.length} {items.length === 1 ? 'item' : 'items'}
                              </div>
                            </div>
                            {location !== 'Unknown Location' && (
                              <a
                                href={`https://www.google.com/maps/search/${encodeURIComponent(location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: '6px 12px',
                                  background: 'white',
                                  border: '1px solid #1976d2',
                                  color: '#1976d2',
                                  borderRadius: '6px',
                                  textDecoration: 'none',
                                  fontSize: '0.8rem',
                                  fontWeight: '600'
                                }}
                              >
                                Navigate
                              </a>
                            )}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {items.map(item => (
                              <div
                                key={item.id}
                                style={{
                                  background: 'white',
                                  padding: '10px',
                                  borderRadius: '8px',
                                  fontSize: '0.85rem',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                              >
                                <div>
                                  <div style={{ fontWeight: '600', marginBottom: '2px' }}>{item.title}</div>
                                  <div style={{ fontSize: '0.75rem', color: '#666' }}>
                                    for {item.buyerName?.split(' ')[0] || 'Unknown'}
                                  </div>
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2e7d32' }}>
                                  ₱{(item.targetPrice || item.price || 0).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {toBuyItems.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📦</div>
                        <p>No items to buy yet!</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
