'use client';

import { useState } from 'react';

export default function PayoutMethods({ selectedMethod, onSelect, required = false }) {
  const [selected, setSelected] = useState(selectedMethod || '');
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: '',
    accountName: '',
    mobileNumber: ''
  });

  const methods = [
    {
      id: 'gcash',
      name: 'GCash',
      icon: '💳',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/GCash_logo.svg',
      color: '#007DFF',
      fees: 'Free',
      processingTime: 'Instant',
      minAmount: 100,
      popular: true,
      fields: ['mobileNumber', 'accountName']
    },
    {
      id: 'paymaya',
      name: 'Maya',
      icon: '💚',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Maya_Logo.svg',
      color: '#00D632',
      fees: 'Free',
      processingTime: 'Instant',
      minAmount: 100,
      popular: true,
      fields: ['mobileNumber', 'accountName']
    },
    {
      id: 'bdo',
      name: 'BDO',
      icon: '🏦',
      logo: null, // Would use actual BDO logo
      color: '#003087',
      fees: '₱25',
      processingTime: '1-2 business days',
      minAmount: 500,
      popular: true,
      fields: ['accountNumber', 'accountName']
    },
    {
      id: 'bpi',
      name: 'BPI',
      icon: '🏦',
      logo: null,
      color: '#D32F2F',
      fees: '₱25',
      processingTime: '1-2 business days',
      minAmount: 500,
      popular: false,
      fields: ['accountNumber', 'accountName']
    },
    {
      id: 'metrobank',
      name: 'Metrobank',
      icon: '🏦',
      logo: null,
      color: '#F57C00',
      fees: '₱25',
      processingTime: '1-2 business days',
      minAmount: 500,
      popular: false,
      fields: ['accountNumber', 'accountName']
    },
    {
      id: 'unionbank',
      name: 'UnionBank',
      icon: '🏦',
      logo: null,
      color: '#E91E63',
      fees: '₱25',
      processingTime: '1-2 business days',
      minAmount: 500,
      popular: false,
      fields: ['accountNumber', 'accountName']
    },
    {
      id: 'landbank',
      name: 'Landbank',
      icon: '🏦',
      logo: null,
      color: '#4CAF50',
      fees: '₱25',
      processingTime: '1-2 business days',
      minAmount: 500,
      popular: false,
      fields: ['accountNumber', 'accountName']
    },
    {
      id: 'security_bank',
      name: 'Security Bank',
      icon: '🏦',
      logo: null,
      color: '#1976D2',
      fees: '₱25',
      processingTime: '1-2 business days',
      minAmount: 500,
      popular: false,
      fields: ['accountNumber', 'accountName']
    }
  ];

  const handleSelect = (methodId) => {
    setSelected(methodId);
    const method = methods.find(m => m.id === methodId);
    onSelect && onSelect(method, accountDetails);
  };

  const selectedMethodData = methods.find(m => m.id === selected);

  return (
    <div style={{
      background: 'white',
      border: '1px solid #eaeaea',
      borderRadius: '12px',
      padding: '25px'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '1.4rem',
          fontWeight: 'bold',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>💰</span>
          <span>Payout Method</span>
          {required && (
            <span style={{
              fontSize: '0.8rem',
              background: '#ff6b6b',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: '600'
            }}>
              REQUIRED
            </span>
          )}
        </h3>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          color: '#666',
          lineHeight: '1.6'
        }}>
          Choose how you want to receive your earnings. You can change this anytime in settings.
        </p>
      </div>

      {/* Popular methods */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: '600',
          color: '#999',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          ⭐ Most Popular
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          {methods.filter(m => m.popular).map((method) => (
            <div
              key={method.id}
              onClick={() => handleSelect(method.id)}
              style={{
                padding: '20px',
                border: `2px solid ${selected === method.id ? method.color : '#eaeaea'}`,
                borderRadius: '12px',
                background: selected === method.id ? `${method.color}10` : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (selected !== method.id) {
                  e.currentTarget.style.borderColor = method.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selected !== method.id) {
                  e.currentTarget.style.borderColor = '#eaeaea';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {selected === method.id && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: method.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  ✓
                </div>
              )}

              <div style={{
                fontSize: '3rem',
                marginBottom: '10px',
                textAlign: 'center'
              }}>
                {method.icon}
              </div>

              <div style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'center',
                marginBottom: '8px'
              }}>
                {method.name}
              </div>

              <div style={{
                fontSize: '0.8rem',
                color: '#666',
                textAlign: 'center',
                marginBottom: '4px'
              }}>
                {method.fees} • {method.processingTime}
              </div>

              <div style={{
                fontSize: '0.75rem',
                color: '#999',
                textAlign: 'center'
              }}>
                Min: ₱{method.minAmount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other banks */}
      <div>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: '600',
          color: '#999',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          🏦 Banks
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px'
        }}>
          {methods.filter(m => !m.popular).map((method) => (
            <div
              key={method.id}
              onClick={() => handleSelect(method.id)}
              style={{
                padding: '15px',
                border: `2px solid ${selected === method.id ? method.color : '#eaeaea'}`,
                borderRadius: '8px',
                background: selected === method.id ? `${method.color}10` : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                if (selected !== method.id) {
                  e.currentTarget.style.borderColor = method.color;
                }
              }}
              onMouseLeave={(e) => {
                if (selected !== method.id) {
                  e.currentTarget.style.borderColor = '#eaeaea';
                }
              }}
            >
              <div style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: selected === method.id ? method.color : '#333'
              }}>
                {method.name}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#999',
                marginTop: '4px'
              }}>
                {method.fees} fee
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account details form */}
      {selected && selectedMethodData && (
        <div style={{
          marginTop: '25px',
          padding: '20px',
          background: '#f9f9f9',
          borderRadius: '12px',
          border: `2px solid ${selectedMethodData.color}`
        }}>
          <div style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '15px'
          }}>
            Enter {selectedMethodData.name} Details
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            {selectedMethodData.fields.includes('mobileNumber') && (
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="+63 912 345 6789"
                  value={accountDetails.mobileNumber}
                  onChange={(e) => setAccountDetails(prev => ({
                    ...prev,
                    mobileNumber: e.target.value
                  }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            )}

            {selectedMethodData.fields.includes('accountNumber') && (
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Account Number *
                </label>
                <input
                  type="text"
                  placeholder="1234567890"
                  value={accountDetails.accountNumber}
                  onChange={(e) => setAccountDetails(prev => ({
                    ...prev,
                    accountNumber: e.target.value
                  }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            )}

            {selectedMethodData.fields.includes('accountName') && (
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Account Name *
                </label>
                <input
                  type="text"
                  placeholder="Juan Dela Cruz"
                  value={accountDetails.accountName}
                  onChange={(e) => setAccountDetails(prev => ({
                    ...prev,
                    accountName: e.target.value
                  }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            )}
          </div>

          <button
            onClick={() => onSelect && onSelect(selectedMethodData, accountDetails)}
            disabled={
              (selectedMethodData.fields.includes('mobileNumber') && !accountDetails.mobileNumber) ||
              (selectedMethodData.fields.includes('accountNumber') && !accountDetails.accountNumber) ||
              (selectedMethodData.fields.includes('accountName') && !accountDetails.accountName)
            }
            style={{
              marginTop: '15px',
              width: '100%',
              padding: '12px',
              background: selectedMethodData.color,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              opacity: (selectedMethodData.fields.includes('mobileNumber') && !accountDetails.mobileNumber) ||
                (selectedMethodData.fields.includes('accountNumber') && !accountDetails.accountNumber) ||
                (selectedMethodData.fields.includes('accountName') && !accountDetails.accountName)
                ? 0.5 : 1
            }}
          >
            Save {selectedMethodData.name} Details
          </button>
        </div>
      )}

      {/* Info box */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '8px',
        border: '1px solid #bbdefb',
        fontSize: '0.85rem',
        color: '#0070f3',
        lineHeight: '1.6'
      }}>
        <strong>🔒 Security:</strong> Your payout information is encrypted and stored securely.
        We never share your financial details with buyers.
      </div>
    </div>
  );
}
