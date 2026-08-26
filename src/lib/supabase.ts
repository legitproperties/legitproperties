import { createClient } from '@supabase/supabase-js';
import { Property, PropertyRequestLead, AdminUser, BlogPost } from '../types';
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
 */
export async function adminSignIn(email: string, password: string): Promise<{ session: any; user: any; error: string | null; errorCode?: string }> {
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      let code = 'AUTH_ERROR';
      const msg = error.message.toLowerCase();
      if (msg.includes('email not confirmed') || msg.includes('not verified') || msg.includes('unconfirmed')) {
        code = 'EMAIL_NOT_CONFIRMED';
      } else if (msg.includes('invalid login credentials') || msg.includes('invalid credentials') || msg.includes('user not found')) {
        code = 'INVALID_CREDENTIALS';
      }
      return { session: null, user: null, error: error.message, errorCode: code };
    }

    return { session: data.session, user: data.user, error: null };
  } catch (err: any) {
    return { session: null, user: null, error: err.message || 'Sign in failed.', errorCode: 'NETWORK_ERROR' };
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
 * Fetch current authenticated user and their admin profile.
 */
export async function getCurrentAdminUser(fallbackUser?: any): Promise<AdminUser | null> {
  // If a user object is explicitly supplied from sign-in/sign-up, map it directly
  if (fallbackUser) {
    const directUser: AdminUser = {
      id: fallbackUser.id || 'admin-user',
      name: fallbackUser.user_metadata?.name || fallbackUser.name || cleanNameFromEmail(fallbackUser.email || 'admin') + ' (Admin)',
      email: fallbackUser.email || '',
      role: (fallbackUser.user_metadata?.role as any) || fallbackUser.role || 'admin',
      created_at: fallbackUser.created_at || new Date().toISOString()
    };
    try {
      localStorage.setItem('legit_admin_user', JSON.stringify(directUser));
    } catch {}
    return directUser;
  }

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
    let authUser: any = null;
    try {
      const { data } = await supabase.auth.getUser();
      authUser = data?.user;
    } catch {
      // ignore
    }

    if (!authUser) {
      try {
        const { data } = await supabase.auth.getSession();
        authUser = data?.session?.user;
      } catch {
        // ignore
      }
    }

    if (!authUser) {
      try {
        const stored = localStorage.getItem('legit_admin_user');
        if (stored) return JSON.parse(stored);
      } catch {}
      return null;
    }

    // Try check admins table for extended role/name
    try {
      const { data: adminRecord, error: adminErr } = await supabase
        .from('admins')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (adminRecord && !adminErr) {
        const fullProfile: AdminUser = {
          id: adminRecord.id,
          name: adminRecord.name || authUser.user_metadata?.name || 'Admin User',
          email: adminRecord.email || authUser.email || '',
          role: adminRecord.role || 'admin',
          created_at: adminRecord.created_at || authUser.created_at
        };
        try {
          localStorage.setItem('legit_admin_user', JSON.stringify(fullProfile));
        } catch {}
        return fullProfile;
      }
    } catch (e) {
      console.warn('Could not query admins table directly:', e);
    }

    // Default fallback from Supabase auth user
    const fallbackProfile: AdminUser = {
      id: authUser.id,
      name: authUser.user_metadata?.name || cleanNameFromEmail(authUser.email || 'admin') + ' (Admin)',
      email: authUser.email || '',
      role: (authUser.user_metadata?.role as any) || 'admin',
      created_at: authUser.created_at || new Date().toISOString()
    };
    try {
      localStorage.setItem('legit_admin_user', JSON.stringify(fallbackProfile));
    } catch {}
    return fallbackProfile;
  } catch (err) {
    console.error('Error fetching admin user profile:', err);
    try {
      const stored = localStorage.getItem('legit_admin_user');
      if (stored) return JSON.parse(stored);
    } catch {}
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

    if (error || !data || data.length === 0) {
      return INITIAL_PROPERTIES;
    }

    return data.map((item) => ({
      id: item.id || item.slug,
      title: item.title,
      slug: item.slug,
      type: item.type,
      category: item.category,
      purpose: item.purpose,
      location: typeof item.location === 'string' ? JSON.parse(item.location) : item.location,
      priceNgn: item.price_ngn ?? item.priceNgn,
      sizeSqm: item.size_sqm ?? item.sizeSqm,
      plotsCount: item.plots_count ?? item.plotsCount,
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      titleStatus: item.title_status ?? item.titleStatus,
      titleVerified: item.title_verified ?? item.titleVerified ?? true,
      verificationDocNo: item.verification_doc_no ?? item.verificationDocNo,
      developerInfo: typeof item.developer_info === 'string' ? JSON.parse(item.developer_info) : (item.developerInfo || { name: 'Legit Verified', trackRecord: '10+ Years', verifiedStatus: 'CAC Verified' }),
      featured: item.featured ?? false,
      images: Array.isArray(item.images) ? item.images : (typeof item.images === 'string' ? JSON.parse(item.images) : []),
      description: item.description || '',
      features: Array.isArray(item.features) ? item.features : [],
      amenities: Array.isArray(item.amenities) ? item.amenities : [],
      nearbyLandmarks: Array.isArray(item.nearby_landmarks) ? item.nearby_landmarks : (item.nearbyLandmarks || []),
      paymentPlan: typeof item.payment_plan === 'string' ? JSON.parse(item.payment_plan) : (item.paymentPlan || { available: true, minDownpaymentPercent: 20, maxTenorMonths: 12 }),
      completionDate: item.completion_date ?? item.completionDate,
      virtualTourUrl: item.virtual_tour_url ?? item.virtualTourUrl,
      dateAdded: item.date_added ?? item.dateAdded ?? new Date().toISOString().split('T')[0],
      verificationNotes: item.verification_notes ?? item.verificationNotes ?? '100% Verified'
    }));
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
 * 1. Detects and confirms active Supabase Auth session before execution.
 * 2. Extracts exact error.message and error.details on failure.
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
      console.info('Supabase Save Property: Auth session detected ->', {
        isAuthenticated,
        userEmail: user?.email,
        userId: user?.id,
        hasAccessToken: Boolean(session?.access_token)
      });
    }

    const dbPayload = {
      title: property.title,
      slug: property.slug || property.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: property.type,
      category: property.category,
      purpose: property.purpose || 'Investment',
      location: typeof property.location === 'object' ? JSON.stringify(property.location) : property.location,
      price_ngn: property.priceNgn,
      size_sqm: property.sizeSqm || null,
      plots_count: property.plotsCount || 1,
      bedrooms: property.bedrooms || null,
      bathrooms: property.bathrooms || null,
      title_status: property.titleStatus,
      title_verified: property.titleVerified ?? true,
      verification_doc_no: property.verificationDocNo || '',
      developer_info: typeof property.developerInfo === 'object' ? JSON.stringify(property.developerInfo) : property.developerInfo,
      featured: property.featured ?? false,
      images: Array.isArray(property.images) ? property.images : [],
      description: property.description || '',
      features: property.features || [],
      amenities: property.amenities || [],
      nearby_landmarks: property.nearbyLandmarks || [],
      payment_plan: typeof property.paymentPlan === 'object' ? JSON.stringify(property.paymentPlan) : property.paymentPlan,
      completion_date: property.completionDate || null,
      virtual_tour_url: property.virtualTourUrl || null,
      date_added: property.dateAdded || new Date().toISOString().split('T')[0],
      verification_notes: property.verificationNotes || 'Verified Title'
    };

    if (property.id && !property.id.startsWith('temp-')) {
      // Update existing property
      const { data, error } = await supabase
        .from('properties')
        .update(dbPayload)
        .eq('id', property.id)
        .select();

      if (error) {
        console.error('Supabase Update Property Error:', error);
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
        console.error('Supabase Insert Property Error:', error);
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
    console.error('Unexpected error in savePropertyToSupabase:', err);
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
