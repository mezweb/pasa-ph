# Navigation & Information Architecture Guide

## Overview
This guide documents the 10 navigation and information architecture improvements implemented for Pasa.ph.

---

## 1. Pasa Bag → Fulfillment List

**Old**: "Pasa Bag", "My Bag"
**New**: "Fulfillment List", "My Orders"

### Why?
- "Fulfillment List" is clearer for sellers - it's a list of items they're fulfilling
- "My Orders" is clearer for buyers
- More professional and descriptive

### Implementation
```javascript
import { TERMINOLOGY } from '@/lib/copy';

// Instead of:
<h2>Pasa Bag</h2>

// Use:
<h2>{TERMINOLOGY.pasaBag}</h2>  // "Fulfillment List"
// or
<h2>{TERMINOLOGY.myOrders}</h2>  // "My Orders"
```

### Where to Update
- Seller dashboard sidebar/menu
- Cart context terminology
- URL routes (consider `/fulfillment-list` instead of `/pasa-bag`)
- Button labels
- Empty states

---

## 2. Add to Bag → Accept Request

**Old**: "Add to Bag"
**New**: "Accept Request"

### Why?
- Sellers aren't "adding" - they're accepting responsibility
- "Accept Request" is more action-oriented
- Clearer transaction intent

### Implementation
```javascript
import { BUTTON_TEXT, TERMINOLOGY } from '@/lib/copy';

// Primary button:
<button>{BUTTON_TEXT.primary.acceptRequest}</button>  // "Accept Request"

// Or from terminology:
<button>{TERMINOLOGY.acceptRequest}</button>
```

### Example in Marketplace
```jsx
function RequestCard({ request }) {
  return (
    <div className="request-card">
      <h3>{request.title}</h3>
      <p>₱{request.price}</p>

      {/* Old: "Add to Bag" */}
      {/* New: "Accept Request" */}
      <button onClick={() => handleAccept(request.id)}>
        {BUTTON_TEXT.primary.acceptRequest}
      </button>
    </div>
  );
}
```

---

## 3. Empty State with Notification

**Component**: `EmptyState`

### When to Use
- No requests available
- No orders found
- No messages
- Empty fulfillment list

### Implementation
```jsx
import EmptyState from '@/components/EmptyState';

// Example: No buyers found
<EmptyState
  icon="🔍"
  title="No Buyers Found"
  description="We'll notify you as soon as someone requests an item from your destination."
  actionLabel="Browse Marketplace"
  onAction={() => router.push('/marketplace')}
  secondaryLabel="Notify me when buyers appear"
  onSecondary={handleNotifyMe}
/>
```

### Props
- `icon` - Emoji or icon (default: '📦')
- `title` - Main heading
- `description` - Explanatory text
- `actionLabel` - Primary button text
- `onAction` - Primary button handler
- `secondaryLabel` - Optional secondary button text
- `onSecondary` - Optional secondary button handler

### Example: Empty Fulfillment List
```jsx
<EmptyState
  icon="✈️"
  title="Your Fulfillment List is Empty"
  description="Accept requests from the marketplace to start earning!"
  actionLabel="Browse Requests"
  onAction={() => router.push('/marketplace')}
  secondaryLabel="Notify me when buyers appear"
  onSecondary={async () => {
    await subscribeToNotifications(user.id);
    alert('You\'ll be notified when new requests appear!');
  }}
/>
```

---

## 4. Sticky Mobile Footer

**Component**: `StickyMobileFooter`

### Purpose
Shows potential earnings and quick action on mobile while scrolling

### Implementation
```jsx
import StickyMobileFooter from '@/components/StickyMobileFooter';

function SellerMarketplace() {
  const potentialEarnings = calculateEarnings(acceptedRequests);
  const itemCount = acceptedRequests.length;

  return (
    <div>
      {/* Your marketplace content */}

      {/* Sticky footer - shows only on mobile */}
      <StickyMobileFooter
        earnings={potentialEarnings}
        itemCount={itemCount}
        onAction={() => router.push('/fulfillment-list')}
        actionLabel="View Fulfillment List"
      />
    </div>
  );
}
```

### Features
- Auto-hidden on desktop (>768px)
- Fixed position above bottom navigation (z-index: 998)
- Shows earnings, item count, and action button
- Mobile-optimized (min-height: 44px touch target)

### Positioning
- Bottom: 60px (above bottom navigation)
- Adds padding-bottom: 150px to body on mobile

---

## 5. Back Buttons

**Implementation**: Use `BUTTON_TEXT.secondary.backToDashboard`

### Standard Back Button
```jsx
import { useRouter } from 'next/navigation';
import { BUTTON_TEXT } from '@/lib/copy';

function MarketplacePage() {
  const router = useRouter();

  return (
    <div>
      <button
        onClick={() => router.push('/seller-dashboard')}
        style={{
          background: 'white',
          border: '2px solid #ddd',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {BUTTON_TEXT.secondary.backToDashboard}
      </button>

      {/* Page content */}
    </div>
  );
}
```

### Where to Add
- Marketplace page → Dashboard
- Fulfillment List → Dashboard
- Order Details → Orders List
- Settings → Dashboard

---

## 6. Consolidated Inbox

**Old**: Separate "Notifications" and "Messages"
**New**: Single "Inbox" tab

### Implementation
```jsx
import { TERMINOLOGY } from '@/lib/copy';

function Inbox() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="inbox">
      <h2>{TERMINOLOGY.inbox}</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={activeTab === 'messages' ? 'active' : ''}
          onClick={() => setActiveTab('messages')}
        >
          💬 Messages
        </button>
        <button
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          🔔 Notifications
        </button>
      </div>

      {/* Content */}
      <div className="inbox-content">
        {activeTab === 'all' && <AllItems />}
        {activeTab === 'messages' && <Messages />}
        {activeTab === 'notifications' && <Notifications />}
      </div>
    </div>
  );
}
```

### Benefits
- Single location for all communications
- Reduced navigation complexity
- Better mobile experience
- Unified notification badge

---

## 7. Breadcrumbs

**Component**: `Breadcrumb`

### Implementation
```jsx
import Breadcrumb from '@/components/Breadcrumb';

function MarketplaceUSA() {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/seller-dashboard' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'USA' } // Current page (no href)
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      {/* Page content */}
    </div>
  );
}
```

### Examples

#### Seller Dashboard → Market → USA
```jsx
const items = [
  { label: 'Dashboard', href: '/seller-dashboard' },
  { label: 'Market', href: '/marketplace' },
  { label: 'USA' }
];
```

#### Dashboard → Orders → Order #1234
```jsx
const items = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Orders', href: '/orders' },
  { label: 'Order #1234' }
];
```

#### Dashboard → Settings → Verification
```jsx
const items = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Settings', href: '/settings' },
  { label: 'Verification' }
];
```

### Features
- Last item (current page) has no link
- Linked items turn blue on hover
- Separated by › chevron
- Mobile-responsive (wraps on small screens)

---

## 8. Deliveries Tab

**New Tab**: Separate "Deliveries" from "Marketplace"

### Purpose
- Marketplace: Browse and accept requests
- Deliveries: Manage active fulfillments

### Implementation
```jsx
import { TERMINOLOGY } from '@/lib/copy';

function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('marketplace');

  return (
    <div className="dashboard">
      <div className="tabs">
        <button
          className={activeTab === 'marketplace' ? 'active' : ''}
          onClick={() => setActiveTab('marketplace')}
        >
          🛍️ {TERMINOLOGY.marketplace}
        </button>
        <button
          className={activeTab === 'deliveries' ? 'active' : ''}
          onClick={() => setActiveTab('deliveries')}
        >
          📦 {TERMINOLOGY.deliveries}
        </button>
        <button
          className={activeTab === 'inbox' ? 'active' : ''}
          onClick={() => setActiveTab('inbox')}
        >
          💬 {TERMINOLOGY.inbox}
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'marketplace' && <Marketplace />}
        {activeTab === 'deliveries' && <Deliveries />}
        {activeTab === 'inbox' && <Inbox />}
      </div>
    </div>
  );
}
```

### Deliveries Tab Content
```jsx
function Deliveries() {
  const activeOrders = useActiveOrders();

  return (
    <div className="deliveries">
      <h2>Active Deliveries</h2>

      {activeOrders.map(order => (
        <OrderCard
          key={order.id}
          order={order}
          showActions={['upload-receipt', 'contact-buyer', 'mark-delivered']}
        />
      ))}

      {activeOrders.length === 0 && (
        <EmptyState
          icon="📦"
          title="No Active Deliveries"
          description="Accept requests from the marketplace to start delivering!"
          actionLabel="Browse Marketplace"
          onAction={() => router.push('/marketplace')}
        />
      )}
    </div>
  );
}
```

---

## 9. Active Trip Banner

**Component**: `ActiveTripBanner`

### Implementation
```jsx
import ActiveTripBanner from '@/components/ActiveTripBanner';

function GlobalHeader() {
  const activeTrip = useActiveTrip(); // Get from context or API

  return (
    <header>
      <Navbar />

      {/* Show banner if user has active trip */}
      {activeTrip && (
        <ActiveTripBanner
          from={activeTrip.from}        // "USA"
          to={activeTrip.to}            // "Manila"
          date={activeTrip.arrivalDate} // "Dec 15, 2024"
          onEdit={() => router.push('/edit-trip')}
        />
      )}
    </header>
  );
}
```

### Features
- Purple gradient background
- Shows origin → destination with flags
- Displays arrival date
- "Edit Trip" button (optional)
- Auto-hidden if no active trip

### Example in Layout
```jsx
// In layout.js or a global wrapper component
export default function SellerLayout({ children }) {
  const { activeTrip } = useSellerContext();

  return (
    <>
      <Navbar />

      {activeTrip && (
        <div className="container">
          <ActiveTripBanner
            from={activeTrip.origin}
            to={activeTrip.destination}
            date={activeTrip.arrival}
            onEdit={() => router.push('/trips/edit')}
          />
        </div>
      )}

      <main>{children}</main>

      <Footer />
    </>
  );
}
```

---

## 10. Role Toggle

**Component**: `RoleToggle`

### Implementation
```jsx
import RoleToggle from '@/components/RoleToggle';

// In Navbar or user menu:
function Navbar() {
  return (
    <nav>
      <div className="nav-left">
        <Logo />
      </div>

      <div className="nav-right">
        {/* Role toggle switch */}
        <RoleToggle />

        <UserMenu />
      </div>
    </nav>
  );
}
```

### Features
- Animated slider toggle
- Two modes: Buyer (🛒) and Traveler (✈️)
- Updates global `viewMode` in CartContext
- Color-coded: Blue for buyer, orange for traveler
- Smooth 300ms transition

### How It Works
```jsx
// Component uses CartContext
const { viewMode, setViewMode } = useCart();

// Toggle switches between:
// - 'buyer' (shopping mode)
// - 'seller' (traveler mode)
```

### Context Integration
Already integrated in `CartContext.js`:
```javascript
const [viewMode, setViewMode] = useState('buyer');

// Available throughout app:
const { viewMode, setViewMode } = useCart();
```

### Example: Conditional Content
```jsx
function Dashboard() {
  const { viewMode } = useCart();

  return (
    <div>
      {viewMode === 'buyer' ? (
        <BuyerDashboard />
      ) : (
        <SellerDashboard />
      )}
    </div>
  );
}
```

---

## Complete Integration Example

Here's a complete seller dashboard with all navigation improvements:

```jsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  Breadcrumb,
  RoleToggle,
  ActiveTripBanner,
  StickyMobileFooter,
  EmptyState
} from '@/components';
import { TERMINOLOGY, BUTTON_TEXT } from '@/lib/copy';

export default function SellerMarketplace() {
  const router = useRouter();
  const { viewMode } = useCart();
  const [requests, setRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/seller-dashboard' },
    { label: TERMINOLOGY.marketplace, href: '/marketplace' },
    { label: 'USA' }
  ];

  const potentialEarnings = acceptedRequests.reduce((sum, r) => sum + r.earnings, 0);

  const handleAcceptRequest = (request) => {
    setAcceptedRequests([...acceptedRequests, request]);
    setRequests(requests.filter(r => r.id !== request.id));
  };

  const handleNotifyMe = async () => {
    // Subscribe to notifications
    await subscribeToNotifications();
    alert('You\'ll be notified when new requests appear!');
  };

  return (
    <div>
      {/* Navigation */}
      <div className="header">
        <RoleToggle />
      </div>

      {/* Active Trip Banner */}
      <ActiveTripBanner
        from="USA"
        to="Manila"
        date="Dec 15, 2024"
        onEdit={() => router.push('/trips/edit')}
      />

      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Back button */}
      <button onClick={() => router.push('/seller-dashboard')}>
        {BUTTON_TEXT.secondary.backToDashboard}
      </button>

      {/* Content */}
      <h1>{TERMINOLOGY.marketplace} - USA</h1>

      {requests.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No Buyers Found"
          description="We'll notify you as soon as someone requests an item from USA."
          actionLabel="Browse Other Markets"
          onAction={() => router.push('/marketplace')}
          secondaryLabel={BUTTON_TEXT.primary.notifyMe}
          onSecondary={handleNotifyMe}
        />
      ) : (
        <div className="requests-grid">
          {requests.map(request => (
            <div key={request.id} className="request-card">
              <h3>{request.title}</h3>
              <p>₱{request.price}</p>
              <button onClick={() => handleAcceptRequest(request)}>
                {BUTTON_TEXT.primary.acceptRequest}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Sticky mobile footer */}
      <StickyMobileFooter
        earnings={potentialEarnings}
        itemCount={acceptedRequests.length}
        onAction={() => router.push('/fulfillment-list')}
        actionLabel={BUTTON_TEXT.primary.viewFulfillmentList}
      />
    </div>
  );
}
```

---

## Navigation Structure

### Before
```
Dashboard
├── Marketplace
├── Pasa Bag
├── Notifications
└── Messages
```

### After
```
Dashboard
├── Marketplace (browse requests)
├── Deliveries (active fulfillments)
├── Fulfillment List (accepted requests)
└── Inbox (notifications + messages)
```

---

## Quick Reference

| Old Term | New Term | Component/File |
|----------|----------|----------------|
| Pasa Bag | Fulfillment List | `TERMINOLOGY.pasaBag` |
| Add to Bag | Accept Request | `BUTTON_TEXT.primary.acceptRequest` |
| Notifications | Inbox | `TERMINOLOGY.inbox` |
| N/A | Deliveries Tab | `TERMINOLOGY.deliveries` |
| N/A | Breadcrumbs | `<Breadcrumb />` |
| N/A | Trip Banner | `<ActiveTripBanner />` |
| N/A | Role Toggle | `<RoleToggle />` |
| N/A | Empty States | `<EmptyState />` |
| N/A | Sticky Footer | `<StickyMobileFooter />` |

---

## File Locations

- **Components**:
  - `/src/components/Breadcrumb.js`
  - `/src/components/RoleToggle.js`
  - `/src/components/ActiveTripBanner.js`
  - `/src/components/StickyMobileFooter.js`
  - `/src/components/EmptyState.js`

- **Copywriting**: `/src/lib/copy.js`
- **Context**: `/src/context/CartContext.js`
- **This Guide**: `/NAVIGATION_GUIDE.md`

---

## Implementation Checklist

When updating navigation:

- [ ] Replace "Pasa Bag" with "Fulfillment List"
- [ ] Replace "Add to Bag" with "Accept Request"
- [ ] Add empty states with notification option
- [ ] Add sticky footer on marketplace (mobile)
- [ ] Add back buttons to sub-pages
- [ ] Consolidate notifications and messages
- [ ] Add breadcrumbs to nested pages
- [ ] Create separate Deliveries tab
- [ ] Show active trip banner when applicable
- [ ] Add role toggle in header/menu

---

**Remember**: Clear navigation = Happy users! Make every path intuitive. 🧭✨
