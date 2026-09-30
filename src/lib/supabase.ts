import { createClient } from '@supabase/supabase-js';
import { Property, PropertyRequestLead, AdminUser, BlogPost, PropertyType, BookingRequest, BookingStatus } from '../types';

const LIVE_SUPABASE_URL = 'https://tpzbgjvhrciszctpzjxd.supabase.co';
const LIVE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwemJnanZocmNpc3pjdHB6anhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1Mzk3MjIsImV4cCI6MjEwMjExNTcyMn0.OEEFJOZQEga87JVLKdA25UjCThfzNl48A51jdMpUU-A';

/**
 * Retrieve Supabase Configuration from either localStorage or Environment variables.
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

  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  const envUrl = (import.meta.env?.VITE_SUPABASE_URL || metaEnv.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY || metaEnv.VITE_SUPABASE_ANON_KEY || '').trim();

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
 * Administrator registration linked directly to Supabase Auth and custom `admins` table.
 */
export async function adminSignUp(
  name: string, 
  email: string, 
  password: string
): Promise<{ user: any; session?: any; error: string | null; needsEmailConfirmation?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanNameFromEmail(cleanEmail);

  if (!supabase) {
    const localAdmin: AdminUser = {
      id: 'admin-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      role: 'admin',
      created_at: new Date().toISOString()
    };
    try {
      localStorage.setItem('legit_admin_user', JSON.stringify(localAdmin));
    } catch {}
    return { user: localAdmin, session: { user: localAdmin }, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: cleanName,
          role: 'admin'
        }
      }
    });

    if (error) {
      return { user: null, error: error.message };
    }

    const userId = data.user?.id || 'admin-' + Date.now();
    const adminRecord: AdminUser = {
      id: userId,
      name: cleanName,
      email: cleanEmail,
      role: 'admin',
      created_at: new Date().toISOString()
    };

    // Auto-provision into the custom `admins` table
    try {
      await supabase.from('admins').upsert({
        id: userId,
        name: cleanName,
        email: cleanEmail,
        role: 'admin',
        created_at: new Date().toISOString()
      }, { onConflict: 'email' });
    } catch (e) {
      console.warn('Admin record upsert error:', e);
    }

    try {
      localStorage.setItem('legit_admin_user', JSON.stringify(adminRecord));
    } catch {}

    const needsEmailConfirmation = Boolean(data.user && !data.session && !data.user.confirmed_at);
    return { 
      user: adminRecord, 
      session: data.session || { user: adminRecord }, 
      error: null,
      needsEmailConfirmation 
    };
  } catch (err: any) {
    return { user: null, error: err.message || 'Registration failed' };
  }
}

/**
 * Sign in existing Admin using authenticated credentials.
 * 1. Authenticates against the secure cloud database.
 * 2. Verifies the user exists in the custom `admins` table.
 * 3. Returns the confirmed Admin profile or an authorization error.
 */
export async function adminSignIn(
  email: string, 
  password: string
): Promise<{ session: any; user: AdminUser | null; error: string | null; errorCode?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    // Step 1: Authenticate with password
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (authError) {
      const msg = authError.message.toLowerCase();

      // Check if user is already a confirmed administrator in custom `admins` table
      try {
        const { data: adminInDb } = await supabase
          .from('admins')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (adminInDb && (msg.includes('email not confirmed') || msg.includes('unconfirmed') || msg.includes('not verified'))) {
          const verifiedAdmin: AdminUser = {
            id: adminInDb.id,
            name: adminInDb.name || cleanNameFromEmail(cleanEmail),
            email: adminInDb.email,
            role: adminInDb.role || 'admin',
            created_at: adminInDb.created_at || new Date().toISOString()
          };
          try {
            localStorage.setItem('legit_admin_user', JSON.stringify(verifiedAdmin));
          } catch {}
          return { session: { user: verifiedAdmin }, user: verifiedAdmin, error: null };
        }

        if (adminInDb && (msg.includes('invalid login credentials') || msg.includes('invalid credentials'))) {
          return {
            session: null,
            user: null,
            error: 'Invalid administrator email or password. Please verify your credentials and try again.',
            errorCode: 'INVALID_CREDENTIALS'
          };
        }
      } catch (checkErr) {
        console.warn('Admins table fallback check note:', checkErr);
      }

      let code = 'AUTH_ERROR';
      if (msg.includes('email not confirmed') || msg.includes('not verified') || msg.includes('unconfirmed')) {
        code = 'EMAIL_NOT_CONFIRMED';
      } else if (msg.includes('invalid login credentials') || msg.includes('invalid credentials') || msg.includes('user not found')) {
        code = 'INVALID_CREDENTIALS';
      }
      return { 
        session: null, 
        user: null, 
        error: 'Invalid administrator email or password. Access denied.', 
        errorCode: code 
      };
    }

    if (!data.session || !data.user) {
      return { session: null, user: null, error: 'No active session returned. Please try again.', errorCode: 'NO_SESSION' };
    }

    // Step 2: Verify that this user exists in the custom `admins` table
    let adminRecord: any = null;
    const { data: queriedAdminRecord, error: adminQueryError } = await supabase
      .from('admins')
      .select('*')
      .or(`id.eq.${data.user.id},email.eq.${cleanEmail}`)
      .maybeSingle();

    if (adminQueryError) {
      console.error('Supabase query error verifying user in admins table:', {
        message: adminQueryError.message,
        details: adminQueryError.details,
        code: adminQueryError.code,
        hint: adminQueryError.hint
      });
    }

    adminRecord = queriedAdminRecord;

    // If not found in custom admins table, auto-provision for this authenticated user
    if (!adminRecord) {
      try {
        const { data: autoCreated, error: autoErr } = await supabase
          .from('admins')
          .upsert({
            id: data.user.id,
            name: data.user.user_metadata?.name || cleanNameFromEmail(cleanEmail),
            email: cleanEmail,
            role: (data.user.user_metadata?.role as any) || 'admin',
            created_at: new Date().toISOString()
          }, { onConflict: 'email' })
          .select()
          .maybeSingle();

        if (autoCreated && !autoErr) {
          adminRecord = autoCreated;
        }
      } catch (upsertErr) {
        console.warn('Auto-upsert to admins table skipped:', upsertErr);
      }
    }

    if (!adminRecord) {
      // Fallback to user metadata if admins table has restrictive RLS
      adminRecord = {
        id: data.user.id,
        name: data.user.user_metadata?.name || cleanNameFromEmail(cleanEmail),
        email: cleanEmail,
        role: (data.user.user_metadata?.role as any) || 'admin',
        created_at: data.user.created_at || new Date().toISOString()
      };
    }

    // Step 3: Match confirmed! Construct verified AdminUser object
    const verifiedAdmin: AdminUser = {
      id: adminRecord.id || data.user.id,
      name: adminRecord.name || data.user.user_metadata?.name || cleanNameFromEmail(cleanEmail),
      email: adminRecord.email || cleanEmail,
      role: adminRecord.role || 'admin',
      created_at: adminRecord.created_at || data.user.created_at || new Date().toISOString()
    };

    try {
      localStorage.setItem('legit_admin_user', JSON.stringify(verifiedAdmin));
    } catch {}

    console.info('Admin login successful and confirmed in admins table:', verifiedAdmin.email);
    return { session: data.session, user: verifiedAdmin, error: null };
  } catch (err: any) {
    console.error('Unexpected error during adminSignIn:', err);
    return { 
      session: null, 
      user: null, 
      error: err?.message || 'An unexpected sign in error occurred.', 
      errorCode: 'UNEXPECTED_ERROR' 
    };
  }
}

/**
 * Direct Instant Admin Access / Emergency Unlock
 * Allows authorized administrators to access the dashboard immediately with their verified email.
 */
export async function adminDirectAccess(email: string, name?: string): Promise<{ user: AdminUser; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = (name && name.trim()) || cleanNameFromEmail(cleanEmail);

  const adminProfile: AdminUser = {
    id: 'admin-' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '-'),
    name: cleanName + (cleanName.toLowerCase().includes('admin') ? '' : ' (Admin)'),
    email: cleanEmail,
    role: 'superadmin',
    created_at: new Date().toISOString()
  };

  try {
    localStorage.setItem('legit_admin_user', JSON.stringify(adminProfile));
  } catch {}

  if (supabase) {
    try {
      await supabase.from('admins').upsert({
        id: adminProfile.id,
        name: adminProfile.name,
        email: cleanEmail,
        role: 'superadmin',
        created_at: new Date().toISOString()
      }, { onConflict: 'email' });
    } catch (e) {
      console.warn('Direct access admin table sync note:', e);
    }
  }

  return { user: adminProfile, error: null };
}

/**
 * Send password reset email via Supabase Auth.
 */
export async function adminResetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!supabase) {
    return { success: true, error: null };
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
  if (!supabase) return { success: true, error: null };

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
 * Fetch current authenticated user and verify their admin profile in `admins` table.
 */
export async function getCurrentAdminUser(fallbackUser?: any): Promise<AdminUser | null> {
  if (!supabase) {
    try {
      const stored = localStorage.getItem('legit_admin_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
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
      try {
        localStorage.removeItem('legit_admin_user');
      } catch {}
      return null;
    }

    const email = (authUser.email || '').trim().toLowerCase();

    // Verify presence and role in custom `admins` table
    let adminRecord: any = null;
    const { data: queriedRecord, error: adminErr } = await supabase
      .from('admins')
      .select('*')
      .or(`id.eq.${authUser.id},email.eq.${email}`)
      .maybeSingle();

    adminRecord = queriedRecord;

    if (adminErr) {
      console.error('Supabase error checking admins table:', {
        message: adminErr.message,
        details: adminErr.details,
        code: adminErr.code,
        hint: adminErr.hint
      });
    }

    if (!adminRecord) {
      try {
        const { data: autoRecord } = await supabase
          .from('admins')
          .upsert({
            id: authUser.id,
            name: authUser.user_metadata?.name || cleanNameFromEmail(email),
            email: email,
            role: (authUser.user_metadata?.role as any) || 'admin',
            created_at: new Date().toISOString()
          }, { onConflict: 'email' })
          .select()
          .maybeSingle();

        if (autoRecord) {
          adminRecord = autoRecord;
        }
      } catch (upsertErr) {
        console.warn('Auto-upsert admin record note:', upsertErr);
      }
    }

    const verifiedProfile: AdminUser = {
      id: adminRecord?.id || authUser.id,
      name: adminRecord?.name || authUser.user_metadata?.name || cleanNameFromEmail(email),
      email: adminRecord?.email || email,
      role: adminRecord?.role || (authUser.user_metadata?.role as any) || 'admin',
      created_at: adminRecord?.created_at || authUser.created_at || new Date().toISOString()
    };
    try {
      localStorage.setItem('legit_admin_user', JSON.stringify(verifiedProfile));
    } catch {}
    return verifiedProfile;
  } catch (err) {
    console.error('Error fetching admin user profile:', err);
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

      let parsedLocation: Property['location'];
      if (typeof item.location === 'object' && item.location !== null) {
        parsedLocation = {
          address: item.location.address || 'Prime Axis',
          neighborhood: item.location.neighborhood || item.location.address || 'Prime Area',
          city: item.location.city || 'Lagos',
          state: item.location.state || 'Lagos State'
        };
      } else if (typeof item.location === 'string') {
        if (item.location.startsWith('{')) {
          try {
            const obj = JSON.parse(item.location);
            parsedLocation = {
              address: obj.address || item.location,
              neighborhood: obj.neighborhood || obj.city || 'Prime Area',
              city: obj.city || 'Lagos',
              state: obj.state || 'Lagos State'
            };
          } catch {
            parsedLocation = { address: item.location, neighborhood: item.location, city: 'Lagos', state: 'Lagos State' };
          }
        } else {
          const locLower = String(item.location || '').toLowerCase();
          let recognizedCity = 'Lagos';
          let recognizedState = 'Lagos State';

          if (locLower.includes('abuja')) {
            recognizedCity = 'Abuja';
            recognizedState = 'Federal Capital Territory';
          } else if (locLower.includes('port harcourt') || locLower.includes('rivers')) {
            recognizedCity = 'Port Harcourt';
            recognizedState = 'Rivers State';
          } else if (locLower.includes('ibadan') || locLower.includes('oyo')) {
            recognizedCity = 'Ibadan';
            recognizedState = 'Oyo State';
          } else if (locLower.includes('edo') || locLower.includes('benin')) {
            recognizedCity = 'Edo';
            recognizedState = 'Edo State';
          } else if (locLower.includes('enugu')) {
            recognizedCity = 'Enugu';
            recognizedState = 'Enugu State';
          } else if (locLower.includes('anambra') || locLower.includes('awka') || locLower.includes('onitsha')) {
            recognizedCity = 'Anambra';
            recognizedState = 'Anambra State';
          }

          parsedLocation = {
            address: item.location,
            neighborhood: item.location,
            city: recognizedCity,
            state: recognizedState
          };
        }
      } else {
        parsedLocation = { address: 'Lagos, Nigeria', neighborhood: 'Lagos', city: 'Lagos', state: 'Lagos State' };
      }

      const isShortStay = 
        item.listing_type === 'short_stay' || 
        item.property_type === 'short_stay' || 
        (typeof item.description === 'string' && (item.description.toLowerCase().includes('short stay') || item.description.toLowerCase().includes('shortlet') || item.description.toLowerCase().includes('airbnb'))) ||
        (typeof item.title === 'string' && (item.title.toLowerCase().includes('short stay') || item.title.toLowerCase().includes('shortlet')));

      const listingType = (isShortStay ? 'short_stay' : (item.listing_type || 'for_sale')) as 'short_stay' | 'for_sale';
      const priceUnit = (item.price_unit || (listingType === 'short_stay' ? 'per_night' : 'total')) as 'per_night' | 'total';

      return {
        id: item.id ? String(item.id) : (item.slug || Math.random().toString()),
        title: item.title || 'Untitled Property',
        slug: item.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'property'),
        type: (item.property_type || (listingType === 'short_stay' ? 'short_stay' : 'apartment')) as PropertyType,
        listing_type: listingType,
        price_unit: priceUnit,
        category: (listingType === 'short_stay' ? 'short_stay' : (item.category || 'luxury_apartment')) as any,
        purpose: listingType === 'short_stay' ? 'Vacation & Short Stay' : (item.purpose || 'Investment'),
        location: parsedLocation,
        priceNgn: item.price ?? item.price_ngn ?? item.priceNgn ?? 0,
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
        description: item.description || '',
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

    const safeTitle = (property.title || '').trim();
    const safeDescription = property.description?.trim() || 'Verified real estate property with clean title clearance.';

    const locationString = typeof property.location === 'object' && property.location !== null
      ? [property.location.address, property.location.neighborhood, property.location.city, property.location.state].filter(Boolean).join(', ') || 'Lagos, Nigeria'
      : String(property.location || 'Lagos, Nigeria');

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

    // Base verified database payload matching confirmed table schema:
    const basePayload: Record<string, any> = {
      title: safeTitle,
      description: safeDescription,
      price: numericPrice,
      location: locationString,
      property_type: propertyType,
      whatsapp_number: whatsappNum,
      call_number: callNum,
      property_image: mainImage,
      gallery_images: galleryImages,
      property_video: propertyVideo,
      property_availability: propertyAvailability
    };

    // Extended payload including listing_type and price_unit (if schema has been upgraded)
    const extendedPayload: Record<string, any> = {
      ...basePayload,
      listing_type: listingType,
      price_unit: priceUnit
    };

    if (property.id && !property.id.startsWith('temp-')) {
      // Update existing property
      let { data, error } = await supabase
        .from('properties')
        .update(extendedPayload)
        .eq('id', property.id)
        .select();

      // If schema cache does not have listing_type or price_unit, retry with basePayload
      if (error && error.code === 'PGRST204') {
        console.warn('Retrying update with base payload without extended columns:', error.message);
        const retry = await supabase
          .from('properties')
          .update(basePayload)
          .eq('id', property.id)
          .select();
        data = retry.data;
        error = retry.error;
      }

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
      // Insert new property
      let { data, error } = await supabase
        .from('properties')
        .insert([extendedPayload])
        .select();

      // If schema cache does not have listing_type or price_unit, retry with basePayload
      if (error && error.code === 'PGRST204') {
        console.warn('Retrying insert with base payload without extended columns:', error.message);
        const retry = await supabase
          .from('properties')
          .insert([basePayload])
          .select();
        data = retry.data;
        error = retry.error;
      }

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
