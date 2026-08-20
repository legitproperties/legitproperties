import { createClient } from '@supabase/supabase-js';
import { Property, PropertyRequestLead, AdminUser, BlogPost } from '../types';
import { INITIAL_PROPERTIES } from '../data/properties';

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * ============================================================================
 * ADMIN AUTHENTICATION & PROFILE METHODS
 * ============================================================================
 */

/**
 * Register a new Admin user using Supabase Auth.
 * Name is passed inside options.data metadata so Supabase triggers or admin tables capture it.
 */
export async function adminSignUp(name: string, email: string, password: string): Promise<{ user: any; error: string | null }> {
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

    // Try sync insert into admins table in case database trigger isn't set yet
    if (createdUser) {
      try {
        await supabase.from('admins').upsert({
          id: createdUser.id,
          name: cleanName,
          email: cleanEmail,
          role: 'admin',
          created_at: new Date().toISOString()
        }, { onConflict: 'id' });
      } catch (err) {
        console.warn('Admins table direct upsert skipped:', err);
      }
    }

    return { user: createdUser, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'An unexpected registration error occurred.' };
  }
}

/**
 * Sign in existing Admin using Supabase Auth with Email and Password.
 */
export async function adminSignIn(email: string, password: string): Promise<{ session: any; user: any; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!supabase) {
    // Seamless local admin login when Supabase credentials are pending
    const demoAdmin: AdminUser = {
      id: 'admin-root-' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '-'),
      name: cleanEmail.split('@')[0].toUpperCase() + ' (Admin)',
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
      return { session: null, user: null, error: error.message };
    }

    return { session: data.session, user: data.user, error: null };
  } catch (err: any) {
    return { session: null, user: null, error: err.message || 'Sign in failed.' };
  }
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
      name: fallbackUser.user_metadata?.name || fallbackUser.name || fallbackUser.email?.split('@')[0] || 'Admin User',
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
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Admin User',
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
 * Save / update property in Supabase `properties` table.
 */
export async function savePropertyToSupabase(property: Partial<Property>): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
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
      const { data, error } = await supabase
        .from('properties')
        .update(dbPayload)
        .eq('id', property.id)
        .select();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } else {
      const { data, error } = await supabase
        .from('properties')
        .insert([dbPayload])
        .select();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save property' };
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

export async function saveBlogPostToSupabase(post: Partial<BlogPost>): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
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

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } else {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([dbPayload])
        .select();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save blog post' };
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
