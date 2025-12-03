# Marketplace Improvements Guide

## Overview

This guide documents the 10 comprehensive marketplace improvements implemented for sellers/travelers on Pasa.ph. These enhancements make it easier for travelers to find, evaluate, and accept buyer requests efficiently.

## Table of Contents

1. [Features Overview](#features-overview)
2. [Components](#components)
3. [Implementation Examples](#implementation-examples)
4. [Quick Reference](#quick-reference)

---

## Features Overview

### 1. **Delivery Location Display** ✅

**Feature**: Shows the destination city (e.g., "Makati") on each request card.

**Why It Matters**: Helps travelers filter requests by convenient delivery locations, reducing travel time and costs.

**Implementation**:
```jsx
// Request data structure
{
  id: "req123",
  title: "iPhone 15 Pro",
  from: "USA",
  to: "Philippines",
  deliveryLocation: "Makati", // ← NEW
  price: 55000
}

// Display in RequestCard
<div>
  📍 Delivery: <span style={{ color: '#0070f3' }}>{request.deliveryLocation}</span>
</div>
```

**Visual**:
- Location displayed with 📍 icon
- Blue highlight color (#0070f3)
- Positioned below route information

---

### 2. **Detailed Item Specifications** ✅

**Feature**: Displays Color, Capacity, and Quantity as badges on request cards.

**Why It Matters**: Provides travelers with complete product details at a glance, reducing confusion and back-and-forth messages.

**Implementation**:
```jsx
// Request data with specs
{
  title: "iPhone 15 Pro",
  color: "Natural Titanium",    // ← NEW
  capacity: "256GB",             // ← NEW
  quantity: 2,                   // ← NEW
  // ... other fields
}

// Display as badges
<div style={{ display: 'flex', gap: '8px' }}>
  {request.color && (
    <div style={{
      background: '#f0f9ff',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '0.75rem',
      color: '#0077b6'
    }}>
      🎨 {request.color}
    </div>
  )}
  {request.capacity && <div>📦 {request.capacity}</div>}
  {request.quantity && <div>✕ {request.quantity}</div>}
</div>
```

**Visual**:
- Light blue background (#f0f9ff)
- Icon prefix (🎨 for color, 📦 for capacity, ✕ for quantity)
- Rounded badge style (6px border-radius)

---

### 3. **Estimated Weight Display** ✅

**Feature**: Shows approximate weight (e.g., "0.5kg") on every item.

**Why It Matters**: Helps travelers calculate luggage capacity and plan which items fit their baggage allowance.

**Implementation**:
```jsx
// Request data
{
  title: "Melano CC Serum",
  weight: "0.3",  // ← NEW (in kg)
  // ... other fields
}

// Display weight badge
<div style={{
  background: '#fff3e0',
  padding: '6px 12px',
  borderRadius: '6px'
}}>
  <span style={{ fontSize: '0.8rem', color: '#e65100', fontWeight: '600' }}>
    ⚖️ Approx. Weight: {request.weight}kg
  </span>
</div>
```

**Visual**:
- Orange background (#fff3e0)
- Scale icon (⚖️)
- Displayed prominently near product title

**Integration with Luggage Calculator**:
```jsx
// Seller dashboard shows remaining capacity
const remainingWeight = 23 - currentLuggageWeight;
const canFitItems = Math.floor(remainingWeight / averageItemWeight);
```

---

### 4. **Target Buy Price (Replaces "Avg Price")** ✅

**Feature**: Displays the buyer's maximum budget instead of average market price.

**Why It Matters**: Gives travelers a clear price target, eliminating guesswork about what to pay.

**Before vs After**:
```jsx
// ❌ Before (confusing)
<div>Avg Price: ₱2,500</div>

// ✅ After (clear)
<div>
  <div style={{ fontSize: '0.7rem', color: '#666' }}>
    Target Buy Price (Buyer's Budget)
  </div>
  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2e7d32' }}>
    ₱{request.targetPrice.toLocaleString()}
  </div>
</div>
```

**Profit Calculation**:
```jsx
// Show estimated profit (10% fee)
{request.estimatedProfit && (
  <div style={{
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    padding: '6px 10px',
    borderRadius: '6px'
  }}>
    <div style={{ fontSize: '0.7rem', color: '#1b5e20' }}>
      Your Profit (10% fee)
    </div>
    <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#2e7d32' }}>
      💰 ₱{request.estimatedProfit.toLocaleString()}
    </div>
  </div>
)}
```

---

### 5. **Region Filter** ✅

**Feature**: Filter requests by delivery region (Metro Manila vs Provinces).

**Why It Matters**: Lets travelers focus on requests they can deliver conveniently based on their location.

**Filter Options**:
- **All Regions**: Show all requests
- **Metro Manila**: Makati, BGC, Quezon City, Manila, Pasig, Ortigas, Mandaluyong
- **Provinces**: All locations outside Metro Manila
- **Specific cities**: Makati, BGC, Quezon City, Manila, Pasig, Cebu, Davao

**Implementation**:
```jsx
// MarketplaceControls component
<select
  value={regionFilter}
  onChange={(e) => onRegionFilterChange(e.target.value)}
>
  <option value="all">All Regions</option>
  <option value="metro-manila">Metro Manila</option>
  <option value="provinces">Provinces</option>
  <option value="makati">Makati</option>
  <option value="bgc">BGC / Taguig</option>
  {/* ... more options */}
</select>

// Filtering logic
if (regionFilter === 'metro-manila') {
  const metroManilaAreas = ['Makati', 'BGC', 'Taguig', 'Quezon City', 'Manila', 'Pasig', 'Ortigas'];
  filtered = filtered.filter(req =>
    metroManilaAreas.some(area => req.deliveryLocation?.includes(area))
  );
}
```

---

### 6. **Urgency Tags with "Needed By" Date** ✅

**Feature**: Displays deadline date and urgency badge for time-sensitive requests.

**Why It Matters**: Helps travelers prioritize urgent requests and plan their shopping timeline.

**Implementation**:
```jsx
// Request data
{
  title: "Tokyo Banana",
  neededBy: "2025-12-10",  // ← NEW (ISO date string)
  // ... other fields
}

// Calculate days remaining
const getDaysRemaining = () => {
  if (!request.neededBy) return null;
  const today = new Date();
  const neededDate = new Date(request.neededBy);
  const diffDays = Math.ceil((neededDate - today) / (1000 * 60 * 60 * 24));
  return diffDays;
};

const daysRemaining = getDaysRemaining();
const isUrgent = daysRemaining !== null && daysRemaining <= 3;

// Display urgency badge (top-right corner)
{isUrgent && (
  <span style={{
    background: '#ff4d4f',
    color: 'white',
    fontSize: '0.6rem',
    fontWeight: 'bold',
    padding: '3px 8px',
    borderRadius: '4px',
    animation: 'pulse 2s infinite'
  }}>
    ⚡ URGENT
  </span>
)}

// Display needed by date
<div style={{
  background: isUrgent ? '#fff3e0' : '#f0f9ff',
  border: `1px solid ${isUrgent ? '#ff9800' : '#0070f3'}`,
  padding: '8px 12px',
  borderRadius: '6px'
}}>
  <div style={{ fontSize: '0.75rem', color: '#666' }}>Needed by:</div>
  <div style={{ fontWeight: 'bold', color: isUrgent ? '#e65100' : '#0070f3' }}>
    📅 {new Date(request.neededBy).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })}
    <span style={{ fontSize: '0.75rem' }}>
      ({daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left)
    </span>
  </div>
</div>
```

**Urgency Thresholds**:
- **≤ 3 days**: Red "URGENT" badge with pulsing animation
- **4-7 days**: Blue "Needed by" display
- **> 7 days**: Standard blue display

---

### 7. **Search Bar** ✅

**Feature**: Text search to find items by name, brand, category, or location.

**Why It Matters**: Quickly find specific types of requests without scrolling.

**Implementation**:
```jsx
// MarketplaceControls component
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
    fontSize: '1rem'
  }}
/>

// Search logic (case-insensitive, multi-field)
if (searchQuery) {
  const query = searchQuery.toLowerCase();
  filtered = filtered.filter(req =>
    req.title?.toLowerCase().includes(query) ||
    req.from?.toLowerCase().includes(query) ||
    req.to?.toLowerCase().includes(query) ||
    req.deliveryLocation?.toLowerCase().includes(query)
  );
}
```

**Searchable Fields**:
- Product title (e.g., "iPhone", "Serum")
- Origin country (e.g., "USA", "Japan")
- Destination (e.g., "Philippines")
- Delivery location (e.g., "Makati", "BGC")

**Clear Button**:
```jsx
{searchQuery && (
  <button
    onClick={() => onSearchChange('')}
    style={{
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)'
    }}
  >
    ×
  </button>
)}
```

---

### 8. **Sort Options** ✅

**Feature**: Multiple sort options including "Sort by: Highest Profit".

**Why It Matters**: Helps travelers maximize earnings by prioritizing high-profit requests.

**Sort Options**:
1. **Newest First** (default)
2. **Highest Profit** ← Most requested
3. **Lowest Profit**
4. **Highest Price**
5. **Lowest Price**
6. **Most Urgent** (by deadline)
7. **Lightest Items**
8. **Heaviest Items**

**Implementation**:
```jsx
// Sort dropdown
<select
  value={sortBy}
  onChange={(e) => onSortChange(e.target.value)}
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

// Sort logic
filtered.sort((a, b) => {
  switch (sortBy) {
    case 'profit-high':
      return (b.estimatedProfit || 0) - (a.estimatedProfit || 0);
    case 'urgent':
      const getDays = (req) => {
        if (!req.neededBy) return 999;
        const diff = new Date(req.neededBy) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
      };
      return getDays(a) - getDays(b);
    case 'weight-low':
      return parseFloat(a.weight || 0) - parseFloat(b.weight || 0);
    // ... other cases
  }
});
```

---

### 9. **Bulk Accept** ✅

**Feature**: Select multiple small items and accept them all at once.

**Why It Matters**: Saves time when accepting multiple lightweight items that fit in luggage space.

**Implementation**:
```jsx
// Bulk select toggle button
<button
  onClick={onToggleBulkSelect}
  style={{
    background: showBulkSelect ? '#ff9800' : 'white',
    color: showBulkSelect ? 'white' : '#ff9800',
    border: '2px solid #ff9800'
  }}
>
  ☑️ Bulk Select
  {selectedCount > 0 && (
    <span style={{
      background: 'white',
      color: '#ff9800',
      padding: '2px 8px',
      borderRadius: '10px'
    }}>
      {selectedCount}
    </span>
  )}
</button>

// RequestCard with checkbox
{showBulkSelect && (
  <input
    type="checkbox"
    checked={isSelected}
    onChange={() => onSelect(request.id)}
    style={{ width: '20px', height: '20px' }}
  />
)}

// Bulk accept bar (shows when items selected)
{showBulkSelect && selectedCount > 0 && (
  <div style={{
    background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
    padding: '15px 20px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between'
  }}>
    <div style={{ color: 'white' }}>
      ✓ {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
    </div>
    <button onClick={onBulkAccept}>
      Accept All Selected →
    </button>
  </div>
)}

// Bulk accept handler
const handleBulkAccept = async () => {
  if (!confirm(`Accept ${selectedRequests.length} requests at once?`)) return;

  const promises = selectedRequests.map(id =>
    updateDoc(doc(db, "requests", id), {
      status: 'Accepted',
      sellerId: user.uid,
      acceptedAt: serverTimestamp()
    })
  );

  await Promise.all(promises);
  alert(`Successfully accepted ${selectedRequests.length} requests!`);
  setSelectedRequests([]);
  setShowBulkSelect(false);
};
```

**User Flow**:
1. Click "Bulk Select" button
2. Checkboxes appear on all request cards
3. Click cards to select/deselect
4. Orange bar shows count at bottom
5. Click "Accept All Selected" to confirm
6. All selected requests accepted simultaneously

---

### 10. **Expandable Item Photo** ✅

**Feature**: Click product images to view full-screen with details overlay.

**Why It Matters**: Helps travelers verify product authenticity and check fine details before accepting.

**Implementation**:
```jsx
// Clickable thumbnail in RequestCard
<div
  onClick={() => setShowPhotoModal(true)}
  style={{
    width: '100%',
    height: '180px',
    cursor: 'pointer',
    position: 'relative'
  }}
>
  <img
    src={request.image}
    alt={request.title}
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
  <div style={{
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem'
  }}>
    🔍 Click to expand
  </div>
</div>

// Full-screen modal
{showPhotoModal && (
  <div
    onClick={() => setShowPhotoModal(false)}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}
  >
    <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
      <img
        src={request.image}
        alt={request.title}
        style={{
          maxWidth: '100%',
          maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: '12px'
        }}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowPhotoModal(false);
        }}
        style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          background: 'white',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '1.5rem'
        }}
      >
        ×
      </button>
      {/* Details overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px'
      }}>
        <h3>{request.title}</h3>
        <div>
          {request.from} → {request.to}
          {request.deliveryLocation && ` • 📍 ${request.deliveryLocation}`}
        </div>
      </div>
    </div>
  </div>
)}
```

**Features**:
- Full-screen dark overlay (rgba(0,0,0,0.9))
- Image centers with max 90% viewport width/height
- Close button (white circle with ×)
- Details overlay at bottom (title, route, location)
- Click anywhere to close
- Prevents body scrolling while open

---

## Components

### RequestCard Component

**Location**: `/src/components/RequestCard.js`

**Props**:
```typescript
interface RequestCardProps {
  request: {
    id: string;
    title: string;
    from: string;
    to: string;
    price: number;
    deliveryLocation?: string;
    color?: string;
    capacity?: string;
    quantity?: number;
    weight?: string;
    targetPrice?: number;
    estimatedProfit?: number;
    neededBy?: string;
    image?: string;
    status?: string;
  };
  onAccept: (id: string, title: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  showBulkSelect?: boolean;
  tier?: 'Standard' | 'Gold' | 'Diamond';
}
```

**Usage**:
```jsx
import RequestCard from '@/components/RequestCard';

<RequestCard
  request={requestData}
  onAccept={handleAcceptRequest}
  isSelected={selectedRequests.includes(requestData.id)}
  onSelect={handleSelectRequest}
  showBulkSelect={showBulkSelect}
  tier="Standard"
/>
```

---

### MarketplaceControls Component

**Location**: `/src/components/MarketplaceControls.js`

**Props**:
```typescript
interface MarketplaceControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  regionFilter: string;
  onRegionFilterChange: (region: string) => void;
  showBulkSelect: boolean;
  onToggleBulkSelect: () => void;
  selectedCount: number;
  onBulkAccept: () => void;
}
```

**Usage**:
```jsx
import MarketplaceControls from '@/components/MarketplaceControls';

<MarketplaceControls
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  sortBy={sortBy}
  onSortChange={setSortBy}
  regionFilter={regionFilter}
  onRegionFilterChange={setRegionFilter}
  showBulkSelect={showBulkSelect}
  onToggleBulkSelect={() => setShowBulkSelect(!showBulkSelect)}
  selectedCount={selectedRequests.length}
  onBulkAccept={handleBulkAccept}
/>
```

---

## Implementation Examples

### Complete Seller Dashboard Integration

```jsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import RequestCard from '@/components/RequestCard';
import MarketplaceControls from '@/components/MarketplaceControls';

export default function SellerDashboard() {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [regionFilter, setRegionFilter] = useState('all');
  const [showBulkSelect, setShowBulkSelect] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState([]);

  // Filter and sort requests
  const filteredAndSortedRequests = useMemo(() => {
    let filtered = [...requests];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req =>
        req.title?.toLowerCase().includes(query) ||
        req.deliveryLocation?.toLowerCase().includes(query)
      );
    }

    // Region filter
    if (regionFilter !== 'all') {
      if (regionFilter === 'metro-manila') {
        const metroAreas = ['Makati', 'BGC', 'Quezon City', 'Manila', 'Pasig'];
        filtered = filtered.filter(req =>
          metroAreas.some(area => req.deliveryLocation?.includes(area))
        );
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'profit-high':
          return (b.estimatedProfit || 0) - (a.estimatedProfit || 0);
        case 'urgent':
          // Sort by deadline
          const getDays = (req) => {
            if (!req.neededBy) return 999;
            return Math.ceil((new Date(req.neededBy) - new Date()) / (1000 * 60 * 60 * 24));
          };
          return getDays(a) - getDays(b);
        default:
          return 0;
      }
    });

    return filtered;
  }, [requests, searchQuery, sortBy, regionFilter]);

  const handleBulkAccept = async () => {
    if (!confirm(`Accept ${selectedRequests.length} requests?`)) return;

    // Accept all selected requests
    const promises = selectedRequests.map(id =>
      acceptRequest(id)
    );

    await Promise.all(promises);
    setSelectedRequests([]);
    setShowBulkSelect(false);
  };

  return (
    <div>
      <MarketplaceControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        regionFilter={regionFilter}
        onRegionFilterChange={setRegionFilter}
        showBulkSelect={showBulkSelect}
        onToggleBulkSelect={() => setShowBulkSelect(!showBulkSelect)}
        selectedCount={selectedRequests.length}
        onBulkAccept={handleBulkAccept}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {filteredAndSortedRequests.map(req => (
          <RequestCard
            key={req.id}
            request={req}
            onAccept={handleAcceptRequest}
            isSelected={selectedRequests.includes(req.id)}
            onSelect={(id) => {
              setSelectedRequests(prev =>
                prev.includes(id)
                  ? prev.filter(reqId => reqId !== id)
                  : [...prev, id]
              );
            }}
            showBulkSelect={showBulkSelect}
            tier="Standard"
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Quick Reference

### Data Structure Template

```javascript
const requestExample = {
  // Basic fields
  id: "req_abc123",
  title: "iPhone 15 Pro",
  from: "USA",
  to: "Philippines",
  price: 55000,
  status: "Open", // "Open" | "Accepted" | "Completed"

  // NEW Marketplace Fields
  deliveryLocation: "Makati",        // Specific city/area
  color: "Natural Titanium",         // Product color
  capacity: "256GB",                 // Product capacity/size
  quantity: 1,                       // Number of items
  weight: "0.5",                     // Weight in kg (string)
  targetPrice: 55000,                // Buyer's max budget
  estimatedProfit: 5500,             // 10% of price
  neededBy: "2025-12-15",            // ISO date string
  image: "/products/iphone15.jpg",   // Product image URL
  createdAt: new Date()              // Timestamp
};
```

### Copywriting Constants

```javascript
import { TERMINOLOGY, TOOLTIPS, BUTTON_TEXT } from '@/lib/copy';

// Usage examples
<div>{TERMINOLOGY.deliveryLocation}</div>
// "Delivery Location"

<div>{TERMINOLOGY.targetBuyPrice}</div>
// "Target Buy Price"

<Tooltip text={TOOLTIPS.targetBuyPrice}>
  <span>Target Buy Price (?)</span>
</Tooltip>
// Shows: "The maximum budget the buyer is willing to pay..."

<button>{BUTTON_TEXT.primary.bulkAccept}</button>
// "Accept All Selected →"
```

### Filter & Sort Configuration

```javascript
// Region filter options
const regionOptions = [
  { value: 'all', label: 'All Regions' },
  { value: 'metro-manila', label: 'Metro Manila' },
  { value: 'provinces', label: 'Provinces' },
  { value: 'makati', label: 'Makati' },
  { value: 'bgc', label: 'BGC / Taguig' },
  { value: 'quezon-city', label: 'Quezon City' },
  { value: 'manila', label: 'Manila' },
  { value: 'pasig', label: 'Pasig' },
  { value: 'cebu', label: 'Cebu' },
  { value: 'davao', label: 'Davao' }
];

// Sort options
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'profit-high', label: 'Highest Profit' },
  { value: 'profit-low', label: 'Lowest Profit' },
  { value: 'price-high', label: 'Highest Price' },
  { value: 'price-low', label: 'Lowest Price' },
  { value: 'urgent', label: 'Most Urgent' },
  { value: 'weight-low', label: 'Lightest Items' },
  { value: 'weight-high', label: 'Heaviest Items' }
];
```

### Urgency Calculation Helper

```javascript
// Helper function to calculate urgency
export function getRequestUrgency(neededBy) {
  if (!neededBy) return { isUrgent: false, daysRemaining: null };

  const today = new Date();
  const deadline = new Date(neededBy);
  const diffTime = deadline - today;
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    isUrgent: daysRemaining <= 3,
    daysRemaining,
    urgencyLevel: daysRemaining <= 1 ? 'critical' :
                  daysRemaining <= 3 ? 'high' :
                  daysRemaining <= 7 ? 'medium' : 'low'
  };
}

// Usage
const { isUrgent, daysRemaining } = getRequestUrgency(request.neededBy);
```

---

## Best Practices

### Performance Optimization

1. **Use `useMemo` for filtering/sorting**:
   ```jsx
   const filteredRequests = useMemo(() => {
     // Expensive filtering logic
   }, [requests, searchQuery, sortBy, regionFilter]);
   ```

2. **Lazy load images**:
   ```jsx
   <img
     src={request.image}
     loading="lazy"
     alt={request.title}
   />
   ```

3. **Virtualize long lists** (if > 100 items):
   ```jsx
   // Consider using react-window or react-virtualized
   import { FixedSizeGrid } from 'react-window';
   ```

### Accessibility

1. **Keyboard navigation for bulk select**:
   ```jsx
   <div
     role="checkbox"
     aria-checked={isSelected}
     tabIndex={0}
     onKeyPress={(e) => {
       if (e.key === 'Enter' || e.key === ' ') {
         onSelect(request.id);
       }
     }}
   >
   ```

2. **Screen reader labels**:
   ```jsx
   <button aria-label={`Accept ${request.title} request`}>
     Accept
   </button>
   ```

3. **Focus management in modal**:
   ```jsx
   useEffect(() => {
     if (showPhotoModal) {
       document.body.style.overflow = 'hidden';
       return () => {
         document.body.style.overflow = 'unset';
       };
     }
   }, [showPhotoModal]);
   ```

### Mobile Responsiveness

1. **Responsive grid**:
   ```jsx
   <div style={{
     display: 'grid',
     gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
     gap: '20px'
   }}>
   ```

2. **Touch-friendly controls**:
   ```jsx
   <button style={{
     minHeight: '44px',  // iOS minimum touch target
     minWidth: '44px',
     fontSize: 'max(16px, 1rem)'  // Prevents iOS zoom
   }}>
   ```

3. **Collapsible filters on mobile**:
   ```jsx
   @media (max-width: 768px) {
     .filters-panel {
       display: ${showFilters ? 'block' : 'none'};
     }
   }
   ```

---

## Troubleshooting

### Common Issues

**Issue**: Filters not working
```jsx
// ✅ Solution: Ensure filter state updates trigger re-render
const [regionFilter, setRegionFilter] = useState('all');

// Wrap filtering in useMemo with correct dependencies
const filtered = useMemo(() => {
  return requests.filter(/* ... */);
}, [requests, regionFilter]); // ← Include all dependencies
```

**Issue**: Bulk select checkboxes not showing
```jsx
// ✅ Solution: Check showBulkSelect prop is passed correctly
<RequestCard
  showBulkSelect={showBulkSelect}  // ← Must be true
  onSelect={handleSelect}          // ← Required callback
/>
```

**Issue**: Photo modal not closing
```jsx
// ✅ Solution: Use stopPropagation on close button
<button
  onClick={(e) => {
    e.stopPropagation();  // ← Prevents modal backdrop click
    setShowPhotoModal(false);
  }}
>
  ×
</button>
```

---

## Summary

### All 10 Features Implemented ✅

1. ✅ **Delivery Location** - Shows city on cards
2. ✅ **Item Specs** - Color, Capacity, Quantity badges
3. ✅ **Weight Display** - Approx. weight in kg
4. ✅ **Target Buy Price** - Buyer's budget (not avg price)
5. ✅ **Region Filter** - Metro Manila vs Provinces
6. ✅ **Urgency Tags** - "Needed by" date with badges
7. ✅ **Search Bar** - Full-text search
8. ✅ **Sort Options** - 8 options including "Highest Profit"
9. ✅ **Bulk Accept** - Multi-select with confirmation
10. ✅ **Photo Modal** - Full-screen expandable images

### Files Created/Modified

**New Components**:
- `/src/components/RequestCard.js` (374 lines)
- `/src/components/MarketplaceControls.js` (267 lines)

**Modified Files**:
- `/src/app/seller-dashboard/page.js` (complete marketplace integration)
- `/src/lib/copy.js` (added marketplace terminology)

**Documentation**:
- `/MARKETPLACE_GUIDE.md` (this file)

---

## Next Steps

### For Developers

1. **Add to existing pages**:
   ```jsx
   import RequestCard from '@/components/RequestCard';
   import MarketplaceControls from '@/components/MarketplaceControls';
   ```

2. **Customize filtering logic** for your use case

3. **Connect to real Firebase data** (already integrated in seller-dashboard)

### For Designers

1. Review visual styling in `RequestCard.js`
2. Customize colors, spacing, typography
3. Add brand-specific icons or illustrations

### For Product

1. Track metrics:
   - Most used sort option
   - Most used region filter
   - Bulk accept usage rate
   - Photo modal view rate
   - Urgency tag effectiveness

2. A/B test:
   - Different urgency thresholds (3 days vs 5 days)
   - Badge colors and styles
   - Sort option defaults

---

**Last Updated**: December 3, 2025
**Version**: 1.0
**Author**: Claude (Marketplace Improvements Implementation)
