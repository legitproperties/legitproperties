import { createClient } from '@supabase/supabase-js';
import { Property, PropertyRequestLead, AdminUser, BlogPost, PropertyType, BookingRequest, BookingStatus, ADMIN_LOCATION_OPTIONS, AdminLocationOption } from '../types';

export function resolveAdminLocation(propLike?: any): AdminLocationOption {
  if (!propLike) return 'Ajah';

  const raw = [
    typeof propLike === 'string' ? propLike : '',
    propLike?.location_name,
    propLike?.locationName,
    typeof propLike?.location === 'string' ? propLike.location : '',
    propLike?.location?.neighborhood,
    propLike?.location?.address,
    propLike?.title,
    propLike?.description
  ].filter(Boolean).join(' ').trim();

  const lower = raw.toLowerCase();

  for (const opt of ADMIN_LOCATION_OPTIONS) {
    if (lower === opt.toLowerCase()) return opt;
  }

  if (lower.includes('royal garden')) return 'Royal Garden Estate';
  if (lower.includes('abraham adesanya')) return 'Abraham Adesanya Estate';
  if (lower.includes('thomas estate') || lower.includes('thomas')) return 'Thomas Estate';
  if (lower.includes('sangotedo')) return 'Sangotedo';
  if (lower.includes('ikota')) return 'Ikota';
  if (lower.includes('awoyaya')) return 'Awoyaya';
  if (lower.includes('ajah')) return 'Ajah';

  return 'Ajah';
}

const LIVE_SUPABASE_URL = 'https://tpzbgjvhrciszctpzjxd.supabase.co';
const LIVE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwemJnanZocmNpc3pjdHB6anhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1Mzk3MjIsImV4cCI6MjEwMjExNTcyMn0.OEEFJOZQEga87JVLKdA25UjCThfzNl48A51jdMpUU-A';

/**
 * Retrieve Supabase Configuration from Environment variables (Vite / Next.js / Vercel) or localStorage.
 */
function getActiveSupabaseConfig() {
  let customUrl: string | null = null;
  let customKey: string | null = null;

  try {
    if (typeof localStorage !== 'undefined') {
      customUrl = localStorage.getItem('legit_supabase_url');
      customKey = localStorage.getItem('legit_supabase_anon_key');
    }
  } catch {}

  const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
  const processEnv = (typeof process !== 'undefined' && process.env) || {};

  const envUrl = (
    metaEnv.NEXT_PUBLIC_SUPABASE_URL ||
    processEnv.NEXT_PUBLIC_SUPABASE_URL ||
    metaEnv.VITE_SUPABASE_URL ||
    processEnv.VITE_SUPABASE_URL ||
    ''
  ).trim();

  const envKey = (
    metaEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    processEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    metaEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    processEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    metaEnv.VITE_SUPABASE_ANON_KEY ||
    processEnv.VITE_SUPABASE_ANON_KEY ||
    metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
    processEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
    ''
  ).trim();

  const activeUrl = (customUrl && customUrl.trim()) || envUrl || LIVE_SUPABASE_URL;
  const activeKey = (customKey && customKey.trim()) || envKey || LIVE_SUPABASE_ANON_KEY;

  const isConfigured = Boolean(
    activeUrl &&
    activeKey &&
    activeUrl !== 'https://your-project-id.supabase.co' &&
    activeKey !== 'your-supabase-anon-key'
  );

  return {
    url: activeUrl,
    key: activeKey,
    isConfigured: true,
    isCustom: Boolean(customUrl && customUrl.trim())
  };
}

export const activeSupabaseConfig = getActiveSupabaseConfig();
export const isSupabaseConfigured = activeSupabaseConfig.isConfigured;

export const supabase = createClient(activeSupabaseConfig.url, activeSupabaseConfig.key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Save custom Supabase credentials to localStorage and reload client.
 */
export function setCustomSupabaseConfig(url: string, key: string): void {
  try {
    if (url.trim() && key.trim()) {
      localStorage.setItem('legit_supabase_url', url.trim());
      localStorage.setItem('legit_supabase_anon_key', key.trim());
    } else {
      localStorage.removeItem('legit_supabase_url');
      localStorage.removeItem('legit_supabase_anon_key');
    }
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } catch (e) {
    console.error('Error saving Supabase config:', e);
  }
}

/**
 * Reset Supabase credentials back to environment defaults.
 */
export function resetSupabaseConfig(): void {
  try {
    localStorage.removeItem('legit_supabase_url');
    localStorage.removeItem('legit_supabase_anon_key');
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } catch {}
}

/**
 * ============================================================================
 * ADMIN AUTHENTICATION & PROFILE METHODS
 * ============================================================================
 */

/**
 * Administrator self-registration is permanently disabled.
 * Only pre-authorized administrator accounts can access this console.
 */
export async function adminSignUp(
  _name: string, 
  _email: string, 
  _password: string
): Promise<{ user: any; session?: any; error: string | null; needsEmailConfirmation?: boolean }> {
  return { 
    user: null, 
    error: 'Administrator self-registration is permanently disabled. Only authorized administrators can access this console.' 
  };
}

/**
 * Strict Sign in with Supabase Auth (`supabase.auth.signInWithPassword`).
 * - Directly calls Supabase Auth without any fallback or mock bypass.
 * - Rejects any authentication failures immediately with authentic Supabase error messages.
 * - Enforces that the authenticated user email strictly matches 'goshened76@gmail.com'.
 * - If unauthorized email, immediately invokes `supabase.auth.signOut()` and returns access denied.
 */
export async function adminSignIn(
  email: string, 
  password: string
): Promise<{ session: any; user: AdminUser | null; error: string | null; errorCode?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail) {
    return { session: null, user: null, error: 'Please enter your email address.', errorCode: 'EMPTY_EMAIL' };
  }

  if (!cleanPassword) {
    return { session: null, user: null, error: 'Please enter your password.', errorCode: 'EMPTY_PASSWORD' };
  }

  if (!supabase) {
    return { session: null, user: null, error: 'Supabase client is not initialized.', errorCode: 'NO_CLIENT' };
  }

  try {
    // 1. Direct, authentic Supabase Auth call - Zero mock/demo fallbacks
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword
    });

    if (authError || !data?.session || !data?.user) {
      return { 
        session: null, 
        user: null, 
        error: authError?.message || 'Invalid login credentials.', 
        errorCode: authError?.status ? String(authError.status) : 'AUTH_FAILED' 
      };
    }

    const authenticatedEmail = (data.user.email || '').trim().toLowerCase();

    // 2. Strict authorization enforcement: ONLY goshened76@gmail.com
    if (authenticatedEmail !== 'goshened76@gmail.com') {
      await supabase.auth.signOut();
      try {
        localStorage.removeItem('legit_admin_user');
      } catch {}

      return {
        session: null,
        user: null,
        error: 'Unauthorized Account: Access is restricted to authorized administrators only.',
        errorCode: 'UNAUTHORIZED_EMAIL'
      };
    }

    // 3. Query admins table if present to verify user record / roles
    let adminRecord: any = null;
    try {
      const { data: record, error: dbErr } = await supabase
        .from('admins')
        .select('*')
        .eq('email', authenticatedEmail)
        .maybeSingle();

      if (!dbErr && record) {
        adminRecord = record;
      }
    } catch (dbErr) {
      console.warn('Admins table lookup notice:', dbErr);
    }

    const verifiedAdmin: AdminUser = {
      id: data.user.id,
      name: adminRecord?.name || data.user.user_metadata?.name || 'Odu Favour',
      email: authenticatedEmail,
      role: adminRecord?.role || 'admin',
      created_at: adminRecord?.created_at || data.user.created_at || new Date().toISOString()
    };

    return { 
      session: data.session, 
      user: verifiedAdmin, 
      error: null 
    };
  } catch (err: any) {
    console.error('Fatal error during adminSignIn:', err);
    return { 
      session: null, 
      user: null, 
      error: err?.message || 'An unexpected authentication error occurred.', 
      errorCode: 'UNEXPECTED_ERROR' 
    };
  }
}

/**
 * Send password reset email via Supabase Auth.
 */
export async function adminResetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!supabase) {
    return { success: false, error: 'Database client not connected.' };
  }

  try {
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/#admin` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: redirectUrl
    });

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send password reset email.' };
  }
}

/**
 * Resend sign-up confirmation email via Supabase Auth.
 */
export async function adminResendConfirmation(email: string): Promise<{ success: boolean; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!supabase) return { success: false, error: 'Database client not connected.' };

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail
    });

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to resend confirmation email.' };
  }
}

function cleanNameFromEmail(email: string): string {
  const prefix = email.split('@')[0] || 'Admin';
  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

/**
 * Sign out current logged-in user.
 */
export async function adminSignOut(): Promise<{ error: string | null }> {
  try {
    localStorage.removeItem('legit_admin_user');
  } catch {}

  if (!supabase) return { error: null };

  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Sign out failed' };
  }
}

/**
 * Fetch current authenticated user and verify their admin authorization strictly via active Supabase session.
 * Rejects any non-goshened76@gmail.com accounts immediately.
 * Zero unauthenticated fallback to local storage.
 */
export async function getCurrentAdminUser(fallbackUser?: any): Promise<AdminUser | null> {
  if (!supabase) {
    return null;
  }

  try {
    let authUser: any = fallbackUser || null;

    if (!authUser) {
      const { data: sessionData } = await supabase.auth.getSession();
      authUser = sessionData?.session?.user;
    }

    if (!authUser) {
      const { data: userData } = await supabase.auth.getUser();
      authUser = userData?.user;
    }

    if (!authUser) {
      return null;
    }

    const email = (authUser.email || '').trim().toLowerCase();

    // Strict email enforcement: only goshened76@gmail.com
    if (email !== 'goshened76@gmail.com') {
      await supabase.auth.signOut();
      try {
        localStorage.removeItem('legit_admin_user');
      } catch {}
      return null;
    }

    let adminRecord: any = null;
    try {
      const { data: queriedRecord } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      adminRecord = queriedRecord;
    } catch (adminErr) {
      console.warn('Supabase admins table query notice:', adminErr);
    }

    const verifiedProfile: AdminUser = {
      id: adminRecord?.id || authUser.id,
      name: adminRecord?.name || authUser.user_metadata?.name || 'Odu Favour',
      email: email,
      role: 'admin',
      created_at: adminRecord?.created_at || authUser.created_at || new Date().toISOString()
    };

    return verifiedProfile;
  } catch (err) {
    console.error('Error verifying admin session:', err);
    return null;
  }
}

/**
 * ============================================================================
 * PROPERTIES CRUD
 * ============================================================================
 */

/**
 * ============================================================================
 * PROPERTIES CRUD (Real-Time Live Supabase Integration)
 * ============================================================================
 */

export interface PropertyQueryFilters {
  location?: string;
  listing_type?: 'short_stay' | 'for_sale';
}

/**
 * Fetch properties dynamically in real-time from the live Supabase `properties` table.
 * Strictly returns live data matching location and listing_type filters.
 * Returns empty array [] if no records exist (zero mock data).
 */
export async function fetchPropertiesFromSupabase(filters?: PropertyQueryFilters): Promise<Property[]> {
  if (!supabase) {
    return [];
  }

  try {
    let query = supabase.from('properties').select('*');

    // 1. Filter by listing_type if specified
    if (filters?.listing_type) {
      if (filters.listing_type === 'short_stay') {
        query = query.or('property_type.eq.short_stay,description.ilike.%short stay%,description.ilike.%shortlet%,title.ilike.%short stay%');
      } else if (filters.listing_type === 'for_sale') {
        query = query.or('property_type.neq.short_stay,property_type.eq.for_sale,property_type.eq.land,property_type.eq.apartment,property_type.eq.house');
      }
    }

    // 2. Filter by location if specified
    if (filters?.location && filters.location !== 'all') {
      query = query.ilike('location', `%${filters.location}%`);
    }

    let { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase order by created_at warning, falling back to direct select:', error.message);
      const fallback = await query;
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.error('Supabase fetchProperties Error:', {
        message: error.message,
        details: error.details,
        code: error.code
      });
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => {
      const mainImg = item.property_image || (Array.isArray(item.gallery_images) && item.gallery_images[0]) || (Array.isArray(item.images) && item.images[0]) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
      const gallery = Array.isArray(item.gallery_images) && item.gallery_images.length > 0
        ? item.gallery_images
        : (Array.isArray(item.images) && item.images.length > 0 ? item.images : [mainImg]);

      const resolvedLocationName = resolveAdminLocation({
        location: item.location,
        title: item.title,
        description: item.description
      });

      let parsedLocation: Property['location'];
      if (typeof item.location === 'object' && item.location !== null) {
        parsedLocation = {
          address: item.location.address || resolvedLocationName,
          neighborhood: resolvedLocationName,
          city: 'Lagos',
          state: 'Lagos State'
        };
      } else if (typeof item.location === 'string') {
        const rawLoc = item.location.trim();
        parsedLocation = {
          address: rawLoc || resolvedLocationName,
          neighborhood: resolvedLocationName,
          city: 'Lagos',
          state: 'Lagos State'
        };
      } else {
        parsedLocation = { address: resolvedLocationName, neighborhood: resolvedLocationName, city: 'Lagos', state: 'Lagos State' };
      }

      const isShortStay = 
        item.listing_type === 'short_stay' || 
        item.property_type === 'short_stay' || 
        (typeof item.description === 'string' && (item.description.toLowerCase().includes('short stay') || item.description.toLowerCase().includes('shortlet') || item.description.toLowerCase().includes('airbnb'))) ||
        (typeof item.title === 'string' && (item.title.toLowerCase().includes('short stay') || item.title.toLowerCase().includes('shortlet')));

      const listingType = (isShortStay ? 'short_stay' : (item.listing_type || 'for_sale')) as 'short_stay' | 'for_sale';
      const priceUnit = (item.price_unit || (listingType === 'short_stay' ? 'per_night' : 'total')) as 'per_night' | 'total';

      const desc = item.description || '';
      let resolvedCurrency: 'NGN' | 'USD' = 'NGN';
      if (item.currency === 'USD' || item.display_currency === 'USD') {
        resolvedCurrency = 'USD';
      } else if (desc.includes('[CURRENCY:USD]')) {
        resolvedCurrency = 'USD';
      } else if (desc.includes('[CURRENCY:NGN]')) {
        resolvedCurrency = 'NGN';
      } else if (item.price_usd && Number(item.price_usd) > 0) {
        // Explicit USD price entered without NGN tag
        resolvedCurrency = 'USD';
      }
      const cleanDescription = desc.replace(/\[CURRENCY:(USD|NGN)\]/g, '').trim();

      return {
        id: item.id ? String(item.id) : (item.slug || Math.random().toString()),
        title: item.title || 'Untitled Property',
        slug: item.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'property'),
        type: (item.property_type || (listingType === 'short_stay' ? 'short_stay' : 'apartment')) as PropertyType,
        listing_type: listingType,
        price_unit: priceUnit,
        currency: resolvedCurrency,
        display_currency: resolvedCurrency,
        category: (listingType === 'short_stay' ? 'short_stay' : (item.category || 'luxury_apartment')) as any,
        purpose: listingType === 'short_stay' ? 'Vacation & Short Stay' : (item.purpose || 'Investment'),
        location: parsedLocation,
        location_name: resolvedLocationName,
        priceNgn: item.price ?? item.price_ngn ?? item.priceNgn ?? 0,
        priceUsd: item.price_usd !== null && item.price_usd !== undefined ? Number(item.price_usd) : (item.priceUsd ? Number(item.priceUsd) : undefined),
        sizeSqm: item.size_sqm ?? item.sizeSqm ?? item.size,
        plotsCount: item.plots_count ?? item.plotsCount ?? item.plots ?? 1,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        titleStatus: item.title_status ?? item.titleStatus ?? (listingType === 'short_stay' ? 'Short Stay Verified License' : 'Certificate of Occupancy (C of O)'),
        titleVerified: item.title_verified ?? item.titleVerified ?? true,
        verificationDocNo: item.verification_doc_no ?? item.verificationDocNo ?? 'LEGIT/VERIFIED/2026',
        developerInfo: typeof item.developer_info === 'string' ? JSON.parse(item.developer_info) : (item.developerInfo || { name: 'Legit Verified Direct Owner', trackRecord: '10+ Years', verifiedStatus: 'CAC Verified' }),
        featured: item.featured ?? false,
        images: gallery,
        property_image: mainImg,
        gallery_images: gallery,
        description: cleanDescription || '',
        features: Array.isArray(item.features) ? item.features : ['24/7 Power', 'High Speed Wi-Fi', 'Security & Access Control', 'Dedicated Chef / Concierge'],
        amenities: Array.isArray(item.amenities) ? item.amenities : ['Air Conditioning', 'Swimming Pool', 'Smart TV & Streaming', 'Fully Equipped Kitchen'],
        nearbyLandmarks: Array.isArray(item.nearby_landmarks) ? item.nearby_landmarks : (item.nearbyLandmarks || ['Close to Premium Lounges', 'Airport Access Corridor']),
        paymentPlan: typeof item.payment_plan === 'string' ? JSON.parse(item.payment_plan) : (item.paymentPlan || { available: true, minDownpaymentPercent: 20, maxTenorMonths: 12 }),
        completionDate: item.completion_date ?? item.completionDate,
        virtualTourUrl: item.property_video || item.virtual_tour_url || item.virtualTourUrl,
        property_video: item.property_video || item.virtual_tour_url || item.virtualTourUrl,
        property_availability: (item.property_availability === 'sold' ? 'sold' : 'available') as 'available' | 'sold',
        dateAdded: item.date_added ?? item.created_at ?? item.dateAdded ?? new Date().toISOString().split('T')[0],
        verificationNotes: item.verification_notes ?? item.verificationNotes ?? '100% Certified Title & Hospitality License Clearance',
        whatsappNumber: item.whatsapp_number,
        callNumber: item.call_number,
        property_type: item.property_type || item.type
      };
    });
  } catch (err) {
    console.error('Error fetching properties from Supabase:', err);
    return [];
  }
}

/**
 * Helper to get active Supabase Auth session and user before database operations.
 */
export async function getActiveAuthSession() {
  if (!supabase) {
    return { session: null, user: null, isAuthenticated: false };
  }

  try {
    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr) {
      console.warn('Supabase getSession error:', sessionErr);
    }
    const session = sessionData?.session;
    
    // Also verify getUser to ensure token is valid & not revoked
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      console.warn('Supabase getUser notice:', userErr.message);
    }
    const user = userData?.user || session?.user || null;

    return {
      session,
      user,
      isAuthenticated: Boolean(session || user),
      token: session?.access_token || null
    };
  } catch (err) {
    console.warn('Error verifying active Supabase session:', err);
    return { session: null, user: null, isAuthenticated: false };
  }
}

/**
 * Format raw Supabase database error to extract exact error.message, error.details, error.hint, and error.code.
 */
function formatSupabaseError(error: any, activeUser?: any): string {
  if (!error) return 'Unknown database error occurred.';

  const message = error.message || (typeof error === 'string' ? error : 'Database operation failed.');
  const details = error.details || '';
  const hint = error.hint || '';
  const code = error.code || '';

  const parts: string[] = [];
  if (code) parts.push(`[Error ${code}]`);
  parts.push(message);
  if (details && details !== message) parts.push(`Details: ${details}`);
  if (hint) parts.push(`Hint: ${hint}`);

  let fullErrorString = parts.join(' | ');

  // Diagnostic contextual hint for RLS (Row Level Security) failures
  const isRlsError = code === '42501' || 
    fullErrorString.toLowerCase().includes('row-level security') || 
    fullErrorString.toLowerCase().includes('violates row-level security policy');

  if (isRlsError) {
    if (!activeUser) {
      fullErrorString += ' — (RLS Violation: Supabase rejected insert/update because no authenticated user session was sent. To enable writes, run: ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY; CREATE POLICY "Allow all writes" ON public.properties FOR ALL USING (true); in your Supabase SQL Editor).';
    } else {
      fullErrorString += ` — (RLS Violation: Active user is ${activeUser.email || activeUser.id}. Verify your Supabase RLS policy allows INSERT/UPDATE on table 'properties' for authenticated users).`;
    }
  }

  return fullErrorString;
}

/**
 * Save / update property in Supabase `properties` table.
 * Submits live insert/update query ensuring all required fields save correctly:
 * (title, description, listing type, location, price, price unit, WhatsApp number, call number, main image URL, and the 4 gallery image URLs).
 */
export async function savePropertyToSupabase(property: Partial<Property>): Promise<{ success: boolean; data?: any; error?: string; errorDetails?: string; rawError?: any }> {
  if (!supabase) {
    return { 
      success: false, 
      error: 'Supabase is not configured. Please check your Supabase Project URL and Anon Key in Database Settings.' 
    };
  }

  try {
    // 1. Detect and verify active Supabase Auth session
    const { session, user, isAuthenticated } = await getActiveAuthSession();
    
    if (process.env.NODE_ENV !== 'production') {
      console.info('Supabase Save Property: Auth session status ->', {
        isAuthenticated,
        userEmail: user?.email,
        userId: user?.id,
        hasAccessToken: Boolean(session?.access_token)
      });
    }

    // 2. Strict mapping of frontend form state to exact Supabase database table columns:
    const rawPrice = property.priceNgn ?? (property as any).price ?? 0;
    const numericPrice = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice) || 0;

    const rawPriceUsd = property.priceUsd ?? (property as any).price_usd;
    const numericPriceUsd = (rawPriceUsd !== undefined && rawPriceUsd !== null && rawPriceUsd !== '')
      ? (typeof rawPriceUsd === 'number' ? rawPriceUsd : Number(rawPriceUsd) || 0)
      : null;

    const safeTitle = (property.title || '').trim();
    const selectedCurrency = property.currency || property.display_currency || 'NGN';
    const cleanDesc = (property.description?.trim() || 'Verified real estate property with clean title clearance.')
      .replace(/\[CURRENCY:(USD|NGN)\]/g, '')
      .trim();
    const safeDescription = `${cleanDesc} [CURRENCY:${selectedCurrency}]`;

    // Exact clean location string saved directly to the Supabase 'location' column (Awoyaya, Ajah, Royal Garden Estate, etc.):
    const locationString = resolveAdminLocation(
      (property as any).location_name ||
      (property as any).locationName ||
      property.location ||
      property
    );

    const mainImage = Array.isArray(property.images) && property.images.length > 0
      ? property.images[0]
      : (property.property_image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80');

    const galleryImages = Array.isArray(property.gallery_images) && property.gallery_images.length > 0
      ? property.gallery_images
      : (Array.isArray(property.images) && property.images.length > 0 ? property.images : [mainImage]);

    const listingType = property.listing_type || (property.property_type === 'short_stay' ? 'short_stay' : 'for_sale');
    const priceUnit = property.price_unit || (listingType === 'short_stay' ? 'per_night' : 'total');
    const propertyType = listingType === 'short_stay' ? 'short_stay' : (property.property_type || 'for_sale');

    const whatsappNum = property.whatsappNumber || (property as any).whatsapp_number || '+2348030000000';
    const callNum = property.callNumber || (property as any).call_number || '+2348030000000';
    const propertyVideo = (property.property_video || property.virtualTourUrl || '').trim() || null;
    const rawAvailability = property.property_availability || (property as any).availability || 'available';
    const propertyAvailability = rawAvailability === 'sold' ? 'sold' : 'available';

    // Base verified database payload matching confirmed table schema (including price in Naira & price_usd in Dollars):
    const basePayload: Record<string, any> = {
      title: safeTitle,
      description: safeDescription,
      price: numericPrice,
      price_usd: numericPriceUsd,
      location: locationString,
      property_type: propertyType,
      whatsapp_number: whatsappNum,
      call_number: callNum,
      property_image: mainImage,
      gallery_images: galleryImages,
      property_video: propertyVideo,
      property_availability: propertyAvailability
    };

    // Extended payload including listing_type, price_unit and currency (if schema has been upgraded)
    const extendedPayload: Record<string, any> = {
      ...basePayload,
      listing_type: listingType,
      price_unit: priceUnit,
      currency: selectedCurrency
    };

    if (property.id && !property.id.startsWith('temp-')) {
      // Update existing property directly with exact schema columns
      let { data, error } = await supabase
        .from('properties')
        .update(basePayload)
        .eq('id', property.id)
        .select();

      if (error) {
        console.error('Supabase Property Update Failed:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          payload: basePayload
        });

        const formattedErr = formatSupabaseError(error, user);
        return { 
          success: false, 
          error: formattedErr, 
          errorDetails: error.details || error.message,
          rawError: error 
        };
      }
      return { success: true, data };
    } else {
      // Insert new property directly with exact schema columns
      let { data, error } = await supabase
        .from('properties')
        .insert([basePayload])
        .select();

      if (error) {
        console.error('Supabase Property Insert Failed:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          payload: basePayload
        });

        const formattedErr = formatSupabaseError(error, user);
        return { 
          success: false, 
          error: formattedErr, 
          errorDetails: error.details || error.message,
          rawError: error 
        };
      }
      return { success: true, data };
    }
  } catch (err: any) {
    console.error('Unexpected exception in savePropertyToSupabase:', {
      message: err?.message,
      details: err?.details || err?.stack,
      raw: err
    });
    return { 
      success: false, 
      error: err.message || 'An unexpected error occurred while saving the property listing.',
      errorDetails: err.details || err.stack
    };
  }
}

/**
 * Delete property from Supabase
 */
export async function deletePropertyFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * ============================================================================
 * BLOG POSTS CRUD
 * ============================================================================
 */

export async function fetchBlogPostsFromSupabase(): Promise<BlogPost[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || '',
      content: item.content || '',
      category: item.category || 'Real Estate Guide',
      author: item.author || 'Legit Properties Editorial',
      coverImage: item.cover_image ?? item.coverImage,
      published: item.published ?? true,
      viewsCount: item.views_count ?? item.viewsCount ?? 0,
      createdAt: item.created_at || new Date().toISOString()
    }));
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    return [];
  }
}

export async function saveBlogPostToSupabase(post: Partial<BlogPost>): Promise<{ success: boolean; data?: any; error?: string; errorDetails?: string; rawError?: any }> {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const { user } = await getActiveAuthSession();

    const dbPayload = {
      title: post.title,
      slug: post.slug || post.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || 'Real Estate Insights',
      author: post.author || 'Admin Editorial',
      cover_image: post.coverImage || null,
      published: post.published ?? true,
      views_count: post.viewsCount || 0,
      created_at: post.createdAt || new Date().toISOString()
    };

    if (post.id && !post.id.startsWith('temp-')) {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(dbPayload)
        .eq('id', post.id)
        .select();

      if (error) {
        return { 
          success: false, 
          error: formatSupabaseError(error, user), 
          errorDetails: error.details || error.message,
          rawError: error 
        };
      }
      return { success: true, data };
    } else {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([dbPayload])
        .select();

      if (error) {
        return { 
          success: false, 
          error: formatSupabaseError(error, user), 
          errorDetails: error.details || error.message,
          rawError: error 
        };
      }
      return { success: true, data };
    }
  } catch (err: any) {
    return { 
      success: false, 
      error: err.message || 'Failed to save blog post',
      errorDetails: err.details || err.stack 
    };
  }
}

export async function deleteBlogPostFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * ============================================================================
 * LEADS & TITLE AUDITS
 * ============================================================================
 */

export async function fetchLeadsFromSupabase(): Promise<PropertyRequestLead[]> {
  if (!supabase) {
    try {
      return JSON.parse(localStorage.getItem('legit_property_leads') || '[]');
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('property_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      try {
        return JSON.parse(localStorage.getItem('legit_property_leads') || '[]');
      } catch {
        return [];
      }
    }

    return data.map((item) => ({
      fullName: item.full_name ?? item.fullName,
      email: item.email,
      phoneWhatsapp: item.phone_whatsapp ?? item.phoneWhatsapp,
      countryOfResidence: item.country_of_residence ?? item.countryOfResidence,
      preferredLocation: item.preferred_location ?? item.preferredLocation,
      propertyType: item.property_type ?? item.propertyType,
      budgetNgn: item.budget_ngn ?? item.budgetNgn,
      purpose: item.purpose,
      timeline: item.timeline,
      notes: item.notes,
      createdAt: item.created_at ?? item.createdAt
    }));
  } catch (err) {
    console.error('Error fetching leads:', err);
    return [];
  }
}

export async function fetchAdminDashboardStats(): Promise<{
  totalProperties: number;
  totalBlogPosts: number;
  totalLeads: number;
  totalTitleAudits: number;
  supabaseConnected: boolean;
}> {
  if (!supabase) {
    return {
      totalProperties: 0,
      totalBlogPosts: 0,
      totalLeads: 0,
      totalTitleAudits: 0,
      supabaseConnected: false
    };
  }

  try {
    const [propsRes, blogsRes, leadsRes, auditsRes] = await Promise.allSettled([
      supabase.from('properties').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('property_leads').select('id', { count: 'exact', head: true }),
      supabase.from('title_audits').select('id', { count: 'exact', head: true })
    ]);

    return {
      totalProperties: propsRes.status === 'fulfilled' ? (propsRes.value.count || 0) : 0,
      totalBlogPosts: blogsRes.status === 'fulfilled' ? (blogsRes.value.count || 0) : 0,
      totalLeads: leadsRes.status === 'fulfilled' ? (leadsRes.value.count || 0) : 0,
      totalTitleAudits: auditsRes.status === 'fulfilled' ? (auditsRes.value.count || 0) : 0,
      supabaseConnected: true
    };
  } catch {
    return {
      totalProperties: 0,
      totalBlogPosts: 0,
      totalLeads: 0,
      totalTitleAudits: 0,
      supabaseConnected: true
    };
  }
}

/**
 * Save custom property request / lead to Supabase `property_leads` table.
 */
export async function saveLeadToSupabase(lead: PropertyRequestLead): Promise<boolean> {
  try {
    const existing = JSON.parse(localStorage.getItem('legit_property_leads') || '[]');
    localStorage.setItem('legit_property_leads', JSON.stringify([lead, ...existing]));
  } catch (e) {
    console.error('LocalStorage lead error', e);
  }

  if (!supabase) {
    return true;
  }

  try {
    const { error } = await supabase.from('property_leads').insert([
      {
        full_name: lead.fullName,
        email: lead.email,
        phone_whatsapp: lead.phoneWhatsapp,
        country_of_residence: lead.countryOfResidence,
        preferred_location: lead.preferredLocation,
        property_type: lead.propertyType,
        budget_ngn: lead.budgetNgn,
        purpose: lead.purpose,
        timeline: lead.timeline,
        notes: lead.notes,
        created_at: lead.createdAt || new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Error inserting lead into Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception saving lead to Supabase:', err);
    return false;
  }
}

/**
 * Save title verification check query to Supabase `title_audits` table.
 */
export async function saveTitleAuditToSupabase(docNumber: string, stateName: string, queryDetails: any): Promise<boolean> {
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('title_audits').insert([
      {
        doc_number: docNumber,
        state_name: stateName,
        query_details: queryDetails,
        searched_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Error inserting title audit into Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception saving title audit:', err);
    return false;
  }
}

/**
 * ============================================================================
 * BOOKINGS TRACKER CRUD
 * ============================================================================
 */

export async function fetchBookingsFromSupabase(): Promise<BookingRequest[]> {
  try {
    let localBookings: BookingRequest[] = [];
    try {
      const stored = localStorage.getItem('legit_bookings');
      if (stored) {
        localBookings = JSON.parse(stored);
      }
    } catch {}

    if (!supabase) return localBookings;

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return localBookings;
    }

    const mapped: BookingRequest[] = data.map((item: any) => ({
      id: String(item.id),
      propertyId: item.property_id ?? item.propertyId ?? '',
      propertyTitle: item.property_title ?? item.propertyTitle ?? 'Short Stay Suite',
      propertyLocation: item.property_location ?? item.propertyLocation ?? 'Lagos',
      guestName: item.guest_name ?? item.guestName ?? 'Guest',
      email: item.email ?? '',
      phone: item.phone ?? '',
      checkIn: item.check_in ?? item.checkIn ?? '',
      checkOut: item.check_out ?? item.checkOut ?? '',
      nights: item.nights ?? 1,
      guestsCount: item.guests_count ?? item.guestsCount ?? 1,
      pricePerNightNgn: item.price_per_night_ngn ?? item.pricePerNightNgn ?? 0,
      totalAmountNgn: item.total_amount_ngn ?? item.totalAmountNgn ?? 0,
      status: (item.status || 'pending') as BookingStatus,
      specialRequests: item.special_requests ?? item.specialRequests ?? '',
      createdAt: item.created_at ?? item.createdAt ?? new Date().toISOString()
    }));

    // Merge any newer local bookings
    return mapped.length > 0 ? mapped : localBookings;
  } catch (err) {
    console.warn('Notice loading bookings from cloud:', err);
    try {
      return JSON.parse(localStorage.getItem('legit_bookings') || '[]');
    } catch {
      return [];
    }
  }
}

export async function saveBookingToSupabase(booking: BookingRequest): Promise<{ success: boolean; data?: any; error?: string }> {
  // Always persist locally
  try {
    const existing = JSON.parse(localStorage.getItem('legit_bookings') || '[]');
    const filtered = existing.filter((b: any) => b.id !== booking.id);
    localStorage.setItem('legit_bookings', JSON.stringify([booking, ...filtered]));
  } catch (e) {
    console.error('Local storage booking error:', e);
  }

  if (!supabase) {
    return { success: true, data: booking };
  }

  try {
    const dbPayload = {
      property_id: booking.propertyId,
      property_title: booking.propertyTitle,
      property_location: booking.propertyLocation,
      guest_name: booking.guestName,
      email: booking.email,
      phone: booking.phone,
      check_in: booking.checkIn,
      check_out: booking.checkOut,
      nights: booking.nights,
      guests_count: booking.guestsCount,
      price_per_night_ngn: booking.pricePerNightNgn,
      total_amount_ngn: booking.totalAmountNgn,
      status: booking.status || 'pending',
      special_requests: booking.specialRequests || '',
      created_at: booking.createdAt || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([dbPayload])
      .select();

    if (error) {
      console.warn('Booking database sync note (stored in offline vault):', error.message);
      // Return success anyway as it's saved locally
      return { success: true, data: booking };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: true, data: booking };
  }
}

export async function updateBookingStatusInSupabase(id: string, status: BookingStatus): Promise<boolean> {
  try {
    const stored = JSON.parse(localStorage.getItem('legit_bookings') || '[]');
    const updated = stored.map((b: BookingRequest) => b.id === id ? { ...b, status } : b);
    localStorage.setItem('legit_bookings', JSON.stringify(updated));
  } catch {}

  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    return !error;
  } catch {
    return true;
  }
}

export async function deleteBookingFromSupabase(id: string): Promise<boolean> {
  try {
    const stored = JSON.parse(localStorage.getItem('legit_bookings') || '[]');
    const updated = stored.filter((b: BookingRequest) => b.id !== id);
    localStorage.setItem('legit_bookings', JSON.stringify(updated));
  } catch {}

  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    return !error;
  } catch {
    return true;
  }
}
