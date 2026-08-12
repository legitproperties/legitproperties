import { Property } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  // --- CAROUSEL 1: Prime Lands & Commercial Plots ---
  {
    id: 'prop-land-1',
    title: '600sqm Dry Land in Prime Lekki Phase 1',
    slug: '600sqm-dry-land-lekki-phase-1',
    type: 'land',
    category: 'prime_land',
    purpose: 'Personal Home',
    location: {
      address: 'Admiralty Way Axis, Lekki Phase 1',
      neighborhood: 'Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos State'
    },
    priceNgn: 420000000,
    sizeSqm: 600,
    plotsCount: 1,
    titleStatus: 'Governor\'s Consent',
    titleVerified: true,
    verificationDocNo: 'LAG/GOV/CONSENT/2023/8892',
    developerInfo: {
      name: 'Legit Verified Owner Consortium',
      trackRecord: '15+ Years Registered Title Clearance',
      verifiedStatus: 'Audited & Guaranteed'
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1200&q=80'
    ],
    description: '100% dry, level land situated in a fully developed residential enclave of Lekki Phase 1. Perfect for immediate construction of a contemporary luxury detached duplex or smart multi-unit block. Complete clean title search verified at Alausa Land Registry.',
    features: [
      '100% High Dry Land',
      'Paved Access Road with Drainage',
      'Instant Physical Allocation',
      'Gated Street Patrol Security',
      'Clean Land Bureau Registry Search'
    ],
    amenities: [
      'Paved Access Roads',
      'Central Drainage',
      'Underground Electrical Cables',
      'Strict Access Control Gate'
    ],
    nearbyLandmarks: [
      '5 mins to Admiralty Mall',
      'Direct connectivity to Ikoyi Bridge',
      '24/7 Patrol Security Zone'
    ],
    paymentPlan: {
      available: true,
      minDownpaymentPercent: 30,
      maxTenorMonths: 12,
      monthlyEstNgn: 24500000
    },
    dateAdded: '2026-08-01',
    verificationNotes: 'Ministry of Lands Alausa search completed on July 2026. Zero acquisition overlap, zero omonile risk.'
  },
  {
    id: 'prop-land-2',
    title: 'Commercial Plot on Katampe Extension Expressway',
    slug: 'commercial-plot-katampe-extension-abuja',
    type: 'land',
    category: 'prime_land',
    purpose: 'Commercial Use',
    location: {
      address: 'Main Diplomatic Zone Belt, Katampe Ext.',
      neighborhood: 'Katampe Extension',
      city: 'Abuja',
      state: 'FCT'
    },
    priceNgn: 650000000,
    sizeSqm: 1800,
    plotsCount: 3,
    titleStatus: 'Federal C of O',
    titleVerified: true,
    verificationDocNo: 'FCT/AGIS/CofO/2022/1044',
    developerInfo: {
      name: 'Diplomatic Enclave Holdings',
      trackRecord: 'AGIS Verified Top Tier Land Allocations',
      verifiedStatus: 'Audited & Guaranteed'
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Prime 1,800sqm commercial land plot boasting panoramic views of Abuja central district. Ideal for medical center, corporate headquarters, or luxury serviced residences. Verified AGIS Federal Certificate of Occupancy.',
    features: [
      'AGIS Verified Federal C of O',
      'Corner Piece Plot',
      'Dual Access Road layout',
      'Central Sewage & Power Line Access'
    ],
    amenities: [
      'FCDA Sewage Grid',
      'High Voltage Transformer Connected',
      'Asphalt Road Infrastructure'
    ],
    nearbyLandmarks: [
      '10 mins to Maitama District',
      'Surrounded by top diplomatic residences',
      'Elevated topographical advantages'
    ],
    paymentPlan: {
      available: false,
      minDownpaymentPercent: 100,
      maxTenorMonths: 0
    },
    dateAdded: '2026-08-04',
    verificationNotes: 'Direct AGIS verification confirmed valid recertification and paid ground rents up to 2026.'
  },
  {
    id: 'prop-land-3',
    title: 'Waterfront Estate Land Parcel - Banana Island Axis',
    slug: 'waterfront-estate-land-banana-island',
    type: 'land',
    category: 'prime_land',
    purpose: 'Personal Home',
    location: {
      address: 'Close 4, Ocean Drive, Banana Island Annex',
      neighborhood: 'Banana Island',
      city: 'Lagos',
      state: 'Lagos State'
    },
    priceNgn: 1250000000,
    sizeSqm: 1000,
    plotsCount: 2,
    titleStatus: 'Federal C of O',
    titleVerified: true,
    verificationDocNo: 'FED/LANDS/BAN/09912',
    developerInfo: {
      name: 'Lagoon Crest Infrastructure',
      trackRecord: 'Coastal Engineering & Luxury Estates',
      verifiedStatus: 'Audited & Guaranteed'
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Rare opportunity to acquire 1,000sqm of pristine waterfront shoreline land inside Banana Island enclave. Direct lagoon view, reinforced shoreline piling ready, clear Federal title.',
    features: [
      'Lagoon Frontage View',
      'Civil Engineering Piling Certified',
      'Maximum Gated Security',
      'Ultra-exclusive neighborhood'
    ],
    amenities: [
      'Private Boat Jetty Access',
      '24/7 Armed Security Control',
      'Water Treatment Facility'
    ],
    nearbyLandmarks: [
      'Ultra high net worth security enclave',
      'Helipad access within 3 mins',
      'Private boat jetty rights'
    ],
    paymentPlan: {
      available: true,
      minDownpaymentPercent: 40,
      maxTenorMonths: 18,
      monthlyEstNgn: 41600000
    },
    dateAdded: '2026-08-08',
    verificationNotes: 'Federal Ministry of Works & Housing shoreline permit and Federal C of O fully cleared.'
  },

  // --- CAROUSEL 2: Luxury Apartments & Penthouses ---
  {
    id: 'prop-apt-1',
    title: '4 Bedroom Ultra-Luxury Waterfront Penthouse',
    slug: '4-bedroom-waterfront-penthouse-ikoyi',
    type: 'apartment',
    category: 'luxury_apartment',
    purpose: 'Personal Home',
    location: {
      address: 'Glover Road, Old Ikoyi',
      neighborhood: 'Ikoyi',
      city: 'Lagos',
      state: 'Lagos State'
    },
    priceNgn: 850000000,
    bedrooms: 4,
    bathrooms: 5,
    sizeSqm: 420,
    titleStatus: 'Governor\'s Consent',
    titleVerified: true,
    verificationDocNo: 'LAG/IKY/CONSENT/2024/0112',
    developerInfo: {
      name: 'Aurelia Luxury Developments',
      trackRecord: 'Built 8 High-Rise Luxury Landmarks in Ikoyi',
      verifiedStatus: 'Audited & Guaranteed'
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A masterpiece of architectural finesse on Glover Road, Ikoyi. Features 360-degree panoramic views of Five Cowries Creek and Lagos skyline, smart home automation, private elevator access, infinite edge heated pool, and concierge services.',
    features: [
      'Smart Home Automation System',
      'Private High-Speed Keycard Elevator',
      'Rooftop Infinity Pool & Lounge',
      'Fully Fitted Italian Kitchen with Miele Appliances',
      '2 BQ Ensuite Units'
    ],
    amenities: [
      '24/7 Uninterrupted Power Grid',
      'Concierge & Valet Service',
      'State-of-the-art Gym & Spa',
      'Underground Private Parking'
    ],
    nearbyLandmarks: [
      'Walking distance to Ikoyi Club 1938',
      'Top-tier diplomatic security presence',
      'Minutes to Victoria Island Financial Center'
    ],
    paymentPlan: {
      available: true,
      minDownpaymentPercent: 30,
      maxTenorMonths: 24,
      monthlyEstNgn: 24700000
    },
    completionDate: 'Ready for Occupation',
    virtualTourUrl: 'https://example.com/virtual-tour-ikoyi',
    dateAdded: '2026-08-09',
    verificationNotes: 'Deed of Assignment and Governor\'s Consent fully registered. Building approval code verified with LASPPPA.'
  },
  {
    id: 'prop-apt-2',
    title: '3 Bedroom Smart Luxury Serviced Apartment',
    slug: '3-bedroom-smart-serviced-apartment-guzape-abuja',
    type: 'apartment',
    category: 'luxury_apartment',
    purpose: 'Personal Home',
    location: {
      address: 'Diplomatic Ridge Way, Guzape',
      neighborhood: 'Guzape',
      city: 'Abuja',
      state: 'FCT'
    },
    priceNgn: 380000000,
    bedrooms: 3,
    bathrooms: 4,
    sizeSqm: 260,
    titleStatus: 'Federal C of O',
    titleVerified: true,
    verificationDocNo: 'FCT/AGIS/AP/2023/5512',
    developerInfo: {
      name: 'Capital Crest Structures',
      trackRecord: '12 Premier Residential Towers in Abuja',
      verifiedStatus: 'Audited & Guaranteed'
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Hilltop sanctuary in Guzape District, Abuja offering seamless indoor-outdoor living. Features bullet-resistant security glass, central air purification, automated ambient lighting, and 24/7 dedicated solar-diesel hybrid power grid.',
    features: [
      '100% Guaranteed 24/7 Power',
      'Bullet-resistant Double Glazed Windows',
      'Underground Private Parking (3 Cars)',
      'Gymnasium & Heated Pool',
      'Fibre Optic High Speed Internet Pre-wired'
    ],
    amenities: [
      'Automated Access Gates',
      'Solar-Diesel Hybrid Substation',
      'Clubhouse & Rooftop Deck'
    ],
    nearbyLandmarks: [
      'Overlooking Central Business District',
      'Serene, secure diplomatic neighborhood',
      'Close proximity to Transcorp Hilton'
    ],
    paymentPlan: {
      available: true,
      minDownpaymentPercent: 20,
      maxTenorMonths: 18,
      monthlyEstNgn: 16800000
    },
    completionDate: 'Q4 2026',
    dateAdded: '2026-08-07',
    verificationNotes: 'AGIS C of O title cleared. Approved building blueprints verified with FCT Development Control.'
  },

  // --- CAROUSEL 3: High-Yield Investment Plots ---
  {
    id: 'prop-inv-1',
    title: '500sqm Dry Land in Fast-Growing Epe Tech & Resort Corridor',
    slug: '500sqm-dry-land-epe-corridor',
    type: 'land',
    category: 'investment_plot',
    purpose: 'Investment',
    location: {
      address: 'Epe Express Highway, Near Alaro City',
      neighborhood: 'Epe Expressway',
      city: 'Lagos',
      state: 'Lagos State'
    },
    priceNgn: 18500000,
    sizeSqm: 500,
    plotsCount: 1,
    titleStatus: 'Gazette',
    titleVerified: true,
    verificationDocNo: 'GAZ/EPE/VOL.14/PG.88',
    developerInfo: {
      name: 'Legit Land Banking Capital',
      trackRecord: '2,500+ Allocated Plots Delivered on Schedule',
      verifiedStatus: 'Audited & Guaranteed'
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Top recommendation for land banking & asset preservation. Situated directly adjacent to Alaro Industrial City and the proposed Lekki International Airport axis. Guaranteed 35%+ annual capital appreciation.',
    features: [
      'Lagos State Government Gazette Title',
      'Instant Physical Allocation',
      '100% Dry Table Land',
      'No Omonile Interference Guarantee',
      'Flexible 6-12 Months Payment Plan'
    ],
    amenities: [
      'Perimeter Fencing Included',
      'Gated Gatehouse Entry',
      'Internal Earth Road Network'
    ],
    nearbyLandmarks: [
      '3 mins from Augustine University',
      'Direct frontage on 6-lane expanded Epe Expressway',
      'Proximity to Dangote Refinery Hub'
    ],
    paymentPlan: {
      available: true,
      minDownpaymentPercent: 15,
      maxTenorMonths: 12,
      monthlyEstNgn: 1300000
    },
    dateAdded: '2026-08-10',
    verificationNotes: 'Official Gazette volume verified at Lagos Surveyor General office. Zero government acquisition.'
  },
  {
    id: 'prop-inv-2',
    title: 'Commercial Acreage near Lekki Deep Sea Port',
    slug: 'commercial-acreage-ibeju-lekki-port-axis',
    type: 'land',
    category: 'investment_plot',
    purpose: 'Investment',
    location: {
      address: 'Coastal Road Axis, Ibeju-Lekki',
      neighborhood: 'Ibeju-Lekki',
      city: 'Lagos',
      state: 'Lagos State'
    },
    priceNgn: 45000000,
    sizeSqm: 3000,
    plotsCount: 5,
    titleStatus: 'Certificate of Occupancy (C of O)',
    titleVerified: true,
    verificationDocNo: 'LAG/IBJ/CofO/2022/990',
    developerInfo: {
      name: 'Coastal Corridor Industrial Parks',
      trackRecord: 'Industrial Land Sourcing for Multinational Logistics',
      verifiedStatus: 'Audited & Guaranteed'
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80'
    ],
    description: '3,000sqm (5 plots) strategic commercial land parcel along the expanding Lekki Free Trade Zone expressway. Perfect for container holding terminal, staff quarters, or commercial plaza.',
    features: [
      'Lagos State C of O Title',
      'High Load Bearing Soil Composition',
      'Commercial Zoning Approved',
      'Direct Highway Frontage'
    ],
    amenities: [
      'Commercial Heavy Logistics Clearance',
      'Direct Expressway Access',
      'Transformer Utility Corridor'
    ],
    nearbyLandmarks: [
      '5 mins to Lekki Deep Sea Port',
      '8 mins to Dangote Fertilizer & Refinery Complex',
      'Direct link to Lagos-Calabar Coastal Highway'
    ],
    paymentPlan: {
      available: true,
      minDownpaymentPercent: 20,
      maxTenorMonths: 12,
      monthlyEstNgn: 3000000
    },
    dateAdded: '2026-08-06',
    verificationNotes: 'Lagos State C of O volume & beacon coordinates cleared by Ministry of Physical Planning.'
  },

  // --- CAROUSEL 4: Executive Duplexes & Villas ---
  {
    id: 'prop-dup-1',
    title: '5 Bedroom Fully Detached Contemporary Smart Villa',
    slug: '5-bedroom-detached-smart-villa-chevron-lekki',
    type: 'duplex',
    category: 'executive_duplex',
    purpose: 'Personal Home',
    location: {
      address: 'Orchid Road Corridor, Chevron Axis',
      neighborhood: 'Chevron Lekki',
      city: 'Lagos',
      state: 'Lagos State'
    },
    priceNgn: 320000000,
    bedrooms: 5,
    bathrooms: 6,
    sizeSqm: 500,
    titleStatus: 'Governor\'s Consent',
    titleVerified: true,
    verificationDocNo: 'LAG/LEK/CONSENT/2024/0041',
    developerInfo: {
      name: 'Vanguard Luxury Homes',
      trackRecord: 'Delivered 25+ Smart Duplexes in Chevron & Ikate',
      verifiedStatus: 'Audited & Guaranteed'
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Elegantly proportioned 5-bedroom home built with modern architectural precision. Includes private swimming pool, open air sky lounge, cinema room, automated gates, and solar inverter setup.',
    features: [
      'Private Swimming Pool with Waterfall Feature',
      'Fully Outfitted Private Cinema Room',
      '10kVA Hybrid Solar Inverter System',
      'Automated Access Gates & CCTV Cameras',
      'Spacious En-suite BQ Unit'
    ],
    amenities: [
      'Hybrid Solar Plant',
      'Private Cinema Room',
      'Smart Door Lock Access',
      'High-Pressure Water Treatment'
    ],
    nearbyLandmarks: [
      'Gated residential estate with 24/7 security control',
      'Close to Chevron Nigeria HQ',
      'Flooding-free elevated drainage infrastructure'
    ],
    paymentPlan: {
      available: true,
      minDownpaymentPercent: 30,
      maxTenorMonths: 12,
      monthlyEstNgn: 18600000
    },
    completionDate: 'Ready for Occupation',
    dateAdded: '2026-08-08',
    verificationNotes: 'Lagos State Governor\'s Consent approved and signed. All land taxes paid.'
  },

  // --- CAROUSEL 5: Diaspora Choice & Newly Listed ---
  {
    id: 'prop-diaspora-1',
    title: 'Diaspora Special: 4 Bedroom Terrace with 24/7 Power in Katampe Extension',
    slug: 'diaspora-4-bedroom-terrace-katampe-abuja',
    type: 'terrace',
    category: 'diaspora_choice',
    purpose: 'Personal Home',
    location: {
      address: 'Diplomatic Zone 2, Katampe Extension',
      neighborhood: 'Katampe Extension',
      city: 'Abuja',
      state: 'FCT'
    },
    priceNgn: 290000000,
    bedrooms: 4,
    bathrooms: 5,
    sizeSqm: 320,
    titleStatus: 'Federal C of O',
    titleVerified: true,
    verificationDocNo: 'FCT/AGIS/CofO/2024/0991',
    developerInfo: {
      name: 'Nig-UK Synergy Properties',
      trackRecord: 'Specialist Diaspora Property Management & Verification',
      verifiedStatus: 'Audited & Guaranteed'
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Designed specifically for Nigerians in the UK, USA, Canada & Europe seeking stress-free ownership. Fully managed facility with guaranteed monthly rental dividend option or instant relocation readiness.',
    features: [
      '100% Remote Video Inspection & Escrow Lock',
      '24/7 Hybrid Power Grid',
      'Automated Rental Yield Management Platform',
      'Title Insurance Guarantee'
    ],
    amenities: [
      'Remote CCTV Live Camera Stream for Owners',
      '24/7 On-Site Facilities Manager',
      'Communal Solar Power Backup'
    ],
    nearbyLandmarks: [
      '10 mins to Central Business District Abuja',
      'Near U.S. Diplomatic Quarter'
    ],
    paymentPlan: {
      available: true,
      minDownpaymentPercent: 20,
      maxTenorMonths: 18,
      monthlyEstNgn: 12800000
    },
    completionDate: 'Ready for Occupation',
    dateAdded: '2026-08-11',
    verificationNotes: 'AGIS C of O & Diaspora Escrow Agreement guaranteed by legitproperties.com.ng legal counsel.'
  },
  {
    id: 'prop-new-1',
    title: 'Freshly Listed: 1,000sqm Land Plot in Victoria Garden City (VGC)',
    slug: '1000sqm-land-plot-vgc-lagos',
    type: 'land',
    category: 'newly_listed',
    purpose: 'Personal Home',
    location: {
      address: 'Road 14, Victoria Garden City',
      neighborhood: 'VGC Lekki',
      city: 'Lagos',
      state: 'Lagos State'
    },
    priceNgn: 480000000,
    sizeSqm: 1000,
    plotsCount: 2,
    titleStatus: 'Governor\'s Consent',
    titleVerified: true,
    verificationDocNo: 'LAG/VGC/CONSENT/2024/991',
    developerInfo: {
      name: 'VGC Legacy Owner Group',
      trackRecord: 'Verified Direct Family Estate Ownership',
      verifiedStatus: 'Audited & Guaranteed'
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Direct owner distress sale listing in VGC. Fully dry, corner piece plot facing dual tarred roads inside the gated Victoria Garden City estate. Verified clean title, no encumbrances.',
    features: [
      'Cornerpiece Dual Road Frontage',
      'VGC Maintenance Association Approved',
      'Central Sewage & Water System Connected',
      'Instant Transfer of Title'
    ],
    amenities: [
      'VGC Central Water Treatment',
      '24/7 Gatehouse Security Patrol',
      'Paved Pedestrian Walkways'
    ],
    nearbyLandmarks: [
      'Paved tree-lined avenues with sports park',
      '24/7 security entrance gate control'
    ],
    paymentPlan: {
      available: true,
      minDownpaymentPercent: 50,
      maxTenorMonths: 6,
      monthlyEstNgn: 40000000
    },
    dateAdded: '2026-08-11',
    verificationNotes: 'Governor\'s Consent deed searched and confirmed valid at Lagos Land Registry.'
  }
];

export const CATEGORY_CAROUSELS = [
  {
    key: 'prime_land',
    title: 'Verified Prime Lands & Commercial Plots',
    badge: 'C of O & Governor\'s Consent',
    description: '100% dry, legally audited land plots in Lagos, Abuja & Port Harcourt ready for immediate development.'
  },
  {
    key: 'luxury_apartment',
    title: 'Luxury Apartments & Sky Residences',
    badge: 'Ikoyi, Lekki & Guzape',
    description: 'Sleek, high-yield residential apartments with world-class facilities & 24/7 power guaranteed.'
  },
  {
    key: 'investment_plot',
    title: 'High-Growth Investment & Land Banking Plots',
    badge: 'Epe & Airport Axis',
    description: 'Fast-appreciating land parcels strategically positioned near international airports, deep sea ports & tech hubs.'
  },
  {
    key: 'executive_duplex',
    title: 'Executive Smart Duplexes & Villas',
    badge: 'Gated Communities',
    description: 'Contemporary multi-level homes equipped with smart automation, private pools & maximum security.'
  },
  {
    key: 'diaspora_choice',
    title: 'Diaspora Choice Properties (Remote Purchase Ready)',
    badge: 'Verified for UK / US / CA Buyers',
    description: 'Turn-key real estate packages with remote video title verification, escrow guarantees, and automated management.'
  },
  {
    key: 'newly_listed',
    title: 'Freshly Verified Direct-Owner Listings',
    badge: 'Listed in last 48 Hours',
    description: 'Exclusive, verified real estate deals freshly listed directly from vetted property owners.'
  }
];
