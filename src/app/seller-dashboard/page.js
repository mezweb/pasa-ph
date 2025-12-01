'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userTier, setUserTier] = useState('Standard');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false); // Mock verification status
  const [vacationMode, setVacationMode] = useState(false);
  const [showLuggageCalc, setShowLuggageCalc] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [luggageWeight, setLuggageWeight] = useState(20);
  const [luggageValue, setLuggageValue] = useState(5000);

  // Mock data
  const profileStrength = 65; // Out of 100
  const weeklyEarnings = [1200, 2500, 1800, 3200, 2800, 4100, 3500]; // Last 7 days
  const totalBalance = 15800; // Available for payout

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
    });

    // Fetch ALL pending requests
    const q = query(collection(db, "requests"));
    const unsubscribeRequests = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(items);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubscribeRequests();
    };
  }, [router]);

  const highValueRequests = requests.filter(req => req.price >= 2000);
  const standardRequests = requests.filter(req => req.price < 2000);
  const totalPotentialEarnings = requests.reduce((sum, req) => sum + (req.price || 0), 0);

  // To-do list items
  const todoItems = [
    { text: 'Confirm 2 pending orders', count: 2, urgent: true },
    { text: 'Update your travel schedule', count: 1, urgent: false },
    { text: 'Respond to 3 messages', count: 3, urgent: true },
    { text: 'Complete identity verification', count: 1, urgent: !isVerified }
  ];

  // Notifications
  const notifications = [
    { id: 1, text: 'New order request for iPhone 15', time: '5 min ago', type: 'order' },
    { id: 2, text: 'Payment received for Order #1234', time: '2 hours ago', type: 'payment' },
    { id: 3, text: 'Message from buyer about delivery', time: '4 hours ago', type: 'message' }
  ];

  // Most requested items (mock)
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
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request.");
    }
  };

  const calculateLuggageCapacity = () => {
    const maxWeight = 23; // kg
    const remainingWeight = maxWeight - luggageWeight;
    const maxValue = luggageValue;
    return { remainingWeight, maxValue };
  };

  const maxWeeklyEarning = Math.max(...weeklyEarnings);

  return (
    <>
      <Navbar />
      <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
        <div className="container" style={{ padding: '40px 20px' }}>

          {/* 1. GIANT POST A TRIP BUTTON + Header */}
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
            <Link href="/start-selling">
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
                ✈️ Post a Trip
              </button>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '30px' }}>

            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

              {/* 2. PROFILE STRENGTH */}
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>📊 Profile Strength</h3>
                  <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: profileStrength >= 80 ? '#2e7d32' : '#f97316' }}>
                    {profileStrength}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '12px', background: '#f0f0f0', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${profileStrength}%`,
                    height: '100%',
                    background: profileStrength >= 80 ? 'linear-gradient(90deg, #2e7d32, #4caf50)' : 'linear-gradient(90deg, #f97316, #fb923c)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                <div style={{ marginTop: '15px', fontSize: '0.85rem', color: '#666' }}>
                  <div>✅ ID Verified</div>
                  <div>✅ Email Confirmed</div>
                  <div>⏳ Add payment method (+15%)</div>
                  <div>⏳ Complete 5 orders (+20%)</div>
                </div>
              </div>

              {/* 3. TOTAL POTENTIAL EARNINGS */}
              <div style={{ background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', padding: '25px', borderRadius: '12px', color: 'white' }}>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  💰 Total Potential Earnings
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '5px' }}>
                  ₱{totalPotentialEarnings.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9' }}>
                  From {requests.length} open requests available
                </div>
              </div>

              {/* 4. TO-DO LIST WIDGET */}
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                <h3 style={{ margin: '0 0 15px', fontSize: '1.1rem' }}>📋 To-Do List</h3>
                {todoItems.map((item, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    background: item.urgent ? '#fff3e0' : '#f9f9f9',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      {item.urgent && <span style={{ color: '#f97316', marginRight: '6px' }}>⚠️</span>}
                      <span style={{ fontSize: '0.9rem' }}>{item.text}</span>
                    </div>
                    {item.count > 0 && (
                      <span style={{
                        background: item.urgent ? '#f97316' : '#0070f3',
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontWeight: 'bold'
                      }}>
                        {item.count}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* 5. VERIFY IDENTITY CTA */}
              {!isVerified && (
                <div style={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                  padding: '25px',
                  borderRadius: '12px',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔐</div>
                  <h3 style={{ margin: '0 0 10px' }}>Verify Your Identity</h3>
                  <p style={{ fontSize: '0.9rem', opacity: 0.95, marginBottom: '15px' }}>
                    Increase trust and unlock premium features
                  </p>
                  <button
                    onClick={() => setIsVerified(true)}
                    style={{
                      background: 'white',
                      color: '#ee5a6f',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}
                  >
                    Start Verification
                  </button>
                </div>
              )}

            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

              {/* 6. WEEKLY EARNINGS GRAPH */}
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

              {/* 7. NOTIFICATIONS LIST */}
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                <h3 style={{ margin: '0 0 15px', fontSize: '1.1rem' }}>🔔 Recent Notifications</h3>
                {notifications.map(notif => (
                  <div key={notif.id} style={{
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
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#999' }}>{notif.time}</div>
                  </div>
                ))}
              </div>

              {/* 8. QUICK REPLY TEMPLATES */}
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

          {/* 13. LEVEL/TIER PROGRESS */}
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea', marginBottom: '25px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem' }}>🏆 Seller Tier Progress</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <div style={{
                padding: '8px 16px',
                background: userTier === 'Standard' ? '#666' : '#e0e0e0',
                color: userTier === 'Standard' ? 'white' : '#999',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                ⭐ Standard
              </div>
              <span style={{ color: '#999' }}>→</span>
              <div style={{
                padding: '8px 16px',
                background: userTier === 'Gold' ? '#d4af37' : '#e0e0e0',
                color: userTier === 'Gold' ? 'white' : '#999',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                💎 Gold
              </div>
              <span style={{ color: '#999' }}>→</span>
              <div style={{
                padding: '8px 16px',
                background: userTier === 'Platinum' ? '#b9f2ff' : '#e0e0e0',
                color: userTier === 'Platinum' ? '#0077b6' : '#999',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                💠 Platinum
              </div>
            </div>
            <div style={{ background: '#f0f0f0', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{
                width: userTier === 'Standard' ? '30%' : userTier === 'Gold' ? '70%' : '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #0070f3, #00b4d8)',
                transition: 'width 0.5s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>
              Complete <strong>7 more orders</strong> to reach Gold tier and unlock exclusive high-value requests!
            </div>
          </div>

          {/* Bottom Row - 3 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>

            {/* 9. LUGGAGE CALCULATOR */}
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

            {/* 10. MOST REQUESTED ITEMS */}
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

            {/* 11. SHARE MY SHOP */}
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
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <a href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shopLink)}`} target="_blank" rel="noopener noreferrer">
                  <button style={{ padding: '8px 12px', background: '#1877f2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    📘 Facebook
                  </button>
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shopLink)}`} target="_blank" rel="noopener noreferrer">
                  <button style={{ padding: '8px 12px', background: '#1da1f2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    🐦 Twitter
                  </button>
                </a>
              </div>
            </div>
          </div>

          {/* 12. VACATION MODE + 14. PAYOUT BUTTON + 15. TRAVELER GUIDELINES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginBottom: '30px' }}>

            {/* VACATION MODE */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
              <h3 style={{ margin: '0 0 15px', fontSize: '1.1rem' }}>🏖️ Vacation Mode</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
                Temporarily hide your profile from new requests
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setVacationMode(!vacationMode)}
                  style={{
                    padding: '12px 24px',
                    background: vacationMode ? '#ff4d4f' : '#2e7d32',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    flex: 1
                  }}
                >
                  {vacationMode ? 'Turn Off' : 'Turn On'}
                </button>
                {vacationMode && (
                  <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '0.9rem' }}>🔴 Active</span>
                )}
              </div>
            </div>

            {/* 14. PAYOUT BUTTON */}
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
                  fontSize: '1rem'
                }}
              >
                Withdraw to GCash / Bank
              </button>
            </div>

            {/* 15. TRAVELER GUIDELINES */}
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

          {/* REQUESTS SECTIONS */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>💎 Gold/Diamond Exclusive Requests</h2>
              <span style={{ background: '#d4af37', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>HIGH VALUE</span>
            </div>

            {userTier === 'Standard' ? (
              <div style={{
                background: 'linear-gradient(135deg, #fff9e6 0%, #fff 100%)',
                border: '1px solid #d4af37',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                color: '#856404'
              }}>
                <h3 style={{ marginBottom: '10px' }}>🔒 Locked Access</h3>
                <p style={{ marginBottom: '20px' }}>
                  There are <strong>{highValueRequests.length} high-value requests</strong> waiting.
                  <br/>Only Gold and Diamond members can accept these orders.
                </p>
                <button
                  onClick={() => setUserTier('Gold')}
                  className="btn-primary"
                  style={{ background: '#d4af37', border: 'none' }}
                >
                  Upgrade Membership
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {highValueRequests.map(req => (
                  <div key={req.id} style={{
                    background: 'white',
                    border: req.status === 'Accepted' ? '2px solid #2e7d32' : '1px solid #eaeaea',
                    borderRadius: '12px',
                    padding: '20px',
                    position: 'relative',
                    boxShadow: req.status === 'Accepted' ? '0 0 10px rgba(46, 125, 50, 0.5)' : '0 4px 12px rgba(212, 175, 55, 0.1)'
                  }}>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#d4af37', color: 'white', fontSize: '0.6rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>EXCLUSIVE</div>
                    <h4 style={{ margin: '0 0 5px' }}>{req.title}</h4>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 15px' }}>{req.from} &rarr; {req.to}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#d4af37' }}>₱{req.price}</span>
                      <button
                        onClick={() => handleAcceptRequest(req.id, req.title)}
                        disabled={req.status === 'Accepted'}
                        style={{
                          background: req.status === 'Accepted' ? '#2e7d32' : '#d4af37',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        {req.status === 'Accepted' ? 'Accepted' : 'Accept'}
                      </button>
                    </div>
                  </div>
                ))}
                {highValueRequests.length === 0 && <p style={{ color: '#999' }}>No exclusive requests available right now.</p>}
              </div>
            )}
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Standard Requests</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {standardRequests.map(req => (
                <div key={req.id} style={{
                  background: 'white',
                  border: req.status === 'Accepted' ? '2px solid #2e7d32' : '1px solid #eaeaea',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: req.status === 'Accepted' ? '0 0 10px rgba(46, 125, 50, 0.5)' : '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <h4 style={{ margin: '0 0 5px' }}>{req.title}</h4>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 15px' }}>{req.from} &rarr; {req.to}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>₱{req.price}</span>
                    <button
                      onClick={() => handleAcceptRequest(req.id, req.title)}
                      disabled={req.status === 'Accepted'}
                      style={{
                        background: req.status === 'Accepted' ? '#2e7d32' : 'white',
                        border: req.status === 'Accepted' ? 'none' : '1px solid #0070f3',
                        color: req.status === 'Accepted' ? 'white' : '#0070f3',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      {req.status === 'Accepted' ? 'Accepted' : 'Accept'}
                    </button>
                  </div>
                </div>
              ))}
              {standardRequests.length === 0 && <p style={{ color: '#999' }}>No standard requests available.</p>}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
