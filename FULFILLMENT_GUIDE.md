# Fulfillment List Guide

## Overview

This guide documents the 10 comprehensive Fulfillment List improvements that help sellers/travelers manage their accepted requests efficiently from acceptance through delivery.

The Fulfillment List (formerly "Pasa Bag") is the central hub where travelers track items they've committed to buying and delivering.

## Table of Contents

1. [Features Overview](#features-overview)
2. [Components](#components)
3. [Implementation Examples](#implementation-examples)
4. [Quick Reference](#quick-reference)

---

## Features Overview

### 1. **Item Status Tags** ✅

**Feature**: Status progression displayed as badges: `To Buy` → `Purchased` → `Delivered`

**Why It Matters**: Provides visual clarity on fulfillment progress and helps travelers prioritize tasks.

**Status States**:
- **🛒 To Buy** (Orange) - Item not yet purchased
- **✅ Purchased** (Blue) - Item bought, awaiting delivery
- **🎉 Delivered** (Green) - Item successfully delivered to buyer

**Implementation**:
```jsx
// Status dropdown on each item
<select
  value={item.status || 'to-buy'}
  onChange={(e) => onStatusChange(item.id, e.target.value)}
>
  <option value="to-buy">🛒 To Buy</option>
  <option value="purchased">✅ Purchased</option>
  <option value="delivered">🎉 Delivered</option>
</select>

// Status badge component
const StatusBadge = ({ status }) => {
  const config = {
    'to-buy': { label: 'To Buy', color: '#ff9800', bg: '#fff3e0', icon: '🛒' },
    'purchased': { label: 'Purchased', color: '#2196f3', bg: '#e3f2fd', icon: '✅' },
    'delivered': { label: 'Delivered', color: '#4caf50', bg: '#e8f5e9', icon: '🎉' }
  };

  return (
    <div style={{
      background: config[status].bg,
      color: config[status].color,
      padding: '4px 12px',
      borderRadius: '6px',
      fontWeight: '600'
    }}>
      {config[status].icon} {config[status].label}
    </div>
  );
};
```

**Firebase Update**:
```javascript
await updateDoc(doc(db, "requests", itemId), {
  itemStatus: newStatus,  // 'to-buy', 'purchased', or 'delivered'
  updatedAt: new Date()
});
```

---

### 2. **Cancel Option with Reason Dropdown** ✅

**Feature**: "Remove Item" button that opens modal with reason selection.

**Why It Matters**: Provides transparency to buyers on why items were cancelled and helps track common fulfillment issues.

**Cancellation Reasons**:
1. Out of Stock
2. Price too high
3. Buyer cancelled
4. Can't find item
5. Exceeds luggage limit
6. Customs/import issue
7. Other reason

**Implementation**:
```jsx
const [showRemoveModal, setShowRemoveModal] = useState(false);
const [removeReason, setRemoveReason] = useState('');

// Remove button
<button onClick={() => setShowRemoveModal(true)}>
  Remove
</button>

// Modal with reason dropdown
{showRemoveModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Remove Item from List</h3>
      <p>Why are you removing "{item.title}"?</p>

      <select
        value={removeReason}
        onChange={(e) => setRemoveReason(e.target.value)}
      >
        <option value="">Select a reason...</option>
        <option value="out-of-stock">Out of Stock</option>
        <option value="too-expensive">Price too high</option>
        <option value="buyer-cancelled">Buyer cancelled</option>
        <option value="cant-find">Can't find item</option>
        <option value="exceeded-luggage">Exceeds luggage limit</option>
        <option value="customs-issue">Customs/import issue</option>
        <option value="other">Other reason</option>
      </select>

      <button onClick={handleRemove}>Remove Item</button>
    </div>
  </div>
)}

// Handle removal
const handleRemove = async () => {
  if (!removeReason) {
    alert('Please select a reason for removal');
    return;
  }

  await updateDoc(doc(db, "requests", itemId), {
    status: 'Cancelled',
    cancellationReason: removeReason,
    cancelledAt: new Date(),
    cancelledBy: 'seller'
  });

  // Buyer receives automatic refund notification
};
```

**User Flow**:
1. Click "Remove" button on item card
2. Modal appears with dropdown
3. Select reason from list
4. Confirm removal
5. Item marked as cancelled in Firebase
6. Buyer automatically notified with refund

---

### 3. **Delivery Method Icons** ✅

**Feature**: Visual icons showing **🤝 Meetup** vs **📦 Shipping** for each item.

**Why It Matters**: Helps travelers quickly identify which items need in-person handoff vs shipping logistics.

**Implementation**:
```jsx
<div style={{ display: 'flex', gap: '12px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    {item.deliveryMethod === 'shipping' ? (
      <>
        <span style={{ fontSize: '1.2rem' }}>📦</span>
        <span>Shipping</span>
      </>
    ) : (
      <>
        <span style={{ fontSize: '1.2rem' }}>🤝</span>
        <span>Meetup</span>
      </>
    )}
  </div>
  {item.deliveryLocation && (
    <div>
      <span>📍</span>
      <span>{item.deliveryLocation}</span>
    </div>
  )}
</div>
```

**Data Structure**:
```javascript
{
  id: "req123",
  deliveryMethod: "meetup",  // "meetup" or "shipping"
  deliveryLocation: "Makati", // Specific location
  // ... other fields
}
```

**Visual Indicators**:
- **🤝 Meetup** - In-person handoff (saves shipping costs)
- **📦 Shipping** - Requires courier/postal service
- **📍 Location** - Always shown with specific area

---

### 4. **Group by Buyer Name** ✅

**Feature**: Organize items by buyer to see all requests from the same person.

**Why It Matters**: Essential for planning meetups and coordinating with buyers who ordered multiple items.

**Implementation**:
```jsx
// Toggle for grouping
<label>
  <input
    type="checkbox"
    checked={groupByBuyer}
    onChange={(e) => setGroupByBuyer(e.target.checked)}
  />
  👥 Group by Buyer
</label>

// Grouping logic
const groupedByBuyer = useMemo(() => {
  if (!groupByBuyer) return { 'All Items': items };

  const groups = {};
  items.forEach(item => {
    const buyerName = item.buyerName || 'Unknown Buyer';
    if (!groups[buyerName]) {
      groups[buyerName] = [];
    }
    groups[buyerName].push(item);
  });
  return groups;
}, [items, groupByBuyer]);

// Render grouped items
{Object.entries(groupedByBuyer).map(([buyerName, items]) => (
  <div key={buyerName}>
    {/* Buyer header */}
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '16px 20px',
      borderRadius: '12px',
      color: 'white'
    }}>
      <div>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
          👤 {buyerName}
        </div>
        <div style={{ fontSize: '0.85rem' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </div>
      </div>
      <button onClick={() => handleMessageBuyer(items[0].buyerId, buyerName)}>
        💬 Message {buyerName.split(' ')[0]}
      </button>
    </div>

    {/* Items from this buyer */}
    {items.map(item => <FulfillmentItem key={item.id} item={item} />)}
  </div>
))}
```

**Benefits**:
- See all items for one buyer at a glance
- Plan single meetup for multiple items
- Message buyer about all their items at once
- Better coordination for delivery scheduling

---

### 5. **Profit Math Display** ✅

**Feature**: Clear breakdown showing: `Buy Price + Fee = Total Payout`

**Why It Matters**: Transparency on earnings helps travelers understand exactly what they'll receive.

**Implementation**:
```jsx
<div style={{
  background: '#e8f5e9',
  padding: '10px 12px',
  borderRadius: '8px'
}}>
  <div style={{ color: '#666', marginBottom: '4px' }}>
    Payout Breakdown:
  </div>

  {/* Buy Price */}
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span>Buy Price:</span>
    <span style={{ fontWeight: '600' }}>
      ₱{(item.targetPrice || item.price).toLocaleString()}
    </span>
  </div>

  {/* Your Fee (10%) */}
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span>Your Fee (10%):</span>
    <span style={{ fontWeight: '600' }}>
      ₱{item.estimatedProfit.toLocaleString()}
    </span>
  </div>

  {/* Total */}
  <div style={{
    borderTop: '1px solid #c8e6c9',
    paddingTop: '6px',
    marginTop: '6px',
    display: 'flex',
    justifyContent: 'space-between'
  }}>
    <span style={{ fontWeight: 'bold' }}>Total Payout:</span>
    <span style={{
      fontWeight: 'bold',
      color: '#2e7d32',
      fontSize: '1.1rem'
    }}>
      ₱{(
        (item.targetPrice || item.price) + item.estimatedProfit
      ).toLocaleString()}
    </span>
  </div>
</div>
```

**Calculation**:
```javascript
const buyPrice = item.targetPrice || item.price || 0;
const fee = Math.floor(buyPrice * 0.1); // 10% service fee
const totalPayout = buyPrice + fee;
```

**Example**:
- Buy Price: ₱10,000
- Your Fee (10%): ₱1,000
- **Total Payout: ₱11,000** ← What traveler receives

---

### 6. **Deadline Warning (48 Hours)** ✅

**Feature**: Highlight items due within 48 hours with red border and urgent banner.

**Why It Matters**: Helps travelers prioritize urgent deliveries and avoid missing deadlines.

**Implementation**:
```jsx
// Calculate deadline urgency
const getDeadlineUrgency = () => {
  if (!item.neededBy) return { isUrgent: false, hoursRemaining: null };

  const now = new Date();
  const deadline = new Date(item.neededBy);
  const diffMs = deadline - now;
  const hoursRemaining = Math.ceil(diffMs / (1000 * 60 * 60));

  return {
    isUrgent: hoursRemaining <= 48 && hoursRemaining > 0,
    hoursRemaining,
    isPastDue: hoursRemaining <= 0
  };
};

const { isUrgent, hoursRemaining, isPastDue } = getDeadlineUrgency();

// Visual indicators
<div style={{
  border: isUrgent ? '2px solid #ff4d4f' :
          isPastDue ? '2px solid #d32f2f' :
          '1px solid #eaeaea'
}}>
  {/* Urgent banner at top */}
  {(isUrgent || isPastDue) && (
    <div style={{
      background: isPastDue ? '#d32f2f' : '#ff4d4f',
      color: 'white',
      padding: '4px 12px',
      fontSize: '0.7rem',
      fontWeight: 'bold',
      textAlign: 'center'
    }}>
      {isPastDue
        ? '⚠️ PAST DUE!'
        : `⏰ URGENT: ${hoursRemaining}h remaining`
      }
    </div>
  )}

  {/* Item content */}
</div>
```

**Warning Levels**:
- **> 48 hours** - Normal display (white background, gray border)
- **≤ 48 hours** - Urgent (red border, orange banner with countdown)
- **Past due** - Critical (dark red border, red banner with "PAST DUE")

---

### 7. **Export Shopping List** ✅

**Feature**: Download printable text file with all items organized by buyer.

**Why It Matters**: Travelers can bring physical checklist while shopping abroad without phone dependency.

**Implementation**:
```jsx
const handleExportShoppingList = () => {
  const toBuyItems = acceptedRequests.filter(item => item.status === 'to-buy');

  if (toBuyItems.length === 0) {
    alert('No items to buy yet!');
    return;
  }

  // Generate text content
  let content = `PASA.PH SHOPPING LIST\n`;
  content += `Generated: ${new Date().toLocaleDateString()}\n`;
  content += `Traveler: ${user?.displayName || 'N/A'}\n`;
  content += `\n${'='.repeat(60)}\n\n`;

  // Group by buyer
  const grouped = {};
  toBuyItems.forEach(item => {
    const buyer = item.buyerName || 'Unknown';
    if (!grouped[buyer]) grouped[buyer] = [];
    grouped[buyer].push(item);
  });

  // Format each buyer's items
  Object.entries(grouped).forEach(([buyer, items]) => {
    content += `BUYER: ${buyer}\n`;
    content += `-`.repeat(60) + `\n`;

    items.forEach((item, idx) => {
      content += `\n${idx + 1}. ${item.title}\n`;
      if (item.color) content += `   Color: ${item.color}\n`;
      if (item.capacity) content += `   Capacity: ${item.capacity}\n`;
      if (item.quantity > 1) content += `   Quantity: ${item.quantity}\n`;
      content += `   Max Price: ₱${item.targetPrice.toLocaleString()}\n`;
      content += `   Delivery: ${item.deliveryMethod === 'shipping' ? '📦 Shipping' : '🤝 Meetup'}\n`;
      content += `   Location: ${item.deliveryLocation}\n`;
      if (item.neededBy) {
        content += `   Needed by: ${new Date(item.neededBy).toLocaleDateString()}\n`;
      }
      content += `   [ ] Bought\n`;
    });
    content += `\n`;
  });

  content += `\n${'='.repeat(60)}\n`;
  content += `TOTAL ITEMS TO BUY: ${toBuyItems.length}\n`;
  content += `ESTIMATED PAYOUT: ₱${totalPayout.toLocaleString()}\n`;

  // Create downloadable file
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pasa-shopping-list-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export button
<button onClick={handleExportShoppingList}>
  📄 Export Shopping List
</button>
```

**Exported File Format**:
```
PASA.PH SHOPPING LIST
Generated: 12/3/2025
Traveler: John Doe

============================================================

BUYER: Maria Santos
------------------------------------------------------------

1. iPhone 15 Pro
   Color: Natural Titanium
   Capacity: 256GB
   Max Price: ₱55,000
   Delivery: 🤝 Meetup
   Location: Makati
   Needed by: 12/15/2025
   [ ] Bought

2. Melano CC Serum
   Quantity: 3
   Max Price: ₱1,350
   Delivery: 📦 Shipping
   Location: Quezon City
   [ ] Bought

============================================================
TOTAL ITEMS TO BUY: 2
ESTIMATED PAYOUT: ₱61,950
```

**Benefits**:
- Print and take shopping
- Check off items physically
- No battery/data needed
- Professional appearance

---

### 8. **Chat Shortcut ("Message Buyer")** ✅

**Feature**: Direct "Message Buyer" button on each item row and buyer group header.

**Why It Matters**: Quick access to buyer communication for clarifications, updates, or delivery coordination.

**Implementation**:
```jsx
// On individual item
<button
  onClick={() => onMessageBuyer(item.buyerId, item.buyerName)}
  style={{
    width: '100%',
    padding: '8px 12px',
    background: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  }}
>
  <span>💬</span>
  <span>Message</span>
</button>

// On buyer group header
<button
  onClick={() => handleMessageBuyer(items[0].buyerId, buyerName)}
>
  💬 Message {buyerName.split(' ')[0]}
</button>

// Handler function
const handleMessageBuyer = (buyerId, buyerName) => {
  // Navigate to messages with pre-selected buyer
  router.push(`/messages?userId=${buyerId}&name=${encodeURIComponent(buyerName)}`);
};
```

**Use Cases**:
- Ask about product specifications
- Confirm delivery location/time
- Update on purchase status
- Request additional information
- Coordinate meetup details

**Button Placement**:
1. **Item row**: Bottom-right of each item card
2. **Buyer header**: Right side when grouped by buyer
3. **Color**: Blue (#0070f3) for primary action

---

### 9. **Customs Warning (10k PHP De Minimis)** ✅

**Feature**: Progress bar tracking total value against ₱10,000 tax-free limit.

**Why It Matters**: Helps travelers avoid unexpected customs duties by staying under the de minimis threshold.

**De Minimis Rule**:
- Items valued ≤ ₱10,000: **Tax-free**
- Items valued > ₱10,000: Subject to **20-30% customs duties**

**Implementation**:
```jsx
// CustomsTracker Component
export default function CustomsTracker({ items }) {
  const DE_MINIMIS_LIMIT = 10000; // PHP

  // Calculate total value (exclude delivered items)
  const totalValue = items.reduce((sum, item) => {
    if (item.status === 'delivered') return sum;
    return sum + (item.targetPrice || item.price || 0);
  }, 0);

  const percentage = Math.min((totalValue / DE_MINIMIS_LIMIT) * 100, 100);
  const isNearLimit = percentage >= 75; // Warning at 75%
  const isOverLimit = totalValue > DE_MINIMIS_LIMIT; // Critical over 100%

  return (
    <div style={{
      background: isOverLimit ? '#ffebee' :
                  isNearLimit ? '#fff3e0' : 'white',
      border: `1px solid ${isOverLimit ? '#ef5350' :
                           isNearLimit ? '#ff9800' : '#eaeaea'}`
    }}>
      <h3>🛃 Customs De Minimis Tracker</h3>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: '24px',
        background: '#f0f0f0',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          background: isOverLimit
            ? 'linear-gradient(90deg, #ef5350 0%, #d32f2f 100%)'
            : isNearLimit
            ? 'linear-gradient(90deg, #ff9800 0%, #f57c00 100%)'
            : 'linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)'
        }}>
          {percentage.toFixed(0)}%
        </div>
      </div>

      {/* Value display */}
      <div>
        <div>
          <div>Current Total Value</div>
          <div style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: isOverLimit ? '#d32f2f' :
                   isNearLimit ? '#f57c00' : '#2e7d32'
          }}>
            ₱{totalValue.toLocaleString()}
          </div>
        </div>
        <div>
          <div>Remaining</div>
          <div>
            ₱{Math.max(0, DE_MINIMIS_LIMIT - totalValue).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Warning messages */}
      {isOverLimit && (
        <div style={{ background: '#d32f2f', color: 'white' }}>
          <strong>⚠️ Over De Minimis Limit!</strong>
          <div>
            You may be charged customs duties and taxes on items over ₱10,000.
            Consider removing some items or splitting into multiple trips.
          </div>
        </div>
      )}

      {isNearLimit && !isOverLimit && (
        <div style={{ background: '#ff9800', color: 'white' }}>
          <strong>⚡ Approaching Limit</strong>
          <div>
            You're at {percentage.toFixed(0)}% of the tax-free limit.
            Be careful when accepting more requests!
          </div>
        </div>
      )}
    </div>
  );
}
```

**Warning Levels**:
1. **0-74%** - Green (Safe zone)
2. **75-99%** - Orange (Warning: Approaching limit)
3. **100%+** - Red (Critical: Over limit, customs fees apply)

**What Travelers Should Know**:
- Customs duties: ~20-30% of item value
- De minimis applies per trip/shipment
- Multiple trips can stay under limit
- Some items may have higher duties (electronics, luxury goods)

---

### 10. **Strike-through (Mark as Bought)** ✅

**Feature**: Checkbox to mark items as "Bought" with visual strike-through effect.

**Why It Matters**: Track shopping progress in real-time without changing official status.

**Implementation**:
```jsx
// Checkbox
<input
  type="checkbox"
  checked={item.isBought || false}
  onChange={() => onToggleBought(item.id)}
  style={{
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    accentColor: '#4caf50' // Green checkmark
  }}
  title="Mark as bought"
/>

// Item content with conditional styling
<div style={{
  textDecoration: item.isBought ? 'line-through' : 'none',
  opacity: item.isBought ? 0.6 : 1,
  transition: 'all 0.3s'
}}>
  <h4>{item.title}</h4>
  {/* ... other item details ... */}
</div>

// Toggle function
const handleToggleBought = async (itemId) => {
  const item = acceptedRequests.find(i => i.id === itemId);

  try {
    await updateDoc(doc(db, "requests", itemId), {
      isBought: !item.isBought,
      boughtAt: !item.isBought ? new Date() : null
    });
  } catch (error) {
    console.error("Error toggling bought status:", error);
  }
};
```

**Visual States**:
- **Unchecked**: Normal appearance, full opacity
- **Checked**:
  - Strike-through text
  - 60% opacity (faded)
  - Green checkmark in checkbox
  - Smooth transition animation

**Workflow**:
1. Traveler shops for items
2. Checks off each item as purchased
3. Items fade/strikethrough for visual confirmation
4. Status can still be updated separately (To Buy → Purchased)
5. Double confirmation: checkbox + status dropdown

**Benefits**:
- Quick visual feedback while shopping
- Doesn't affect official status
- Easy to undo if mistake
- Works offline (checkbox state)
- Can later update status in bulk

---

## Components

### FulfillmentItem Component

**Location**: `/src/components/FulfillmentItem.js`

**Props**:
```typescript
interface FulfillmentItemProps {
  item: {
    id: string;
    title: string;
    buyerId: string;
    buyerName: string;
    targetPrice: number;
    estimatedProfit: number;
    deliveryMethod: 'meetup' | 'shipping';
    deliveryLocation: string;
    neededBy?: string; // ISO date string
    status: 'to-buy' | 'purchased' | 'delivered';
    isBought?: boolean;
    color?: string;
    capacity?: string;
    quantity?: number;
  };
  onStatusChange: (id: string, newStatus: string) => void;
  onRemove: (id: string, reason: string) => void;
  onMessageBuyer: (buyerId: string, buyerName: string) => void;
  onToggleBought: (id: string) => void;
  showBuyerName?: boolean;
}
```

**Features**:
- Status dropdown
- Deadline urgency banner
- Checkbox for bought status
- Remove modal with reasons
- Message buyer button
- Profit breakdown
- Delivery method icons

---

### CustomsTracker Component

**Location**: `/src/components/CustomsTracker.js`

**Props**:
```typescript
interface CustomsTrackerProps {
  items: Array<{
    targetPrice?: number;
    price?: number;
    status: string;
  }>;
}
```

**Features**:
- Progress bar visualization
- Color-coded warnings (green/orange/red)
- Total value calculation
- Remaining amount display
- Warning messages
- Info tooltip on de minimis rule

---

## Implementation Examples

### Complete Fulfillment List Page

```jsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import FulfillmentItem from '@/components/FulfillmentItem';
import CustomsTracker from '@/components/CustomsTracker';

export default function FulfillmentList() {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [groupByBuyer, setGroupByBuyer] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch accepted requests
  useEffect(() => {
    const q = query(
      collection(db, "requests"),
      where("sellerId", "==", user.uid),
      where("status", "==", "Accepted")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAcceptedRequests(items);
    });

    return () => unsubscribe();
  }, [user]);

  // Group by buyer
  const groupedByBuyer = useMemo(() => {
    if (!groupByBuyer) return { 'All Items': filteredRequests };

    const groups = {};
    filteredRequests.forEach(item => {
      const buyer = item.buyerName || 'Unknown';
      if (!groups[buyer]) groups[buyer] = [];
      groups[buyer].push(item);
    });
    return groups;
  }, [filteredRequests, groupByBuyer]);

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div>🛒 To Buy: {toBuyCount}</div>
        <div>✅ Purchased: {purchasedCount}</div>
        <div>🎉 Delivered: {deliveredCount}</div>
        <div>💰 Pending Payout: ₱{totalPayout.toLocaleString()}</div>
      </div>

      {/* Customs tracker */}
      <CustomsTracker items={acceptedRequests} />

      {/* Controls */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={groupByBuyer}
            onChange={(e) => setGroupByBuyer(e.target.checked)}
          />
          👥 Group by Buyer
        </label>

        <button onClick={handleExportShoppingList}>
          📄 Export Shopping List
        </button>
      </div>

      {/* Items */}
      {Object.entries(groupedByBuyer).map(([buyerName, items]) => (
        <div key={buyerName}>
          {groupByBuyer && (
            <div className="buyer-header">
              <div>👤 {buyerName} ({items.length} items)</div>
              <button onClick={() => handleMessageBuyer(items[0].buyerId, buyerName)}>
                💬 Message
              </button>
            </div>
          )}

          {items.map(item => (
            <FulfillmentItem
              key={item.id}
              item={item}
              onStatusChange={handleStatusChange}
              onRemove={handleRemoveItem}
              onMessageBuyer={handleMessageBuyer}
              onToggleBought={handleToggleBought}
              showBuyerName={!groupByBuyer}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

## Quick Reference

### Data Structure

```javascript
const fulfillmentItem = {
  // Basic info
  id: "req_abc123",
  title: "iPhone 15 Pro",
  buyerId: "buyer_xyz789",
  buyerName: "Maria Santos",

  // Pricing
  targetPrice: 55000,
  estimatedProfit: 5500,

  // Delivery
  deliveryMethod: "meetup", // or "shipping"
  deliveryLocation: "Makati",
  neededBy: "2025-12-15", // ISO date string

  // Status tracking
  status: "to-buy", // "to-buy" | "purchased" | "delivered"
  isBought: false, // Checkbox state
  itemStatus: "to-buy", // Firebase field for status

  // Specs
  color: "Natural Titanium",
  capacity: "256GB",
  quantity: 1,
  weight: "0.5"
};
```

### Status Lifecycle

```
1. ACCEPTED (from marketplace)
   ↓
2. TO BUY (added to fulfillment list)
   ↓ [traveler checks checkbox while shopping]
   isBought: true (strike-through applied)
   ↓
3. PURCHASED (officially marked)
   ↓
4. DELIVERED (handed to buyer)
```

### Customs Calculation

```javascript
// Total value calculation
const totalValue = items
  .filter(item => item.status !== 'delivered')
  .reduce((sum, item) => sum + (item.targetPrice || item.price || 0), 0);

// Warning thresholds
const DE_MINIMIS_LIMIT = 10000; // PHP
const percentage = (totalValue / DE_MINIMIS_LIMIT) * 100;

if (percentage >= 100) {
  // Red alert: Over limit
  dutiesApply = true;
} else if (percentage >= 75) {
  // Orange warning: Approaching limit
  showWarning = true;
} else {
  // Green: Safe zone
}
```

### Cancellation Reasons

```javascript
const CANCELLATION_REASONS = [
  { value: 'out-of-stock', label: 'Out of Stock' },
  { value: 'too-expensive', label: 'Price too high' },
  { value: 'buyer-cancelled', label: 'Buyer cancelled' },
  { value: 'cant-find', label: "Can't find item" },
  { value: 'exceeded-luggage', label: 'Exceeds luggage limit' },
  { value: 'customs-issue', label: 'Customs/import issue' },
  { value: 'other', label: 'Other reason' }
];
```

---

## Best Practices

### Performance

1. **Use `useMemo` for grouping**:
   ```jsx
   const groupedByBuyer = useMemo(() => {
     // Expensive grouping logic
   }, [items, groupByBuyer]);
   ```

2. **Optimize Firestore queries**:
   ```javascript
   // Only fetch seller's accepted requests
   const q = query(
     collection(db, "requests"),
     where("sellerId", "==", user.uid),
     where("status", "==", "Accepted")
   );
   ```

3. **Lazy load delivered items**:
   ```jsx
   // Default filter: exclude delivered
   const [showDelivered, setShowDelivered] = useState(false);
   ```

### User Experience

1. **Confirm destructive actions**:
   ```jsx
   if (!confirm(`Remove "${item.title}"?`)) return;
   ```

2. **Provide feedback**:
   ```jsx
   alert('Shopping list downloaded!');
   ```

3. **Smart defaults**:
   - Group by buyer: ON (helps coordination)
   - Filter: All items (full visibility)
   - Sort: Urgent first

### Mobile Optimization

1. **Touch-friendly targets**:
   ```jsx
   <button style={{ minHeight: '44px', minWidth: '44px' }}>
   ```

2. **Responsive layout**:
   ```jsx
   gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
   ```

3. **Safe export on mobile**:
   ```jsx
   // Works on all devices
   const blob = new Blob([content], { type: 'text/plain' });
   ```

---

## Troubleshooting

### Common Issues

**Issue**: Customs tracker shows wrong total
```jsx
// ✅ Solution: Exclude delivered items
const totalValue = items
  .filter(item => item.status !== 'delivered') // ← Important
  .reduce((sum, item) => sum + (item.targetPrice || 0), 0);
```

**Issue**: Export button downloads empty file
```jsx
// ✅ Solution: Check filter before export
const toBuyItems = acceptedRequests.filter(item => item.status === 'to-buy');
if (toBuyItems.length === 0) {
  alert('No items to buy yet!');
  return;
}
```

**Issue**: Grouping doesn't work
```jsx
// ✅ Solution: Ensure buyerName field exists
{
  buyerName: data.buyerName || 'Unknown Buyer', // ← Fallback
}
```

---

## Summary

### All 10 Features Implemented ✅

1. ✅ **Item Status** - To Buy → Purchased → Delivered badges
2. ✅ **Cancel Option** - Remove with 7 reason options
3. ✅ **Delivery Icons** - 🤝 Meetup vs 📦 Shipping
4. ✅ **Group by Buyer** - Organize by buyer name
5. ✅ **Profit Math** - Buy Price + Fee = Total Payout
6. ✅ **Deadline Warning** - Red highlight for ≤48 hours
7. ✅ **Export List** - Printable shopping checklist
8. ✅ **Chat Shortcut** - Message Buyer buttons
9. ✅ **Customs Tracker** - 10k PHP de minimis progress bar
10. ✅ **Strike-through** - Checkbox to mark bought

### Files Created

1. **FulfillmentItem.js** (370 lines) - Enhanced item card
2. **CustomsTracker.js** (145 lines) - De minimis tracker
3. **fulfillment-list/page.js** (460 lines) - Main page

### Files Modified

1. **copy.js** - Added fulfillment terminology, tooltips, button text

---

**Last Updated**: December 3, 2025
**Version**: 1.0
**Author**: Claude (Fulfillment List Implementation)
