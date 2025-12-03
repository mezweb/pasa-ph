# Trust & Transparency Features Implementation Guide

## Overview
This guide shows how to implement the 9 trust and transparency features across Pasa.ph.

---

## Components Available

All trust components are in `/src/components/TrustBadges.js`:

```javascript
import {
  EscrowBadge,
  VerifiedBadge,
  CapitalDisplay,
  ServiceFeeInfo,
  UploadReceiptButton,
  PayoutTimingInfo,
  AddressPrivacyNote,
  TotalCapitalSummary
} from '@/components/TrustBadges';
```

---

## 1. Escrow Secured Badge

**Where**: Display on every Request Card in the marketplace

### Usage

```jsx
import { EscrowBadge } from '@/components/TrustBadges';

// In your product/request card:
<div className="product-card">
  <EscrowBadge size="small" />  {/* or "medium", "large" */}
  <h3>{product.title}</h3>
  <p>₱{product.price}</p>
</div>
```

### Sizes Available
- `small`: Compact, for tight spaces
- `medium`: Default, balanced size
- `large`: Prominent, for emphasis

### Example in Product List
```jsx
{POPULAR_PRODUCTS.map(product => (
  <div key={product.id} className="product-card">
    {/* Add escrow badge at top */}
    <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 5 }}>
      <EscrowBadge size="small" />
    </div>

    <img src={product.image} alt={product.title} />
    <h3>{product.title}</h3>
    <p>₱{product.price}</p>
    <button>Get it!</button>
  </div>
))}
```

---

## 2. Capital Required Display

**Where**: Fulfillment List / Seller's Bag

### Usage

```jsx
import { CapitalDisplay } from '@/components/TrustBadges';

// Show what seller pays:
<CapitalDisplay
  mode="pay"
  amount={5000}
  showLabel={true}
/>

// Show what seller earns:
<CapitalDisplay
  mode="earn"
  amount={750}
  showLabel={true}
/>
```

### Example in Seller Bag
```jsx
{bagItems.map(item => (
  <div key={item.id} className="bag-item">
    <h4>{item.title}</h4>

    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      <CapitalDisplay mode="pay" amount={item.price} />
      <CapitalDisplay mode="earn" amount={item.price * 0.15} />
    </div>
  </div>
))}
```

---

## 3. Upload Receipt Button

**Where**: Active order view (disabled until after purchase)

### Usage

```jsx
import { UploadReceiptButton } from '@/components/TrustBadges';

// In order details:
<UploadReceiptButton
  disabled={!order.isPurchased}  // Enable after purchase
  onClick={handleUploadReceipt}
/>
```

### Example in Order Details
```jsx
function OrderDetails({ order }) {
  const handleUpload = async () => {
    // Upload logic here
    console.log('Upload receipt for order:', order.id);
  };

  return (
    <div className="order-details">
      <h3>Order #{order.id}</h3>
      <p>Status: {order.status}</p>

      {/* Upload button - disabled until order.isPurchased is true */}
      <UploadReceiptButton
        disabled={!order.isPurchased}
        onClick={handleUpload}
      />

      {order.isPurchased && (
        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>
          Upload your receipt to receive payment faster!
        </p>
      )}
    </div>
  );
}
```

---

## 4. Payout Timing Info

**Where**: Order page, Seller Dashboard, Payment sections

### Usage

```jsx
import { PayoutTimingInfo } from '@/components/TrustBadges';

// Simple usage:
<PayoutTimingInfo />
```

### Example in Seller Dashboard
```jsx
function SellerDashboard() {
  return (
    <div className="dashboard">
      <h2>Your Earnings</h2>
      <div className="balance">₱15,800</div>

      {/* Show how payout works */}
      <PayoutTimingInfo />

      <button>Withdraw to GCash</button>
    </div>
  );
}
```

---

## 5. Address Privacy Note

**Where**: User Profile page, Settings page

### Usage

```jsx
import { AddressPrivacyNote } from '@/components/TrustBadges';

// In profile:
<AddressPrivacyNote />
```

### Example in Profile Page
```jsx
function ProfilePage() {
  return (
    <div className="profile">
      <h2>My Profile</h2>

      <div className="field">
        <label>Name</label>
        <input type="text" value={user.name} />
      </div>

      <div className="field">
        <label>Address</label>
        <input type="text" value={user.address} />
      </div>

      {/* Privacy note about addresses */}
      <AddressPrivacyNote />
    </div>
  );
}
```

---

## 6. Clickable Identity Verification

**Where**: Dashboard to-do list, Profile settings

### Implementation

```jsx
import { useRouter } from 'next/navigation';

function Dashboard() {
  const router = useRouter();
  const isVerified = false; // Check user verification status

  return (
    <div className="todo-list">
      <h3>To-Do List</h3>
      {!isVerified && (
        <div
          className="todo-item urgent"
          onClick={() => router.push('/settings?tab=verification')}
          style={{ cursor: 'pointer' }}
        >
          <span>Complete identity verification</span>
          <span className="badge">1</span>
          <span className="arrow">→</span>
        </div>
      )}
    </div>
  );
}
```

### Verification Settings Page
```jsx
// In /settings page:
function Settings() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'general';

  return (
    <div className="settings">
      <Tabs>
        <Tab active={activeTab === 'general'}>General</Tab>
        <Tab active={activeTab === 'verification'}>Verification</Tab>
      </Tabs>

      {activeTab === 'verification' && (
        <div className="verification-section">
          <h3>Identity Verification</h3>
          <p>Verify your identity to unlock more features</p>
          {/* Verification form */}
        </div>
      )}
    </div>
  );
}
```

---

## 7. Service Fee Tooltip

**Where**: Cart, Checkout, Order summary

### Usage

```jsx
import { ServiceFeeInfo } from '@/components/TrustBadges';

// In order summary:
<ServiceFeeInfo
  amount={serviceFeeAmount}
  percentage={10}
  showTooltip={true}  // Shows ? icon with explanation
/>
```

### Example in Cart
```jsx
function CartSummary() {
  const subtotal = 5000;
  const serviceFee = Math.round(subtotal * 0.10);
  const total = subtotal + serviceFee;

  return (
    <div className="cart-summary">
      <div className="line-item">
        <span>Subtotal</span>
        <span>₱{subtotal.toLocaleString()}</span>
      </div>

      {/* Service fee with tooltip */}
      <ServiceFeeInfo
        amount={serviceFee}
        percentage={10}
        showTooltip={true}
      />

      <div className="line-item total">
        <span>Total</span>
        <span>₱{total.toLocaleString()}</span>
      </div>
    </div>
  );
}
```

---

## 8. Total Capital Summary

**Where**: Seller's Bag/Fulfillment List

### Usage

```jsx
import { TotalCapitalSummary } from '@/components/TrustBadges';

// Pass array of items:
<TotalCapitalSummary
  items={bagItems}
  mode="seller"
/>
```

### Example in Seller Bag
```jsx
function SellerBag() {
  const bagItems = [
    { id: 1, title: 'iPhone 15', price: 55000, quantity: 1 },
    { id: 2, title: 'Airpods Pro', price: 12000, quantity: 2 }
  ];

  return (
    <div className="seller-bag">
      <h2>My Fulfillment Bag</h2>

      {bagItems.map(item => (
        <div key={item.id} className="bag-item">
          <h4>{item.title}</h4>
          <p>₱{item.price.toLocaleString()} × {item.quantity}</p>
        </div>
      ))}

      {/* Total capital needed and earnings */}
      <TotalCapitalSummary items={bagItems} mode="seller" />

      <button>Confirm Purchase</button>
    </div>
  );
}
```

---

## 9. Verified Seller Checkmark

**Where**: User avatars throughout the app

### Usage

```jsx
import { VerifiedBadge } from '@/components/TrustBadges';

// Option 1: Badge on avatar (absolute positioned)
<div style={{ position: 'relative', display: 'inline-block' }}>
  <img src={user.avatar} alt={user.name} className="avatar" />
  {user.isVerified && <VerifiedBadge size="small" />}
</div>

// Option 2: Inline badge next to name
<h3>
  {user.name}
  {user.isVerified && <VerifiedBadge size="tiny" inline={true} />}
</h3>
```

### Sizes Available
- `tiny`: 14px (for inline usage)
- `small`: 18px (for small avatars)
- `medium`: 24px (for large avatars)

### Example in User Card
```jsx
function UserCard({ user }) {
  return (
    <div className="user-card">
      {/* Avatar with badge */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src={user.avatar}
          alt={user.name}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%'
          }}
        />
        {user.isVerified && (
          <VerifiedBadge size="small" />
        )}
      </div>

      {/* Name with inline badge */}
      <h3 style={{ marginTop: '10px' }}>
        {user.name}
        {user.isVerified && <VerifiedBadge size="tiny" inline={true} />}
      </h3>

      <p>{user.bio}</p>
    </div>
  );
}
```

### Example in Navbar
```jsx
function Navbar() {
  const user = useUser();

  return (
    <nav>
      <div className="user-menu">
        <div style={{ position: 'relative' }}>
          <img src={user.avatar} className="avatar" />
          {user.isVerified && <VerifiedBadge size="tiny" />}
        </div>
        <span>{user.name}</span>
      </div>
    </nav>
  );
}
```

---

## Complete Integration Example

Here's a complete example showing all features together:

```jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  EscrowBadge,
  VerifiedBadge,
  CapitalDisplay,
  ServiceFeeInfo,
  UploadReceiptButton,
  PayoutTimingInfo,
  AddressPrivacyNote,
  TotalCapitalSummary
} from '@/components/TrustBadges';

function CompleteDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bagItems, setBagItems] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);

  return (
    <div className="dashboard">
      {/* Header with verified badge */}
      <div className="header">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={user?.avatar} className="avatar" />
          {user?.isVerified && <VerifiedBadge size="medium" />}
        </div>
        <h1>
          Welcome, {user?.name}
          {user?.isVerified && <VerifiedBadge size="tiny" inline={true} />}
        </h1>
      </div>

      {/* To-do list with clickable verification */}
      <div className="todo-section">
        <h2>To-Do List</h2>
        {!user?.isVerified && (
          <div
            className="todo-item"
            onClick={() => router.push('/settings?tab=verification')}
            style={{ cursor: 'pointer' }}
          >
            ⚠️ Complete identity verification →
          </div>
        )}
      </div>

      {/* Marketplace with escrow badges */}
      <div className="marketplace">
        <h2>Available Requests</h2>
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <EscrowBadge size="small" />
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>₱{product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seller Bag with capital summary */}
      <div className="seller-bag">
        <h2>My Fulfillment Bag</h2>
        {bagItems.map(item => (
          <div key={item.id} className="bag-item">
            <h4>{item.title}</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              <CapitalDisplay mode="pay" amount={item.price} />
              <CapitalDisplay mode="earn" amount={item.price * 0.15} />
            </div>
          </div>
        ))}

        <TotalCapitalSummary items={bagItems} mode="seller" />
      </div>

      {/* Active Orders with upload button */}
      <div className="orders">
        <h2>Active Orders</h2>
        {activeOrders.map(order => (
          <div key={order.id} className="order-card">
            <h3>Order #{order.id}</h3>
            <p>Status: {order.status}</p>

            <UploadReceiptButton
              disabled={!order.isPurchased}
              onClick={() => handleUploadReceipt(order.id)}
            />
          </div>
        ))}
      </div>

      {/* Payment section */}
      <div className="payment-section">
        <h2>Your Earnings</h2>
        <div className="balance">₱15,800</div>

        <PayoutTimingInfo />

        <button className="btn-primary">Withdraw to GCash</button>
      </div>

      {/* Profile with privacy note */}
      <div className="profile">
        <h2>Profile Settings</h2>
        <input type="text" placeholder="Address" />
        <AddressPrivacyNote />
      </div>

      {/* Cart with service fee tooltip */}
      <div className="cart-summary">
        <div className="subtotal">Subtotal: ₱5,000</div>
        <ServiceFeeInfo amount={500} percentage={10} showTooltip={true} />
        <div className="total">Total: ₱5,500</div>
      </div>
    </div>
  );
}
```

---

## Checklist for Implementation

When adding trust features to a page:

- [ ] **Product/Request Cards**: Add `<EscrowBadge />`
- [ ] **Seller Bag**: Add `<CapitalDisplay />` and `<TotalCapitalSummary />`
- [ ] **Active Orders**: Add `<UploadReceiptButton />`
- [ ] **Payment Pages**: Add `<PayoutTimingInfo />`
- [ ] **Profile**: Add `<AddressPrivacyNote />`
- [ ] **To-Do List**: Make verification clickable
- [ ] **Cart/Checkout**: Add `<ServiceFeeInfo />` with tooltip
- [ ] **User Avatars**: Add `<VerifiedBadge />` where appropriate

---

## Quick Reference

| Component | Purpose | Where to Use |
|-----------|---------|--------------|
| `EscrowBadge` | Show payment protection | Product cards, request cards |
| `VerifiedBadge` | Show verified seller | Avatars, usernames |
| `CapitalDisplay` | Show pay/earn amounts | Seller bag, fulfillment list |
| `ServiceFeeInfo` | Explain platform fee | Cart, checkout |
| `UploadReceiptButton` | Upload proof of purchase | Order details |
| `PayoutTimingInfo` | Explain payment timeline | Dashboard, order pages |
| `AddressPrivacyNote` | Explain address privacy | Profile, settings |
| `TotalCapitalSummary` | Show total investment | Seller bag |

---

## File Locations

- **Components**: `/src/components/TrustBadges.js`
- **This Guide**: `/TRUST_FEATURES_GUIDE.md`
- **Copywriting**: `/src/lib/copy.js`
- **Tooltips**: `/src/components/Tooltip.js`

---

**Remember**: These features build trust and transparency. Use them prominently to help users feel secure! 🛡️✅
