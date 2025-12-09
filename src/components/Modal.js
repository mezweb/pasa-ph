export default function Modal({ isOpen, onClose, title, children, hasUnsavedChanges = false }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Only close if clicking the overlay itself, not the modal content
    if (e.target === e.currentTarget) {
      if (hasUnsavedChanges) {
        const shouldClose = window.confirm('You have unsaved changes. Do you want to discard them?');
        if (shouldClose) {
          onClose();
        }
      } else {
        onClose();
      }
    }
  };

  const handleCloseClick = () => {
    if (hasUnsavedChanges) {
      const shouldClose = window.confirm('You have unsaved changes. Do you want to discard them?');
      if (shouldClose) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000,
        cursor: 'pointer'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', padding: '30px', borderRadius: '8px',
          width: '90%', maxWidth: '500px', position: 'relative',
          cursor: 'default',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <button
          onClick={handleCloseClick}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          &times;
        </button>
        <h2 style={{ marginBottom: '20px' }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}