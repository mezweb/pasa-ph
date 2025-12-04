'use client';

import { useState } from 'react';

export default function ReportIssueButton({
  variant = 'primary', // 'primary', 'secondary', 'floating'
  orderId = null,
  size = 'medium' // 'small', 'medium', 'large'
}) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    issueType: '',
    orderId: orderId || '',
    subject: '',
    description: '',
    priority: 'medium',
    attachments: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const issueTypes = [
    { value: 'payment', label: '💳 Payment Issue', description: 'Problems with payments or refunds' },
    { value: 'delivery', label: '📦 Delivery Problem', description: 'Late, missing, or damaged items' },
    { value: 'quality', label: '⚠️ Item Quality', description: 'Wrong item or quality concerns' },
    { value: 'communication', label: '💬 Communication Issue', description: 'Unresponsive or unprofessional behavior' },
    { value: 'scam', label: '🚫 Suspected Scam', description: 'Fraudulent or suspicious activity' },
    { value: 'safety', label: '🛡️ Safety Concern', description: 'Unsafe or inappropriate behavior' },
    { value: 'technical', label: '🔧 Technical Problem', description: 'Website or app issues' },
    { value: 'other', label: '📝 Other', description: 'Other concerns not listed above' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In production, send to Firestore or support ticketing system
    console.log('Report submitted:', formData);

    setSubmitted(true);
    setSubmitting(false);

    // Auto-close after 3 seconds
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setFormData({
        issueType: '',
        orderId: orderId || '',
        subject: '',
        description: '',
        priority: 'medium',
        attachments: []
      });
    }, 3000);
  };

  const buttonStyles = {
    primary: {
      background: '#ff6b6b',
      color: 'white',
      border: 'none',
      padding: size === 'small' ? '8px 16px' : size === 'large' ? '14px 28px' : '10px 20px',
      borderRadius: '8px',
      fontSize: size === 'small' ? '0.85rem' : size === 'large' ? '1.1rem' : '0.95rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)'
    },
    secondary: {
      background: 'white',
      color: '#ff6b6b',
      border: '2px solid #ff6b6b',
      padding: size === 'small' ? '8px 16px' : size === 'large' ? '14px 28px' : '10px 20px',
      borderRadius: '8px',
      fontSize: size === 'small' ? '0.85rem' : size === 'large' ? '1.1rem' : '0.95rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s'
    },
    floating: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#ff6b6b',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      fontSize: '1.5rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
      zIndex: 9998,
      transition: 'all 0.2s'
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={buttonStyles[variant]}
        onMouseEnter={(e) => {
          if (variant === 'floating') {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 107, 0.5)';
          } else {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = variant === 'floating' ? 'scale(1)' : 'translateY(0)';
          e.currentTarget.style.boxShadow = variant === 'floating'
            ? '0 4px 12px rgba(255, 107, 107, 0.4)'
            : '0 2px 8px rgba(255, 107, 107, 0.3)';
        }}
        title="Report an issue or get help"
      >
        {variant === 'floating' ? (
          '🚨'
        ) : (
          <>
            <span>🚨</span>
            <span>Report Issue</span>
          </>
        )}
      </button>

      {/* Modal */}
      {showModal && (
        <div
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
          onClick={() => !submitting && setShowModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {!submitted ? (
              <>
                {/* Header */}
                <div style={{
                  padding: '25px',
                  borderBottom: '1px solid #eaeaea',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                  color: 'white',
                  borderRadius: '16px 16px 0 0',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      color: 'white',
                      fontSize: '1.2rem',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>

                  <h2 style={{
                    margin: '0 0 8px 0',
                    fontSize: '1.8rem',
                    fontWeight: 'bold'
                  }}>
                    🚨 Report an Issue
                  </h2>
                  <p style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    opacity: 0.9
                  }}>
                    We're here to help. Describe your issue and we'll respond within 24 hours.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
                  {/* Issue Type */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontSize: '0.95rem',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      What's the issue? *
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '10px'
                    }}>
                      {issueTypes.map(type => (
                        <div
                          key={type.value}
                          onClick={() => setFormData(prev => ({ ...prev, issueType: type.value }))}
                          style={{
                            padding: '12px',
                            border: `2px solid ${formData.issueType === type.value ? '#ff6b6b' : '#eaeaea'}`,
                            borderRadius: '8px',
                            background: formData.issueType === type.value ? '#fff5f5' : 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '4px'
                          }}>
                            {type.label}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#666',
                            lineHeight: '1.4'
                          }}>
                            {type.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order ID (optional) */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '0.95rem',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      Order ID <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#999' }}>(if applicable)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.orderId}
                      onChange={(e) => setFormData(prev => ({ ...prev, orderId: e.target.value }))}
                      placeholder="e.g., ORD-12345"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  {/* Subject */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '0.95rem',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of the issue"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '0.95rem',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      Detailed Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Please provide as much detail as possible about the issue..."
                      rows="5"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* Priority */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '0.95rem',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      Priority Level
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {[
                        { value: 'low', label: 'Low', color: '#4caf50' },
                        { value: 'medium', label: 'Medium', color: '#ff9800' },
                        { value: 'high', label: 'High', color: '#f44336' }
                      ].map(priority => (
                        <button
                          key={priority.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                          style={{
                            flex: 1,
                            padding: '10px',
                            border: `2px solid ${formData.priority === priority.value ? priority.color : '#eaeaea'}`,
                            borderRadius: '8px',
                            background: formData.priority === priority.value ? `${priority.color}20` : 'white',
                            color: formData.priority === priority.value ? priority.color : '#666',
                            fontWeight: formData.priority === priority.value ? 'bold' : 'normal',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {priority.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Info box */}
                  <div style={{
                    marginBottom: '20px',
                    padding: '15px',
                    background: '#e3f2fd',
                    borderRadius: '8px',
                    border: '1px solid #bbdefb',
                    fontSize: '0.85rem',
                    color: '#0070f3',
                    lineHeight: '1.6'
                  }}>
                    <strong>ℹ️ Response Time:</strong> We aim to respond within 24 hours for standard issues
                    and within 2 hours for high-priority reports.
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={!formData.issueType || !formData.subject || !formData.description || submitting}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: (!formData.issueType || !formData.subject || !formData.description || submitting)
                        ? '#ccc'
                        : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: (!formData.issueType || !formData.subject || !formData.description || submitting)
                        ? 'not-allowed'
                        : 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {submitting ? (
                      <>
                        <span style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid white',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }} />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      'Submit Report'
                    )}
                  </button>
                </form>

                <style jsx>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </>
            ) : (
              // Success state
              <div style={{
                padding: '60px 40px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '20px',
                  animation: 'bounceIn 0.5s'
                }}>
                  ✅
                </div>
                <h3 style={{
                  margin: '0 0 15px 0',
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: '#4caf50'
                }}>
                  Report Submitted!
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '1rem',
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  We've received your report. Our support team will review it and respond within 24 hours.
                </p>
                <div style={{
                  marginTop: '25px',
                  padding: '15px',
                  background: '#e8f5e9',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#2e7d32'
                }}>
                  <strong>Ticket ID:</strong> #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
