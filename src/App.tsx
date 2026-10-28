import React, { useState, useEffect, useMemo } from 'react';
import { Property, SupportedCity, ListingType, CurrencyCode, BookingRequest } from './types';
import { fetchPropertiesFromSupabase, fetchPropertyByIdOrSlug } from './lib/supabase';
import { parsePropertyIdentifierFromUrl, getPropertyUrl } from './utils/propertyUrl';
import { trackMetaPixelEvent } from './utils/metaPixel';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminAuthPage } from './components/admin/AdminAuthPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Navbar } from './components/Navbar';
import { LocalizedLandingPage } from './components/public/LocalizedLandingPage';
import { BookingModal } from './components/public/BookingModal';
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
import { ShieldCheck, Loader2 } from 'lucide-react';

/**
 * Protected Admin Route Container
 * Enforces authentication guards: unauthenticated users access Sign In & Sign Up pages linked to Supabase Auth & admins table.
 * Authenticated admins instantly redirect to the Admin Dashboard.
 */
function AdminRouteView({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg border border-slate-800">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>Verifying Administrator Authorization...</span>
        </div>
      </div>
    );
  }

  if (!admin || admin.email !== 'goshened76@gmail.com') {
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

function parseAppRoute(): { isAdmin: boolean; category: ListingType; city: SupportedCity; propertyIdentifier: string | null } {
  if (typeof window === 'undefined') {
    return { isAdmin: false, category: 'short_stay', city: 'Lagos', propertyIdentifier: null };
  }

  const path = (window.location.pathname + window.location.hash + window.location.search).toLowerCase();

  const isAdmin =
    path.includes('/admin') ||
    path.includes('#admin') ||
    path.includes('page=admin') ||
    path.includes('admin=true');

  if (isAdmin) {
    return { isAdmin: true, category: 'short_stay', city: 'Lagos', propertyIdentifier: null };
  }

  const propertyIdentifier = parsePropertyIdentifierFromUrl();

  if (path.includes('for-sale') || path.includes('for_sale') || path.includes('properties-for-sale')) {
    return { isAdmin: false, category: 'for_sale', city: 'Lagos', propertyIdentifier };
  }

  return { isAdmin: false, category: 'short_stay', city: 'Lagos', propertyIdentifier };
}

function MainApp() {
  const [routeState, setRouteState] = useState(() => parseAppRoute());
  const [currentCategory, setCurrentCategory] = useState<ListingType>(routeState.category);
  const [currentCity, setCurrentCity] = useState<SupportedCity | 'all'>(routeState.city);

  const [properties, setProperties] = useState<Property[]>([]);
  const [currency] = useState<CurrencyCode>('NGN');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoadingDirectProperty, setIsLoadingDirectProperty] = useState<boolean>(() => Boolean(parsePropertyIdentifierFromUrl()));

  // Direct selection handler that updates browser URL to unique property link
  const handleSelectProperty = (prop: Property, replaceHistory = false) => {
    setSelectedProperty(prop);
    if (prop.listing_type) {
      setCurrentCategory(prop.listing_type);
    }
    const propertyUrl = getPropertyUrl(prop);
    if (typeof window !== 'undefined') {
      if (replaceHistory) {
        window.history.replaceState({ propertyId: prop.id }, '', propertyUrl);
      } else {
        window.history.pushState({ propertyId: prop.id }, '', propertyUrl);
      }
    }
    document.title = `${prop.title} | Legit Properties`;
    trackMetaPixelEvent('ViewContent', {
      content_name: prop.title,
      content_ids: [prop.id],
      content_type: 'product',
      value: prop.priceNgn,
      currency: prop.currency || 'NGN'
    });
  };

  const handleClosePropertyModal = () => {
    setSelectedProperty(null);
    if (typeof window !== 'undefined') {
      const currentPropInUrl = parsePropertyIdentifierFromUrl();
      if (currentPropInUrl) {
        const fallbackUrl = currentCategory === 'short_stay' ? '#/short-stay/lagos' : '#/properties-for-sale';
        window.history.pushState(null, '', fallbackUrl);
      }
    }
  };

  // 1. Initial direct link resolution on mount & path-to-hash normalization
  useEffect(() => {
    const propIdentifier = parsePropertyIdentifierFromUrl();

    // If loaded via server-side path /property/:slug, normalize URL to /#/property/:slug
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/property/')) {
      if (propIdentifier) {
        window.history.replaceState(null, '', `/#/property/${encodeURIComponent(propIdentifier)}`);
      }
    }

    if (!propIdentifier) {
      setIsLoadingDirectProperty(false);
      return;
    }

    let isMounted = true;
    (async () => {
      setIsLoadingDirectProperty(true);
      const direct = await fetchPropertyByIdOrSlug(propIdentifier);
      if (isMounted && direct) {
        handleSelectProperty(direct, true);
      }
      if (isMounted) {
        setIsLoadingDirectProperty(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load properties live from Supabase (Strict zero mock data)
  useEffect(() => {
    async function loadProperties() {
      const data = await fetchPropertiesFromSupabase();
      setProperties(data || []);

      // If user came via unique property link and not resolved yet, match from catalog
      const propIdentifier = parsePropertyIdentifierFromUrl();
      if (propIdentifier && data && data.length > 0) {
        const found = data.find(
          (p) =>
            p.slug === propIdentifier ||
            p.id === propIdentifier ||
            p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === propIdentifier
        );
        if (found) {
          handleSelectProperty(found, true);
        }
      }
    }
    loadProperties();
  }, []);

  // 3. Sync route and property selection on popstate and hashchange
  useEffect(() => {
    const handleUrlChange = async () => {
      const route = parseAppRoute();
      setRouteState(route);
      if (!route.isAdmin) {
        setCurrentCategory(route.category);
        setCurrentCity(route.city);
      }

      const propIdentifier = parsePropertyIdentifierFromUrl();
      if (!propIdentifier) {
        setSelectedProperty(null);
      } else {
        const found = properties.find(
          (p) =>
            p.slug === propIdentifier ||
            p.id === propIdentifier ||
            p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === propIdentifier
        );
        if (found) {
          handleSelectProperty(found, true);
        } else {
          setIsLoadingDirectProperty(true);
          const direct = await fetchPropertyByIdOrSlug(propIdentifier);
          if (direct) {
            handleSelectProperty(direct, true);
            setProperties((prev) => (prev.some((p) => p.id === direct.id) ? prev : [direct, ...prev]));
          }
          setIsLoadingDirectProperty(false);
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [properties]);

  // Update Document SEO metadata & Schema.org on location/category change
  useEffect(() => {
    if (routeState.isAdmin) {
      document.title = 'Administrator Portal | Legit Properties';
      return;
    }

    if (currentCategory === 'short_stay') {
      document.title = 'Luxury Short Stay Apartments in Lagos | Legit Properties';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Book hand-picked, verified short stay apartments and luxury shortlets in Lagos with 24/7 uninterrupted power, high-speed fiber Wi-Fi, and direct host WhatsApp.'
        );
      }
    } else {
      document.title = 'Verified Properties for Sale in Lagos | Legit Properties';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Buy legally vetted lands, off-plan duplexes, and luxury residences in Lagos with certified C of O, Governor\'s Consent, and land registry records.'
        );
      }
    }

    // Embed Schema.org JSON-LD
    let scriptTag = document.getElementById('seo-structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-structured-data';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': currentCategory === 'short_stay' ? 'LodgingBusiness' : 'RealEstateAgent',
      name: 'Legit Properties',
      description: 'Premium short-stay apartments and verified real estate in Lagos, Nigeria.',
      url: typeof window !== 'undefined' ? window.location.href : 'https://legitproperties.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lagos',
        addressCountry: 'NG'
      },
      priceRange: '₦₦₦₦'
    };

    scriptTag.textContent = JSON.stringify(schemaData);
  }, [routeState.isAdmin, currentCategory]);

  // Navigate function
  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      if (path.startsWith('/admin')) {
        window.history.pushState(null, '', '#/admin');
        setRouteState({ isAdmin: true, category: currentCategory, city: 'Lagos' });
      } else {
        window.history.pushState(null, '', path);
        const parsed = parseAppRoute();
        setRouteState(parsed);
        setCurrentCategory(parsed.category);
        setCurrentCity('Lagos');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateCity = (city: SupportedCity | 'all', category: 'short_stay' | 'for_sale') => {
    setCurrentCity('Lagos');
    setCurrentCategory(category);

    const newHash = category === 'short_stay' 
      ? '#/short-stay/lagos' 
      : '#/properties-for-sale';

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', newHash);
    }
  };

  // Bookmarks
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('legit_saved_properties');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('legit_saved_properties', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const savedProperties = useMemo(() => {
    return properties.filter((p) => savedIds.includes(p.id));
  }, [properties, savedIds]);

  // Modals state
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);

  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isTitleCheckOpen, setIsTitleCheckOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLegalGuideOpen, setIsLegalGuideOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  // If currently routed to admin
  if (routeState.isAdmin) {
    return <AdminRouteView onNavigate={navigateTo} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
      
      {/* 1. Universal Top Navigation Bar: Minimalist Logo + Hamburger Drawer (Strictly No Currency Switcher) */}
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
        onNavigateCity={handleNavigateCity}
        onOpenAdmin={() => navigateTo('/admin')}
      />

      {/* 2. Public-Facing Localized Landing Page (SEO & Conversion Optimized) */}
      <main className="flex-1">
        <LocalizedLandingPage
          currentCategory={currentCategory}
          currentCity={currentCity}
          properties={properties}
          onSelectProperty={handleSelectProperty}
          onOpenBookingModal={(prop) => setBookingProperty(prop)}
          onNavigateCity={handleNavigateCity}
        />

        {/* Trust Signals Section */}
        <TrustBar onOpenTitleCheck={() => setIsTitleCheckOpen(true)} />
      </main>

      {/* Direct Property Loading Overlay when navigating directly via URL */}
      {isLoadingDirectProperty && !selectedProperty && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
            <span className="text-sm font-semibold">Opening verified property...</span>
          </div>
        </div>
      )}

      {/* 3. Footer */}
      <Footer
        onOpenTitleCheck={() => setIsTitleCheckOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenLegalGuide={() => setIsLegalGuideOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* 4. Instant Booking Modal for Short Stays & Direct Purchase Inquiries */}
      <BookingModal
        property={bookingProperty}
        isOpen={Boolean(bookingProperty)}
        onClose={() => setBookingProperty(null)}
      />

      {/* 5. Property Detail Inspection Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={Boolean(selectedProperty)}
        onClose={handleClosePropertyModal}
        currency={currency}
        isSaved={selectedProperty ? savedIds.includes(selectedProperty.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* 6. Utility Drawers & Modals */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedProperties={savedProperties}
        currency={currency}
        onRemoveSaved={handleToggleSave}
        onClearAll={() => {
          setSavedIds([]);
          localStorage.removeItem('legit_saved_properties');
        }}
        onSelectProperty={handleSelectProperty}
      />

      <PropertyFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterOptions={{
          type: 'all',
          category: 'all',
          city: currentCity === 'all' ? 'all' : currentCity,
          minPrice: 0,
          maxPrice: 2000000000,
          titleStatus: 'all',
          purpose: 'all',
          bedrooms: 'all',
          query: ''
        }}
        onFilterChange={() => {}}
        onResetFilters={() => {}}
        totalResultsCount={properties.length}
      />

      <TitleCheckWidget
        isOpen={isTitleCheckOpen}
        onClose={() => setIsTitleCheckOpen(false)}
      />

      <PropertyRequestModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSubmitLead={() => {}}
      />

      <ClientDashboardDrawer
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        currency={currency}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenTitleCheck={() => setIsTitleCheckOpen(true)}
        onOpenLeadModal={() => setIsLeadModalOpen(true)}
      />

      <LegalGuideModal
        isOpen={isLegalGuideOpen}
        onClose={() => setIsLegalGuideOpen(false)}
        onOpenTitleCheck={() => setIsTitleCheckOpen(true)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

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
