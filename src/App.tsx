import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Property, FilterOptions, CurrencyCode, PropertyRequestLead } from './types';
import { INITIAL_PROPERTIES, CATEGORY_CAROUSELS } from './data/properties';
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
import { ShieldCheck, FilterX, Search } from 'lucide-react';

export default function App() {
  const [properties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [currency, setCurrency] = useState<CurrencyCode>('NGN');
  
  // Bookmarked Properties state
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('legit_saved_properties');
      return stored ? JSON.parse(stored) : ['prop-land-1', 'prop-apt-1'];
    } catch {
      return ['prop-land-1', 'prop-apt-1'];
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
  const handleLeadSubmit = (lead: PropertyRequestLead) => {
    try {
      const existing = JSON.parse(localStorage.getItem('legit_property_leads') || '[]');
      localStorage.setItem('legit_property_leads', JSON.stringify([lead, ...existing]));
    } catch (err) {
      console.error('Lead storage error', err);
    }
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
      // Title Status filter
      if (
        filterOptions.titleStatus !== 'all' &&
        !p.titleStatus.toLowerCase().includes(filterOptions.titleStatus.toLowerCase())
      ) {
        return false;
      }
      // Max price filter
      if (filterOptions.maxPrice && p.priceNgn > filterOptions.maxPrice) return false;
      // Search query filter
      if (filterOptions.query.trim() !== '') {
        const q = filterOptions.query.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchLoc = `${p.location.neighborhood} ${p.location.city} ${p.location.address}`.toLowerCase().includes(q);
        const matchTitleType = p.titleStatus.toLowerCase().includes(q);
        if (!matchTitle && !matchLoc && !matchTitleType) return false;
      }
      return true;
    });
  }, [properties, filterOptions]);

  // Saved Properties List
  const savedProperties = useMemo(() => {
    return properties.filter((p) => savedIds.includes(p.id));
  }, [properties, savedIds]);

  // Check if filters are active
  const isFilterActive =
    filterOptions.type !== 'all' ||
    filterOptions.city !== 'all' ||
    filterOptions.titleStatus !== 'all' ||
    filterOptions.maxPrice < 2000000000 ||
    filterOptions.query.trim() !== '';

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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#102033] selection:bg-[#167A5A] selection:text-white">
      
      {/* 1. Navigation Header */}
      <Navbar
        savedCount={savedIds.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenFilter={() => setIsFilterModalOpen(true)}
        onOpenTitleCheck={() => setIsTitleCheckOpen(true)}
        onOpenLeadModal={() => setIsLeadModalOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        currency={currency}
        onToggleCurrency={(c) => setCurrency(c)}
        searchQuery={filterOptions.query}
        onSearchChange={(q) => setFilterOptions((prev) => ({ ...prev, query: q }))}
      />

      {/* 2. Hero Section */}
      <Hero
        filterOptions={filterOptions}
        onFilterChange={(updated) => setFilterOptions((prev) => ({ ...prev, ...updated }))}
        onScrollToListings={scrollToProperties}
        totalPropertiesCount={properties.length}
      />

      {/* 3. IMMEDIATELY FOLLOWED BY NEAT AND PLENTY CAROUSELS OF LISTED PROPERTIES */}
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

        {/* If no properties match search filter */}
        {filteredProperties.length === 0 ? (
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

            // If user filtered by type (e.g. land only), show matching properties across carousels
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
        onScrollToTop={scrollToTop}
      />

      {/* --- OVERLAY MODALS & DRAWERS --- */}

      {/* Property Detail View Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        currency={currency}
        isSaved={selectedProperty ? savedIds.includes(selectedProperty.id) : false}
        onClose={() => setSelectedProperty(null)}
        onToggleSave={handleToggleSave}
      />

      {/* Bookmarked Properties Drawer */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedProperties={savedProperties}
        currency={currency}
        onRemoveSaved={handleToggleSave}
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

    </div>
  );
}
