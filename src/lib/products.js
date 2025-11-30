export const POPULAR_PRODUCTS = [
  // --- FOOD ---
  {
    id: 'p1',
    title: 'Premium Confectionery',
    category: 'Food',
    images: [
        'https://placehold.co/600x600/fff3e0/e65100?text=Japanese+Chocolates+1',
        'https://placehold.co/600x600/fff3e0/e65100?text=Japanese+Snacks+2',
        'https://placehold.co/600x600/fff3e0/e65100?text=Japanese+Sweets+3'
    ],
    from: 'Japan',
    requests: 45,
    sellers: 12,
    isHot: true,
    price: 75,
    estimatedDelivery: '3-5 Days',
    topSellers: ['KikoJapz', 'TokyoTreats', 'PasabuyMnl']
  },
  {
    id: 'p3',
    title: 'Irvins Salted Egg',
    category: 'Food',
    image: 'https://placehold.co/400x400/ffeb3b/000000?text=Irvins',
    from: 'Singapore',
    requests: 30,
    sellers: 8,
    isHot: false,
    price: 650,
    estimatedDelivery: '5-7 Days',
    topSellers: ['SG_Finds', 'LionCityShopper']
  },
  { id: 'p4', title: 'Trader Joes Speculoos', category: 'Food', image: 'https://placehold.co/400x400/d32f2f/ffffff?text=Speculoos', from: 'USA', requests: 25, sellers: 5, isHot: false, price: 500, estimatedDelivery: '10-14 Days', topSellers: ['USADirect'] },
  { id: 'p5', title: 'Jenny Bakery Cookies', category: 'Food', image: 'https://placehold.co/400x400/fafafa/333?text=Jenny+Bakery', from: 'Hong Kong', requests: 15, sellers: 3, isHot: false, price: 1800, estimatedDelivery: '4-6 Days', topSellers: ['HK_Treats'] },
  
  // --- BEAUTY ---
  { 
    id: 'p6', 
    title: 'Glossier You Perfume', 
    category: 'Beauty', 
    // Changed 'image' to 'images' array
    images: [
        'https://placehold.co/600x600/fce4ec/c2185b?text=Glossier+1',
        'https://placehold.co/600x600/fce4ec/c2185b?text=Glossier+2',
        'https://placehold.co/600x600/fce4ec/c2185b?text=Glossier+3'
    ],
    from: 'USA', 
    requests: 120, 
    sellers: 15, 
    isHot: true, 
    price: 4500, 
    estimatedDelivery: '10-12 Days', 
    topSellers: ['BeautyMnl_Proxy', 'SephoraHunter'] 
  },
  { id: 'p7', title: 'The Ordinary Set', category: 'Beauty', image: 'https://placehold.co/400x400/ffffff/000?text=The+Ordinary', from: 'USA', requests: 55, sellers: 10, isHot: true, price: 2200, estimatedDelivery: '10-12 Days', topSellers: ['SkincareJunkie'] },
  { id: 'p8', title: 'Laneige Lip Mask', category: 'Beauty', image: 'https://placehold.co/400x400/f48fb1/ffffff?text=Laneige', from: 'South Korea', requests: 40, sellers: 18, isHot: false, price: 850, estimatedDelivery: '5-8 Days', topSellers: ['K_BeautyHub'] },
  {
    id: 'p9',
    title: 'Melano CC Premium',
    category: 'Beauty',
    images: [
        'https://placehold.co/600x600/fff176/fbc02d?text=Melano+CC+1',
        'https://placehold.co/600x600/fff176/fbc02d?text=Melano+CC+2',
        'https://placehold.co/600x600/fff176/fbc02d?text=Melano+CC+3'
    ],
    from: 'Japan',
    requests: 35,
    sellers: 22,
    isHot: false,
    price: 750,
    estimatedDelivery: '3-5 Days',
    topSellers: ['JapanSkincare', 'BeautyMnl']
  },
  {
    id: 'p9a',
    title: 'Anessa UV Milk',
    category: 'Beauty',
    images: [
        'https://placehold.co/600x600/4fc3f7/ffffff?text=Anessa+1',
        'https://placehold.co/600x600/4fc3f7/ffffff?text=Anessa+2'
    ],
    from: 'Japan',
    requests: 28,
    sellers: 15,
    isHot: true,
    price: 1350,
    estimatedDelivery: '3-5 Days',
    topSellers: ['JapanSkincare', 'SunCarePH']
  },
  {
    id: 'p9b',
    title: 'Canmake Cosmetics',
    category: 'Beauty',
    images: [
        'https://placehold.co/600x600/fce4ec/c2185b?text=Canmake+1',
        'https://placehold.co/600x600/fce4ec/c2185b?text=Canmake+2'
    ],
    from: 'Japan',
    requests: 42,
    sellers: 18,
    isHot: false,
    price: 600,
    estimatedDelivery: '3-5 Days',
    topSellers: ['JapanMakeup', 'KawaiiBeauty']
  },
  {
    id: 'p9c',
    title: 'Fino / Tsubaki Hair Mask',
    category: 'Beauty',
    images: [
        'https://placehold.co/600x600/fff9c4/f57f17?text=Hair+Mask+1',
        'https://placehold.co/600x600/fff9c4/f57f17?text=Hair+Mask+2'
    ],
    from: 'Japan',
    requests: 30,
    sellers: 12,
    isHot: false,
    price: 450,
    estimatedDelivery: '3-5 Days',
    topSellers: ['JapanHairCare', 'BeautyEssentials']
  },
  {
    id: 'p9d',
    title: 'DHC Collagen (60 Days)',
    category: 'Beauty',
    images: [
        'https://placehold.co/600x600/ffebee/c62828?text=DHC+1',
        'https://placehold.co/600x600/ffebee/c62828?text=DHC+2'
    ],
    from: 'Japan',
    requests: 38,
    sellers: 16,
    isHot: true,
    price: 850,
    estimatedDelivery: '3-5 Days',
    topSellers: ['SupplementsPH', 'HealthJapan']
  },
  { id: 'p10', title: 'Ellips Hair Vitamins', category: 'Beauty', image: 'https://placehold.co/400x400/e91e63/ffffff?text=Ellips', from: 'Indonesia', requests: 20, sellers: 5, isHot: false, price: 450, estimatedDelivery: '7-10 Days', topSellers: ['IndoGlow'] },

  // --- ELECTRONICS ---
  { 
    id: 'p11', 
    title: 'iPhone 15 Pro', 
    category: 'Electronics', 
    // Changed 'image' to 'images' array
    images: [
        'https://placehold.co/600x600/212121/ffffff?text=iPhone+15+Pro+1',
        'https://placehold.co/600x600/212121/ffffff?text=iPhone+15+Pro+2',
        'https://placehold.co/600x600/212121/ffffff?text=iPhone+15+Pro+3'
    ],
    from: 'USA', 
    requests: 200, 
    sellers: 4, 
    isHot: true, 
    price: 65000, 
    estimatedDelivery: '10-15 Days', 
    topSellers: ['AppleTrust'] 
  },
  { id: 'p12', title: 'Kindle Paperwhite', category: 'Electronics', image: 'https://placehold.co/400x400/000000/ffffff?text=Kindle', from: 'USA', requests: 45, sellers: 6, isHot: true, price: 8000, estimatedDelivery: '10-15 Days', topSellers: ['TechReader'] },
  {
    id: 'p13',
    title: 'Instax Film (20s Twin Pack)',
    category: 'Electronics',
    images: [
        'https://placehold.co/600x600/81d4fa/ffffff?text=Instax+Film+1',
        'https://placehold.co/600x600/81d4fa/ffffff?text=Instax+Film+2'
    ],
    from: 'Japan',
    requests: 30,
    sellers: 8,
    isHot: false,
    price: 950,
    estimatedDelivery: '5-7 Days',
    topSellers: ['CamGeek', 'PhotoSupplies']
  },

  // --- CLOTHING ---
  {
    id: 'p14',
    title: 'Onitsuka Tiger Mexico 66',
    category: 'Clothing',
    images: [
        'https://placehold.co/600x600/ffffff/1565c0?text=Onitsuka+Tiger+1',
        'https://placehold.co/600x600/ffffff/1565c0?text=Onitsuka+Tiger+2',
        'https://placehold.co/600x600/ffffff/1565c0?text=Onitsuka+Tiger+3'
    ],
    from: 'Japan',
    requests: 52,
    sellers: 10,
    isHot: true,
    price: 7500,
    estimatedDelivery: '5-7 Days',
    topSellers: ['SneakerHeadPH', 'JapanFashion']
  },

  // --- OTHER ---
  {
    id: 'p15',
    title: 'Issey Miyake Bao Bao',
    category: 'Other',
    images: [
        'https://placehold.co/600x600/212121/ffffff?text=Issey+Miyake+1',
        'https://placehold.co/600x600/212121/ffffff?text=Issey+Miyake+2',
        'https://placehold.co/600x600/212121/ffffff?text=Issey+Miyake+3'
    ],
    from: 'Japan',
    requests: 18,
    sellers: 6,
    isHot: false,
    price: 22500,
    estimatedDelivery: '7-10 Days',
    topSellers: ['LuxuryJP', 'DesignerBagsPH']
  },
  {
    id: 'p15a',
    title: 'Rohto Eye Drops',
    category: 'Other',
    images: [
        'https://placehold.co/600x600/e3f2fd/0277bd?text=Rohto+1',
        'https://placehold.co/600x600/e3f2fd/0277bd?text=Rohto+2'
    ],
    from: 'Japan',
    requests: 44,
    sellers: 20,
    isHot: false,
    price: 250,
    estimatedDelivery: '3-5 Days',
    topSellers: ['PharmaPH', 'JapanHealth']
  },

  // --- LOCAL (Bulacan/Pampanga) ---
  { 
    id: 'p16', 
    title: 'Good Shepherd Ube', 
    category: 'Food', 
    // Changed 'image' to 'images' array
    images: [
        'https://placehold.co/600x600/7b1fa2/ffffff?text=Ube+Jam+1',
        'https://placehold.co/600x600/7b1fa2/ffffff?text=Ube+Jam+2'
    ],
    from: 'Pampanga', 
    requests: 90, 
    sellers: 25, 
    isHot: true, 
    price: 450, 
    estimatedDelivery: '1-2 Days', 
    topSellers: ['PampangaBest'] 
  },
  { id: 'p17', title: 'Eurobake Inipit', category: 'Food', image: 'https://placehold.co/400x400/ffcc80/e65100?text=Inipit', from: 'Bulacan', requests: 50, sellers: 15, isHot: false, price: 300, estimatedDelivery: '1-2 Days', topSellers: ['BulacanTreats'] },
  { id: 'p18', title: 'Sasmuan Polvoron', category: 'Food', image: 'https://placehold.co/400x400/fff9c4/fbc02d?text=Polvoron', from: 'Pampanga', requests: 40, sellers: 10, isHot: false, price: 500, estimatedDelivery: '1-2 Days', topSellers: ['SweetPampanga'] },
  { id: 'p19', title: 'Pastillas de Leche', category: 'Food', image: 'https://placehold.co/400x400/ffffff/333?text=Pastillas', from: 'Bulacan', requests: 65, sellers: 20, isHot: true, price: 250, estimatedDelivery: '1-2 Days', topSellers: ['PastillasQueen'] },
  { id: 'p20', title: 'Aling Lucing Sisig', category: 'Food', image: 'https://placehold.co/400x400/3e2723/ffffff?text=Sisig+Frozen', from: 'Pampanga', requests: 35, sellers: 5, isHot: false, price: 600, estimatedDelivery: '1-2 Days', topSellers: ['SisigExpress'] },
];