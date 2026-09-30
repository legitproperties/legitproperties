import { Property } from '../types';

/**
 * Curated initial properties covering short stays across all 7 Nigerian cities
 * and verified properties for sale. Live additions from Supabase will dynamically merge or override.
 */
export const INITIAL_PROPERTIES: Property[] = [
  // 1. Short Stay: Lagos
  {
    id: 'lag-short-01',
    title: 'The Skyview Waterfront Penthouse & Infinity Pool',
    slug: 'skyview-waterfront-penthouse-ikoyi',
    type: 'short_stay',
    listing_type: 'short_stay',
    price_unit: 'per_night',
    category: 'short_stay',
    purpose: 'Vacation & Short Stay',
    location: {
      address: 'Admiralty Way, Ikoyi',
      neighborhood: 'Ikoyi Waterfront',
      city: 'Lagos',
      state: 'Lagos State'
    },
    priceNgn: 185000,
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 210,
    titleStatus: 'Short Stay Verified License',
    titleVerified: true,
    verificationDocNo: 'LEGIT/LAG/STAY/2026/01',
    developerInfo: {
      name: 'Legit Verified Luxury Host',
      trackRecord: 'Superhost 5-Star Rating',
      verifiedStatus: 'Audited & Inspected'
    },
    featured: true,
    property_image: '/src/assets/images/hero_shortstay_lagos_1790768196208.jpg',
    images: [
      '/src/assets/images/hero_shortstay_lagos_1790768196208.jpg',
      '/src/assets/images/hero_luxury_interior_1790768220829.jpg',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Ultra-luxury waterfront short stay overlooking the five cowries creek. Features 24/7 dual soundproof power backup, private chef station, gigabit fiber Wi-Fi, and Olympic infinity pool.',
    features: ['24/7 Power', 'Infinity Pool', 'Lagoon View', 'High-Speed Fiber', 'Chef on Call'],
    amenities: ['Air Conditioning', 'Smart Home Controls', 'Netflix 4K', 'Dedicated Parking'],
    nearbyLandmarks: ['Ikoyi Club', 'Victoria Island Hub', 'Lekki Toll Link'],
    paymentPlan: { available: false, minDownpaymentPercent: 100, maxTenorMonths: 0 },
    dateAdded: '2026-09-20',
    verificationNotes: 'Physical safety audit and hospitality license cleared.',
    whatsappNumber: '+2348030000000',
    callNumber: '+2348030000000',
    property_availability: 'available'
  },

  // 2. Short Stay: Abuja
  {
    id: 'abj-short-01',
    title: 'The Diplomatic Villa & Private Terrace Garden',
    slug: 'diplomatic-villa-maitama-abuja',
    type: 'short_stay',
    listing_type: 'short_stay',
    price_unit: 'per_night',
    category: 'short_stay',
    purpose: 'Vacation & Short Stay',
    location: {
      address: 'Amazon Street, Maitama',
      neighborhood: 'Maitama Diplomatic Zone',
      city: 'Abuja',
      state: 'Federal Capital Territory'
    },
    priceNgn: 220000,
    bedrooms: 3,
    bathrooms: 3,
    sizeSqm: 320,
    titleStatus: 'Short Stay Verified License',
    titleVerified: true,
    verificationDocNo: 'LEGIT/ABJ/STAY/2026/02',
    developerInfo: {
      name: 'Diplomatic Suites Management',
      trackRecord: 'Embassy Approved',
      verifiedStatus: 'Security Certified'
    },
    featured: true,
    property_image: '/src/assets/images/hero_shortstay_abuja_1790768208820.jpg',
    images: [
      '/src/assets/images/hero_shortstay_abuja_1790768208820.jpg',
      '/src/assets/images/hero_luxury_interior_1790768220829.jpg',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Immaculate executive residence in Maitama. High-perimeter security, biometric access, solar hybrid uninterrupted energy, and expansive rooftop terrace with views of Aso Rock.',
    features: ['Embassy Security', '24/7 Power Guarantee', 'Rooftop Lounge', 'Fiber Internet'],
    amenities: ['Solar Inverter', 'Jacuzzi Suite', 'Espresso Bar', 'Private Guardhouse'],
    nearbyLandmarks: ['Transcorp Hilton', 'Millennium Park', 'Diplomatic Enclave'],
    paymentPlan: { available: false, minDownpaymentPercent: 100, maxTenorMonths: 0 },
    dateAdded: '2026-09-22',
    verificationNotes: 'Security and diplomatic protocol verified.',
    whatsappNumber: '+2348030000000',
    callNumber: '+2348030000000',
    property_availability: 'available'
  },

  // 3. Short Stay: Port Harcourt
  {
    id: 'ph-short-01',
    title: 'The Coral Executive Serviced Residence',
    slug: 'coral-executive-residence-peter-odili',
    type: 'short_stay',
    listing_type: 'short_stay',
    price_unit: 'per_night',
    category: 'short_stay',
    purpose: 'Vacation & Short Stay',
    location: {
      address: 'Off Peter Odili Road',
      neighborhood: 'Peter Odili Axis',
      city: 'Port Harcourt',
      state: 'Rivers State'
    },
    priceNgn: 145000,
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 180,
    titleStatus: 'Short Stay Verified License',
    titleVerified: true,
    verificationDocNo: 'LEGIT/RIV/STAY/2026/03',
    developerInfo: {
      name: 'Rivers Hospitality Hub',
      trackRecord: '10+ Corporate Partners',
      verifiedStatus: 'CAC Registered'
    },
    featured: true,
    property_image: '/src/assets/images/hero_luxury_interior_1790768220829.jpg',
    images: [
      '/src/assets/images/hero_luxury_interior_1790768220829.jpg',
      '/src/assets/images/hero_shortstay_lagos_1790768196208.jpg',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Upscale shortlet suited for energy executives and diaspora visitors. 24/7 industrial generator backup, private gym access, high-speed Starlink internet, and airport escort on request.',
    features: ['Starlink Wi-Fi', '24/7 Power', 'Gated Security', 'Airport Escort Option'],
    amenities: ['Gym Access', 'Smart Lock', 'Full Kitchen', 'Laundry Room'],
    nearbyLandmarks: ['Pleasure Park', 'Trans-Amadi Hub', 'Port Harcourt Club'],
    paymentPlan: { available: false, minDownpaymentPercent: 100, maxTenorMonths: 0 },
    dateAdded: '2026-09-24',
    verificationNotes: 'Rivers State hospitality registry confirmed.',
    whatsappNumber: '+2348030000000',
    callNumber: '+2348030000000',
    property_availability: 'available'
  },

  // 4. Short Stay: Ibadan
  {
    id: 'ib-short-01',
    title: 'The Bodija Heritage Luxury Penthouse',
    slug: 'bodija-heritage-luxury-penthouse-ibadan',
    type: 'short_stay',
    listing_type: 'short_stay',
    price_unit: 'per_night',
    category: 'short_stay',
    purpose: 'Vacation & Short Stay',
    location: {
      address: 'Favos Axis, Old Bodija',
      neighborhood: 'Bodija GRA',
      city: 'Ibadan',
      state: 'Oyo State'
    },
    priceNgn: 95000,
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 165,
    titleStatus: 'Short Stay Verified License',
    titleVerified: true,
    verificationDocNo: 'LEGIT/IB/STAY/2026/04',
    developerInfo: {
      name: 'Oyo Premier Stays',
      trackRecord: '5-Star Hospitality',
      verifiedStatus: 'Verified'
    },
    featured: true,
    property_image: '/src/assets/images/hero_luxury_interior_1790768220829.jpg',
    images: [
      '/src/assets/images/hero_luxury_interior_1790768220829.jpg',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Serene contemporary penthouse in prime Bodija. Ultra-quiet neighbourhood, private swimming pool, smart ambient lighting, and uninterrupted solar inverter power.',
    features: ['Solar Hybrid Power', 'Private Pool', 'Serene Environment', 'Fiber Internet'],
    amenities: ['Poolside Cabana', 'Air Conditioning', 'Automated Curtains', 'Chef Services'],
    nearbyLandmarks: ['University of Ibadan', 'Agodi Gardens', 'Ventura Mall'],
    paymentPlan: { available: false, minDownpaymentPercent: 100, maxTenorMonths: 0 },
    dateAdded: '2026-09-25',
    verificationNotes: 'Oyo State commercial clearance verified.',
    whatsappNumber: '+2348030000000',
    callNumber: '+2348030000000',
    property_availability: 'available'
  },

  // 5. Short Stay: Edo
  {
    id: 'edo-short-01',
    title: 'The Royal Palm Executive Suite & Pool Villa',
    slug: 'royal-palm-executive-suite-benin-city',
    type: 'short_stay',
    listing_type: 'short_stay',
    price_unit: 'per_night',
    category: 'short_stay',
    purpose: 'Vacation & Short Stay',
    location: {
      address: 'Boundary Road, GRA',
      neighborhood: 'GRA Benin City',
      city: 'Edo',
      state: 'Edo State'
    },
    priceNgn: 110000,
    bedrooms: 3,
    bathrooms: 3,
    sizeSqm: 240,
    titleStatus: 'Short Stay Verified License',
    titleVerified: true,
    verificationDocNo: 'LEGIT/EDO/STAY/2026/05',
    developerInfo: {
      name: 'Edo Heritage Living',
      trackRecord: 'Verified Host',
      verifiedStatus: 'CAC Audited'
    },
    featured: true,
    property_image: '/src/assets/images/hero_luxury_interior_1790768220829.jpg',
    images: [
      '/src/assets/images/hero_luxury_interior_1790768220829.jpg',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Regal villa in central GRA Benin City. High perimeter wall, electric fence, swimming pool, luxury travertine interiors, and private chauffeur on standby.',
    features: ['24/7 Power', 'Swimming Pool', 'Chauffeur Standby', 'Electric Fencing'],
    amenities: ['Jacuzzi Bath', 'Fully Furnished Kitchen', 'Smart TVs', 'Sound System'],
    nearbyLandmarks: ['Benin Airport', 'Golf Club GRA', 'Oba Palace Historic Quarter'],
    paymentPlan: { available: false, minDownpaymentPercent: 100, maxTenorMonths: 0 },
    dateAdded: '2026-09-26',
    verificationNotes: 'Edo State Ministry of Urban Development title audited.',
    whatsappNumber: '+2348030000000',
    callNumber: '+2348030000000',
    property_availability: 'available'
  },

  // 6. Short Stay: Enugu
  {
    id: 'enu-short-01',
    title: 'The Coal City Skyline Residence & Terrace',
    slug: 'coal-city-skyline-residence-enugu',
    type: 'short_stay',
    listing_type: 'short_stay',
    price_unit: 'per_night',
    category: 'short_stay',
    purpose: 'Vacation & Short Stay',
    location: {
      address: 'Independence Layout',
      neighborhood: 'Independence Layout',
      city: 'Enugu',
      state: 'Enugu State'
    },
    priceNgn: 125000,
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 190,
    titleStatus: 'Short Stay Verified License',
    titleVerified: true,
    verificationDocNo: 'LEGIT/ENU/STAY/2026/06',
    developerInfo: {
      name: 'Enugu Prime Stays',
      trackRecord: 'Superhost Rating',
      verifiedStatus: 'Verified'
    },
    featured: true,
    property_image: '/src/assets/images/hero_luxury_interior_1790768220829.jpg',
    images: [
      '/src/assets/images/hero_luxury_interior_1790768220829.jpg',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Scenic hillside serviced apartment in Independence Layout with panoramic mountain views. Equipped with dual soundproof generator system, fiber Wi-Fi, and 24/7 security.',
    features: ['Mountain Views', '24/7 Electricity', 'High-Speed Wi-Fi', 'Terrace Bar'],
    amenities: ['Air Conditioning', 'Smart Lock Entry', 'Chef on Call', 'Dry Cleaning'],
    nearbyLandmarks: ['Government House', 'Polo Park Mall', 'Enugu Golf Course'],
    paymentPlan: { available: false, minDownpaymentPercent: 100, maxTenorMonths: 0 },
    dateAdded: '2026-09-27',
    verificationNotes: 'Enugu State hospitality register certified.',
    whatsappNumber: '+2348030000000',
    callNumber: '+2348030000000',
    property_availability: 'available'
  },

  // 7. Short Stay: Anambra
  {
    id: 'ana-short-01',
    title: 'The Grand Awka Executive Corporate Lodge',
    slug: 'grand-awka-executive-corporate-lodge',
    type: 'short_stay',
    listing_type: 'short_stay',
    price_unit: 'per_night',
    category: 'short_stay',
    purpose: 'Vacation & Short Stay',
    location: {
      address: 'Enugu-Onitsha Expressway Corridor',
      neighborhood: 'Awka GRA',
      city: 'Anambra',
      state: 'Anambra State'
    },
    priceNgn: 130000,
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 175,
    titleStatus: 'Short Stay Verified License',
    titleVerified: true,
    verificationDocNo: 'LEGIT/ANA/STAY/2026/07',
    developerInfo: {
      name: 'Anambra Premier Stays',
      trackRecord: 'Executive Quality',
      verifiedStatus: 'Verified'
    },
    featured: true,
    property_image: '/src/assets/images/hero_luxury_interior_1790768220829.jpg',
    images: [
      '/src/assets/images/hero_luxury_interior_1790768220829.jpg',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Executive corporate apartment in Awka capital territory. Solar hybrid power system, meeting lounge, high-speed internet, and VIP transit concierge.',
    features: ['Solar Hybrid Power', 'Business Lounge', 'Private Security', 'Fiber Internet'],
    amenities: ['Workspace Suite', 'Smart TV', 'Fully Fitted Kitchen', 'Balcony'],
    nearbyLandmarks: ['Anambra State Secretariat', 'Nnamdi Azikiwe University', 'Gov Lodge'],
    paymentPlan: { available: false, minDownpaymentPercent: 100, maxTenorMonths: 0 },
    dateAdded: '2026-09-28',
    verificationNotes: 'Anambra Geographic Information Service audited.',
    whatsappNumber: '+2348030000000',
    callNumber: '+2348030000000',
    property_availability: 'available'
  },

  // 8. Properties for Sale: Lagos
  {
    id: 'sale-lag-01',
    title: '600sqm 100% Dry Residential Plot with Governor\'s Consent',
    slug: '600sqm-dry-land-lekki-phase-1',
    type: 'for_sale',
    listing_type: 'for_sale',
    price_unit: 'total',
    category: 'prime_land',
    purpose: 'Investment',
    location: {
      address: 'Admiralty Way Axis, Lekki Phase 1',
      neighborhood: 'Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos State'
    },
    priceNgn: 145000000,
    sizeSqm: 600,
    plotsCount: 1,
    titleStatus: 'Governor\'s Consent',
    titleVerified: true,
    verificationDocNo: 'LAG/GOV/CONSENT/2026/8812',
    developerInfo: {
      name: 'Direct Family Estate Owner',
      trackRecord: 'Clean Title Since 1998',
      verifiedStatus: 'Lands Registry Verified'
    },
    featured: true,
    property_image: '/src/assets/images/hero_property_sales_1790768238681.jpg',
    images: [
      '/src/assets/images/hero_property_sales_1790768238681.jpg',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Prime, 100% dry residential plot in high-demand Lekki Phase 1. Clean Governor’s Consent with zero encumbrance or government acquisition notice. Perfect for luxury detached duplex or boutique apartments.',
    features: ['100% Dry Land', 'Governor\'s Consent', 'Paved Road', 'Central Drainage'],
    amenities: ['Electricity Connected', 'Gated Community', 'Immediate Development Ready'],
    nearbyLandmarks: ['Lekki-Ikoyi Link Bridge', 'Admiralty Mall', 'Victoria Island'],
    paymentPlan: { available: true, minDownpaymentPercent: 40, maxTenorMonths: 6 },
    dateAdded: '2026-09-18',
    verificationNotes: 'Searched & certified at Lagos State Lands Bureau, Alausa.',
    whatsappNumber: '+2348030000000',
    callNumber: '+2348030000000',
    property_availability: 'available'
  },

  // 9. Properties for Sale: Abuja
  {
    id: 'sale-abj-01',
    title: '5-Bedroom Contemporary Smart Mansion with C of O',
    slug: '5-bedroom-smart-mansion-guzape-abuja',
    type: 'for_sale',
    listing_type: 'for_sale',
    price_unit: 'total',
    category: 'executive_duplex',
    purpose: 'Personal Home',
    location: {
      address: 'Guzape Hills, Diplomatic Corridor',
      neighborhood: 'Guzape Hills',
      city: 'Abuja',
      state: 'Federal Capital Territory'
    },
    priceNgn: 320000000,
    bedrooms: 5,
    bathrooms: 6,
    sizeSqm: 850,
    titleStatus: 'Certificate of Occupancy (C of O)',
    titleVerified: true,
    verificationDocNo: 'AGIS/FCT/COFO/2026/4102',
    developerInfo: {
      name: 'Prime Capital Developers',
      trackRecord: '15+ Luxury Mansions Built',
      verifiedStatus: 'COREN & CAC Certified'
    },
    featured: true,
    property_image: '/src/assets/images/hero_property_sales_1790768238681.jpg',
    images: [
      '/src/assets/images/hero_property_sales_1790768238681.jpg',
      '/src/assets/images/hero_shortstay_abuja_1790768208820.jpg',
      '/src/assets/images/hero_luxury_interior_1790768220829.jpg'
    ],
    description: 'Masterpiece multi-level smart villa in Guzape Hills. Private elevator, infinity heated pool, bulletproof security access doors, smart automation by Control4, and full title deed under AGIS.',
    features: ['Certificate of Occupancy', 'Private Elevator', 'Heated Pool', 'Smart Automation'],
    amenities: ['Cinema Room', 'Bespoke Italian Kitchen', '4-Car Garage', 'Maids Quarters'],
    nearbyLandmarks: ['Asokoro District', 'Guzape COZA Hub', 'Central Business District'],
    paymentPlan: { available: true, minDownpaymentPercent: 30, maxTenorMonths: 12 },
    dateAdded: '2026-09-19',
    verificationNotes: 'AGIS Abuja land search completed and confirmed 100% clean.',
    whatsappNumber: '+2348030000000',
    callNumber: '+2348030000000',
    property_availability: 'available'
  }
];

export const CATEGORY_CAROUSELS = [
  {
    key: 'short_stay',
    title: 'Luxury Short Stay Apartments & Sky Residences',
    badge: 'Airbnb Model · Instant Booking',
    description: 'Turn-key shortlet penthouses with 24/7 power, high-speed fiber internet, and dedicated host services.'
  },
  {
    key: 'prime_land',
    title: 'Verified Prime Lands & Commercial Plots',
    badge: 'C of O & Governor\'s Consent',
    description: '100% dry, legally audited land plots in Lagos, Abuja & Port Harcourt ready for immediate development.'
  },
  {
    key: 'executive_duplex',
    title: 'Executive Smart Duplexes & Villas for Sale',
    badge: 'Finished & Off-Plan',
    description: 'Contemporary multi-level residences equipped with smart automation, private pools & maximum security.'
  },
  {
    key: 'investment_plot',
    title: 'High-Growth Investment & Land Banking Plots',
    badge: 'Airport & Deep Sea Port Corridors',
    description: 'Fast-appreciating land parcels strategically positioned near international development corridors.'
  }
];
