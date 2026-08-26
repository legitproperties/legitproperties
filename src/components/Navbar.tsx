import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Bookmark,
  SlidersHorizontal,
  User,
  Sparkles,
  Menu,
  X,
  BookOpen,
  HelpCircle,
  Phone,
  Info,
  ChevronRight,
  Globe
} from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuAction = (action: () => void) => {
    setIsMenuOpen(false);
    action();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 transition-all duration-200 shadow-xs">
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
            </div>

            {/* Quick Search Bar in Navbar */}
            <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-4">
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

            {/* Action Controls & Hamburger Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Currency Selector (Desktop compact) */}
              <div className="hidden sm:flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
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

              {/* Saved Bookmark Trigger */}
              <button
                onClick={onOpenSaved}
                className="relative p-2.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Saved Properties"
              >
                <Bookmark className="w-4 h-4 text-slate-500" />
                <span className="hidden md:inline">Saved</span>
                {savedCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {savedCount}
                  </span>
                )}
              </button>

              {/* Request Property Lead CTA Button */}
              <button
                onClick={onOpenLeadModal}
                className="hidden sm:flex px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Request Property</span>
              </button>

              {/* Hamburger Menu Toggle Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 flex items-center gap-2 transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 text-slate-900" />
                <span className="text-xs font-bold hidden xs:inline text-slate-800">Menu</span>
              </button>

            </div>

          </div>

          {/* Mobile Search Bar in Navbar */}
          <div className="md:hidden pb-3">
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
          </div>

        </div>
      </header>

      {/* Hamburger Sliding Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Slide-out Menu Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto border-l border-slate-200 animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">legitproperties</h3>
                  <p className="text-[11px] font-semibold text-slate-500">Navigation & Verification Suite</p>
                </div>
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Sections */}
            <div className="p-6 space-y-6 flex-1">
              
              {/* Primary Services Group */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
                  Property Services
                </h4>

                <div className="space-y-1">
                  <button
                    onClick={() => handleMenuAction(onOpenTitleCheck)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:bg-emerald-100/70 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <span>Free Land Title Verification</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-600 text-white font-extrabold">Instant</span>
                        </div>
                        <div className="text-[11px] text-emerald-800/80">Audit C of O, Governor's Consent & Gazettes</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleMenuAction(onOpenLeadModal)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Custom Property Request</div>
                        <div className="text-[11px] text-slate-500">Request specific land or luxury villa match</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleMenuAction(onOpenFilter)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <SlidersHorizontal className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Advanced Property Filters</div>
                        <div className="text-[11px] text-slate-500">Filter by title doc, budget, city & type</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleMenuAction(onOpenDashboard)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Client Document Vault</div>
                        <div className="text-[11px] text-slate-500">Saved inspection logs & deed repository</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Informational Guides & Resources */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
                  Information & Support
                </h4>

                <div className="space-y-1">
                  <button
                    onClick={() => handleMenuAction(onOpenAbout)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Info className="w-4 h-4 text-slate-500" />
                      <span>About legitproperties</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleMenuAction(onOpenLegalGuide)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      <span>Land Title Verification Guide</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleMenuAction(onOpenFaq)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      <span>Buyer Frequently Asked Questions</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleMenuAction(onOpenContact)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span>Contact & State Office Registry</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Currency Selector (Mobile in drawer) */}
              <div className="sm:hidden pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span>Display Currency</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onToggleCurrency('NGN')}
                      className={`py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        currency === 'NGN'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ₦ NGN
                    </button>
                    <button
                      onClick={() => onToggleCurrency('USD')}
                      className={`py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        currency === 'USD'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      $ USD
                    </button>
                    <button
                      onClick={() => onToggleCurrency('GBP')}
                      className={`py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        currency === 'GBP'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      £ GBP
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% C of O & Governor's Consent Audited</span>
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">
                All legal verifications are carried out directly with the Lagos State Lands Bureau (Alausa), AGIS Abuja, and Rivers State Ministry of Lands.
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
