// Copywriting Constants - Friendly, Filipino-first tone

export const GREETINGS = {
  welcome: 'Mabuhay! Welcome to Pasa.ph',
  welcomeBack: 'Kumusta! Welcome back',
  goodMorning: 'Magandang umaga!',
  goodAfternoon: 'Magandang hapon!',
  goodEvening: 'Magandang gabi!'
};

export const TERMINOLOGY = {
  // Core Terms
  seller: 'Traveler',
  sellers: 'Travelers',
  buyer: 'Shopper',
  buyers: 'Shoppers',
  preorder: 'Pasabuy Request',
  preorders: 'Pasabuy Requests',
  outOfStock: 'Trip Ended',
  inStock: 'Available',
  serviceFee: "Traveler's Tip",
  serviceFeeAlt: "Traveler's Fee",

  // Navigation Terms (NEW)
  pasaBag: 'Fulfillment List',
  addToBag: 'Accept Request',
  myOrders: 'My Orders',
  marketplace: 'Marketplace',
  deliveries: 'Deliveries',
  inbox: 'Inbox',
  dashboard: 'Dashboard',

  // Actions
  addToCart: 'Get it!',
  buy: 'Book it!',
  checkout: 'Confirm Order',
  request: 'Request this!',
  message: 'Message Traveler',
  track: 'Track My Order',
  acceptRequest: 'Accept Request',
  backToDashboard: 'Back to Dashboard',
  notifyMe: 'Notify me when buyers appear',

  // Status
  pending: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Trip Cancelled',
  confirmed: 'Confirmed',

  // Pasabuy Specific
  pasabuy: 'Pasabuy',
  pasabuyExplain: 'Someone traveling abroad buys and brings items for you',
  travelerFee: "Traveler's service fee for bringing your item"
};

export const ERROR_MESSAGES = {
  notFound: "Oops! We couldn't find that. 😅",
  serverError: "Naku! Something went wrong. Please try again.",
  networkError: "Ay! Check your internet connection.",
  unauthorized: "Oops! Please log in first.",
  invalidInput: "Hmm, that doesn't look right. Try again?",
  emptyCart: "Your cart is empty. Let's shop! 🛍️",
  paymentFailed: "Payment didn't go through. Want to try again?",
  orderFailed: "Order couldn't be placed. Don't worry, try again! 💪"
};

export const SUCCESS_MESSAGES = {
  orderPlaced: 'Salamat! Your order is flying to you! ✈️',
  itemAdded: 'Added to cart! 🎉',
  profileUpdated: 'Profile updated! Looking good! ✨',
  reviewSubmitted: 'Thank you for your feedback! 🙏',
  messageSent: 'Message sent! 💬'
};

export const EMAIL_SUBJECTS = {
  orderConfirmed: '✈️ Your item is flying to you!',
  itemShipped: '📦 Your package is on the way!',
  itemDelivered: '🎉 Your order has arrived!',
  orderCancelled: 'Trip cancelled - Full refund issued',
  messageReceived: '💬 New message from your traveler',
  reviewRequest: '⭐ How was your experience?'
};

export const BUTTON_TEXT = {
  primary: {
    shop: 'Start Shopping!',
    addToCart: 'Get it!',
    checkout: 'Book it now!',
    buy: 'Buy this!',
    request: 'Request this!',
    message: 'Chat with Traveler',
    track: 'Track Order',
    cancel: 'Cancel Trip',
    acceptRequest: 'Accept Request',
    notifyMe: 'Notify me',
    viewFulfillmentList: 'View Fulfillment List'
  },
  secondary: {
    viewMore: 'See more',
    viewAll: 'View all',
    learnMore: 'Learn more',
    goBack: 'Go back',
    close: 'Close',
    backToDashboard: '← Back to Dashboard'
  }
};

export const TOOLTIPS = {
  pasabuy: "Pasabuy means 'please buy for me'. A traveler going abroad buys items and brings them back for you - no markup, just a small tip!",
  escrow: "We hold payment until you receive your item. Safe and secure!",
  serviceFee: "A small tip (10%) for the traveler who's bringing your item all the way from abroad.",
  verification: "Verified travelers have confirmed their ID, phone, and email.",
  rating: "Based on past successful deliveries and customer reviews."
};

// Helper function for time-based greetings
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return GREETINGS.goodMorning;
  if (hour < 18) return GREETINGS.goodAfternoon;
  return GREETINGS.goodEvening;
};
