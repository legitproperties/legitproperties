export type PropertyType = 'short_stay' | 'for_sale' | 'apartment' | 'house' | 'terrace' | 'duplex' | 'commercial' | 'land' | 'investment';

export type ListingType = 'short_stay' | 'for_sale';
export type PriceUnit = 'per_night' | 'total';

export type SupportedCity = 'Lagos';

export type TitleStatus = 
  | 'Certificate of Occupancy (C of O)'
  | 'Governor\'s Consent'
  | 'Gazette'
  | 'Excision Title'
  | 'Registered Survey & Deed'
  | 'Federal C of O'
  | 'Short Stay Verified License';

export type CurrencyCode = 'NGN' | 'USD' | 'GBP';

export type DisplayCurrency = 'NGN' | 'USD';

export interface Property {
  id: string;
  title: string;
  slug: string;
  type: PropertyType;
  listing_type?: ListingType;
  price_unit?: PriceUnit;
  currency?: DisplayCurrency;
  display_currency?: DisplayCurrency;
  category: 'prime_land' | 'luxury_apartment' | 'investment_plot' | 'newly_listed' | 'executive_duplex' | 'diaspora_choice' | 'short_stay';
  purpose: 'Personal Home' | 'Investment' | 'Rental Income' | 'Retirement' | 'Commercial Use' | 'Vacation & Short Stay';
  location: {
    address: string;
    neighborhood: string;
    city: SupportedCity | string;
    state: string;
  };
  priceNgn: number;
  priceUsd?: number;
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
  whatsappNumber?: string;
  callNumber?: string;
  property_image?: string;
  gallery_images?: string[];
  property_type?: string;
  property_video?: string;
  property_availability?: 'available' | 'sold';
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface BookingRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestsCount: number;
  pricePerNightNgn: number;
  totalAmountNgn: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt: string;
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

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin' | 'editor';
  created_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImage?: string;
  published: boolean;
  viewsCount?: number;
  createdAt: string;
}

