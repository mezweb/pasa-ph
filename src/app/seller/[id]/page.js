'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { POPULAR_PRODUCTS } from '@/lib/products'; 

// --- MOCK DATA GENERATOR ---
const getSellerProfile = (id) => {
  const levels = [
    { lvl: 1, name: "Novice", color: "#888" },
    { lvl: 2, name: "Explorer", color: "#2e7d32" },
    { lvl: 3, name: "Pro", color: "#0070f3" },
    { lvl: 4, name: "Elite", color: "#d4af37" },
    { lvl: 5, name: "Legend", color: "#7b1fa2" }
  ];

  const sales = id.length * 12; 
  const trips = Math.floor(sales / 5);
  const rating = (4 + (id.length % 10) / 10).toFixed(1); 
  
  let levelObj = levels[0];
  if (sales > 100) levelObj = levels[4];
  else if (sales > 50) levelObj = levels[3];
  else if (sales > 25) levelObj = levels[2];
  else if (sales > 10) levelObj = levels[1];

  return {
    id,
    name: id,
    bio: `Hi! I'm ${id}. I travel frequently for business and leisure. I love finding unique items for my Pasa.ph customers!`,
    level: levelObj,
    stats: { sales, trips, rating },
    destinations: ['Japan', 'South Korea', 'Singapore', 'USA'].slice(0, (id.length % 4) + 1),
    joined: `202${id.length % 4}`,
    topItems: [
        { id: 's1', title: 'Tokyo Banana', price: 800, from: 'Japan', to: 'Manila', image: 'https://placehold.co/400x400/ffeeba/856404?text=Tokyo+Banana' },
        { id: 's2', title: 'Don Quijote Snacks', price: 500, from: 'Japan', to: 'Manila', image: 'https://placehold.co/400x400/ffeb3b/000000?text=Snacks' },
        { id: 's3', title: 'Rare KitKat', price: 300, from: 'Japan', to: 'Bulacan', image: 'https://placehold.co/400x400/d50000/ffffff?text=KitKat' }
    ]
  };
};

export default function SellerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const sellerName = decodeURIComponent(id);
  const seller = getSellerProfile(sellerName);

  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');

  // Check auth status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Load reviews
  useEffect(() => {
    loadReviews();
  }, [sellerName]);

  const loadReviews = async () => {
    try {
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('sellerId', '==', sellerName),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(reviewsQuery);
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to submit a review');
      router.push('/login');
      return;
    }

    if (newRating === 0) {
      alert('Please select a rating');
      return;
    }

    if (newReview.trim().length < 10) {
      alert('Please write a review of at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReviewData = {
        sellerId: sellerName,
        userId: user.uid,
        userName: user.displayName || user.email.split('@')[0],
        rating: newRating,
        comment: newReview.trim(),
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'reviews'), newReviewData);

      // Add review to state immediately with current timestamp
      const tempReview = {
        id: Date.now().toString(),
        ...newReviewData,
        createdAt: { toDate: () => new Date() }
      };
      setReviews(prev => [tempReview, ...prev]);

      // Reset form
      setNewRating(0);
      setNewReview('');

      // Show confirmation popup
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);

      // Reload reviews to get actual data from Firebase
      await loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and sort reviews
  const getFilteredAndSortedReviews = () => {
    let filtered = reviews;

    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating));
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt?.toDate() - a.createdAt?.toDate() || 0;
        case 'oldest':
          return a.createdAt?.toDate() - b.createdAt?.toDate() || 0;
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return sorted;
  };

  const getProductLink = (title) => {
    const found = POPULAR_PRODUCTS.find(p => p.title === title);
    return found ? `/product/${found.id}` : '#';
  };

  // Calculate average rating from actual reviews
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();
  const reviewCount = reviews.length;

  return (
    <>
      <Navbar />
      
      {/* PROFILE HEADER */}
      <div style={{ background: 'white', borderBottom: '1px solid #eaeaea' }}>
        <div className="container" style={{ padding: '40px 20px', maxWidth: '900px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                
                {/* Avatar & Level */}
                <div style={{ position: 'relative' }}>
                    <img 
                        src={`https://placehold.co/120x120/0070f3/ffffff?text=${seller.name.charAt(0)}`} 
                        style={{ width: '120px', height: '120px', borderRadius: '50%', border: `4px solid ${seller.level.color}` }}
                    />
                    <div style={{ 
                        position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                        background: seller.level.color, color: 'white', padding: '4px 12px', borderRadius: '20px',
                        fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}>
                        Level {seller.level.lvl}: {seller.level.name}
                    </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: '0 0 10px' }}>{seller.name}</h1>
                    <p style={{ color: '#666', marginBottom: '15px', maxWidth: '500px' }}>{seller.bio}</p>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {seller.destinations.map(dest => (
                            <span key={dest} style={{ background: '#f0f0f0', color: '#333', padding: '5px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                                ✈️ {dest}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Stats Box */}
                <div style={{ display: 'flex', gap: '20px', background: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#333' }}>{seller.stats.sales}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Sold</div>
                    </div>
                    <div style={{ width: '1px', background: '#ddd' }}></div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#333' }}>{seller.stats.trips}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Trips</div>
                    </div>
                    <div style={{ width: '1px', background: '#ddd' }}></div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f09433' }}>
                            {averageRating > 0 ? `${averageRating} ★` : 'No ratings'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {reviewCount > 0 ? `${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}` : 'Rating'}
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div style={{ background: '#f8f9fa', minHeight: '60vh', padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Top Items & Recent Activity</h2>
                <button 
                    className="btn-primary" 
                    onClick={() => router.push(`/request-item/${seller.name}`)}
                    style={{ fontSize: '0.9rem' }}
                >
                    Request Item from {seller.name}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {seller.topItems.map(item => (
                    <Link href={getProductLink(item.title)} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eaeaea', transition: 'transform 0.2s', cursor: 'pointer', height: '100%' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ height: '180px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '15px' }}>
                                <h4 style={{ margin: '0 0 5px' }}>{item.title}</h4>
                                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>{item.from} &rarr; {item.to}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold', color: '#0070f3' }}>₱{item.price}</span>
                                    <span style={{ fontSize: '0.7rem', background: '#e8f5e9', color: '#2e7d32', padding: '2px 6px', borderRadius: '4px' }}>SOLD RECENTLY</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
                
                <div style={{ background: 'white', borderRadius: '8px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#888', minHeight: '250px' }}>
                    <span style={{ fontSize: '2rem', marginBottom: '10px' }}>🛍️</span>
                    See all 50+ items sold
                </div>
            </div>

            {/* REVIEWS SECTION */}
            <div style={{ marginTop: '60px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Reviews & Ratings</h2>

                {/* Write Review Form */}
                <div style={{ background: 'white', borderRadius: '12px', padding: 'clamp(20px, 4vw, 30px)', marginBottom: '30px', border: '1px solid #eaeaea' }}>
                    <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', marginBottom: '20px' }}>Write a Review</h3>

                    <form onSubmit={handleSubmitReview}>
                        {/* Star Rating */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
                                Your Rating
                            </label>
                            <div style={{ display: 'flex', gap: '8px', fontSize: 'clamp(2rem, 6vw, 2.5rem)' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() => setNewRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        style={{
                                            cursor: 'pointer',
                                            color: star <= (hoverRating || newRating) ? '#f09433' : '#ddd',
                                            transition: 'color 0.2s',
                                            lineHeight: 1
                                        }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            {newRating > 0 && (
                                <div style={{ marginTop: '8px', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', color: '#666' }}>
                                    You rated: {newRating} star{newRating !== 1 ? 's' : ''}
                                </div>
                            )}
                        </div>

                        {/* Review Text */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
                                Your Review
                            </label>
                            <textarea
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                placeholder="Share your experience with this seller... (minimum 10 characters)"
                                style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#0070f3'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            />
                            <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', color: '#888', marginTop: '5px' }}>
                                {newReview.length}/500 characters
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !user}
                            className="btn-primary"
                            style={{
                                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                padding: 'clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 24px)',
                                opacity: isSubmitting || !user ? 0.6 : 1,
                                cursor: isSubmitting || !user ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : !user ? 'Login to Review' : 'Submit Review'}
                        </button>
                        {!user && (
                            <div style={{ marginTop: '10px', fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', color: '#666' }}>
                                Please <Link href="/login" style={{ color: '#0070f3', fontWeight: '600' }}>login</Link> to write a review
                            </div>
                        )}
                    </form>
                </div>

                {/* Existing Reviews */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                        <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.2rem)', margin: 0 }}>
                            Customer Reviews ({reviews.length})
                        </h3>

                        {/* Sort and Filter Controls */}
                        {reviews.length > 0 && (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {/* Sort Dropdown */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="highest">Highest Rated</option>
                                    <option value="lowest">Lowest Rated</option>
                                </select>

                                {/* Filter Dropdown */}
                                <select
                                    value={filterRating}
                                    onChange={(e) => setFilterRating(e.target.value)}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="all">All Ratings</option>
                                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                                    <option value="3">⭐⭐⭐ 3 Stars</option>
                                    <option value="2">⭐⭐ 2 Stars</option>
                                    <option value="1">⭐ 1 Star</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {reviews.length === 0 ? (
                        <div style={{ background: 'white', padding: '40px', textAlign: 'center', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                            <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '15px' }}>💬</div>
                            <p style={{ color: '#888', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
                                No reviews yet. Be the first to review {seller.name}!
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {getFilteredAndSortedReviews().map((review) => (
                                <div
                                    key={review.id}
                                    style={{
                                        background: 'white',
                                        padding: 'clamp(15px, 4vw, 20px)',
                                        borderRadius: '12px',
                                        border: '1px solid #eaeaea'
                                    }}
                                >
                                    {/* Review Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', marginBottom: '5px' }}>
                                                {review.userName}
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px', fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        style={{
                                                            color: star <= review.rating ? '#f09433' : '#ddd',
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', color: '#888' }}>
                                            {review.createdAt ? new Date(review.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                                        </div>
                                    </div>

                                    {/* Review Comment */}
                                    <p style={{ margin: 0, color: '#333', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', lineHeight: 1.6 }}>
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: '#2e7d32',
          color: 'white',
          padding: 'clamp(15px, 3vw, 20px) clamp(20px, 4vw, 30px)',
          borderRadius: '12px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
          zIndex: 10000,
          animation: 'slideInUp 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '90vw'
        }}>
          <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>✓</span>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', marginBottom: '3px' }}>
              Review Submitted!
            </div>
            <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', opacity: 0.9 }}>
              Thank you for your feedback
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Footer />
    </>
  );
}