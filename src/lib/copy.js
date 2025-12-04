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
  travelerFee: "Traveler's service fee for bringing your item",

  // Marketplace Specific (NEW)
  deliveryLocation: 'Delivery Location',
  targetBuyPrice: 'Target Buy Price',
  estimatedWeight: 'Estimated Weight',
  neededBy: 'Needed by',
  urgentRequest: 'Urgent Request',
  bulkSelect: 'Bulk Select',
  bulkAccept: 'Accept All Selected',
  sortBy: 'Sort By',
  filterByRegion: 'Filter by Region',
  searchMarketplace: 'Search Marketplace',
  itemSpecs: 'Item Specifications',
  metroManila: 'Metro Manila',
  provinces: 'Provinces',

  // Fulfillment List Specific (NEW)
  fulfillmentList: 'Fulfillment List',
  toBuy: 'To Buy',
  purchased: 'Purchased',
  delivered: 'Delivered',
  removeItem: 'Remove Item',
  exportShoppingList: 'Export Shopping List',
  messageBuyer: 'Message Buyer',
  groupByBuyer: 'Group by Buyer',
  customsTracker: 'Customs De Minimis Tracker',
  deMinimisLimit: 'De Minimis Limit',
  pendingPayout: 'Pending Payout',
  payoutBreakdown: 'Payout Breakdown',
  meetup: 'Meetup',
  shipping: 'Shipping',
  markAsBought: 'Mark as Bought',

  // Dashboard Specific (NEW)
  projectedProfit: 'Projected Profit',
  registerTrip: 'Register Trip',
  withdrawFunds: 'Withdraw Funds',
  availableBalance: 'Available Balance',
  profileStrength: 'Profile Strength',
  sellerTier: 'Seller Tier Progress',
  weatherWidget: 'Weather',
  exchangeRates: 'Live Exchange Rates',
  motivationalGoal: 'Your Goal',
  vacationMode: 'Vacation Mode',

  // Trust & Verification (NEW)
  idVerification: 'ID Verification',
  faceVerification: 'Face Verification',
  verifiedSeller: 'Verified Seller',
  trustScore: 'Trust Score',
  buyerFeedback: 'Buyer Feedback',
  travelerPledge: 'Traveler Pledge',
  escrowProtection: 'Escrow Protection',
  reportIssue: 'Report an Issue',
  disputeCenter: 'Dispute Center',
  insuranceOptIn: 'Insurance Coverage',
  travelInsurance: 'Travel Insurance',
  payoutMethod: 'Payout Method',
  mobileVerification: 'Mobile Number Verification',
  languagesSpoken: 'Languages Spoken',
  membershipTier: 'Membership Tier',
  upgradeAccount: 'Upgrade Account'
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
    viewFulfillmentList: 'View Fulfillment List',
    // Marketplace actions (NEW)
    bulkAccept: 'Accept All Selected →',
    viewDetails: 'View Details',
    expandPhoto: 'Click to Expand',
    clearFilters: 'Clear All Filters',
    // Fulfillment actions (NEW)
    exportList: 'Export Shopping List',
    messageBuyer: 'Message Buyer',
    removeItem: 'Remove Item',
    markBought: 'Mark as Bought'
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
  rating: "Based on past successful deliveries and customer reviews.",

  // Marketplace Tooltips (NEW)
  targetBuyPrice: "The maximum budget the buyer is willing to pay. This is your guide for purchasing the item.",
  estimatedWeight: "Approximate weight to help you calculate luggage capacity and fees.",
  deliveryLocation: "Where the buyer wants the item delivered within the Philippines.",
  urgentRequest: "Buyer needs this item soon! Priority delivery requested.",
  bulkSelect: "Select multiple lightweight items to accept at once and maximize your earnings.",
  sortByProfit: "View requests organized by your potential profit amount.",
  regionFilter: "Filter requests by delivery area to find convenient drop-offs near you.",

  // Fulfillment Tooltips (NEW)
  customsDeMinimis: "Items valued at ₱10,000 or less are generally tax-free. Values above may incur 20-30% customs duties.",
  payoutBreakdown: "Your total payout includes the item's buy price plus your 10% service fee.",
  groupByBuyer: "Organize items by buyer to see all requests from the same person. Helpful for planning meetups!",
  exportShoppingList: "Download a printable checklist of all items you need to buy, organized by buyer.",
  statusProgression: "Track each item through the process: To Buy → Purchased → Delivered.",
  removeReason: "Let the buyer know why you can't fulfill this request. They'll receive a refund automatically.",
  deadlineWarning: "Items highlighted in red are due within 48 hours. Prioritize these!",
  markAsBought: "Check off items as you shop to track your progress. They'll show with a strikethrough."
};

// Helper function for time-based greetings
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return GREETINGS.goodMorning;
  if (hour < 18) return GREETINGS.goodAfternoon;
  return GREETINGS.goodEvening;
};
