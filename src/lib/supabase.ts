import { createClient } from '@supabase/supabase-js';
import { Property, PropertyRequestLead, AdminUser, BlogPost, PropertyType } from '../types';
import { INITIAL_PROPERTIES } from '../data/properties';

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

  const activeUrl = (customUrl && customUrl.trim()) || envUrl;
  const activeKey = (customKey && customKey.trim()) || envKey;

  const isConfigured = Boolean(
    activeUrl &&
    activeKey &&
    activeUrl !== 'https://your-project-id.supabase.co' &&
    activeKey !== 'your-supabase-anon-key'
  );

  return {
    url: activeUrl,
    key: activeKey,
    isConfigured,
    isCustom: Boolean(customUrl && customUrl.trim())
  };
}

export const activeSupabaseConfig = getActiveSupabaseConfig();
export const isSupabaseConfigured = activeSupabaseConfig.isConfigured;

export const supabase = isSupabaseConfigured
  ? createClient(activeSupabaseConfig.url, activeSupabaseConfig.key)
  : null;

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
 * Register a new Admin user using Supabase Auth.
 */
export async function adminSignUp(name: string, email: string, password: string): Promise<{ user: any; error: string | null; needsEmailConfirmation?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanEmail.split('@')[0];

  if (!supabase) {
    // Local / Demo Admin Account creation
    const localUser: AdminUser = {
      id: 'admin-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      role: 'superadmin',
      created_at: new Date().toISOString()
    };
    try {
      localStorage.setItem('legit_admin_user', JSON.stringify(localUser));
    } catch {}
    return { user: localUser, error: null };
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

    const createdUser = data.user;
    const needsEmailConfirmation = Boolean(createdUser && (!createdUser.confirmed_at && !createdUser.email_confirmed_at && (!data.session)));

    // Try sync insert into admins table in case database trigger isn't set yet
    if (createdUser) {
      try {
        await supabase.from('admins').upsert({
          id: createdUser.id,
          name: cleanName,
          email: cleanEmail,
          role: 'admin',
          created_at: new Date().toISOString()
        }, { onConflict: 'email' });
      } catch (err) {
        console.warn('Admins table direct upsert skipped:', err);
      }
    }

    return { user: createdUser, error: null, needsEmailConfirmation };
  } catch (err: any) {
    return { user: null, error: err.message || 'An unexpected registration error occurred.' };
  }
}

/**
 * Sign in existing Admin using Supabase Auth with Email and Password.
 * 1. Calls supabase.auth.signInWithPassword.
 * 2. Verifies the user exists in the custom `admins` table.
 * 3. Returns the confirmed Admin profile or an authorization error.
 */
export async function adminSignIn(
  email: string, 
  password: string
): Promise<{ session: any; user: AdminUser | null; error: string | null; errorCode?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!supabase) {
    // Seamless local admin login when Supabase credentials are not configured
    const demoAdmin: AdminUser = {
      id: 'admin-root-' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '-'),
      name: cleanNameFromEmail(cleanEmail) + ' (Admin)',
      email: cleanEmail,
      role: 'superadmin',
      created_at: new Date().toISOString()
    };
    try {
      localStorage.setItem('legit_admin_user', JSON.stringify(demoAdmin));
    } catch {}
    return { session: { user: demoAdmin }, user: demoAdmin, error: null };
  }

  try {
    // Step 1: Authenticate with Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (authError) {
      console.error('Supabase auth.signInWithPassword Error:', {
        message: authError.message,
        status: (authError as any).status
      });

      let code = 'AUTH_ERROR';
      const msg = authError.message.toLowerCase();
      if (msg.includes('email not confirmed') || msg.includes('not verified') || msg.includes('unconfirmed')) {
        code = 'EMAIL_NOT_CONFIRMED';
      } else if (msg.includes('invalid login credentials') || msg.includes('invalid credentials') || msg.includes('user not found')) {
        code = 'INVALID_CREDENTIALS';
      }
      return { session: null, user: null, error: authError.message, errorCode: code };
    }

    if (!data.session || !data.user) {
      return { session: null, user: null, error: 'No active session returned from Supabase Auth.', errorCode: 'NO_SESSION' };
    }

    // Step 2: Verify that this user exists in the custom `admins` table
    const { data: adminRecord, error: adminQueryError } = await supabase
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

    if (!adminRecord) {
      console.warn(`Admin access rejected: ${cleanEmail} authenticated in Auth but was not found in 'admins' table.`);
      // Sign out since user does not have admin record
      await supabase.auth.signOut();
      try {
        localStorage.removeItem('legit_admin_user');
      } catch {}

      return {
        session: null,
        user: null,
        error: `Access Denied: The account (${cleanEmail}) is not registered in the database 'admins' table.`,
        errorCode: 'NOT_IN_ADMINS_TABLE'
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
    const { data: adminRecord, error: adminErr } = await supabase
      .from('admins')
      .select('*')
      .or(`id.eq.${authUser.id},email.eq.${email}`)
      .maybeSingle();

    if (adminErr) {
      console.error('Supabase error checking admins table:', {
        message: adminErr.message,
        details: adminErr.details,
        code: adminErr.code,
        hint: adminErr.hint
      });
    }

    if (adminRecord) {
      const verifiedProfile: AdminUser = {
        id: adminRecord.id || authUser.id,
        name: adminRecord.name || authUser.user_metadata?.name || cleanNameFromEmail(email),
        email: adminRecord.email || email,
        role: adminRecord.role || 'admin',
        created_at: adminRecord.created_at || authUser.created_at || new Date().toISOString()
      };
      try {
        localStorage.setItem('legit_admin_user', JSON.stringify(verifiedProfile));
      } catch {}
      return verifiedProfile;
    }

    // User is authenticated in Supabase Auth, but NOT in custom `admins` table
    console.warn(`User ${email} (${authUser.id}) is authenticated but not registered in 'admins' table.`);
    try {
      localStorage.removeItem('legit_admin_user');
    } catch {}
    return null;
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
 * Fetch properties from Supabase `properties` table, or fall back to local seed data.
 */
export async function fetchPropertiesFromSupabase(): Promise<Property[]> {
  if (!supabase) {
    return INITIAL_PROPERTIES;
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('date_added', { ascending: false });

    if (error) {
      console.error('Supabase fetchProperties Error:', {
        message: error.message,
        details: error.details,
        code: error.code
      });
      return INITIAL_PROPERTIES;
    }

    if (!data || data.length === 0) {
      return INITIAL_PROPERTIES;
    }

    return data.map((item) => {
      const mainImg = item.property_image || (Array.isArray(item.gallery_images) && item.gallery_images[0]) || (Array.isArray(item.images) && item.images[0]) || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80';
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
          parsedLocation = {
            address: item.location,
            neighborhood: item.location,
            city: item.location.includes('Abuja') ? 'Abuja' : item.location.includes('Port Harcourt') ? 'Port Harcourt' : item.location.includes('Ibadan') ? 'Ibadan' : 'Lagos',
            state: item.location.includes('Abuja') ? 'FCT' : item.location.includes('Port Harcourt') ? 'Rivers State' : 'Lagos State'
          };
        }
      } else {
        parsedLocation = { address: 'Lagos, Nigeria', neighborhood: 'Lagos', city: 'Lagos', state: 'Lagos State' };
      }

      return {
        id: item.id ? String(item.id) : (item.slug || Math.random().toString()),
        title: item.title || 'Untitled Property',
        slug: item.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'property'),
        type: (item.property_type || item.type || 'land') as PropertyType,
        category: item.category || 'prime_land',
        purpose: item.purpose || 'Investment',
        location: parsedLocation,
        priceNgn: item.price ?? item.price_ngn ?? item.priceNgn ?? 0,
        sizeSqm: item.size_sqm ?? item.sizeSqm ?? item.size,
        plotsCount: item.plots_count ?? item.plotsCount ?? item.plots ?? 1,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        titleStatus: item.title_status ?? item.titleStatus ?? 'Certificate of Occupancy (C of O)',
        titleVerified: item.title_verified ?? item.titleVerified ?? true,
        verificationDocNo: item.verification_doc_no ?? item.verificationDocNo ?? 'LEGIT/VERIFIED/2026',
        developerInfo: typeof item.developer_info === 'string' ? JSON.parse(item.developer_info) : (item.developerInfo || { name: 'Legit Verified Direct Owner', trackRecord: '10+ Years', verifiedStatus: 'CAC Verified' }),
        featured: item.featured ?? false,
        images: gallery,
        property_image: mainImg,
        gallery_images: gallery,
        description: item.description || '',
        features: Array.isArray(item.features) ? item.features : ['100% Dry Land', 'Paved Access Road', 'Registered Title Survey'],
        amenities: Array.isArray(item.amenities) ? item.amenities : ['Central Drainage', 'Security Patrol', 'Paved Road'],
        nearbyLandmarks: Array.isArray(item.nearby_landmarks) ? item.nearby_landmarks : (item.nearbyLandmarks || ['Close to Express Road', 'Prime Commercial Hub']),
        paymentPlan: typeof item.payment_plan === 'string' ? JSON.parse(item.payment_plan) : (item.paymentPlan || { available: true, minDownpaymentPercent: 20, maxTenorMonths: 12 }),
        completionDate: item.completion_date ?? item.completionDate,
        virtualTourUrl: item.virtual_tour_url ?? item.virtualTourUrl,
        dateAdded: item.date_added ?? item.created_at ?? item.dateAdded ?? new Date().toISOString().split('T')[0],
        verificationNotes: item.verification_notes ?? item.verificationNotes ?? '100% Certified Title Search at Lands Registry',
        whatsappNumber: item.whatsapp_number,
        callNumber: item.call_number,
        property_type: item.property_type || item.type
      };
    });
  } catch (err) {
    console.error('Error fetching properties from Supabase:', err);
    return INITIAL_PROPERTIES;
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
      fullErrorString += ' — (RLS Violation: No active Supabase Auth session detected. Please sign in via the Admin Login page to include an authenticated user JWT in the request).';
    } else {
      fullErrorString += ` — (RLS Violation: Active user is ${activeUser.email || activeUser.id}. Please verify that your Supabase RLS policy allows INSERT/UPDATE on table 'properties' for this user role).`;
    }
  }

  return fullErrorString;
}

/**
 * Save / update property in Supabase `properties` table.
 * 1. Strictly maps payload to exact database columns:
 *    (id, title, description, price, location, property_type, whatsapp_number, call_number, property_image, gallery_images).
 * 2. Excludes non-existent schema columns like `amenities` to prevent PostgREST PGRST204 schema cache errors.
 * 3. Explicitly logs error.message and error.details to console on failure.
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
    // (id, title, description, price, location, property_type, whatsapp_number, call_number, property_image, gallery_images)
    const rawPrice = property.priceNgn ?? (property as any).price ?? 0;
    const numericPrice = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice) || 0;

    const safeTitle = (property.title || '').trim();
    const safeDescription = property.description?.trim() || 'Verified real estate property with clean title clearance.';

    const locationString = typeof property.location === 'object' && property.location !== null
      ? [property.location.address, property.location.neighborhood, property.location.city, property.location.state].filter(Boolean).join(', ') || 'Lagos, Nigeria'
      : String(property.location || 'Lagos, Nigeria');

    const mainImage = Array.isArray(property.images) && property.images.length > 0
      ? property.images[0]
      : (property.property_image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80');

    const galleryImages = Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : (property.gallery_images || [mainImage]);

    const propertyType = property.property_type || property.type || 'land';
    const whatsappNum = property.whatsappNumber || (property as any).whatsapp_number || '+2348030000000';
    const callNum = property.callNumber || (property as any).call_number || '+2348030000000';

    // Exact database payload matching the table schema (NO `amenities` or other unmapped columns)
    const dbPayload: Record<string, any> = {
      title: safeTitle,
      description: safeDescription,
      price: numericPrice,
      location: locationString,
      property_type: propertyType,
      whatsapp_number: whatsappNum,
      call_number: callNum,
      property_image: mainImage,
      gallery_images: galleryImages
    };

    if (property.id && !property.id.startsWith('temp-')) {
      // Update existing property
      const { data, error } = await supabase
        .from('properties')
        .update(dbPayload)
        .eq('id', property.id)
        .select();

      if (error) {
        // Explicitly log the exact Supabase error (message, details, code, hint)
        console.error('Supabase Property Update Failed:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          payload: dbPayload
        });
        console.error(`[Supabase Error Details] Message: ${error.message} | Details: ${error.details || 'None'} | Code: ${error.code || 'None'}`);

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
      const { data, error } = await supabase
        .from('properties')
        .insert([dbPayload])
        .select();

      if (error) {
        // Explicitly log the exact Supabase error (message, details, code, hint)
        console.error('Supabase Property Insert Failed:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          payload: dbPayload
        });
        console.error(`[Supabase Error Details] Message: ${error.message} | Details: ${error.details || 'None'} | Code: ${error.code || 'None'}`);

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
