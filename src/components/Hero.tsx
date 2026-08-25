import React from 'react';
import { ShieldCheck, ArrowDown, Building2, MapPin, Layers, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { FilterOptions } from '../types';

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
  return (
    <section className="relative pt-10 pb-12 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/80 border-b border-slate-200/70 overflow-hidden">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Minimalist Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Title Verified Real Estate</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Verified Lands, Houses and Luxury Apartments in Nigeria.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Every property on <strong className="text-slate-900 font-semibold">legitproperties</strong> is audited for valid Certificate of Occupancy (C of O) and Governor's Consent. Zero land disputes. Absolute peace of mind.
          </p>
        </div>

        {/* Minimalist Embedded Quick Filter Bar */}
        <div className="mt-8 max-w-4xl mx-auto bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          
          {/* Property Type Segmented Toggle */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl mb-3 text-xs font-semibold text-slate-600">
            <button
              onClick={() => onFilterChange({ type: 'all' })}
              className={`py-2 px-3 rounded-lg transition-all text-center ${
                filterOptions.type === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              All Listings ({totalPropertiesCount})
            </button>
            <button
              onClick={() => onFilterChange({ type: 'land' })}
              className={`py-2 px-3 rounded-lg transition-all text-center ${
                filterOptions.type === 'land'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Verified Lands
            </button>
            <button
              onClick={() => onFilterChange({ type: 'apartment' })}
              className={`py-2 px-3 rounded-lg transition-all text-center ${
                filterOptions.type === 'apartment'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Apartments
            </button>
            <button
              onClick={() => onFilterChange({ type: 'duplex' })}
              className={`py-2 px-3 rounded-lg transition-all text-center ${
                filterOptions.type === 'duplex'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Duplexes & Villas
            </button>
          </div>

          {/* Location & Title Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* City Dropdown */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" /> City / Location
              </label>
              <select
                value={filterOptions.city}
                onChange={(e) => onFilterChange({ city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">All Locations (Lagos, Abuja, PH)</option>
                <option value="Lagos">Lagos State (Lekki, Ikoyi, Epe, VGC)</option>
                <option value="Abuja">Abuja FCT (Maitama, Guzape, Katampe)</option>
                <option value="Port Harcourt">Port Harcourt (Trans Amadi)</option>
              </select>
            </div>

            {/* Title Type Filter */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Title Document
              </label>
              <select
                value={filterOptions.titleStatus}
                onChange={(e) => onFilterChange({ titleStatus: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">Any Verified Title</option>
                <option value="C of O">Certificate of Occupancy (C of O)</option>
                <option value="Governor's Consent">Governor's Consent</option>
                <option value="Federal C of O">Federal C of O</option>
                <option value="Gazette">Lagos Gazette Title</option>
              </select>
            </div>

            {/* Price Budget Dropdown */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" /> Maximum Price
              </label>
              <select
                value={filterOptions.maxPrice || 2000000000}
                onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value={2000000000}>No Price Limit</option>
                <option value={30000000}>Under ₦30 Million</option>
                <option value={100000000}>Under ₦100 Million</option>
                <option value={350000000}>Under ₦350 Million</option>
                <option value={700000000}>Under ₦700 Million</option>
              </select>
            </div>

          </div>

        </div>

        {/* Minimalist Key Trust Points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-600 border-t border-slate-200/60 pt-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Ministry Land Search Cleared</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Zero Omonile & Land Grabber Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Direct Owner Dealings & Video Verification</span>
          </div>
        </div>

        {/* Prompt to immediate carousels */}
        <div className="mt-6 text-center">
          <button
            onClick={onScrollToListings}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors group"
          >
            <span>Explore Plenty Verified Listings Below</span>
            <ArrowDown className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
