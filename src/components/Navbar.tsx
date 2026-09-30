import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Menu,
  X,
  MapPin,
  Bookmark,
  Sparkles,
  Search,
  BookOpen,
  HelpCircle,
  Phone,
  Info,
  Lock,
  ChevronRight,
  Building2,
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { SupportedCity } from '../types';

interface NavbarProps {
  savedCount: number;
  onOpenSaved: () => void;
  onOpenFilter?: () => void;
  onOpenTitleCheck: () => void;
  onOpenLeadModal: () => void;
  onOpenDashboard: () => void;
  onOpenAbout: () => void;
  onOpenLegalGuide: () => void;
  onOpenContact: () => void;
  onOpenFaq: () => void;
  onNavigateCity?: (city: SupportedCity | 'all', category: 'short_stay' | 'for_sale') => void;
  onOpenAdmin?: () => void;
}

const NIGERIAN_CITIES: { id: SupportedCity; label: string; state: string }[] = [
  { id: 'Lagos', label: 'Lagos', state: 'Ikoyi, VI & Lekki' },
  { id: 'Abuja', label: 'Abuja', state: 'Maitama, Guzape & Wuse' },
  { id: 'Port Harcourt', label: 'Port Harcourt', state: 'Old GRA & Trans-Amadi' },
  { id: 'Ibadan', label: 'Ibadan', state: 'Bodija & Oluyole' },
  { id: 'Edo', label: 'Edo', state: 'Benin City GRA' },
  { id: 'Enugu', label: 'Enugu', state: 'Independence Layout' },
  { id: 'Anambra', label: 'Anambra', state: 'Awka & Onitsha' },
];

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
  onNavigateCity,
  onOpenAdmin,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleAction = (callback?: () => void) => {
    setIsDrawerOpen(false);
    if (callback) {
      callback();
    }
  };

  const handleCitySelect = (city: SupportedCity, category: 'short_stay' | 'for_sale') => {
    setIsDrawerOpen(false);
    if (onNavigateCity) {
      onNavigateCity(city, category);
    }
  };

  return (
    <>
      {/* Top Header Bar: Clean, Minimalist SaaS Aesthetic */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left Side: Legit Properties Logo */}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateCity) {
                  onNavigateCity('Lagos', 'short_stay');
                } else {
                  window.location.hash = '#/';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-3 group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center tracking-tight">
                  <span className="font-extrabold text-xl text-slate-950">legit</span>
                  <span className="font-light text-xl text-slate-700">properties</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1"></span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 -mt-0.5">
                  Verified Real Estate & Short Stays
                </span>
              </div>
            </a>

            {/* Right Side: Single Clean Hamburger Menu Icon */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 hover:border-slate-300 transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 flex items-center gap-2"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 text-slate-800" />
                {savedCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Slide-over Drawer Backdrop & Panel */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-all duration-300 animate-in slide-in-from-right">
              
              {/* Drawer Header */}
              <div>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-950">legitproperties</div>
                      <div className="text-[10px] text-slate-600 font-medium">Navigation & Portals</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Primary Destination Hubs: Short Stays */}
                <div className="p-6 space-y-6">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center justify-between">
                      <span>Short Stay Apartments</span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        7 Nigerian Cities
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {NIGERIAN_CITIES.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleCitySelect(city.id, 'short_stay')}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer border border-transparent hover:border-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-600 flex items-center justify-center transition-colors">
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 group-hover:text-slate-950">
                                Short Stay in {city.label}
                              </div>
                              <div className="text-[10px] text-slate-600">{city.state}</div>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Properties for Sale Section */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">
                      Verified Real Estate for Sale
                    </div>
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        if (onNavigateCity) {
                          onNavigateCity('all', 'for_sale');
                        }
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Properties for Sale</div>
                          <div className="text-[11px] text-slate-600">Lands with C of O & Luxury Mansions</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* Utilities & Portals */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">
                      Client Services & Tools
                    </div>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => handleAction(onOpenSaved)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-800 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Bookmark className="w-4 h-4 text-slate-500" />
                          <span>Saved Listings</span>
                        </div>
                        {savedCount > 0 ? (
                          <span className="px-2 py-0.5 bg-slate-950 text-white text-[10px] font-bold rounded-full">
                            {savedCount}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-600">0</span>
                        )}
                      </button>

                      <button
                        onClick={() => handleAction(onOpenLeadModal)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-800 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Request Custom Property</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Concierge</span>
                      </button>

                      <button
                        onClick={() => handleAction(onOpenTitleCheck)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-800 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Title Verification Audit</span>
                        </div>
                        <span className="text-[10px] text-slate-600">Legal Check</span>
                      </button>

                      <button
                        onClick={() => handleAction(onOpenDashboard)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-800 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Layers className="w-4 h-4 text-slate-500" />
                          <span>Client Portfolio Portal</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Guides & Support */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">
                      Resources & Company
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => handleAction(onOpenAbout)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left text-slate-700 font-medium transition-colors cursor-pointer"
                      >
                        About Us
                      </button>
                      <button
                        onClick={() => handleAction(onOpenLegalGuide)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left text-slate-700 font-medium transition-colors cursor-pointer"
                      >
                        Legal Guide
                      </button>
                      <button
                        onClick={() => handleAction(onOpenFaq)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left text-slate-700 font-medium transition-colors cursor-pointer"
                      >
                        FAQs
                      </button>
                      <button
                        onClick={() => handleAction(onOpenContact)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left text-slate-700 font-medium transition-colors cursor-pointer"
                      >
                        Contact Concierge
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer: Admin Access Button */}
              <div className="p-6 border-t border-slate-200 bg-slate-50/70">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    if (onOpenAdmin) {
                      onOpenAdmin();
                    } else {
                      window.location.hash = '#/admin';
                    }
                  }}
                  className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Sign In & Dashboard</span>
                </button>
                <p className="text-[10px] text-center text-slate-600 mt-2">
                  Legit Properties Nigeria · 100% Title Verified & Inspected
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
