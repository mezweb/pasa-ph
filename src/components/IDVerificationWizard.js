'use client';

import { useState } from 'react';

export default function IDVerificationWizard({ onComplete, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    idType: '',
    idNumber: '',
    fullName: '',
    birthDate: '',
    idFrontPhoto: null,
    idBackPhoto: null,
    selfiePhoto: null
  });
  const [uploading, setUploading] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
    setUploading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setUploading(false);
    onComplete && onComplete(formData);
  };

  const isStep1Valid = formData.idType && formData.idNumber && formData.fullName && formData.birthDate;
  const isStep2Valid = formData.idFrontPhoto && formData.idBackPhoto;
  const isStep3Valid = formData.selfiePhoto;

  return (
    <div style={{
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
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '30px',
          borderBottom: '1px solid #eaeaea',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#999',
              cursor: 'pointer',
              padding: '5px 10px'
            }}
          >
            ✕
          </button>

          <h2 style={{
            margin: '0 0 10px 0',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#333'
          }}>
            🛡️ ID Verification
          </h2>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            color: '#666'
          }}>
            Verify your identity to build trust with buyers
          </p>

          {/* Progress bar */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '25px'
          }}>
            {[1, 2, 3].map(num => (
              <div key={num} style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                background: num <= step ? '#4caf50' : '#e0e0e0',
                transition: 'background 0.3s'
              }} />
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            fontSize: '0.75rem',
            color: '#999',
            fontWeight: '600'
          }}>
            <span style={{ color: step >= 1 ? '#4caf50' : '#999' }}>Info</span>
            <span style={{ color: step >= 2 ? '#4caf50' : '#999' }}>ID Photos</span>
            <span style={{ color: step >= 3 ? '#4caf50' : '#999' }}>Selfie</span>
          </div>
        </div>

        {/* Step content */}
        <div style={{ padding: '30px' }}>
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Step 1: Basic Information
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {/* ID Type */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    color: '#333'
                  }}>
                    ID Type *
                  </label>
                  <select
                    value={formData.idType}
                    onChange={(e) => setFormData(prev => ({ ...prev, idType: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                  >
                    <option value="">Select ID type...</option>
                    <option value="passport">Passport</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="national_id">National ID (PhilSys)</option>
                    <option value="umid">UMID</option>
                    <option value="sss">SSS ID</option>
                    <option value="voters">Voter's ID</option>
                  </select>
                </div>

                {/* ID Number */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    color: '#333'
                  }}>
                    ID Number *
                  </label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                    placeholder="Enter your ID number"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    color: '#333'
                  }}>
                    Full Name (as shown on ID) *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Juan Dela Cruz"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                {/* Birth Date */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    color: '#333'
                  }}>
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                padding: '12px',
                background: '#e3f2fd',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#0070f3'
              }}>
                <strong>🔒 Privacy:</strong> Your information is encrypted and never shared with buyers without your consent.
              </div>
            </div>
          )}

          {/* STEP 2: ID Photos */}
          {step === 2 && (
            <div>
              <h3 style={{
                margin: '0 0 10px 0',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Step 2: Upload ID Photos
              </h3>
              <p style={{
                margin: '0 0 20px 0',
                fontSize: '0.9rem',
                color: '#666'
              }}>
                Take clear photos of the front and back of your ID
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px'
              }}>
                {/* Front photo */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    color: '#333'
                  }}>
                    Front Side *
                  </label>
                  <label style={{
                    display: 'block',
                    width: '100%',
                    height: '180px',
                    border: '2px dashed ' + (formData.idFrontPhoto ? '#4caf50' : '#ccc'),
                    borderRadius: '12px',
                    background: formData.idFrontPhoto ? '#e8f5e9' : '#f9f9f9',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('idFrontPhoto', e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      fontSize: '2.5rem',
                      marginBottom: '10px',
                      color: formData.idFrontPhoto ? '#4caf50' : '#999'
                    }}>
                      {formData.idFrontPhoto ? '✓' : '📷'}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: formData.idFrontPhoto ? '#4caf50' : '#666',
                      textAlign: 'center'
                    }}>
                      {formData.idFrontPhoto ? 'Front uploaded ✓' : 'Click to upload'}
                    </div>
                  </label>
                </div>

                {/* Back photo */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    color: '#333'
                  }}>
                    Back Side *
                  </label>
                  <label style={{
                    display: 'block',
                    width: '100%',
                    height: '180px',
                    border: '2px dashed ' + (formData.idBackPhoto ? '#4caf50' : '#ccc'),
                    borderRadius: '12px',
                    background: formData.idBackPhoto ? '#e8f5e9' : '#f9f9f9',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('idBackPhoto', e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      fontSize: '2.5rem',
                      marginBottom: '10px',
                      color: formData.idBackPhoto ? '#4caf50' : '#999'
                    }}>
                      {formData.idBackPhoto ? '✓' : '📷'}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: formData.idBackPhoto ? '#4caf50' : '#666',
                      textAlign: 'center'
                    }}>
                      {formData.idBackPhoto ? 'Back uploaded ✓' : 'Click to upload'}
                    </div>
                  </label>
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                padding: '12px',
                background: '#fff3e0',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#e65100'
              }}>
                <strong>💡 Tips:</strong> Ensure all text is clearly readable, avoid glare, and crop out any background.
              </div>
            </div>
          )}

          {/* STEP 3: Selfie/Liveness Check */}
          {step === 3 && (
            <div>
              <h3 style={{
                margin: '0 0 10px 0',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Step 3: Face Verification
              </h3>
              <p style={{
                margin: '0 0 20px 0',
                fontSize: '0.9rem',
                color: '#666'
              }}>
                Take a selfie to verify your identity matches your ID
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                {/* Selfie upload */}
                <label style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: '300px',
                  border: '3px dashed ' + (formData.selfiePhoto ? '#4caf50' : '#ccc'),
                  borderRadius: '16px',
                  background: formData.selfiePhoto ? '#e8f5e9' : '#f9f9f9',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={(e) => handleFileUpload('selfiePhoto', e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    fontSize: '4rem',
                    marginBottom: '15px',
                    color: formData.selfiePhoto ? '#4caf50' : '#999'
                  }}>
                    {formData.selfiePhoto ? '✓' : '🤳'}
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: formData.selfiePhoto ? '#4caf50' : '#666',
                    marginBottom: '8px'
                  }}>
                    {formData.selfiePhoto ? 'Selfie uploaded ✓' : 'Take a selfie'}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#999',
                    textAlign: 'center',
                    padding: '0 20px'
                  }}>
                    {formData.selfiePhoto ? 'Click to retake' : 'Click to open camera'}
                  </div>
                </label>

                {/* Instructions */}
                <div style={{
                  width: '100%',
                  padding: '15px',
                  background: '#f0f9ff',
                  borderRadius: '12px',
                  border: '1px solid #bbdefb'
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#0070f3',
                    marginBottom: '10px'
                  }}>
                    📸 Selfie Guidelines:
                  </div>
                  <ul style={{
                    margin: 0,
                    paddingLeft: '20px',
                    fontSize: '0.85rem',
                    color: '#555',
                    lineHeight: '1.8'
                  }}>
                    <li>Face the camera directly</li>
                    <li>Remove sunglasses or mask</li>
                    <li>Ensure good lighting</li>
                    <li>Hold your ID next to your face (optional but recommended)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div style={{
          padding: '20px 30px',
          borderTop: '1px solid #eaeaea',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '15px'
        }}>
          {step > 1 && (
            <button
              onClick={handleBack}
              style={{
                padding: '12px 24px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                color: '#666',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !isStep1Valid) ||
                (step === 2 && !isStep2Valid)
              }
              style={{
                marginLeft: 'auto',
                padding: '12px 24px',
                background: (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)
                  ? '#ccc'
                  : '#0070f3',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)
                  ? 'not-allowed'
                  : 'pointer'
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStep3Valid || uploading}
              style={{
                marginLeft: 'auto',
                padding: '12px 24px',
                background: !isStep3Valid || uploading ? '#ccc' : '#4caf50',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: !isStep3Valid || uploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {uploading ? (
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
                'Submit Verification ✓'
              )}
            </button>
          )}
        </div>

        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
