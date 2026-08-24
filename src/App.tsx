import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Property, FilterOptions, CurrencyCode, PropertyRequestLead } from './types';
import { INITIAL_PROPERTIES, CATEGORY_CAROUSELS } from './data/properties';
import { fetchPropertiesFromSupabase, saveLeadToSupabase, isSupabaseConfigured } from './lib/supabase';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminAuthPage } from './components/admin/AdminAuthPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyCarousel } from './components/PropertyCarousel';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { SavedDrawer } from './components/SavedDrawer';
import { PropertyFilterModal } from './components/PropertyFilterModal';
import { TitleCheckWidget } from './components/TitleCheckWidget';
import { TrustBar } from './components/TrustBar';
import { Footer } from './components/Footer';
import { PropertyRequestModal } from './components/PropertyRequestModal';
import { ClientDashboardDrawer } from './components/ClientDashboardDrawer';
import { AboutModal } from './components/AboutModal';
import { LegalGuideModal } from './components/LegalGuideModal';
import { ContactModal } from './components/ContactModal';
import { FaqModal } from './components/FaqModal';
import { ShieldCheck, FilterX, Search, Database, Lock, Loader2 } from 'lucide-react';

/**
 * Protected Admin Route Container
 * Enforces authentication guards: unauthenticated users are presented with the Sign In/Sign Up portal,
 * while authenticated admins access the full interactive CMS dashboard.
 */
function AdminRouteView({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-[#167A5A] flex items-center justify-center shadow-lg shadow-emerald-950/50">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <AdminAuthPage
        onSuccess={() => onNavigate('/admin/dashboard')}
        onGoBack={() => onNavigate('/')}
      />
    );
  }

  return (
    <AdminDashboard
      onGoToPublicSite={() => onNavigate('/')}
    />
  );
}

function getActiveAppRoute(): string {
  if (typeof window === 'undefined') return '/';
  const pathname = window.location.pathname;
  const hash = window.location.hash;
  const search = window.location.search;

  if (
    pathname.startsWith('/admin') ||
    hash.startsWith('#admin') ||
    hash.startsWith('#/admin') ||
    search.includes('page=admin') ||
    search.includes('admin=true') ||
    search.includes('admin=1')
  ) {
    return '/admin';
  }
  return pathname;
}

function MainApp() {
  const [currentPath, setCurrentPath] = useState<string>(() => getActiveAppRoute());

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      if (path.startsWith('/admin')) {
        window.history.pushState(null, '', '#/admin');
      } else {
        window.history.pushState(null, '', path);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getActiveAppRoute());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [currency, setCurrency] = useState<CurrencyCode>('NGN');
  
  // Load properties from Supabase database if configured
  useEffect(() => {
    async function loadProperties() {
      const data = await fetchPropertiesFromSupabase();
      if (data && data.length > 0) {
        setProperties(data);
      }
    }
    loadProperties();
  }, []);
  
  // Bookmarked Properties state (Clean start, no pre-saved demo properties)
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('legit_saved_properties');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Purge legacy demo IDs
        const cleaned = parsed.filter(
          (id) => typeof id === 'string' && !id.startsWith('prop-land-') && !id.startsWith('prop-apt-') && !id.startsWith('prop-invest-') && !id.startsWith('prop-dup-') && !id.startsWith('prop-diaspora-') && !id.startsWith('prop-new-') && id !== 'prop-land-1' && id !== 'prop-apt-1'
        );
        return cleaned;
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('legit_saved_properties', JSON.stringify(savedIds));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedIds]);

  // Filter state
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type: 'all',
    category: 'all',
    city: 'all',
    minPrice: 0,
    maxPrice: 2000000000,
    titleStatus: 'all',
    purpose: 'all',
    bedrooms: 'all',
    query: ''
  });

  // Modals & Drawers state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isTitleCheckOpen, setIsTitleCheckOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Informational Pages / Modals state
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLegalGuideOpen, setIsLegalGuideOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const listingsSectionRef = useRef<HTMLDivElement>(null);

  // Toggle Bookmark
  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Scroll smooth to listings
  const scrollToProperties = () => {
    listingsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lead submission logger
  const handleLeadSubmit = async (lead: PropertyRequestLead) => {
    await saveLeadToSupabase(lead);
  };

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Type filter
      if (filterOptions.type !== 'all' && p.type !== filterOptions.type) return false;
      // Category filter
      if (filterOptions.category !== 'all' && p.category !== filterOptions.category) return false;
      // City filter
      if (filterOptions.city !== 'all' && p.location.city !== filterOptions.city) return false;
      // Price filter
      if (p.priceNgn < filterOptions.minPrice || p.priceNgn > filterOptions.maxPrice) return false;
      // Title Status filter
      if (filterOptions.titleStatus !== 'all' && p.titleStatus !== filterOptions.titleStatus) return false;
      // Purpose filter
      if (filterOptions.purpose !== 'all' && p.purpose !== filterOptions.purpose) return false;
      
      // Bedrooms filter
      if (filterOptions.bedrooms !== 'all') {
        const reqBeds = parseInt(filterOptions.bedrooms, 10);
        if (!p.bedrooms || p.bedrooms < reqBeds) return false;
      }

      // Query search
      if (filterOptions.query.trim()) {
        const q = filterOptions.query.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCity = p.location.city.toLowerCase().includes(q);
        const matchNeigh = p.location.neighborhood.toLowerCase().includes(q);
        const matchTitleDoc = p.titleStatus.toLowerCase().includes(q);
        const matchDeveloper = p.developerInfo.name.toLowerCase().includes(q);
        if (!matchTitle && !matchCity && !matchNeigh && !matchTitleDoc && !matchDeveloper) return false;
      }

      return true;
    });
  }, [properties, filterOptions]);

  // Saved Properties List
  const savedProperties = useMemo(() => {
    return properties.filter((p) => savedIds.includes(p.id));
  }, [properties, savedIds]);

  const handleResetFilters = () => {
    setFilterOptions({
      type: 'all',
      category: 'all',
      city: 'all',
      minPrice: 0,
      maxPrice: 2000000000,
      titleStatus: 'all',
      purpose: 'all',
      bedrooms: 'all',
      query: ''
    });
  };

  const isFilterActive =
    filterOptions.type !== 'all' ||
    filterOptions.category !== 'all' ||
    filterOptions.city !== 'all' ||
    filterOptions.minPrice > 0 ||
    filterOptions.maxPrice < 2000000000 ||
    filterOptions.titleStatus !== 'all' ||
    filterOptions.purpose !== 'all' ||
    filterOptions.bedrooms !== 'all' ||
    filterOptions.query.trim() !== '';

  // Render Admin View if on admin route
  if (currentPath.startsWith('/admin')) {
    return <AdminRouteView onNavigate={navigateTo} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-[#167A5A] selection:text-white">
      
      {/* 1. Header & Navigation */}
      <Navbar
        savedCount={savedIds.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenFilter={() => setIsFilterModalOpen(true)}
        onOpenTitleCheck={() => setIsTitleCheckOpen(true)}
        onOpenLeadModal={() => setIsLeadModalOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenLegalGuide={() => setIsLegalGuideOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        onOpenAdmin={() => navigateTo('/admin')}
        currency={currency}
        onToggleCurrency={(code) => setCurrency(code)}
        searchQuery={filterOptions.query}
        onSearchChange={(q) => setFilterOptions((prev) => ({ ...prev, query: q }))}
      />

      {/* 2. Hero Component */}
      <Hero
        filterOptions={filterOptions}
        onFilterChange={(updated) => setFilterOptions((prev) => ({ ...prev, ...updated }))}
        onScrollToListings={scrollToProperties}
        totalPropertiesCount={filteredProperties.length}
      />

      {/* 3. Listed Properties Section */}
      <main ref={listingsSectionRef} className="flex-1 space-y-2 py-4">
        
        {/* Active Filter Bar Banner if filters are applied */}
        {isFilterActive && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
            <div className="p-3.5 bg-[#102033] text-white rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                <span>
                  Showing <strong>{filteredProperties.length}</strong> verified properties matching your active search
                </span>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            </div>
          </div>
        )}

        {/* If no properties exist in database yet */}
        {properties.length === 0 ? (
          <div className="max-w-3xl mx-auto my-12 p-8 sm:p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-5 shadow-xs">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-[#167A5A] border border-emerald-100">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#102033]">
                Live Verified Properties Coming Soon
              </h3>
              <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                All live listings added to your connected Supabase database will automatically display here with Certificate of Occupancy (C of O), Governor's Consent, and high-resolution media.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsLeadModalOpen(true)}
                className="px-5 py-3 bg-[#102033] hover:bg-[#167A5A] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Submit Custom Property Request
              </button>
              <button
                onClick={() => setIsTitleCheckOpen(true)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-[#102033] text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Free Land Title Verification
              </button>
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          /* If no properties match search filter */
          <div className="max-w-2xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#102033]">No properties matched your search criteria</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your price filter or title status selection to view available land and apartment listings across Lagos, Abuja, and Port Harcourt.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#102033] hover:bg-[#167A5A] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Reset Search & Show All Properties
            </button>
          </div>
        ) : (
          /* Render carousels for each category! */
          CATEGORY_CAROUSELS.map((carousel) => {
            const categoryProperties = filteredProperties.filter(
              (p) => p.category === carousel.key
            );

            const displayProperties = categoryProperties.length > 0
              ? categoryProperties
              : filteredProperties.slice(0, 4);

            if (categoryProperties.length === 0 && isFilterActive) {
              return null;
            }

            return (
              <div key={carousel.key} id={carousel.key}>
                <PropertyCarousel
                  title={carousel.title}
                  badge={carousel.badge}
                  description={carousel.description}
                  properties={categoryProperties.length > 0 ? categoryProperties : displayProperties}
                  currency={currency}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onSelectProperty={(p) => setSelectedProperty(p)}
                  onViewCategoryAll={() =>
                    setFilterOptions((prev) => ({ ...prev, category: carousel.key }))
                  }
                />
              </div>
            );
          })
        )}

        {/* 4. Trust Banner Section */}
        <TrustBar onOpenTitleCheck={() => setIsTitleCheckOpen(true)} />

      </main>

      {/* 5. Footer */}
      <Footer
        onOpenTitleCheck={() => setIsTitleCheckOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenLegalGuide={() => setIsLegalGuideOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        onOpenAdmin={() => navigateTo('/admin')}
        onScrollToTop={scrollToTop}
      />

      {/* 6. Modals & Slide-out Drawers */}

      {/* Property Details Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={Boolean(selectedProperty)}
        onClose={() => setSelectedProperty(null)}
        currency={currency}
        isSaved={selectedProperty ? savedIds.includes(selectedProperty.id) : false}
        onToggleSave={handleToggleSave}
        onOpenTitleCheck={() => {
          setSelectedProperty(null);
          setIsTitleCheckOpen(true);
        }}
        onOpenLeadModal={() => {
          setSelectedProperty(null);
          setIsLeadModalOpen(true);
        }}
      />

      {/* Bookmarked Properties Drawer */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedProperties={savedProperties}
        currency={currency}
        onRemoveSaved={handleToggleSave}
        onClearAll={() => setSavedIds([])}
        onSelectProperty={(p) => setSelectedProperty(p)}
      />

      {/* Advanced Filter Modal */}
      <PropertyFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterOptions={filterOptions}
        onFilterChange={(updated) => setFilterOptions((prev) => ({ ...prev, ...updated }))}
        onResetFilters={handleResetFilters}
        totalResultsCount={filteredProperties.length}
      />

      {/* Free Title Verification Widget */}
      <TitleCheckWidget
        isOpen={isTitleCheckOpen}
        onClose={() => setIsTitleCheckOpen(false)}
      />

      {/* Custom Property Request Match Lead Modal */}
      <PropertyRequestModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSubmitLead={handleLeadSubmit}
      />

      {/* Client Vault Dashboard Drawer */}
      <ClientDashboardDrawer
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        currency={currency}
      />

      {/* About Us Page Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenTitleCheck={() => setIsTitleCheckOpen(true)}
        onOpenLeadModal={() => setIsLeadModalOpen(true)}
      />

      {/* Title Verification & Legal Guide Modal */}
      <LegalGuideModal
        isOpen={isLegalGuideOpen}
        onClose={() => setIsLegalGuideOpen(false)}
        onOpenTitleCheck={() => setIsTitleCheckOpen(true)}
      />

      {/* Contact Us & Office Locations Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Buyer FAQs Modal */}
      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
        onOpenTitleCheck={() => setIsTitleCheckOpen(true)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <MainApp />
    </AdminAuthProvider>
  );
}
