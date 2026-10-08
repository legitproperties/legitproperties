import React, { useRef, useMemo, useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Zap,
  Wifi,
  ChevronDown,
  Building2,
  Calendar,
  Eye,
  CheckCircle2,
  ArrowRight,
  Filter,
  Loader2
} from 'lucide-react';
import { Property, SupportedCity, ListingType } from '../../types';
import { fetchPropertiesFromSupabase } from '../../lib/supabase';
import { formatPropertyPrice } from '../../utils/formatters';
import propertyForSaleHeroImg from '../../assets/images/PROPERTY 1.jpeg';
import shortStayHeroImg from '../../assets/images/hero_luxury_interior_1790768220829.jpg';

interface LocalizedLandingPageProps {
  currentCategory: 'short_stay' | 'for_sale';
  currentCity: SupportedCity | 'all';
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenBookingModal: (property: Property) => void;
  onNavigateCity: (city: SupportedCity | 'all', category: 'short_stay' | 'for_sale') => void;
}

interface LocationMeta {
  title: string;
  tagline: string;
  keywords: string;
  heroImage: string;
  ctaText: string;
  neighborhoods: string[];
}

const CITY_METADATA: Record<string, LocationMeta> = {
  Lagos: {
    title: 'Experience Luxury Short Stays in Lagos',
    tagline: 'Hand-picked premium shortlets, waterfront penthouses, and serviced apartments in Ikoyi, Victoria Island & Lekki Phase 1.',
    keywords: 'Lagos shortlet · Lagos short stay apartments · Lagos Airbnb · 24/7 Uninterrupted Light · Private Chef Available',
    heroImage: shortStayHeroImg,
    ctaText: 'Explore Lagos Short Stays',
    neighborhoods: ['Ikoyi', 'Victoria Island', 'Lekki Phase 1', 'Banana Island', 'Ikeja GRA', 'Eko Atlantic', 'Ajah', 'Magodo']
  },
  for_sale_all: {
    title: 'Verified Luxury Properties for Sale in Lagos',
    tagline: 'Legally vetted lands with Certificate of Occupancy (C of O), Governor\'s Consent, and architectural mansions ready for title transfer.',
    keywords: 'Lagos properties for sale · Verified C of O land Lagos · Lekki mansions · Diaspora title verification guaranteed',
    heroImage: propertyForSaleHeroImg,
    ctaText: 'Browse Properties for Sale in Lagos',
    neighborhoods: ['Ikoyi', 'Victoria Island', 'Lekki Phase 1', 'Banana Island', 'Ikeja GRA', 'Eko Atlantic', 'Ajah', 'Epe']
  }
};

export const LocalizedLandingPage: React.FC<LocalizedLandingPageProps> = ({
  currentCategory,
  currentCity,
  properties,
  onSelectProperty,
  onOpenBookingModal,
  onNavigateCity
}) => {
  const listingsRef = useRef<HTMLDivElement>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high'>('featured');

  // Determine metadata
  const meta: LocationMeta = useMemo(() => {
    if (currentCategory === 'for_sale') {
      return {
        ...CITY_METADATA.for_sale_all,
        title: 'Properties for Sale in Lagos',
        tagline: 'Legally verified lands, off-plan developments, and finished duplexes in Lagos with certified land registry records.',
        keywords: 'Lagos property for sale · Lagos lands with C of O · Direct Owner Deals · Safe Diaspora Escrow',
        ctaText: 'Explore Lagos Properties for Sale',
        heroImage: propertyForSaleHeroImg
      };
    }
    return {
      ...CITY_METADATA.Lagos,
      heroImage: shortStayHeroImg
    };
  }, [currentCategory]);

  // Smooth scroll down to listings
  const handleCtaClick = () => {
    listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Direct live Supabase fetching for this localized landing page
  const [liveProperties, setLiveProperties] = useState<Property[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingLive(true);

    fetchPropertiesFromSupabase({
      listing_type: currentCategory
    }).then((data) => {
      if (isMounted) {
        setLiveProperties(data);
        setIsLoadingLive(false);
      }
    }).catch((err) => {
      console.error('Error fetching live properties from Supabase:', err);
      if (isMounted) {
        setLiveProperties([]);
        setIsLoadingLive(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentCategory]);

  // Combine live query results with any parent properties
  const activePropertiesPool = useMemo(() => {
    if (liveProperties.length > 0) return liveProperties;
    return properties || [];
  }, [liveProperties, properties]);

  // Filter listings based on category and neighborhood
  const filteredListings = useMemo(() => {
    return activePropertiesPool.filter((p) => {
      // Category / Listing Type matching
      if (currentCategory === 'short_stay') {
        const isShortStay =
          p.listing_type === 'short_stay' ||
          p.price_unit === 'per_night' ||
          p.property_type === 'short_stay' ||
          p.category === 'short_stay' ||
          (p.description && (p.description.toLowerCase().includes('short stay') || p.description.toLowerCase().includes('shortlet')));
        if (!isShortStay) return false;
      } else {
        const isShortStay =
          p.listing_type === 'short_stay' ||
          p.price_unit === 'per_night' ||
          p.property_type === 'short_stay' ||
          p.category === 'short_stay';
        if (isShortStay) return false;
      }

      // Neighborhood subfilter
      if (selectedNeighborhood !== 'all') {
        const matchNeigh =
          p.location.neighborhood?.toLowerCase().includes(selectedNeighborhood.toLowerCase()) ||
          p.location.address?.toLowerCase().includes(selectedNeighborhood.toLowerCase());
        if (!matchNeigh) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.priceNgn - b.priceNgn;
      if (sortBy === 'price_high') return b.priceNgn - a.priceNgn;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [activePropertiesPool, currentCategory, selectedNeighborhood, sortBy]);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-900 selection:text-white">
      
      {/* 1. Category Switcher & Lagos Hub Bar */}
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30" aria-label="Location Switcher">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Primary Category Switcher: Short Stays vs For Sale */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0 self-start sm:self-auto">
              <button
                onClick={() => onNavigateCity('Lagos', 'short_stay')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentCategory === 'short_stay'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Short-Stay Apartments
              </button>
              <button
                onClick={() => onNavigateCity('Lagos', 'for_sale')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentCategory === 'for_sale'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Properties for Sale
              </button>
            </div>

            {/* Exclusive Lagos Location Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* 2. Hero Section: Clean Split Layout */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Conversion-driven Copy & Anchor Jump CTA */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Legit Properties</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>Lagos, Nigeria</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-[1.15] text-balance">
                {meta.title}
              </h1>

              {/* Tagline */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {meta.tagline}
              </p>

              {/* High-Intent SEO Keywords Subtitle */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>High-Intent Verified Standard</span>
                </div>
                <p className="italic text-[11px] text-slate-500">
                  {meta.keywords}
                </p>
              </div>

              {/* Anchor Jump CTA Button & Guarantee */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={handleCtaClick}
                  className="px-8 py-4 bg-slate-950 hover:bg-slate-800 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>{meta.ctaText}</span>
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                </button>

                <div className="flex items-center gap-3 text-xs text-slate-600 pl-1">
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>24/7 Power</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1">
                    <Wifi className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fiber Wi-Fi</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: High-Grade Luxury Real Estate Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[16/11] bg-slate-900">
                <img
                  key={meta.heroImage}
                  src={meta.heroImage}
                  alt={meta.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Scrim for Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating Verified Overlay Pill */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/20 text-slate-900 flex items-center justify-between text-xs shadow-lg">
                  <div>
                    <div className="font-extrabold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% Inspected & Live</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Direct host contact & instant check-in</p>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-lg">
                    Lagos
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Active Property Listings Grid (Target of the Anchor Jump) */}
      <section ref={listingsRef} id="listings" className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header & Sub-filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
              {currentCategory === 'short_stay' ? 'Curated Short Stays' : 'Vetted Real Estate Inventory'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Active Listings in Lagos
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Showing <strong className="text-slate-900">{filteredListings.length}</strong> available {currentCategory === 'short_stay' ? 'apartments' : 'properties'} ready for immediate booking or inspection
            </p>
          </div>

          {/* Controls: Neighborhood & Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            {meta.neighborhoods.length > 0 && (
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 pl-2 font-medium">Zone:</span>
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="bg-transparent text-slate-900 font-semibold focus:outline-none pr-2 cursor-pointer"
                >
                  <option value="all">All Prime Areas</option>
                  {meta.neighborhoods.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 pl-2 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-900 font-semibold focus:outline-none pr-2 cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {isLoadingLive ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-50 rounded-3xl p-4 border border-slate-200 animate-pulse space-y-4">
                <div className="aspect-[16/10] bg-slate-200 rounded-2xl" />
                <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-4 max-w-xl mx-auto">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Fresh Listings for {currentCity === 'all' ? 'Selected Category' : currentCity} Coming Soon
              </h3>
              <p className="text-xs text-slate-600">
                Live properties from Supabase for {currentCity === 'all' ? 'Nigeria' : currentCity} will appear here as soon as verified by the admin desk.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigateCity('Lagos', currentCategory)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                View Lagos Listings
              </button>
              <button
                onClick={() => setSelectedNeighborhood('all')}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((property) => {
              const isShortStay =
                property.listing_type === 'short_stay' ||
                property.price_unit === 'per_night' ||
                property.category === 'short_stay';

              const priceUnitLabel = isShortStay ? ' / night' : '';
              const priceInfo = formatPropertyPrice(property, priceUnitLabel);
              const cleanWhatsapp = (property.whatsappNumber || '+2348030000000').replace(/[^0-9]/g, '');
              const cleanCall = property.callNumber || property.whatsappNumber || '+2348030000000';
              const messageText = encodeURIComponent(
                `Hello Legit Properties, I am inquiring about: ${property.title} in ${property.location.neighborhood || property.location.city} (${priceInfo.formatted}). Is it available?`
              );

              return (
                <div
                  key={property.id}
                  className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Property Image Container */}
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelectProperty(property)}>
                      <img
                        src={property.images[0] || property.property_image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold">
                          {property.location.city}
                        </span>
                        {property.property_availability === 'sold' ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-amber-950 text-[10px] font-extrabold uppercase">
                            Sold Out
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold uppercase">
                            Available
                          </span>
                        )}
                      </div>

                      {/* Media counter */}
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold">
                        {property.images.length} Photos
                      </div>
                    </div>

                    {/* Property Info */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{property.location.neighborhood}, {property.location.city}</span>
                        </div>
                        <h3
                          onClick={() => onSelectProperty(property)}
                          className="font-bold text-base sm:text-lg text-slate-900 line-clamp-1 mt-1 hover:text-emerald-700 transition-colors cursor-pointer"
                        >
                          {property.title}
                        </h3>
                      </div>

                      {/* Specs */}
                      <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                        {property.bedrooms && (
                          <span>{property.bedrooms} Beds</span>
                        )}
                        {property.bathrooms && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{property.bathrooms} Baths</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{property.sizeSqm ? `${property.sizeSqm} sqm` : 'Executive'}</span>
                      </div>

                      {/* Single Exclusive Price in selected currency (Naira or Dollar) */}
                      <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between gap-2">
                        <span className="text-lg sm:text-xl font-black text-slate-900 font-mono tracking-tight">
                          {priceInfo.formatted}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                          {priceInfo.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar: Dual Agent Contact & Instant Book / Inquire */}
                  <div className="p-5 pt-0 space-y-2.5">
                    
                    {/* Primary Button: Instant Book (Short Stay) or Inquire (For Sale) */}
                    <button
                      onClick={() => onOpenBookingModal(property)}
                      className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
                    >
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span>{isShortStay ? 'Instant Book This Stay' : 'Inquire / Request Inspection'}</span>
                    </button>

                    {/* Dual Agent Contact: Direct Call & WhatsApp Integration */}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${cleanCall}`}
                        className="py-2.5 px-3 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-600" />
                        <span>Direct Call</span>
                      </a>

                      <a
                        href={`https://wa.me/${cleanWhatsapp}?text=${messageText}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

    </div>
  );
};
