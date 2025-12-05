'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RequestCard from '../../components/RequestCard';
import MarketplaceControls from '../../components/MarketplaceControls';
import WeatherWidget from '../../components/WeatherWidget';
import ExchangeRateTicker from '../../components/ExchangeRateTicker';
import MotivationalGoal from '../../components/MotivationalGoal';
import Link from 'next/link';

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [luggageWeight, setLuggageWeight] = useState(20);

  // Dashboard preferences
  const [dismissedWidgets, setDismissedWidgets] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dismissedWidgets');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Marketplace controls state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [regionFilter, setRegionFilter] = useState('all');
  const [showBulkSelect, setShowBulkSelect] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState([]);

  // Mock data
  const weeklyEarnings = [1200, 2500, 1800, 3200, 2800, 4100, 3500];
  const totalBalance = 15800;
  const currentTripDestination = 'Tokyo'; // For weather widget

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
    });

    // Fetch ALL pending requests with enhanced data
    const q = query(collection(db, "requests"));
    const unsubscribeRequests = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();

        const getDeliveryLocation = (to) => {
          const locations = ['Makati', 'BGC', 'Quezon City', 'Manila', 'Pasig', 'Ortigas'];
          return locations[Math.floor(Math.random() * locations.length)];
        };

        return {
          id: doc.id,
          ...data,
          deliveryLocation: data.deliveryLocation || getDeliveryLocation(data.to),
          color: data.color || null,
          capacity: data.capacity || null,
          quantity: data.quantity || 1,
          weight: data.weight || (Math.random() * 2 + 0.5).toFixed(1),
          targetPrice: data.targetPrice || data.price,
          estimatedProfit: data.estimatedProfit || Math.floor((data.price || 0) * 0.1),
          neededBy: data.neededBy || null,
          image: data.image || '/product-placeholder.jpg',
          createdAt: data.createdAt || new Date()
        };
      });
      setRequests(items);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubscribeRequests();
    };
  }, [router]);

  // Filter and sort requests
  const filteredAndSortedRequests = useMemo(() => {
    let filtered = [...requests];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req =>
        req.title?.toLowerCase().includes(query) ||
        req.from?.toLowerCase().includes(query) ||
        req.to?.toLowerCase().includes(query) ||
        req.deliveryLocation?.toLowerCase().includes(query)
      );
    }

    if (regionFilter !== 'all') {
      if (regionFilter === 'metro-manila') {
        const metroManilaAreas = ['Makati', 'BGC', 'Taguig', 'Quezon City', 'Manila', 'Pasig', 'Ortigas', 'Mandaluyong'];
        filtered = filtered.filter(req =>
          metroManilaAreas.some(area => req.deliveryLocation?.includes(area))
        );
      } else if (regionFilter === 'provinces') {
        const metroManilaAreas = ['Makati', 'BGC', 'Taguig', 'Quezon City', 'Manila', 'Pasig', 'Ortigas', 'Mandaluyong'];
        filtered = filtered.filter(req =>
          !metroManilaAreas.some(area => req.deliveryLocation?.includes(area))
        );
      } else {
        filtered = filtered.filter(req =>
          req.deliveryLocation?.toLowerCase().includes(regionFilter.replace('-', ' '))
        );
      }
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'profit-high':
          return (b.estimatedProfit || 0) - (a.estimatedProfit || 0);
        case 'profit-low':
          return (a.estimatedProfit || 0) - (b.estimatedProfit || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'weight-low':
          return parseFloat(a.weight || 0) - parseFloat(b.weight || 0);
        case 'weight-high':
          return parseFloat(b.weight || 0) - parseFloat(a.weight || 0);
        case 'urgent':
          const getDays = (req) => {
            if (!req.neededBy) return 999;
            const diff = new Date(req.neededBy) - new Date();
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
          };
          return getDays(a) - getDays(b);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [requests, searchQuery, sortBy, regionFilter]);

  // Feature 3: Renamed from totalPotentialEarnings to projectedProfit
  const projectedProfit = requests.reduce((sum, req) => sum + ((req.estimatedProfit || 0)), 0);

  // Feature 4: Actionable notifications with specific links
  const notifications = [
    {
      id: 1,
      text: 'New order request for iPhone 15',
      time: '5 min ago',
      type: 'order',
      link: '#standard-requests' // Scroll to marketplace
    },
    {
      id: 2,
      text: 'Payment received for Order #1234',
      time: '2 hours ago',
      type: 'payment',
      link: '/fulfillment-list?orderId=1234'
    },
    {
      id: 3,
      text: 'Message from buyer about delivery',
      time: '4 hours ago',
      type: 'message',
      link: '/messages?userId=buyer123'
    }
  ];

  // Most requested items
  const mostRequestedItems = [
    { item: 'iPhone 15', count: 45, avgPrice: 55000 },
    { item: 'Melano CC Serum', count: 38, avgPrice: 450 },
    { item: 'Tokyo Banana', count: 32, avgPrice: 800 },
    { item: 'Airpods Pro', count: 28, avgPrice: 12000 }
  ];

  // Quick reply templates
  const quickReplies = [
    "I'll be arriving on [date]. I can deliver to your location.",
    "Item purchased! I'll send you a photo of the receipt shortly.",
    "Your item has been shipped and will arrive on [date].",
    "I'm currently in [country]. Let me know if you need anything!"
  ];

  // Share shop link
  const shopLink = `https://pasa.ph/seller/${user?.uid || 'demo123'}`;

  const handleAcceptRequest = async (id, title) => {
    if (!confirm(`Confirm acceptance of request: ${title}?`)) return;
    try {
      await updateDoc(doc(db, "requests", id), {
        status: 'Accepted',
        sellerId: user.uid,
        acceptedAt: serverTimestamp()
      });
      alert(`Request ${title} ACCEPTED!`);
      setSelectedRequests(prev => prev.filter(reqId => reqId !== id));
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request.");
    }
  };

  const handleBulkAccept = async () => {
    if (selectedRequests.length === 0) return;
    if (!confirm(`Accept ${selectedRequests.length} requests at once?`)) return;

    const promises = selectedRequests.map(id => {
      return updateDoc(doc(db, "requests", id), {
        status: 'Accepted',
        sellerId: user.uid,
        acceptedAt: serverTimestamp()
      });
    });

    try {
      await Promise.all(promises);
      alert(`Successfully accepted ${selectedRequests.length} requests!`);
      setSelectedRequests([]);
      setShowBulkSelect(false);
    } catch (error) {
      console.error("Error in bulk accept:", error);
      alert("Some requests failed to accept. Please try again.");
    }
  };

  const handleSelectRequest = (id) => {
    setSelectedRequests(prev => {
      if (prev.includes(id)) {
        return prev.filter(reqId => reqId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Feature 7: Dismiss widget functionality
  const handleDismissWidget = (widgetName) => {
    const updated = [...dismissedWidgets, widgetName];
    setDismissedWidgets(updated);
    localStorage.setItem('dismissedWidgets', JSON.stringify(updated));
  };

  const isWidgetDismissed = (widgetName) => {
    return dismissedWidgets.includes(widgetName);
  };

  const maxWeeklyEarning = Math.max(...weeklyEarnings);

  return (
    <>
      <Navbar />
      <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
        <div className="container" style={{ padding: '40px 20px' }}>

          {/* Header with TWO prominent CTAs */}
          <div style={{
            background: 'linear-gradient(135deg, #0070f3 0%, #0051cc 100%)',
            padding: '30px',
            borderRadius: '16px',
            marginBottom: '30px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                Seller Dashboard
              </h1>
              <p style={{ margin: 0, opacity: 0.95 }}>
                Welcome back, {user?.displayName || 'Traveler'}!
              </p>
            </div>

            {/* Feature 6: Register Trip button prominently placed */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/start-selling">
                <button style={{
                  background: '#ff9800',
                  color: 'white',
                  border: 'none',
                  padding: '18px 36px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span>✈️</span>
                  <span>Register Trip</span>
                </button>
              </Link>

              <Link href="/fulfillment-list">
                <button style={{
                  background: 'white',
                  color: '#0070f3',
                  border: 'none',
                  padding: '18px 36px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  📋 View Orders
                </button>
              </Link>
            </div>
          </div>

          {/* Feature 9: Exchange Rate Ticker */}
          <ExchangeRateTicker />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '30px' }}>

            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

              {/* Feature 3: Renamed to "Projected Profit" */}
              <div style={{ background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', padding: '25px', borderRadius: '12px', color: 'white' }}>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  💰 Projected Profit
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '5px' }}>
                  ₱{projectedProfit.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.85rem', opacity: '0.9' }}>
                  From {requests.length} open requests available
                </div>
              </div>

              {/* Feature 10: Motivational Goal */}
              <MotivationalGoal
                currentEarnings={weeklyEarnings.reduce((a, b) => a + b, 0)}
                flightCost={20000}
                goalName="Pay off your next flight!"
              />

            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

              {/* Feature 8: Weather Widget */}
              <WeatherWidget destination={currentTripDestination} />

              {/* Weekly Earnings Graph */}
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem' }}>📈 Weekly Earnings</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '150px' }}>
                  {weeklyEarnings.map((earning, idx) => (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '100%',
                        height: `${(earning / maxWeeklyEarning) * 100}%`,
                        background: 'linear-gradient(to top, #0070f3, #4d9fff)',
                        borderRadius: '4px 4px 0 0',
                        minHeight: '20px',
                        position: 'relative',
                        transition: 'height 0.3s ease'
                      }}>
                        <div style={{ position: 'absolute', top: '-20px', fontSize: '0.7rem', fontWeight: 'bold', width: '100%', textAlign: 'center', color: '#333' }}>
                          ₱{(earning / 1000).toFixed(1)}k
                        </div>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#999' }}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                  Total this week: <strong style={{ color: '#0070f3' }}>₱{weeklyEarnings.reduce((a, b) => a + b, 0).toLocaleString()}</strong>
                </div>
              </div>

              {/* Feature 4: Actionable Notifications */}
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                <h3 style={{ margin: '0 0 15px', fontSize: '1.1rem' }}>🔔 Recent Notifications</h3>
                {notifications.map(notif => (
                  <Link key={notif.id} href={notif.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                      padding: '12px',
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f9f9f9'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                          {notif.type === 'order' && '📦'}
                          {notif.type === 'payment' && '💵'}
                          {notif.type === 'message' && '💬'}
                          {' '}{notif.text}
                        </span>
                        <span style={{ color: '#0070f3', fontSize: '0.75rem' }}>→</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#999' }}>{notif.time}</div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Quick Reply Templates */}
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                <h3 style={{ margin: '0 0 15px', fontSize: '1.1rem' }}>💬 Quick Reply Templates</h3>
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigator.clipboard.writeText(reply)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '8px',
                      background: '#f9f9f9',
                      border: '1px solid #eaeaea',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#0070f3';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#f9f9f9';
                      e.currentTarget.style.color = 'inherit';
                    }}
                  >
                    {reply}
                  </button>
                ))}
                <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '10px' }}>
                  Click any template to copy to clipboard
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Row - Utilities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>

            {/* Luggage Calculator */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
              <h3 style={{ margin: '0 0 15px', fontSize: '1.1rem' }}>🧳 Luggage Calculator</h3>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '5px' }}>
                  Current Weight (kg):
                </label>
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={luggageWeight}
                  onChange={(e) => setLuggageWeight(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0070f3' }}>{luggageWeight} kg</div>
              </div>
              <div style={{ padding: '15px', background: '#f0f9ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Remaining Capacity:</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
                  {23 - luggageWeight} kg
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '8px' }}>
                  ≈ {Math.floor((23 - luggageWeight) * 0.8)} items (avg 1.25kg each)
                </div>
              </div>
            </div>

            {/* Most Requested Items */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
              <h3 style={{ margin: '0 0 15px', fontSize: '1.1rem' }}>🔥 Most Requested Items</h3>
              {mostRequestedItems.slice(0, 4).map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px',
                  borderBottom: idx < 3 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item.item}</div>
                    <div style={{ fontSize: '0.75rem', color: '#999' }}>{item.count} requests</div>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2e7d32' }}>
                    ₱{item.avgPrice.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Share My Shop */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
              <h3 style={{ margin: '0 0 15px', fontSize: '1.1rem' }}>🔗 Share My Shop</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
                Share your personalized shop link with buyers
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={shopLink}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #eaeaea',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    background: '#f9f9f9'
                  }}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shopLink);
                    alert('Link copied to clipboard!');
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Feature 5: Withdraw Button + Guidelines */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginBottom: '40px' }}>

            {/* Feature 5: Available Balance with Withdraw Button */}
            <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '25px', borderRadius: '12px', color: 'white' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem' }}>💳 Available Balance</h3>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '15px' }}>
                ₱{totalBalance.toLocaleString()}
              </div>
              <button
                onClick={() => router.push('/payout')}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'white',
                  color: '#10b981',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>💸</span>
                <span>Withdraw Funds</span>
              </button>
            </div>

            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
              <h3 style={{ margin: '0 0 15px', fontSize: '1.1rem' }}>📖 Traveler Guidelines</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
                Learn about prohibited items and travel regulations
              </p>
              <Link href="/trust-and-safety">
                <button style={{
                  width: '100%',
                  padding: '12px',
                  background: '#f97316',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  View Guidelines
                </button>
              </Link>
            </div>
          </div>

          {/* MARKETPLACE SECTION WITH ALL NEW FEATURES */}

          {/* Marketplace Controls (Search, Sort, Filter, Bulk Select) */}
          <MarketplaceControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            regionFilter={regionFilter}
            onRegionFilterChange={setRegionFilter}
            showBulkSelect={showBulkSelect}
            onToggleBulkSelect={() => {
              setShowBulkSelect(!showBulkSelect);
              if (showBulkSelect) setSelectedRequests([]);
            }}
            selectedCount={selectedRequests.length}
            onBulkAccept={handleBulkAccept}
          />

          {/* Available Requests */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>📋 Available Requests</h2>
            {loading ? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading requests...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {filteredAndSortedRequests.map(req => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    onAccept={handleAcceptRequest}
                    isSelected={selectedRequests.includes(req.id)}
                    onSelect={handleSelectRequest}
                    showBulkSelect={showBulkSelect}
                  />
                ))}
                {filteredAndSortedRequests.length === 0 && (
                  <p style={{ color: '#999', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                    {requests.length > 0
                      ? "No requests match your current filters. Try adjusting your search or filters."
                      : "No requests available at this time. Check back soon!"}
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
