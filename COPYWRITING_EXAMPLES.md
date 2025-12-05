# Copywriting & Tone Guide

This guide shows how to use the improved, humanized copy across the Pasa.ph application.

## 📦 Import Copy Constants

```javascript
import {
  TERMINOLOGY,
  BUTTON_TEXT,
  TOOLTIPS,
  MICROCOPY,
  EMPTY_STATES,
  formatCurrency
} from '@/lib/copy';
```

## ✅ Improved Copy Examples

### 1. Humanized Labels

**Before:** "Manage your account settings"
**After:** "Your Traveler Profile"

```javascript
<h1>{TERMINOLOGY.accountSettings}</h1>
// Output: "Your Traveler Profile"
```

### 2. Clear Question Format

**Before:** "Base City"
**After:** "Where do you live?"

```javascript
<label>{TERMINOLOGY.baseCity}</label>
// Output: "Where do you live?"
```

### 3. Action-Oriented Buttons

**Before:** "List Item"
**After:** "Publish Request"

```javascript
<button>{BUTTON_TEXT.primary.listItem}</button>
// Output: "Publish Request"

<button>{BUTTON_TEXT.primary.saveChanges}</button>
// Output: "Update Profile"
```

### 4. Microcopy for Privacy

**Before:** Just showing "Delivery Address" field
**After:** Adding reassuring microcopy

```javascript
<label>{TERMINOLOGY.deliveryAddress}</label>
<input type="text" placeholder="Your address" />
<small style={{ color: '#666', fontSize: '0.85rem' }}>
  {MICROCOPY.deliveryPrivacy}
</small>
// Output: "We only share this after purchase"
```

### 5. Onboarding Flow

**Before:** "How does Pasa.ph work?"
**After:** "Start here: Your First Trip"

```javascript
<Link href="/how-it-works">{TERMINOLOGY.howItWorks}</Link>
// Output: "Start here: Your First Trip"
```

### 6. Service Fee with Tooltip

**Before:** Just "Service Fee: ₱50"
**After:** Service Fee with info icon

```javascript
import { ServiceFeeLabel } from '@/components/InfoIcon';
import { formatCurrency } from '@/lib/copy';

<ServiceFeeLabel amount={formatCurrency(50)} />
// Displays: "Service Fee (10%) ?"
// Tooltip: "A 10% tip for the traveler who's shopping, carrying, and delivering..."
```

Or manual implementation:

```javascript
import InfoIcon from '@/components/InfoIcon';
import { TOOLTIPS } from '@/lib/copy';

<div>
  Service Fee (10%)
  <InfoIcon text={TOOLTIPS.serviceFee} position="top" size="sm" />
</div>
```

### 7. Regional Empty States

**Before:** "No active buyers found"
**After:** "Quiet day in USA"

```javascript
import EmptyState from '@/components/EmptyState';

<EmptyState
  type="no-buyers"
  region="USA"
  onWaitlist={(email, region) => console.log(`Waitlist: ${email} for ${region}`)}
/>
// Output title: "Quiet day in USA"
```

Or using EMPTY_STATES:

```javascript
import { EMPTY_STATES } from '@/lib/copy';

<p>{EMPTY_STATES.noBuyers('USA')}</p>
// Output: "Quiet day in USA"

<p>{EMPTY_STATES.noSellers('Japan')}</p>
// Output: "No travelers heading to Japan yet"
```

### 8. Support/Help Navigation

**Before:** "Support Center"
**After:** "Help & Disputes"

```javascript
<Link href="/support">{TERMINOLOGY.supportCenter}</Link>
// Output: "Help & Disputes"
```

### 9. Consistent Currency Formatting

**Before:** Mixed formats like "PHP 500", "₱500.00", "500 pesos"
**After:** Consistent ₱500 format

```javascript
import { formatCurrency } from '@/lib/copy';

// Basic usage
formatCurrency(500)
// Output: "₱500"

// With decimals
formatCurrency(1500, { showDecimals: true })
// Output: "₱1,500.00"

// Compact notation
formatCurrency(1500000, { compact: true })
// Output: "₱1.5M"

// Large numbers with commas
formatCurrency(25000)
// Output: "₱25,000"

// Parse from string
formatCurrency("PHP 1,500")
// Output: "₱1,500"
```

## 🎯 Complete Usage Examples

### Profile Settings Page

```javascript
'use client';

import { TERMINOLOGY, BUTTON_TEXT, MICROCOPY } from '@/lib/copy';
import InfoIcon from '@/components/InfoIcon';

export default function ProfileSettings() {
  return (
    <div>
      <h1>{TERMINOLOGY.accountSettings}</h1>
      {/* Output: "Your Traveler Profile" */}

      <div>
        <label>{TERMINOLOGY.baseCity}</label>
        {/* Output: "Where do you live?" */}
        <input type="text" placeholder="e.g., Manila" />
      </div>

      <div>
        <label>{TERMINOLOGY.deliveryAddress}</label>
        <input type="text" placeholder="Your address" />
        <small>{MICROCOPY.deliveryPrivacy}</small>
        {/* Output: "We only share this after purchase" */}
      </div>

      <button className="btn-primary">
        {BUTTON_TEXT.primary.updateProfile}
      </button>
      {/* Output: "Update Profile" */}
    </div>
  );
}
```

### Checkout Summary with Service Fee

```javascript
'use client';

import { formatCurrency, TOOLTIPS } from '@/lib/copy';
import { ServiceFeeLabel } from '@/components/InfoIcon';

export default function CheckoutSummary({ subtotal, serviceFee, total }) {
  return (
    <div className="summary-box">
      <div className="summary-box-item">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <ServiceFeeLabel amount={formatCurrency(serviceFee)} />
      {/* Includes tooltip explaining the 10% fee */}

      <div className="summary-box-item">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
```

### Marketplace Empty State

```javascript
'use client';

import EmptyState from '@/components/EmptyState';

export default function MarketplacePage() {
  const [requests, setRequests] = useState([]);
  const userRegion = 'Japan';

  if (requests.length === 0) {
    return (
      <EmptyState
        type="no-buyers"
        region={userRegion}
        suggestions={['South Korea', 'Singapore', 'Hong Kong']}
        onWaitlist={(email, region) => {
          // Save to waitlist
          console.log(`${email} waiting for ${region}`);
        }}
      />
    );
    // Title: "Quiet day in Japan"
    // Description: "No shoppers requesting items from Japan right now..."
    // Suggestions: South Korea, Singapore, Hong Kong chips
  }

  return <div>{/* Render requests */}</div>;
}
```

### Navigation Links

```javascript
'use client';

import Link from 'next/link';
import { TERMINOLOGY } from '@/lib/copy';

export default function Navbar() {
  return (
    <nav>
      <Link href="/how-it-works">{TERMINOLOGY.howItWorks}</Link>
      {/* Output: "Start here: Your First Trip" */}

      <Link href="/support">{TERMINOLOGY.supportCenter}</Link>
      {/* Output: "Help & Disputes" */}

      <Link href="/marketplace">{TERMINOLOGY.marketplace}</Link>
      {/* Output: "Marketplace" */}
    </nav>
  );
}
```

## 📊 All Available Copy Constants

### TERMINOLOGY (Nouns & Labels)

- `accountSettings` - "Your Traveler Profile"
- `baseCity` - "Where do you live?"
- `listItem` - "Publish Request"
- `saveChanges` - "Update Profile"
- `supportCenter` - "Help & Disputes"
- `howItWorks` - "Start here: Your First Trip"
- `serviceFee` - "Traveler's Tip"

### BUTTON_TEXT (CTAs)

- `primary.listItem` - "Publish Request"
- `primary.updateProfile` - "Update Profile"
- `primary.saveChanges` - "Update Profile"

### EMPTY_STATES (Functions)

- `noBuyers(region)` - "Quiet day in {region}"
- `noSellers(region)` - "No travelers heading to {region} yet"
- `noRequests` - "Take a break - no new requests"
- `quietDay` - "Quiet day here - check back soon!"

### MICROCOPY (Hints & Privacy)

- `deliveryPrivacy` - "We only share this after purchase"
- `securePayment` - "Your payment is protected by escrow"
- `verifiedBadge` - "ID and phone verified"
- `responseTime` - "Usually responds in 1 hour"

### TOOLTIPS (Explanations)

- `serviceFee` - Full explanation of 10% tip
- `serviceFeeShort` - "10% tip for the traveler's time and effort"
- `escrow` - Payment protection explanation
- `pasabuy` - What pasabuy means

## 🎨 Currency Formatting

```javascript
// Always use formatCurrency for consistency
formatCurrency(500)           // ₱500
formatCurrency(1500.50)       // ₱1,501 (rounds by default)
formatCurrency(1500.50, { showDecimals: true })  // ₱1,500.50
formatCurrency(1000000, { compact: true })       // ₱1.0M
formatCurrency("PHP 1,500")   // ₱1,500 (parses strings)
formatCurrency("1500")        // ₱1,500
```

## ✨ Best Practices

1. **Always use constants** instead of hardcoding copy
2. **Add InfoIcon** next to technical terms like "Service Fee"
3. **Use regional context** in empty states when available
4. **Format currency consistently** with `formatCurrency()`
5. **Add microcopy** for privacy-sensitive fields
6. **Use action verbs** in button text ("Publish", "Update", not "Save")
7. **Make copy conversational** ("Quiet day" vs "No results")
8. **Provide alternatives** in empty states (suggestions)
9. **Explain fees upfront** with tooltips
10. **Use Filipino-English mix** where natural (from existing TERMINOLOGY)

## 🔄 Migration Checklist

- [ ] Replace "Manage account settings" → `TERMINOLOGY.accountSettings`
- [ ] Replace "Base City" → `TERMINOLOGY.baseCity`
- [ ] Replace "List Item" button → `BUTTON_TEXT.primary.listItem`
- [ ] Add `MICROCOPY.deliveryPrivacy` under delivery address fields
- [ ] Replace "How it works" → `TERMINOLOGY.howItWorks`
- [ ] Add `<InfoIcon>` next to service fee displays
- [ ] Update empty states with regional context
- [ ] Replace "Save Changes" → `BUTTON_TEXT.primary.updateProfile`
- [ ] Replace "Support Center" → `TERMINOLOGY.supportCenter`
- [ ] Convert all prices to `formatCurrency(amount)`
