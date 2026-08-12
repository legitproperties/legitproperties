import React from 'react';
import { ShieldCheck, Search, Bookmark, SlidersHorizontal, MessageCircle, Check, FileCheck2, User, Sparkles } from 'lucide-react';
import { CurrencyCode } from '../types';

interface NavbarProps {
  savedCount: number;
  onOpenSaved: () => void;
  onOpenFilter: () => void;
  onOpenTitleCheck: () => void;
  onOpenLeadModal: () => void;
  onOpenDashboard: () => void;
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
  currency,
  onToggleCurrency,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#102033] text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-[#167A5A] transition-colors">
                <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#102033] leading-none">
                  legitproperties<span className="text-[#167A5A] font-bold">.com.ng</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">
                  100% Title Verified Lands & Luxury Homes
                </span>
              </div>
            </a>

            {/* Title Check Badge */}
            <button
              onClick={onOpenTitleCheck}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#167A5A] text-xs font-bold border border-emerald-200/80 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-[#167A5A]" />
              <span>Zero Omonile Risk</span>
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Lekki, Ikoyi, Guzape, Epe, C of O..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#102033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20 focus:border-[#167A5A] transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency Selector (NGN, USD, GBP) */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => onToggleCurrency('NGN')}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currency === 'NGN'
                    ? 'bg-white text-[#102033] shadow-xs'
                    : 'text-slate-500 hover:text-[#102033]'
                }`}
              >
                ₦ NGN
              </button>
              <button
                onClick={() => onToggleCurrency('USD')}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-white text-[#102033] shadow-xs'
                    : 'text-slate-500 hover:text-[#102033]'
                }`}
              >
                $ USD
              </button>
              <button
                onClick={() => onToggleCurrency('GBP')}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currency === 'GBP'
                    ? 'bg-white text-[#102033] shadow-xs'
                    : 'text-slate-500 hover:text-[#102033]'
                }`}
              >
                £ GBP
              </button>
            </div>

            {/* Filter Trigger */}
            <button
              onClick={onOpenFilter}
              className="p-2.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#102033] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Filter Properties"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* Saved Counter Trigger */}
            <button
              onClick={onOpenSaved}
              className="relative p-2.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#102033] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Saved Properties"
            >
              <Bookmark className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#167A5A] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Client Portal / Vault Dashboard */}
            <button
              onClick={onOpenDashboard}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#102033] text-xs font-semibold transition-all cursor-pointer"
            >
              <User className="w-4 h-4 text-[#167A5A]" />
              <span>Client Vault</span>
            </button>

            {/* Request Specific Land / Property Lead Modal Trigger */}
            <button
              onClick={onOpenLeadModal}
              className="px-3.5 py-2 bg-[#167A5A] hover:bg-[#126248] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Property Request</span>
              <span className="sm:hidden">Request</span>
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Lekki, Ikoyi, Guzape, C of O..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-[#102033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
