'use client';

import { useState } from 'react';

export default function MarketplaceControls({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  regionFilter,
  onRegionFilterChange,
  showBulkSelect,
  onToggleBulkSelect,
  selectedCount = 0,
  onBulkAccept
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #eaeaea',
      marginBottom: '20px'
    }}>
      {/* Top Row - Search and Bulk Select Toggle */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '15px',
        flexWrap: 'wrap'
      }}>
        {/* Search Bar */}
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Search items, brands, or categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 40px 12px 15px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '1rem',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#0070f3';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 112, 243, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0';
              e.target.style.boxShadow = 'none';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: '#999',
                padding: '5px'
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Filters Toggle (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: '12px 20px',
            background: showFilters ? '#0070f3' : 'white',
            color: showFilters ? 'white' : '#0070f3',
            border: '2px solid #0070f3',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>⚙️ Filters</span>
          <span style={{ fontSize: '0.8rem' }}>
            {showFilters ? '▲' : '▼'}
          </span>
        </button>

        {/* Bulk Select Toggle */}
        <button
          onClick={onToggleBulkSelect}
          style={{
            padding: '12px 20px',
            background: showBulkSelect ? '#ff9800' : 'white',
            color: showBulkSelect ? 'white' : '#ff9800',
            border: `2px solid #ff9800`,
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>☑️ Bulk Select</span>
          {selectedCount > 0 && (
            <span style={{
              background: 'white',
              color: '#ff9800',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '0.8rem'
            }}>
              {selectedCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel (Collapsible) */}
      {showFilters && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          {/* Sort Options */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#666',
              marginBottom: '8px'
            }}>
              📊 Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="profit-high">Highest Profit</option>
              <option value="profit-low">Lowest Profit</option>
              <option value="price-high">Highest Price</option>
              <option value="price-low">Lowest Price</option>
              <option value="urgent">Most Urgent</option>
              <option value="weight-low">Lightest Items</option>
              <option value="weight-high">Heaviest Items</option>
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#666',
              marginBottom: '8px'
            }}>
              📍 Delivery Region
            </label>
            <select
              value={regionFilter}
              onChange={(e) => onRegionFilterChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Regions</option>
              <option value="metro-manila">Metro Manila</option>
              <option value="provinces">Provinces</option>
              <option value="makati">Makati</option>
              <option value="bgc">BGC / Taguig</option>
              <option value="quezon-city">Quezon City</option>
              <option value="manila">Manila</option>
              <option value="pasig">Pasig</option>
              <option value="cebu">Cebu</option>
              <option value="davao">Davao</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => {
                onSearchChange('');
                onSortChange('newest');
                onRegionFilterChange('all');
              }}
              style={{
                width: '100%',
                padding: '10px',
                background: '#f0f0f0',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: '#666',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#e0e0e0';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#f0f0f0';
              }}
            >
              🔄 Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Bulk Accept Bar */}
      {showBulkSelect && selectedCount > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          padding: '15px 20px',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>
            ✓ {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
          </div>
          <button
            onClick={onBulkAccept}
            style={{
              background: 'white',
              color: '#ff9800',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'transform 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Accept All Selected →
          </button>
        </div>
      )}

      {/* Active Filters Summary */}
      {(searchQuery || sortBy !== 'newest' || regionFilter !== 'all') && (
        <div style={{
          marginTop: '15px',
          padding: '12px',
          background: '#f0f9ff',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#0077b6'
        }}>
          <strong>Active filters:</strong>
          {' '}
          {searchQuery && <span>Search: "{searchQuery}" • </span>}
          {sortBy !== 'newest' && <span>Sort: {sortBy.replace('-', ' ')} • </span>}
          {regionFilter !== 'all' && <span>Region: {regionFilter.replace('-', ' ')}</span>}
        </div>
      )}
    </div>
  );
}
