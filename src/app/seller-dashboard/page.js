'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp, addDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RequestCard from '../../components/RequestCard';
import MarketplaceControls from '../../components/MarketplaceControls';
import ExchangeRateTicker from '../../components/ExchangeRateTicker';
import MotivationalGoal from '../../components/MotivationalGoal';
import Modal from '../../components/Modal';
import Link from 'next/link';

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [luggageWeight, setLuggageWeight] = useState(20);
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('PHP');
  const [copiedShopLink, setCopiedShopLink] = useState(false);
  const [editingTemplates, setEditingTemplates] = useState(false);

  // Registered trip state
  const [registeredTrip, setRegisteredTrip] = useState(null);

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

  // Register Trip modal state
  const [isRegisterTripOpen, setIsRegisterTripOpen] = useState(false);
  const [isSubmittingTrip, setIsSubmittingTrip] = useState(false);
  const [isEditingTrip, setIsEditingTrip] = useState(false);
  const [editingTripId, setEditingTripId] = useState(null);
  const [tripForm, setTripForm] = useState({
    destination: 'Japan',
    departureDate: '',
    returnDate: '',
    maxWeight: '23',
    notes: '',
    cities: '',
    flightTicket: null,
    frequentTraveler: false
  });
  const [showTripSuccess, setShowTripSuccess] = useState(false);
  const [tripSuccessType, setTripSuccessType] = useState('register'); // 'register' or 'update'
  const [dateError, setDateError] = useState('');

  // Quick reply templates (now editable)
  const [quickReplies, setQuickReplies] = useState([
    "I'll be arriving on [date]. I can deliver to your location.",
    "Item purchased! I'll send you a photo of the receipt shortly.",
    "Your item has been shipped and will arrive on [date].",
    "I'm currently in [country]. Let me know if you need anything!"
  ]);

  // Mock data
  const weeklyEarnings = [1200, 2500, 1800, 3200, 2800, 4100, 3500];
  const totalBalance = 15800;

  // New orders count for badge
  const newOrdersCount = 3;

  // Exchange rates
  const exchangeRates = {
    'Japan': { currency: 'JPY', rate: 0.37 },
    'USA': { currency: 'USD', rate: 56.5 },
    'South Korea': { currency: 'KRW', rate: 0.043 },
    'Singapore': { currency: 'SGD', rate: 41.2 },
    'Hong Kong': { currency: 'HKD', rate: 7.2 },
    'Vietnam': { currency: 'VND', rate: 0.0023 }
  };

  // Recent activity (Feature 14)
  const recentActivity = [
    { user: 'Maria L.', item: 'iPhone 15 Pro', location: 'Tokyo', time: '2 min ago' },
    { user: 'John D.', item: 'Melano CC Serum', location: 'Tokyo', time: '5 min ago' },
    { user: 'Sarah K.', item: 'Tokyo Banana', location: 'Tokyo', time: '8 min ago' }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Fetch user data for profile completion
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }

      // Fetch registered trips
      const tripsQuery = query(collection(db, 'trips'));
      const unsubscribeTrips = onSnapshot(tripsQuery, (snapshot) => {
        const userTrips = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(trip => trip.userId === currentUser.uid && trip.status === 'active')
          .sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));

        if (userTrips.length > 0) {
          setRegisteredTrip(userTrips[0]);
          // Feature 15: Smart filtering - default to trip destination
          if (regionFilter === 'all') {
            setRegionFilter(userTrips[0].destination);
          }
        }
      });
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

  // Calculate profile completion (Feature 12)
  const calculateProfileCompletion = () => {
    if (!userData) return 0;
    const fields = ['displayName', 'email', 'photoURL', 'bio', 'city', 'deliveryAddress'];
    const completedFields = fields.filter(field => userData[field] && userData[field].length > 0);
    return Math.round((completedFields.length / fields.length) * 100);
  };

  // Calculate trip countdown (Feature 9)
  const getTripCountdown = () => {
    if (!registeredTrip || !registeredTrip.departureDate) return null;
    const today = new Date();
    const departure = new Date(registeredTrip.departureDate);
    const diffTime = departure - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Trip in progress';
    if (diffDays === 0) return 'Departing today!';
    if (diffDays === 1) return 'Departing tomorrow!';
    return `Trip starts in ${diffDays} days`;
  };

  // Calculate Traveler Level (Feature 17)
  const calculateTravelerLevel = () => {
    const totalEarnings = weeklyEarnings.reduce((a, b) => a + b, 0);
    if (totalEarnings >= 20000) return { level: 'Diamond', color: '#00c3ff' };
    if (totalEarnings >= 10000) return { level: 'Gold', color: '#d4af37' };
    return { level: 'Standard', color: '#666' };
  };

  const travelerLevel = calculateTravelerLevel();

  // Get today's date in YYYY-MM-DD format for date picker min
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Validate trip dates
  const validateTripDates = (departure, returnDate) => {
    if (!departure || !returnDate) return true;
    const depDate = new Date(departure);
    const retDate = new Date(returnDate);
    if (retDate < depDate) {
      setDateError('Return date cannot be before departure date');
      return false;
    }
    setDateError('');
    return true;
  };

  // Convert price based on currency
  const convertCurrency = (phpPrice) => {
    if (currency === 'PHP') return `₱${phpPrice.toLocaleString()}`;

    if (registeredTrip && exchangeRates[registeredTrip.destination]) {
      const rate = exchangeRates[registeredTrip.destination].rate;
      const currencyCode = exchangeRates[registeredTrip.destination].currency;
      const converted = Math.round(phpPrice * rate);
      return `${currencyCode} ${converted.toLocaleString()}`;
    }
    return `₱${phpPrice.toLocaleString()}`;
  };

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
        // Match by destination country
        filtered = filtered.filter(req => req.from === regionFilter);
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

  const projectedProfit = requests.reduce((sum, req) => sum + ((req.estimatedProfit || 0)), 0);

  const notifications = [
    {
      id: 1,
      text: 'New order request for iPhone 15',
      time: '5 min ago',
      type: 'order',
      link: '#available-requests'
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

  const mostRequestedItems = [
    { item: 'iPhone 15', count: 45, avgPrice: 55000 },
    { item: 'Melano CC Serum', count: 38, avgPrice: 450 },
    { item: 'Tokyo Banana', count: 32, avgPrice: 800 },
    { item: 'Airpods Pro', count: 28, avgPrice: 12000 }
  ];

  const shopLink = `https://pasa.ph/seller/${user?.uid || 'demo123'}`;

  const handleCopyShopLink = () => {
    navigator.clipboard.writeText(shopLink);
    setCopiedShopLink(true);
    setTimeout(() => setCopiedShopLink(false), 2000);
  };

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

  // Feature 18: Select All
  const handleSelectAll = () => {
    if (selectedRequests.length === filteredAndSortedRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredAndSortedRequests.map(req => req.id));
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

  // Handle editing existing trip
  const handleEditTrip = () => {
    if (!registeredTrip) return;

    setIsEditingTrip(true);
    setEditingTripId(registeredTrip.id);
    setTripForm({
      destination: registeredTrip.destination || 'Japan',
      departureDate: registeredTrip.departureDate || '',
      returnDate: registeredTrip.returnDate || '',
      maxWeight: String(registeredTrip.maxWeight || '23'),
      notes: registeredTrip.notes || '',
      cities: registeredTrip.cities || '',
      flightTicket: null, // Can't pre-populate file input
      frequentTraveler: registeredTrip.frequentTraveler || false
    });
    setIsRegisterTripOpen(true);
  };

  const handleRegisterTrip = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to register a trip');
      return;
    }

    // Validate dates
    if (!validateTripDates(tripForm.departureDate, tripForm.returnDate)) {
      return;
    }

    setIsSubmittingTrip(true);
    try {
      const tripData = {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userEmail: user.email,
        destination: tripForm.destination,
        departureDate: tripForm.departureDate,
        returnDate: tripForm.returnDate,
        maxWeight: Number(tripForm.maxWeight),
        notes: tripForm.notes,
        cities: tripForm.cities,
        frequentTraveler: tripForm.frequentTraveler,
        hasFlightTicket: tripForm.flightTicket !== null,
        verified: tripForm.flightTicket !== null, // Verified if flight ticket uploaded
        status: 'active'
      };

      if (isEditingTrip && editingTripId) {
        // Update existing trip
        const tripRef = doc(db, 'trips', editingTripId);
        await updateDoc(tripRef, {
          ...tripData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new trip
        await addDoc(collection(db, 'trips'), {
          ...tripData,
          createdAt: serverTimestamp()
        });
      }

      // Show success animation
      setTripSuccessType(isEditingTrip ? 'update' : 'register');
      setShowTripSuccess(true);
      setTimeout(() => {
        setShowTripSuccess(false);
        setIsRegisterTripOpen(false);
        setIsEditingTrip(false);
        setEditingTripId(null);
        setTripForm({
          destination: 'Japan',
          departureDate: '',
          returnDate: '',
          maxWeight: '23',
          notes: '',
          cities: '',
          flightTicket: null,
          frequentTraveler: false
        });
        setDateError('');
      }, 3000);
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip. Please try again.');
    } finally {
      setIsSubmittingTrip(false);
    }
  };

  const maxWeeklyEarning = Math.max(...weeklyEarnings);
  const profileCompletion = calculateProfileCompletion();
  const tripCountdown = getTripCountdown();

  // Check if trip form has unsaved changes
  const hasUnsavedTripChanges = useMemo(() => {
    return tripForm.departureDate !== '' ||
           tripForm.returnDate !== '' ||
           tripForm.cities !== '' ||
           tripForm.notes !== '' ||
           tripForm.flightTicket !== null ||
           tripForm.frequentTraveler !== false ||
           tripForm.maxWeight !== '23' ||
           tripForm.destination !== 'Japan';
  }, [tripForm]);

  const bgColor = darkMode ? '#1a1a1a' : '#f8f9fa';
  const cardBg = darkMode ? '#2d2d2d' : 'white';
  const textColor = darkMode ? '#e0e0e0' : '#333';
  const borderColor = darkMode ? '#444' : '#eaeaea';

  return (
    <>
      <Navbar />
      <div style={{ background: bgColor, minHeight: '100vh', paddingBottom: '60px' }}>
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>

          {/* Header with CTAs and Dark Mode Toggle */}
          <div style={{
            background: darkMode ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' : 'linear-gradient(135deg, #0070f3 0%, #0051cc 100%)',
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
              {/* Feature 17: Traveler Level */}
              <div style={{ marginTop: '8px', display: 'inline-block', padding: '4px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '0.85rem' }}>
                ⭐ {travelerLevel.level} Traveler
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Feature 20: Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              {/* Feature 1: Help Link */}
              <Link href="/support">
                <button style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  ❓ Help
                </button>
              </Link>

              <button
                onClick={() => setIsRegisterTripOpen(true)}
                style={{
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

              {/* Feature 8: Notification Badge */}
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
                  transition: 'transform 0.2s',
                  position: 'relative'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  📋 View Orders
                  {newOrdersCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#ff4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {newOrdersCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>

          {/* Feature 9: Trip Countdown */}
          {tripCountdown && (
            <div style={{
              background: darkMode ? '#2d2d2d' : '#fff3cd',
              padding: '15px 25px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: `1px solid ${darkMode ? '#444' : '#ffc107'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: darkMode ? textColor : '#856404'
            }}>
              <span style={{ fontSize: '1.5rem' }}>⏰</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{tripCountdown}</span>
            </div>
          )}

          {/* Feature 10: Exchange Rate with Timestamp & Feature 4: Currency Toggle */}
          <div style={{ marginBottom: '20px' }}>
            <ExchangeRateTicker />
            {registeredTrip && (
              <div style={{
                background: cardBg,
                padding: '15px 25px',
                borderRadius: '12px',
                marginTop: '10px',
                border: `1px solid ${borderColor}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: textColor
              }}>
                <span style={{ fontSize: '0.9rem' }}>
                  Display prices in:
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setCurrency('PHP')}
                    style={{
                      padding: '8px 16px',
                      background: currency === 'PHP' ? '#0070f3' : '#e0e0e0',
                      color: currency === 'PHP' ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    PHP
                  </button>
                  <button
                    onClick={() => setCurrency('DEST')}
                    style={{
                      padding: '8px 16px',
                      background: currency === 'DEST' ? '#0070f3' : '#e0e0e0',
                      color: currency === 'DEST' ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {registeredTrip && exchangeRates[registeredTrip.destination]?.currency || 'USD'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Feature 12: Profile Completion Progress */}
          <div style={{
            background: cardBg,
            padding: '20px 25px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: `1px solid ${borderColor}`,
            color: textColor
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: '600' }}>Profile Completion</span>
              <span style={{ fontWeight: 'bold', color: '#0070f3' }}>{profileCompletion}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              background: darkMode ? '#444' : '#e0e0e0',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${profileCompletion}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0070f3, #00a8ff)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            {profileCompletion < 100 && (
              <Link href="/profile">
                <button style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  background: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  Complete Profile
                </button>
              </Link>
            )}
          </div>

          {/* Feature 14: Recent Activity Ticker */}
          <div style={{
            background: darkMode ? '#2d2d2d' : '#e3f2fd',
            padding: '15px 25px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: `1px solid ${darkMode ? '#444' : '#90caf9'}`,
            color: darkMode ? textColor : '#1565c0',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', animation: 'scroll 20s linear infinite' }}>
              <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>🔥 Live Activity:</span>
              {recentActivity.map((activity, idx) => (
                <span key={idx} style={{ whiteSpace: 'nowrap' }}>
                  {activity.user} just requested <strong>{activity.item}</strong> from {activity.location} • {activity.time}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '30px' }}>

            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

              {/* Projected Profit */}
              <div style={{ background: darkMode ? 'linear-gradient(135deg, #1e5631 0%, #16491f 100%)' : 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', padding: '25px', borderRadius: '12px', color: 'white' }}>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  💰 Projected Profit
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '5px' }}>
                  {convertCurrency(projectedProfit)}
                </div>
                <div style={{ fontSize: '0.85rem', opacity: '0.9' }}>
                  From {requests.length} open requests available
                </div>
              </div>

              {/* Feature 16: Fixed Motivational Goal Color */}
              <MotivationalGoal
                currentEarnings={weeklyEarnings.reduce((a, b) => a + b, 0)}
                flightCost={20000}
                goalName="Pay off your next flight!"
                darkMode={darkMode}
              />

            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

              {/* Feature 3: Trip Details Card (replaces Weather) */}
              {registeredTrip ? (
                <div style={{ background: cardBg, padding: '25px', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor }}>
                  <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem' }}>✈️ Registered Trip</h3>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0070f3', marginBottom: '10px' }}>
                      {registeredTrip.destination}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
                      <div>
                        <div style={{ color: darkMode ? '#999' : '#666', fontSize: '0.8rem' }}>Departure</div>
                        <div style={{ fontWeight: '600' }}>{new Date(registeredTrip.departureDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div style={{ color: darkMode ? '#999' : '#666', fontSize: '0.8rem' }}>Return</div>
                        <div style={{ fontWeight: '600' }}>{new Date(registeredTrip.returnDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '12px', background: darkMode ? '#1a1a1a' : '#f0f9ff', borderRadius: '8px', marginBottom: '15px' }}>
                    <div style={{ fontSize: '0.85rem', color: darkMode ? '#999' : '#666', marginBottom: '5px' }}>Max Luggage</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2e7d32' }}>
                      {registeredTrip.maxWeight} kg
                    </div>
                  </div>
                  <button
                    onClick={handleEditTrip}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: darkMode ? '#444' : '#f0f0f0',
                      color: textColor,
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = darkMode ? '#555' : '#e0e0e0';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = darkMode ? '#444' : '#f0f0f0';
                    }}
                  >
                    ✏️ Edit Trip Details
                  </button>
                </div>
              ) : (
                <div style={{ background: cardBg, padding: '25px', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor, textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 15px', fontSize: '1.1rem' }}>✈️ No Trip Registered</h3>
                  <p style={{ color: darkMode ? '#999' : '#666', marginBottom: '15px' }}>
                    Register your next trip to see relevant requests
                  </p>
                  <button
                    onClick={() => setIsRegisterTripOpen(true)}
                    style={{
                      padding: '12px 24px',
                      background: '#0070f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Register Trip
                  </button>
                </div>
              )}

              {/* Weekly Earnings Graph */}
              <div style={{ background: cardBg, padding: '25px', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor }}>
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
                        <div style={{ position: 'absolute', top: '-20px', fontSize: '0.7rem', fontWeight: 'bold', width: '100%', textAlign: 'center' }}>
                          ₱{(earning / 1000).toFixed(1)}k
                        </div>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: darkMode ? '#999' : '#999' }}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                  Total this week: <strong style={{ color: '#0070f3' }}>{convertCurrency(weeklyEarnings.reduce((a, b) => a + b, 0))}</strong>
                </div>
              </div>

              {/* Notifications with Select All */}
              <div style={{ background: cardBg, padding: '25px', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>🔔 Recent Notifications</h3>
                  {/* Feature 18: Select All would go here for notifications bulk actions */}
                </div>
                {notifications.map(notif => (
                  <Link key={notif.id} href={notif.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                      padding: '12px',
                      borderBottom: `1px solid ${darkMode ? '#444' : '#f0f0f0'}`,
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = darkMode ? '#3d3d3d' : '#f9f9f9'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
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
                      <div style={{ fontSize: '0.75rem', color: darkMode ? '#999' : '#999' }}>{notif.time}</div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Feature 6: Editable Quick Reply Templates */}
              <div style={{ background: cardBg, padding: '25px', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>💬 Quick Reply Templates</h3>
                  <button
                    onClick={() => setEditingTemplates(!editingTemplates)}
                    style={{
                      padding: '6px 12px',
                      background: darkMode ? '#444' : '#f0f0f0',
                      color: textColor,
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    {editingTemplates ? 'Done' : 'Edit'}
                  </button>
                </div>
                {quickReplies.map((reply, idx) => (
                  editingTemplates ? (
                    <input
                      key={idx}
                      value={reply}
                      onChange={(e) => {
                        const updated = [...quickReplies];
                        updated[idx] = e.target.value;
                        setQuickReplies(updated);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '8px',
                        background: darkMode ? '#1a1a1a' : '#fff',
                        color: textColor,
                        border: `1px solid ${borderColor}`,
                        borderRadius: '8px',
                        fontSize: '0.85rem'
                      }}
                    />
                  ) : (
                    <button
                      key={idx}
                      onClick={() => {
                        navigator.clipboard.writeText(reply);
                        alert('Template copied!');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '8px',
                        background: darkMode ? '#3d3d3d' : '#f9f9f9',
                        color: textColor,
                        border: `1px solid ${borderColor}`,
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
                        e.currentTarget.style.background = darkMode ? '#3d3d3d' : '#f9f9f9';
                        e.currentTarget.style.color = textColor;
                      }}
                    >
                      {reply}
                    </button>
                  )
                ))}
                {!editingTemplates && (
                  <div style={{ fontSize: '0.75rem', color: darkMode ? '#999' : '#999', marginTop: '10px' }}>
                    Click any template to copy to clipboard
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Bottom Row - Utilities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>

            {/* Feature 5: Luggage Calculator with Progress Bar */}
            <div style={{ background: cardBg, padding: '25px', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor }}>
              <h3 style={{ margin: '0 0 15px', fontSize: '1.1rem' }}>🧳 Luggage Calculator</h3>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.85rem', color: darkMode ? '#999' : '#666', display: 'block', marginBottom: '5px' }}>
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
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0070f3', marginBottom: '10px' }}>{luggageWeight} kg</div>

                {/* Visual Capacity Bar */}
                <div style={{
                  width: '100%',
                  height: '20px',
                  background: darkMode ? '#444' : '#e0e0e0',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    width: `${(luggageWeight / 23) * 100}%`,
                    height: '100%',
                    background: luggageWeight > 20 ? 'linear-gradient(90deg, #ff4444, #ff6666)' : 'linear-gradient(90deg, #2e7d32, #4caf50)',
                    transition: 'width 0.3s ease, background 0.3s ease'
                  }} />
                </div>
              </div>
              <div style={{ padding: '15px', background: darkMode ? '#1a1a1a' : '#f0f9ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: darkMode ? '#999' : '#666', marginBottom: '5px' }}>Remaining Capacity:</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
                  {23 - luggageWeight} kg
                </div>
                <div style={{ fontSize: '0.75rem', color: darkMode ? '#999' : '#666', marginTop: '8px' }}>
                  ≈ {Math.floor((23 - luggageWeight) * 0.8)} items (avg 1.25kg each)
                </div>
              </div>
            </div>

            {/* Most Requested Items */}
            <div style={{ background: cardBg, padding: '25px', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor }}>
              <h3 style={{ margin: '0 0 15px', fontSize: '1.1rem' }}>🔥 Most Requested Items</h3>
              {mostRequestedItems.slice(0, 4).map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px',
                  borderBottom: idx < 3 ? `1px solid ${darkMode ? '#444' : '#f0f0f0'}` : 'none'
                }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item.item}</div>
                    <div style={{ fontSize: '0.75rem', color: darkMode ? '#999' : '#999' }}>{item.count} requests</div>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2e7d32' }}>
                    {convertCurrency(item.avgPrice)}
                  </div>
                </div>
              ))}
            </div>

            {/* Feature 7: Share My Shop with Green "Copied!" */}
            <div style={{ background: cardBg, padding: '25px', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor }}>
              <h3 style={{ margin: '0 0 15px', fontSize: '1.1rem' }}>🔗 Share My Shop</h3>
              <p style={{ fontSize: '0.85rem', color: darkMode ? '#999' : '#666', marginBottom: '15px' }}>
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
                    border: `1px solid ${borderColor}`,
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    background: darkMode ? '#1a1a1a' : '#f9f9f9',
                    color: textColor
                  }}
                />
                <button
                  onClick={handleCopyShopLink}
                  style={{
                    padding: '10px 20px',
                    background: copiedShopLink ? '#2e7d32' : '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s'
                  }}
                >
                  {copiedShopLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Feature 11: Withdraw Button (grayed out if balance is 0) & Feature 13: Tooltip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginBottom: '40px' }}>

            <div style={{ background: darkMode ? 'linear-gradient(135deg, #047857 0%, #065f46 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '25px', borderRadius: '12px', color: 'white' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem' }}>💳 Available Balance</h3>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '15px' }}>
                {convertCurrency(totalBalance)}
              </div>
              <button
                onClick={() => router.push('/payout')}
                disabled={totalBalance === 0}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: totalBalance === 0 ? '#999' : 'white',
                  color: totalBalance === 0 ? '#666' : '#10b981',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: totalBalance === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  opacity: totalBalance === 0 ? 0.5 : 1
                }}
                onMouseOver={(e) => {
                  if (totalBalance > 0) e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>💸</span>
                <span>{totalBalance === 0 ? 'No Balance' : 'Withdraw Funds'}</span>
              </button>
            </div>

            <div style={{ background: cardBg, padding: '25px', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>📖 Traveler Guidelines</h3>
                {/* Feature 13: Tooltip */}
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#0070f3',
                    color: 'white',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    cursor: 'help'
                  }}
                  title="Service fees help cover platform costs including payment processing, customer support, and trust & safety measures."
                  >
                    ?
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: darkMode ? '#999' : '#666', marginBottom: '15px' }}>
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

          {/* MARKETPLACE SECTION */}
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
            onSelectAll={handleSelectAll}
            totalCount={filteredAndSortedRequests.length}
            darkMode={darkMode}
          />

          {/* Available Requests */}
          <div id="available-requests">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: textColor }}>📋 Available Requests</h2>
            {loading ? (
              <p style={{ textAlign: 'center', padding: '40px', color: darkMode ? '#999' : '#999' }}>Loading requests...</p>
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
                    darkMode={darkMode}
                    convertCurrency={convertCurrency}
                  />
                ))}
                {/* Feature 2: Empty State CTA */}
                {filteredAndSortedRequests.length === 0 && (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '60px 40px',
                    background: cardBg,
                    borderRadius: '12px',
                    border: `1px solid ${borderColor}`,
                    color: textColor
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📦</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
                      {requests.length > 0
                        ? "No requests match your filters"
                        : "No requests available"}
                    </h3>
                    <p style={{ color: darkMode ? '#999' : '#666', marginBottom: '20px' }}>
                      {requests.length > 0
                        ? "Try adjusting your search or filters to see more requests."
                        : "Check back soon for new opportunities!"}
                    </p>
                    <Link href="/products">
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
                        Browse Marketplace for Requests
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Register Trip Modal */}
      <Modal
        isOpen={isRegisterTripOpen}
        onClose={() => {
          setIsRegisterTripOpen(false);
          setIsEditingTrip(false);
          setEditingTripId(null);
        }}
        title={isEditingTrip ? "✏️ Edit Trip Details" : "✈️ Register a New Trip"}
        hasUnsavedChanges={hasUnsavedTripChanges}
      >
        <form onSubmit={handleRegisterTrip} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Destination with flag icons */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>Destination Country *</label>
            <select
              required
              value={tripForm.destination}
              onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
            >
              <option value="Japan">🇯🇵 Japan</option>
              <option value="USA">🇺🇸 USA</option>
              <option value="South Korea">🇰🇷 South Korea</option>
              <option value="Singapore">🇸🇬 Singapore</option>
              <option value="Hong Kong">🇭🇰 Hong Kong</option>
              <option value="Vietnam">🇻🇳 Vietnam</option>
            </select>
          </div>

          {/* Cities visiting field */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>Cities Visiting (Optional)</label>
            <input
              type="text"
              value={tripForm.cities}
              onChange={(e) => setTripForm({ ...tripForm, cities: e.target.value })}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
              placeholder="e.g. Tokyo, Osaka, Kyoto"
            />
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px', marginBottom: '0' }}>
              List the specific cities you'll be visiting
            </p>
          </div>

          {/* Date inputs with validation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>Departure Date *</label>
              <input
                type="date"
                required
                min={getTodayDate()}
                value={tripForm.departureDate}
                onChange={(e) => {
                  setTripForm({ ...tripForm, departureDate: e.target.value });
                  validateTripDates(e.target.value, tripForm.returnDate);
                }}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>Return Date *</label>
              <input
                type="date"
                required
                min={tripForm.departureDate || getTodayDate()}
                value={tripForm.returnDate}
                onChange={(e) => {
                  setTripForm({ ...tripForm, returnDate: e.target.value });
                  validateTripDates(tripForm.departureDate, e.target.value);
                }}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
              />
            </div>
          </div>

          {/* Date error message */}
          {dateError && (
            <div style={{
              padding: '10px',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '6px',
              color: '#c00',
              fontSize: '0.9rem'
            }}>
              {dateError}
            </div>
          )}

          {/* Luggage weight with helper text */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>Max Luggage Weight (kg) *</label>
            <input
              type="number"
              required
              min="1"
              max="50"
              value={tripForm.maxWeight}
              onChange={(e) => setTripForm({ ...tripForm, maxWeight: e.target.value })}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
              placeholder="e.g. 23"
            />
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px', marginBottom: '0' }}>
              💡 Standard check-in bag is 23kg
            </p>
          </div>

          {/* Flight ticket upload for verified badge */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>
              Proof of Travel (Optional)
              {tripForm.flightTicket && <span style={{ color: '#2e7d32', marginLeft: '8px' }}>✓ Verified</span>}
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setTripForm({ ...tripForm, flightTicket: e.target.files[0] })}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem' }}
            />
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px', marginBottom: '0' }}>
              🎫 Upload your flight ticket to get a "Verified" badge and increase buyer trust
            </p>
          </div>

          {/* Recurring trips checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
            <input
              type="checkbox"
              id="frequentTraveler"
              checked={tripForm.frequentTraveler}
              onChange={(e) => setTripForm({ ...tripForm, frequentTraveler: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="frequentTraveler" style={{ fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer', margin: 0 }}>
              ✈️ I travel to this destination frequently
            </label>
          </div>

          {/* Additional notes */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>Additional Notes (Optional)</label>
            <textarea
              value={tripForm.notes}
              onChange={(e) => setTripForm({ ...tripForm, notes: e.target.value })}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Any special information about your trip..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmittingTrip || !!dateError}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '14px',
              fontSize: '1.05rem',
              fontWeight: '700',
              opacity: (isSubmittingTrip || !!dateError) ? 0.6 : 1,
              cursor: (isSubmittingTrip || !!dateError) ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmittingTrip ? (isEditingTrip ? 'Updating...' : 'Registering...') : (isEditingTrip ? 'Update Trip' : 'Register Trip')}
          </button>
        </form>
      </Modal>

      {/* Success Animation Overlay */}
      {showTripSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '400px',
            position: 'relative',
            animation: 'scaleIn 0.5s ease'
          }}>
            {/* Confetti particles */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', borderRadius: '20px', pointerEvents: 'none' }}>
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `confetti 2s ease-out ${i * 0.05}s`,
                    fontSize: '1.5rem',
                    opacity: 0
                  }}
                >
                  {['🎉', '🎊', '✨', '⭐', '🌟', '🎈', '💫'][Math.floor(Math.random() * 7)]}
                </div>
              ))}
            </div>

            {/* Success content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'bounce 0.6s ease' }}>
                ✈️
              </div>
              <h2 style={{ fontSize: '2rem', color: '#2e7d32', marginBottom: '15px', fontWeight: 'bold' }}>
                {tripSuccessType === 'update' ? 'Trip Updated!' : 'Trip Registered!'}
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '20px' }}>
                {tripSuccessType === 'update'
                  ? 'Your trip details have been successfully updated!'
                  : 'Your trip has been successfully registered. Start browsing marketplace requests!'}
              </p>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                🎯 Ready to earn on your trip!
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(200px) rotate(360deg);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .container > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
