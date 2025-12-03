# Pasa.ph Copywriting & Tone Guide

## Core Philosophy
**Friendly, Filipino-first, Action-oriented**

We use warm, conversational language that reflects Filipino hospitality while remaining clear and helpful.

---

## 1. Terminology Changes

### Before → After

| Old Term | New Term | Rationale |
|----------|----------|-----------|
| **Sellers** | **Travelers** | Emphasizes the service of bringing items from abroad |
| **Pre-order** | **Pasabuy Request** | Uses familiar Filipino term, more descriptive |
| **Out of Stock** | **Trip Ended** | Less commercial, more personal |
| **Service Fee** | **Traveler's Tip** or **Traveler's Fee** | Clarifies what the fee is for |
| **Buy Now** | **Get it!** or **Book it!** | More action-oriented |
| **Add to Cart** | **Get it!** | Simpler, more decisive |

---

## 2. Localized Greetings 🇵🇭

Use Filipino greetings throughout the app:

- **Welcome**: "Mabuhay! Welcome to Pasa.ph"
- **Welcome Back**: "Kumusta! Welcome back"
- **Morning**: "Magandang umaga!"
- **Afternoon**: "Magandang hapon!"
- **Evening**: "Magandang gabi!"

### Implementation
```javascript
import { getTimeBasedGreeting } from '@/lib/copy';

// In your component
<h1>{getTimeBasedGreeting()}</h1>
```

---

## 3. Friendly Error Messages

Never use cold, technical error messages. Always be warm and helpful:

### Examples

| Situation | Message |
|-----------|---------|
| **404 Not Found** | "Oops! We couldn't find that. 😅" |
| **Server Error** | "Naku! Something went wrong. Please try again." |
| **Network Error** | "Ay! Check your internet connection." |
| **Unauthorized** | "Oops! Please log in first." |
| **Invalid Input** | "Hmm, that doesn't look right. Try again?" |
| **Empty Cart** | "Your cart is empty. Let's shop! 🛍️" |

### Implementation
```javascript
import { ERROR_MESSAGES } from '@/lib/copy';

// In your error handling
setError(ERROR_MESSAGES.notFound);
```

---

## 4. Action Verbs on Buttons

Make buttons action-oriented and exciting:

### Button Text Guidelines

| Context | Button Text |
|---------|-------------|
| **Add to Cart** | "Get it!" |
| **Checkout** | "Book it now!" |
| **Buy** | "Buy this!" |
| **Request Item** | "Request this!" |
| **Message** | "Chat with Traveler" |
| **Track** | "Track My Order" |
| **Shop** | "Start Shopping!" |

### Implementation
```javascript
import { BUTTON_TEXT } from '@/lib/copy';

<button>{BUTTON_TEXT.primary.addToCart}</button>
```

---

## 5. Service Fee Clarification

**Old**: "Service Fee (10%)"
**New**: "Traveler's Tip (10%)" or "Traveler's Fee (10%)"

### With Tooltip
Use tooltip to explain:

```javascript
import Tooltip from '@/components/Tooltip';
import { TOOLTIPS } from '@/lib/copy';

<Tooltip text={TOOLTIPS.serviceFee}>
  <span>Traveler's Tip (10%) ℹ️</span>
</Tooltip>
```

**Tooltip Text**: "A small tip (10%) for the traveler who's bringing your item all the way from abroad."

---

## 6. Tooltips for Confusing Terms

Add helpful tooltips for jargon:

### Key Terms Needing Tooltips

| Term | Tooltip Text |
|------|--------------|
| **Pasabuy** | "Pasabuy means 'please buy for me'. A traveler going abroad buys items and brings them back for you - no markup, just a small tip!" |
| **Escrow** | "We hold payment until you receive your item. Safe and secure!" |
| **Traveler's Fee** | "A small tip (10%) for the traveler who's bringing your item all the way from abroad." |
| **Verification** | "Verified travelers have confirmed their ID, phone, and email." |

### Implementation
```javascript
import Tooltip from '@/components/Tooltip';
import { TOOLTIPS } from '@/lib/copy';

<Tooltip text={TOOLTIPS.pasabuy}>
  <span>What is Pasabuy? ℹ️</span>
</Tooltip>
```

---

## 7. Email Subject Lines

Make emails exciting and personal:

| Event | Subject Line |
|-------|--------------|
| **Order Confirmed** | "✈️ Your item is flying to you!" |
| **Item Shipped** | "📦 Your package is on the way!" |
| **Item Delivered** | "🎉 Your order has arrived!" |
| **Order Cancelled** | "Trip cancelled - Full refund issued" |
| **New Message** | "💬 New message from your traveler" |
| **Review Request** | "⭐ How was your experience?" |

### Implementation
```javascript
import { EMAIL_SUBJECTS } from '@/lib/copy';

// In your email service
sendEmail({
  subject: EMAIL_SUBJECTS.orderConfirmed,
  //...
});
```

---

## 8. Order Confirmation with Celebration

Show a celebratory modal when order is placed successfully.

### Features
- Confetti animation
- Filipino greeting: "Salamat! Order Received! 🇵🇭"
- Bouncing emoji
- Order number display
- Positive messaging: "Your order is flying to you! ✈️"

### Implementation
```javascript
import OrderConfirmation from '@/components/OrderConfirmation';

const [showConfirmation, setShowConfirmation] = useState(false);
const [orderId, setOrderId] = useState(null);

// After successful order
setOrderId(response.orderId);
setShowConfirmation(true);

// In JSX
<OrderConfirmation
  orderId={orderId}
  show={showConfirmation}
  onClose={() => setShowConfirmation(false)}
/>
```

---

## 9. Success Messages

Always celebrate user actions:

| Action | Message |
|--------|---------|
| **Order Placed** | "Salamat! Your order is flying to you! ✈️" |
| **Item Added** | "Added to cart! 🎉" |
| **Profile Updated** | "Profile updated! Looking good! ✨" |
| **Review Submitted** | "Thank you for your feedback! 🙏" |
| **Message Sent** | "Message sent! 💬" |

---

## 10. Status Terminology

| Old | New | Why |
|-----|-----|-----|
| **Pending** | **On the way** | More descriptive |
| **Cancelled** | **Trip Cancelled** | Matches traveler theme |
| **Out of Stock** | **Trip Ended** | Less commercial |

---

## Usage Examples

### Complete Example: Product Card
```javascript
import Tooltip from '@/components/Tooltip';
import { BUTTON_TEXT, TOOLTIPS } from '@/lib/copy';

<div className="product-card">
  <h3>{product.title}</h3>
  <p>₱{product.price}</p>

  <Tooltip text={TOOLTIPS.pasabuy}>
    <span>ℹ️ What is Pasabuy?</span>
  </Tooltip>

  <button onClick={addToCart}>
    {BUTTON_TEXT.primary.addToCart}
  </button>
</div>
```

### Complete Example: Error Handling
```javascript
import { ERROR_MESSAGES } from '@/lib/copy';

try {
  await fetchData();
} catch (error) {
  if (error.status === 404) {
    setError(ERROR_MESSAGES.notFound);
  } else if (error.status === 500) {
    setError(ERROR_MESSAGES.serverError);
  } else {
    setError(ERROR_MESSAGES.networkError);
  }
}
```

---

## Component Library

### Available Components

1. **Tooltip** (`@/components/Tooltip`)
   - Position: top, bottom, left, right
   - Auto-positioning
   - Mobile-friendly (tap to show)

2. **OrderConfirmation** (`@/components/OrderConfirmation`)
   - Confetti animation
   - Auto-dismiss after 5s
   - Celebratory design

### Available Constants

Import from `@/lib/copy`:
- `GREETINGS` - Localized Filipino greetings
- `TERMINOLOGY` - Core term replacements
- `ERROR_MESSAGES` - Friendly error texts
- `SUCCESS_MESSAGES` - Celebration messages
- `EMAIL_SUBJECTS` - Email subject lines
- `BUTTON_TEXT` - Action-oriented button labels
- `TOOLTIPS` - Helpful explanations
- `getTimeBasedGreeting()` - Function for time-based greetings

---

## Quick Reference

### Do's ✅
- Use Filipino greetings (Mabuhay, Kumusta)
- Be warm and friendly
- Use action verbs
- Add emojis for warmth
- Explain confusing terms
- Celebrate successes
- Use "Traveler" instead of "Seller"

### Don'ts ❌
- Don't use cold, technical language
- Don't leave users confused
- Don't hide fees or terms
- Don't use negative language
- Don't be too formal
- Don't forget tooltips for jargon

---

## File Locations

- **Copy Constants**: `/src/lib/copy.js`
- **Tooltip Component**: `/src/components/Tooltip.js`
- **Order Confirmation**: `/src/components/OrderConfirmation.js`
- **This Guide**: `/COPYWRITING_GUIDE.md`

---

## Implementation Checklist

When adding new features, always:

- [ ] Use terminology from `/src/lib/copy.js`
- [ ] Add tooltips for complex terms
- [ ] Use action verbs on buttons
- [ ] Add friendly error messages
- [ ] Include success celebrations
- [ ] Use Filipino greetings where appropriate
- [ ] Test on mobile (tooltips should be tappable)

---

**Remember**: Every word is an opportunity to make users feel welcome and empowered! 🇵🇭✨
