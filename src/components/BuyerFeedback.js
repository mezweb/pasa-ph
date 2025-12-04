'use client';

import { useState } from 'react';

export default function BuyerFeedback({ reviews = [] }) {
  const [showAll, setShowAll] = useState(false);

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0
      ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
      : 0
  }));

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  // Render stars
  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            style={{
              color: star <= rating ? '#ffc107' : '#e0e0e0',
              fontSize: '1.1rem'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid #eaeaea',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #eaeaea',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '1.3rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⭐</span>
          <span>Buyer Feedback</span>
        </h3>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          opacity: 0.9
        }}>
          {reviews.length} review{reviews.length !== 1 ? 's' : ''} from happy buyers
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {reviews.length === 0 ? (
          // Empty state
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#999'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📝</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px', color: '#666' }}>
              No reviews yet
            </div>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Complete your first delivery to start receiving buyer feedback!
            </div>
          </div>
        ) : (
          <>
            {/* Rating summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '30px',
              marginBottom: '30px',
              padding: '20px',
              background: '#f9f9f9',
              borderRadius: '12px'
            }}>
              {/* Average rating */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#ffc107',
                  lineHeight: 1
                }}>
                  {avgRating}
                </div>
                {renderStars(Math.round(parseFloat(avgRating)))}
                <div style={{
                  fontSize: '0.85rem',
                  color: '#666',
                  marginTop: '8px'
                }}>
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Rating distribution */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                justifyContent: 'center'
              }}>
                {ratingCounts.map(({ star, count, percentage }) => (
                  <div key={star} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ width: '12px', fontWeight: '600', color: '#666' }}>
                      {star}
                    </span>
                    <span style={{ color: '#ffc107' }}>★</span>
                    <div style={{
                      flex: 1,
                      height: '8px',
                      background: '#e0e0e0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: '#ffc107',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{ width: '35px', textAlign: 'right', color: '#666' }}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual reviews */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              {displayedReviews.map((review, idx) => (
                <div key={idx} style={{
                  padding: '15px',
                  background: '#f9f9f9',
                  borderRadius: '12px',
                  border: '1px solid #eee'
                }}>
                  {/* Reviewer info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <img
                      src={review.buyerPhoto || 'https://placehold.co/40x40?text=B'}
                      alt={review.buyerName}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #e0e0e0'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.95rem',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '2px'
                      }}>
                        {review.buyerName}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {renderStars(review.rating)}
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#999'
                        }}>
                          • {review.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review text */}
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#555',
                    lineHeight: '1.6',
                    marginBottom: '10px'
                  }}>
                    "{review.comment}"
                  </div>

                  {/* Order info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8rem',
                    color: '#999'
                  }}>
                    <span>📦</span>
                    <span>{review.itemName}</span>
                    <span>•</span>
                    <span>{review.location}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Show more button */}
            {reviews.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                style={{
                  width: '100%',
                  marginTop: '15px',
                  padding: '12px',
                  background: 'white',
                  border: '1px solid #0070f3',
                  borderRadius: '8px',
                  color: '#0070f3',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
