import React from 'react';
import { ShieldCheck, Search, Bookmark, SlidersHorizontal, User, Sparkles, BookOpen, Phone, HelpCircle } from 'lucide-react';
import { CurrencyCode } from '../types';

interface NavbarProps {
  savedCount: number;
  onOpenSaved: () => void;
  onOpenFilter: () => void;
  onOpenTitleCheck: () => void;
  onOpenLeadModal: () => void;
  onOpenDashboard: () => void;
  onOpenAbout: () => void;
  onOpenLegalGuide: () => void;
  onOpenContact: () => void;
  onOpenFaq: () => void;
  currency: CurrencyCode;
  onToggleCurrency: (code: CurrencyCode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  onOpenSaved,
  onOpenFilter,
  onOpenTitleCheck,
  onOpenLeadModal,
  onOpenDashboard,
  onOpenAbout,
  onOpenLegalGuide,
  onOpenContact,
  onOpenFaq,
  currency,
  onToggleCurrency,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 transition-all duration-200 shadow-xs">
      
      {/* Top Utility Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 py-2 border-b border-slate-800 text-[11px] font-medium hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% C of O & Governor's Consent Guaranteed</span>
            </div>
            <span className="text-slate-600">•</span>
            <button onClick={onOpenLegalGuide} className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
              <BookOpen className="w-3 h-3 text-slate-400" />
              <span>Title Audit Guide</span>
            </button>
            <button onClick={onOpenFaq} className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
              <HelpCircle className="w-3 h-3 text-slate-400" />
              <span>Buyer FAQs</span>
            </button>
            <button onClick={onOpenContact} className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>Contact & Offices</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">Registry Helpline: <strong className="text-white">+234 803 000 1122</strong></span>
            <span className="text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60">
              CAC & Ministry Verified
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-all">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 leading-none">
                  legit<span className="text-slate-700">properties</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">
                  Verified Lands & Luxury Real Estate
                </span>
              </div>
            </a>

            {/* Quick Title Check Badge Button */}
            <button
              onClick={onOpenTitleCheck}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 hover:bg-slate-200 transition-all cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verify Any Title</span>
            </button>
          </div>

          {/* Quick Search Bar in Navbar */}
          <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Lekki, Ikoyi, Guzape, Epe, C of O..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
              />
            </div>
          </div>

          {/* Action Controls & Currency */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency Selector */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => onToggleCurrency('NGN')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currency === 'NGN'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ₦ NGN
              </button>
              <button
                onClick={() => onToggleCurrency('USD')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                $ USD
              </button>
              <button
                onClick={() => onToggleCurrency('GBP')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currency === 'GBP'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                £ GBP
              </button>
            </div>

            {/* Filter Trigger Button */}
            <button
              onClick={onOpenFilter}
              className="p-2.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Filter Properties"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* Saved Bookmark Trigger */}
            <button
              onClick={onOpenSaved}
              className="relative p-2.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Saved Properties"
            >
              <Bookmark className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Client Vault Dashboard */}
            <button
              onClick={onOpenDashboard}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <User className="w-4 h-4 text-slate-600" />
              <span>Client Vault</span>
            </button>

            {/* Custom Request Lead CTA Button */}
            <button
              onClick={onOpenLeadModal}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Request Property</span>
              <span className="sm:hidden">Request</span>
            </button>
          </div>

        </div>

        {/* Mobile Search & Sub-nav Links */}
        <div className="md:hidden pb-3 space-y-2">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Lekki, Ikoyi, Guzape, C of O..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-1 pt-1 overflow-x-auto gap-2">
            <button onClick={onOpenAbout} className="hover:text-slate-900 whitespace-nowrap">About Us</button>
            <button onClick={onOpenLegalGuide} className="hover:text-slate-900 whitespace-nowrap">Title Guide</button>
            <button onClick={onOpenFaq} className="hover:text-slate-900 whitespace-nowrap">FAQs</button>
            <button onClick={onOpenContact} className="hover:text-slate-900 whitespace-nowrap">Contact Us</button>
            <button onClick={onOpenTitleCheck} className="text-slate-900 font-extrabold hover:text-slate-700 whitespace-nowrap flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verify Title</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
