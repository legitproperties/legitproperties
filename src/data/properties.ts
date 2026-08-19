import { Property } from '../types';

/**
 * Clean initial properties array (no demo/mock listings).
 * Live verified properties are loaded directly from Supabase database.
 */
export const INITIAL_PROPERTIES: Property[] = [];

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
