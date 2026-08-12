import { createClient } from '@supabase/supabase-js';
import { Property, PropertyRequestLead } from '../types';
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
      console.warn('Supabase fetch properties empty or returned error, using fallback seed properties:', error);
      return INITIAL_PROPERTIES;
    }

    // Map database snake_case or JSON format back to Property object
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
 * Save custom property request / lead to Supabase `property_leads` table.
 */
export async function saveLeadToSupabase(lead: PropertyRequestLead): Promise<boolean> {
  // Always save to local storage as fallback
  try {
    const existing = JSON.parse(localStorage.getItem('legit_property_leads') || '[]');
    localStorage.setItem('legit_property_leads', JSON.stringify([lead, ...existing]));
  } catch (e) {
    console.error('LocalStorage lead error', e);
  }

  if (!supabase) {
    console.log('Supabase not configured; lead stored in LocalStorage.');
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
