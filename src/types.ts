export type PropertyType = 'land' | 'apartment' | 'house' | 'terrace' | 'duplex' | 'commercial' | 'offplan' | 'investment';

export type TitleStatus = 
  | 'Certificate of Occupancy (C of O)'
  | 'Governor\'s Consent'
  | 'Gazette'
  | 'Excision Title'
  | 'Registered Survey & Deed'
  | 'Federal C of O';

export type CurrencyCode = 'NGN' | 'USD' | 'GBP';

export interface Property {
  id: string;
  title: string;
  slug: string;
  type: PropertyType;
  category: 'prime_land' | 'luxury_apartment' | 'investment_plot' | 'newly_listed' | 'executive_duplex' | 'diaspora_choice';
  purpose: 'Personal Home' | 'Investment' | 'Rental Income' | 'Retirement' | 'Commercial Use';
  location: {
    address: string;
    neighborhood: string;
    city: 'Lagos' | 'Abuja' | 'Port Harcourt' | 'Ibadan';
    state: string;
  };
  priceNgn: number;
  sizeSqm?: number;
  plotsCount?: number;
  bedrooms?: number;
  bathrooms?: number;
  titleStatus: TitleStatus;
  titleVerified: boolean;
  verificationDocNo: string;
  developerInfo: {
    name: string;
    trackRecord: string;
    verifiedStatus: string;
  };
  featured: boolean;
  images: string[];
  description: string;
  features: string[];
  amenities: string[];
  nearbyLandmarks: string[];
  paymentPlan: {
    available: boolean;
    minDownpaymentPercent: number;
    maxTenorMonths: number;
    monthlyEstNgn?: number;
  };
  completionDate?: string;
  virtualTourUrl?: string;
  dateAdded: string;
  verificationNotes: string;
}

export interface FilterOptions {
  type: 'all' | PropertyType;
  category: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  titleStatus: string;
  purpose: string;
  bedrooms: string;
  query: string;
}

export interface PropertyRequestLead {
  fullName: string;
  email: string;
  phoneWhatsapp: string;
  countryOfResidence: string;
  preferredLocation: string;
  propertyType: string;
  budgetNgn: number;
  purpose: string;
  timeline: string;
  notes?: string;
  createdAt: string;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  residenceCountry: string;
  avatarUrl: string;
  currentStep: 'Selected' | 'Verification' | 'Documentation' | 'Payment' | 'Ownership';
  activePropertyName?: string;
  totalPaidNgn: number;
  totalContractNgn: number;
  nextPaymentDueDate: string;
  nextPaymentAmountNgn: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: 'Purchase Agreement' | 'Payment Receipt' | 'Title Document' | 'Verification Record';
  date: string;
  status: 'Verified' | 'Pending Review' | 'Archived';
  fileSize: string;
}

export interface PaymentRecord {
  id: string;
  reference: string;
  date: string;
  amountNgn: number;
  purpose: string;
  status: 'Completed' | 'Pending' | 'Upcoming';
  receiptUrl?: string;
}
