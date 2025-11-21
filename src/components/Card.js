export default function Card({ title, subtitle, price, image, type, badge }) {
    return (
      <div className="card">
        <div className="card-img">
             {/* Using placeholder for MVP */}
            <img 
                src={image || `https://placehold.co/600x400/e3f2fd/0070f3?text=${encodeURIComponent(title)}`} 
                alt={title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ 
                fontSize: '0.7rem', 
                background: type === 'request' ? '#e3f2fd' : '#e8f5e9', 
                color: type === 'request' ? '#0070f3' : '#2e7d32', 
                padding: '2px 8px', 
                borderRadius: '4px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
            }}>
                {badge || (type === 'request' ? 'Looking For' : 'Seller')} {/* CHANGED */}
            </span>
          </div>
          <h3 className="card-title">{title}</h3>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
            {subtitle}
          </div>
          <div className="card-price">{price}</div>
        </div>
      </div>
    );
  }