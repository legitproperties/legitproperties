import React from 'react';
import { ShieldCheck, ArrowDown, Building2, MapPin, Search, Trees, Home, Building, Banknote, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { FilterOptions } from '../types';
import heroHouseImg from '../assets/images/luxury_modern_house_1787638229702.jpg';

interface HeroProps {
  filterOptions: FilterOptions;
  onFilterChange: (updated: Partial<FilterOptions>) => void;
  onScrollToListings: () => void;
  totalPropertiesCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  filterOptions,
  onFilterChange,
  onScrollToListings,
  totalPropertiesCount,
}) => {
  const handleSelectCategoryCard = (type: 'land' | 'duplex' | 'apartment' | 'all') => {
    onFilterChange({ type });
    onScrollToListings();
  };

  return (
    <section className="relative pt-10 pb-16 bg-white text-slate-900 overflow-hidden border-b border-slate-200">
      
      {/* Subtle Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Two-Column Hero: Left Heading & Details | Right House Image Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (Heading, Subtitle, Trust Metrics) */}
          <div className="lg:col-span-7 text-left space-y-4 sm:space-y-5">
            
            {/* Top Verified Shield Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold tracking-wide shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Ministry Title Verified • Zero Omonile Risk</span>
            </div>

            {/* Primary Headline with Reduced Font Size */}
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-[1.18]">
              Verified Lands, Houses and <span className="text-slate-800 underline decoration-slate-300">Luxury Apartments</span> in Nigeria.
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-slate-600 font-normal max-w-xl leading-relaxed">
              Every property on <strong className="text-slate-900 font-semibold">legitproperties</strong> undergoes multi-level legal audit with State Lands Bureaus & AGIS. C of O, Governor's Consent, and instant physical allocation guaranteed.
            </p>

            {/* Live Trust Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-w-xl">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <div className="text-lg sm:text-xl font-black text-slate-900">₦50B+</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Title Audited</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <div className="text-lg sm:text-xl font-black text-emerald-600">100%</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">C of O & Consent</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <div className="text-lg sm:text-xl font-black text-slate-900">0%</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Omonile Risk</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <div className="text-lg sm:text-xl font-black text-slate-900">&lt; 48 Hrs</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Fast Allocation</div>
              </div>
            </div>

          </div>

          {/* Right Column (House Picture Showcase) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-100 group">
              <img
                src={heroHouseImg}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80';
                }}
                alt="Luxury Nigerian Verified Real Estate House"
                className="w-full h-[280px] sm:h-[360px] lg:h-[380px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

              {/* Top Verified Floating Badge */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Title • C of O</span>
              </div>

              {/* Top Right Live Tag */}
              <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md">
                <Sparkles className="w-3 h-3" />
                <span>Audited Deal</span>
              </div>

              {/* Bottom Info Floating Card */}
              <div className="absolute bottom-3.5 inset-x-3.5 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 shadow-xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-slate-500 text-[11px] font-semibold">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">Lekki Phase 1 & Ikoyi, Lagos</span>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    Executive Smart Mansion & Lands
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-800 text-[10px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant Allocation</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Multi-Parameter Search & Filter Console */}
        <div className="max-w-4xl mx-auto bg-slate-50 rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xl">
          
          {/* Segmented Category Pill Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-white rounded-2xl mb-4 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => onFilterChange({ type: 'all' })}
              className={`py-2.5 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                filterOptions.type === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>All Listings ({totalPropertiesCount})</span>
            </button>
            <button
              onClick={() => onFilterChange({ type: 'land' })}
              className={`py-2.5 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                filterOptions.type === 'land'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Trees className="w-3.5 h-3.5" />
              <span>Verified Lands</span>
            </button>
            <button
              onClick={() => onFilterChange({ type: 'duplex' })}
              className={`py-2.5 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                filterOptions.type === 'duplex'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Houses & Mansions</span>
            </button>
            <button
              onClick={() => onFilterChange({ type: 'apartment' })}
              className={`py-2.5 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                filterOptions.type === 'apartment'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Luxury Apartments</span>
            </button>
          </div>

          {/* Select Dropdown Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* City Location Selector */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> City / Location
              </label>
              <select
                value={filterOptions.city}
                onChange={(e) => onFilterChange({ city: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all cursor-pointer"
              >
                <option value="all">All Locations (Lagos, Abuja, PH)</option>
                <option value="Lagos">Lagos (Lekki, Ikoyi, Epe, VGC, Victoria Island)</option>
                <option value="Abuja">Abuja FCT (Maitama, Guzape, Katampe)</option>
                <option value="Port Harcourt">Port Harcourt (Trans Amadi & GRA)</option>
              </select>
            </div>

            {/* Title Document Selector */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Title Document
              </label>
              <select
                value={filterOptions.titleStatus}
                onChange={(e) => onFilterChange({ titleStatus: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all cursor-pointer"
              >
                <option value="all">Any Verified Title</option>
                <option value="C of O">Certificate of Occupancy (C of O)</option>
                <option value="Governor's Consent">Governor's Consent</option>
                <option value="Federal C of O">Federal C of O</option>
                <option value="Gazette">Lagos Gazette Title</option>
              </select>
            </div>

            {/* Maximum Price Selector */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5 text-slate-500" /> Maximum Price
              </label>
              <select
                value={filterOptions.maxPrice || 2000000000}
                onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all cursor-pointer"
              >
                <option value={2000000000}>No Price Limit</option>
                <option value={30000000}>Under ₦30 Million</option>
                <option value={100000000}>Under ₦100 Million</option>
                <option value={350000000}>Under ₦350 Million</option>
                <option value={700000000}>Under ₦700 Million</option>
              </select>
            </div>

          </div>

          {/* Action CTA Trigger */}
          <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
              Popular: <span className="text-slate-700 font-semibold">Lekki Phase 1 • Epe Expressway • Maitama Abuja • C of O Titles</span>
            </div>

            <button
              onClick={onScrollToListings}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Explore Verified Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Visual Category Showcase Cards */}
        <div className="mt-10 max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Curated Portfolio Collections
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Lands */}
            <div
              onClick={() => handleSelectCategoryCard('land')}
              className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Trees className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors flex items-center justify-between">
                <span>Verified Lands</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Commercial & residential plots in Lekki, Epe, & Abuja with instant physical allocation.
              </p>
            </div>

            {/* 2. Luxury Houses */}
            <div
              onClick={() => handleSelectCategoryCard('duplex')}
              className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors flex items-center justify-between">
                <span>Luxury Mansions</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Contemporary duplexes, smart homes & fully detached villas with governor's consent.
              </p>
            </div>

            {/* 3. Luxury Apartments */}
            <div
              onClick={() => handleSelectCategoryCard('apartment')}
              className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors flex items-center justify-between">
                <span>Prime Apartments</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                High-yield short-let ready flats & penthouses with guaranteed rental returns.
              </p>
            </div>

            {/* 4. Installment & Diaspora */}
            <div
              onClick={() => onScrollToListings()}
              className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Banknote className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors flex items-center justify-between">
                <span>Payment Plans</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Flexible 3 to 12 months installment plans customized for local & diaspora investors.
              </p>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-8 text-center">
          <button
            onClick={onScrollToListings}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer"
          >
            <span>Scroll Down to View Verified Listings</span>
            <ArrowDown className="w-3.5 h-3.5 text-slate-600 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
