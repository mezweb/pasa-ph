'use client';

export default function EscrowTimeline({ compact = false }) {
  const steps = [
    {
      number: 1,
      icon: '💳',
      title: 'Buyer Pays',
      description: 'Payment held securely in escrow',
      color: '#0070f3'
    },
    {
      number: 2,
      icon: '🛒',
      title: 'You Buy',
      description: 'Purchase item abroad',
      color: '#ff9800'
    },
    {
      number: 3,
      icon: '✈️',
      title: 'You Deliver',
      description: 'Bring item to Philippines',
      color: '#9c27b0'
    },
    {
      number: 4,
      icon: '✅',
      title: 'Buyer Confirms',
      description: 'Buyer receives & confirms',
      color: '#4caf50'
    },
    {
      number: 5,
      icon: '💰',
      title: 'Funds Released',
      description: 'Payment sent to your account',
      color: '#2e7d32'
    }
  ];

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        padding: '15px',
        background: '#f9f9f9',
        borderRadius: '12px',
        border: '1px solid #eaeaea'
      }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'white',
              borderRadius: '8px',
              border: `2px solid ${step.color}`,
              fontSize: '0.85rem',
              fontWeight: '600',
              color: step.color
            }}>
              <span style={{ fontSize: '1rem' }}>{step.icon}</span>
              <span>{step.title}</span>
            </div>
            {idx < steps.length - 1 && (
              <span style={{ color: '#ccc', fontSize: '1.2rem' }}>→</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      border: '1px solid #eaeaea',
      borderRadius: '12px',
      padding: '30px',
      marginBottom: '20px'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h3 style={{
          margin: '0 0 10px 0',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#333'
        }}>
          🔒 How Escrow Protects You
        </h3>
        <p style={{
          margin: 0,
          fontSize: '0.95rem',
          color: '#666'
        }}>
          Your payment is guaranteed. Funds are only released after successful delivery.
        </p>
      </div>

      {/* Timeline */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start',
            position: 'relative'
          }}>
            {/* Step number/icon */}
            <div style={{
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: step.color,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                flexShrink: 0,
                boxShadow: `0 4px 12px ${step.color}40`
              }}>
                {step.icon}
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '60px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '3px',
                  height: '40px',
                  background: 'linear-gradient(to bottom, ' + step.color + ', ' + steps[idx + 1].color + ')',
                  borderRadius: '2px'
                }} />
              )}
            </div>

            {/* Step content */}
            <div style={{
              flex: 1,
              paddingTop: '8px'
            }}>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '4px'
              }}>
                {step.title}
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: '#666',
                lineHeight: '1.6'
              }}>
                {step.description}
              </div>

              {/* Additional info for key steps */}
              {step.number === 1 && (
                <div style={{
                  marginTop: '8px',
                  padding: '10px',
                  background: '#e3f2fd',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: '#0070f3',
                  border: '1px solid #bbdefb'
                }}>
                  <strong>Safe & Secure:</strong> Money is held by Pasa.ph, not released to seller yet
                </div>
              )}

              {step.number === 4 && (
                <div style={{
                  marginTop: '8px',
                  padding: '10px',
                  background: '#f1f8e9',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: '#689f38',
                  border: '1px solid #dcedc8'
                }}>
                  <strong>Auto-release:</strong> If buyer doesn't confirm within 3 days, funds auto-release
                </div>
              )}

              {step.number === 5 && (
                <div style={{
                  marginTop: '8px',
                  padding: '10px',
                  background: '#e8f5e9',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: '#2e7d32',
                  border: '1px solid #c8e6c9'
                }}>
                  <strong>Fast Payout:</strong> Funds transferred to your account within 1-2 business days
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        background: '#fff3e0',
        borderRadius: '8px',
        border: '1px solid #ffe0b2',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#e65100'
      }}>
        <strong>💡 Pro Tip:</strong> Always communicate and transact only through Pasa.ph platform to ensure escrow protection
      </div>
    </div>
  );
}
