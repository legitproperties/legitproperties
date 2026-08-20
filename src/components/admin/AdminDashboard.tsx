import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  ShieldCheck,
  Database,
  LogOut,
  Plus,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  Clock,
  Eye,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Property, BlogPost, PropertyRequestLead } from '../../types';
import {
  fetchPropertiesFromSupabase,
  savePropertyToSupabase,
  deletePropertyFromSupabase,
  fetchBlogPostsFromSupabase,
  saveBlogPostToSupabase,
  deleteBlogPostFromSupabase,
  fetchLeadsFromSupabase,
  fetchAdminDashboardStats
} from '../../lib/supabase';
import { PropertyFormModal } from './PropertyFormModal';
import { BlogPostFormModal } from './BlogPostFormModal';

interface AdminDashboardProps {
  onGoToPublicSite: () => void;
}

type TabType = 'overview' | 'properties' | 'blog' | 'leads' | 'database';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onGoToPublicSite }) => {
  const { admin, signOut, isConfigured } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Stats & Data State
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBlogPosts: 0,
    totalLeads: 0,
    totalTitleAudits: 0,
    supabaseConnected: isConfigured
  });

  const [propertiesList, setPropertiesList] = useState<Property[]>([]);
  const [blogList, setBlogList] = useState<BlogPost[]>([]);
  const [leadsList, setLeadsList] = useState<PropertyRequestLead[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Modals state
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState<BlogPost | null>(null);

  // Search filters inside admin tabs
  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [leadsSearchQuery, setLeadsSearchQuery] = useState('');

  // SQL Copy feedback
  const [copiedSql, setCopiedSql] = useState(false);

  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      const [fetchedStats, fetchedProps, fetchedBlogs, fetchedLeads] = await Promise.all([
        fetchAdminDashboardStats(),
        fetchPropertiesFromSupabase(),
        fetchBlogPostsFromSupabase(),
        fetchLeadsFromSupabase()
      ]);

      setStats({
        totalProperties: fetchedProps.length,
        totalBlogPosts: fetchedBlogs.length,
        totalLeads: fetchedLeads.length,
        totalTitleAudits: fetchedStats.totalTitleAudits,
        supabaseConnected: fetchedStats.supabaseConnected
      });

      setPropertiesList(fetchedProps);
      setBlogList(fetchedBlogs);
      setLeadsList(fetchedLeads);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Property Handlers
  const handleSaveProperty = async (propData: Partial<Property>) => {
    const res = await savePropertyToSupabase(propData);
    if (res.success) {
      await loadAllData();
      return true;
    }
    return false;
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this property listing?')) {
      const success = await deletePropertyFromSupabase(id);
      if (success) {
        setPropertiesList(prev => prev.filter(p => p.id !== id));
        setStats(prev => ({ ...prev, totalProperties: Math.max(0, prev.totalProperties - 1) }));
      }
    }
  };

  // Blog Handlers
  const handleSaveBlog = async (blogData: Partial<BlogPost>) => {
    const res = await saveBlogPostToSupabase(blogData);
    if (res.success) {
      await loadAllData();
      return true;
    }
    return false;
  };

  const handleDeleteBlog = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const success = await deleteBlogPostFromSupabase(id);
      if (success) {
        setBlogList(prev => prev.filter(b => b.id !== id));
        setStats(prev => ({ ...prev, totalBlogPosts: Math.max(0, prev.totalBlogPosts - 1) }));
      }
    }
  };

  // SQL Schema snippet for Supabase
  const supabaseSqlSchema = `-- 1. Admins Table Schema
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow admins to view and manage admin rows
CREATE POLICY "Admins full access" ON public.admins
  FOR ALL USING (auth.uid() = id);

-- 2. Properties Table Schema
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  purpose TEXT DEFAULT 'Investment',
  location JSONB NOT NULL,
  price_ngn NUMERIC NOT NULL,
  size_sqm NUMERIC,
  plots_count NUMERIC DEFAULT 1,
  bedrooms NUMERIC,
  bathrooms NUMERIC,
  title_status TEXT NOT NULL,
  title_verified BOOLEAN DEFAULT true,
  verification_doc_no TEXT,
  developer_info JSONB,
  featured BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  features TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  nearby_landmarks TEXT[] DEFAULT '{}',
  payment_plan JSONB,
  completion_date TEXT,
  virtual_tour_url TEXT,
  date_added DATE DEFAULT CURRENT_DATE,
  verification_notes TEXT
);

-- Public Read, Admin Write
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Admin write properties" ON public.properties FOR ALL USING (auth.role() = 'authenticated');

-- 3. Blog Posts Table Schema
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Real Estate',
  author TEXT DEFAULT 'Legit Properties Editorial',
  cover_image TEXT,
  published BOOLEAN DEFAULT true,
  views_count NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published blog posts" ON public.blog_posts FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Admin manage blog posts" ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- 4. Property Leads Table Schema
CREATE TABLE IF NOT EXISTS public.property_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_whatsapp TEXT,
  country_of_residence TEXT,
  preferred_location TEXT,
  property_type TEXT,
  budget_ngn NUMERIC,
  purpose TEXT,
  timeline TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.property_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert leads" ON public.property_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view leads" ON public.property_leads FOR SELECT USING (auth.role() = 'authenticated');
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(supabaseSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'properties', label: 'Manage Properties', icon: Building2, badge: stats.totalProperties },
    { id: 'blog', label: 'Blog & Articles', icon: FileText, badge: stats.totalBlogPosts },
    { id: 'leads', label: 'Buyer Requests', icon: Users, badge: stats.totalLeads },
    { id: 'database', label: 'Database & SQL', icon: Database, badge: null }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="h-16 bg-slate-850 bg-[#101b2b] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
        
        {/* Left branding & collapse toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#167A5A] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Legit Properties
              </span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                Admin CMS
              </span>
            </div>
          </div>
        </div>

        {/* Right Admin Profile & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* Supabase status badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-300">
            <div className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isConfigured ? 'Supabase Live' : 'Supabase Setup'}</span>
          </div>

          {/* View public site */}
          <button
            onClick={onGoToPublicSite}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Public Site</span>
          </button>

          {/* Admin User info */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-[#167A5A] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              {admin?.name ? admin.name.substring(0, 2) : 'AD'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-white leading-tight">
                {admin?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono leading-tight">
                {admin?.email || 'admin@legitproperties'}
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={signOut}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Sign Out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Desktop */}
        <aside
          className={`hidden lg:flex flex-col bg-[#0b131f] border-r border-slate-800 transition-all duration-300 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="p-4 flex-1 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#167A5A] text-white shadow-md shadow-emerald-950/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-slate-900/60 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Refresh data action */}
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={loadAllData}
              disabled={isLoadingData}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer ${
                isLoadingData ? 'opacity-50' : ''
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin text-emerald-400' : ''}`} />
              {!sidebarCollapsed && <span>Sync Database</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-64 max-w-[80%] bg-[#0b131f] border-r border-slate-800 p-4 flex flex-col space-y-1.5 z-50">
              <div className="pb-4 mb-2 border-b border-slate-800 flex items-center justify-between">
                <span className="font-extrabold text-sm text-white">Admin Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as TabType);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isActive ? 'bg-[#167A5A] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge !== null && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-6 mt-auto border-t border-slate-800">
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-950/40 text-red-300 text-xs font-bold hover:bg-red-900/50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content Views */}
        <main className="flex-1 bg-slate-900/95 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {/* TAB 1: OVERVIEW / DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              
              {/* Welcome Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#102033] via-slate-850 to-[#102033] border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Admin Control Center</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Welcome, {admin?.name || 'Admin'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                    Manage your verified real estate listings, publish market insights, and review incoming investor inquiries in real-time.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => {
                      setPropertyToEdit(null);
                      setIsPropertyModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#167A5A] hover:bg-[#13684d] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-950/50 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Property</span>
                  </button>

                  <button
                    onClick={() => {
                      setBlogToEdit(null);
                      setIsBlogModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Article</span>
                  </button>
                </div>
              </div>

              {/* 4 Summary Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Total Live Properties</span>
                    <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{stats.totalProperties}</span>
                    <span className="text-[11px] text-emerald-400 font-medium">Supabase Synced</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('properties')}
                    className="mt-3 text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all listings</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Published Articles</span>
                    <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-800">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{stats.totalBlogPosts}</span>
                    <span className="text-[11px] text-blue-400 font-medium">CMS Active</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('blog')}
                    className="mt-3 text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage articles</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Buyer Inquiries</span>
                    <div className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-800">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{stats.totalLeads}</span>
                    <span className="text-[11px] text-purple-400 font-medium">Direct Leads</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="mt-3 text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Review inquiries</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Database Engine</span>
                    <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <Database className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white">PostgreSQL</span>
                    <span className="text-[11px] text-emerald-400 font-medium">Supabase</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('database')}
                    className="mt-3 text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>View SQL schema</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

              </div>

              {/* Quick Table: Recent Live Properties */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-white">Live Properties on Public Homepage</h3>
                    <p className="text-xs text-slate-400">Synced directly with Supabase <code className="text-emerald-400 font-mono">properties</code> table</p>
                  </div>
                  <button
                    onClick={() => {
                      setPropertyToEdit(null);
                      setIsPropertyModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#167A5A] hover:bg-[#13684d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                </div>

                {propertiesList.length === 0 ? (
                  <div className="py-10 text-center space-y-3 bg-slate-900/60 rounded-2xl border border-slate-800">
                    <Building2 className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400">No properties in database yet. Click "Add New" to publish your first verified listing!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                          <th className="pb-3 font-semibold">Title & Category</th>
                          <th className="pb-3 font-semibold">Location</th>
                          <th className="pb-3 font-semibold">Price (NGN)</th>
                          <th className="pb-3 font-semibold">Title Status</th>
                          <th className="pb-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {propertiesList.slice(0, 5).map((prop) => (
                          <tr key={prop.id} className="hover:bg-slate-750/50 transition-colors">
                            <td className="py-3 font-bold text-white flex items-center gap-2.5">
                              {prop.images?.[0] ? (
                                <img src={prop.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400">
                                  <Building2 className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <div className="line-clamp-1">{prop.title}</div>
                                <div className="text-[10px] text-slate-400 font-normal">{prop.category}</div>
                              </div>
                            </td>
                            <td className="py-3 text-slate-300">
                              {prop.location?.neighborhood}, {prop.location?.city}
                            </td>
                            <td className="py-3 font-bold text-emerald-400">
                              ₦{prop.priceNgn.toLocaleString()}
                            </td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold">
                                {prop.titleStatus}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setPropertyToEdit(prop);
                                    setIsPropertyModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProperty(prop.id)}
                                  className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-400 hover:text-red-200"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: PROPERTIES MANAGEMENT */}
          {activeTab === 'properties' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">Properties Inventory</h2>
                  <p className="text-xs text-slate-400">Publish, modify, and audit all lands and luxury apartments</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={propertySearchQuery}
                      onChange={(e) => setPropertySearchQuery(e.target.value)}
                      placeholder="Search listings..."
                      className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#167A5A]"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setPropertyToEdit(null);
                      setIsPropertyModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#167A5A] hover:bg-[#13684d] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Property</span>
                  </button>
                </div>
              </div>

              {/* Grid of properties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {propertiesList
                  .filter(p => p.title.toLowerCase().includes(propertySearchQuery.toLowerCase()) || p.location.city.toLowerCase().includes(propertySearchQuery.toLowerCase()))
                  .map((prop) => (
                    <div key={prop.id} className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg flex flex-col">
                      <div className="relative h-44 bg-slate-700">
                        {prop.images?.[0] ? (
                          <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Building2 className="w-8 h-8" />
                          </div>
                        )}
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-xs text-emerald-400 text-[10px] font-bold">
                          {prop.titleStatus}
                        </span>
                        <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-slate-900/90 backdrop-blur-xs text-white text-xs font-extrabold">
                          ₦{prop.priceNgn.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-bold text-white text-sm line-clamp-1">{prop.title}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>{prop.location.neighborhood}, {prop.location.city}</span>
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-400 font-mono">
                            {prop.sizeSqm ? `${prop.sizeSqm} sqm` : prop.bedrooms ? `${prop.bedrooms} Beds` : 'Verified Plot'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setPropertyToEdit(prop);
                                setIsPropertyModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(prop.id)}
                              className="p-1.5 rounded-lg bg-red-950 text-red-400 hover:bg-red-900 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {propertiesList.length === 0 && (
                <div className="py-16 text-center bg-slate-800/40 rounded-3xl border border-slate-800 space-y-3">
                  <Building2 className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-base font-bold text-white">No properties found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Add your first live listing to showcase verified real estate directly on the homepage.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BLOG & ARTICLES */}
          {activeTab === 'blog' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">Blog & Editorial CMS</h2>
                  <p className="text-xs text-slate-400">Publish property verification guides, C of O advice, and market trends</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={blogSearchQuery}
                      onChange={(e) => setBlogSearchQuery(e.target.value)}
                      placeholder="Search articles..."
                      className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#167A5A]"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setBlogToEdit(null);
                      setIsBlogModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#167A5A] hover:bg-[#13684d] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Article</span>
                  </button>
                </div>
              </div>

              {/* Blog List */}
              <div className="space-y-3">
                {blogList
                  .filter(b => b.title.toLowerCase().includes(blogSearchQuery.toLowerCase()))
                  .map((post) => (
                    <div key={post.id} className="p-4 sm:p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-600 transition-all">
                      <div className="flex items-start gap-4">
                        {post.coverImage ? (
                          <img src={post.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-slate-700 text-[10px] font-semibold text-slate-300">
                              {post.category}
                            </span>
                            <span className="text-[11px] text-slate-400">{post.createdAt.split('T')[0]}</span>
                          </div>
                          <h4 className="font-bold text-white text-sm sm:text-base mt-1">{post.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{post.excerpt}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => {
                            setBlogToEdit(post);
                            setIsBlogModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(post.id)}
                          className="p-1.5 rounded-xl bg-red-950 text-red-400 hover:bg-red-900 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                {blogList.length === 0 && (
                  <div className="py-16 text-center bg-slate-800/40 rounded-3xl border border-slate-800 space-y-3">
                    <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                    <h3 className="text-base font-bold text-white">No articles published yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Share real estate advice and C of O verification guides with your readers.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: LEADS & INQUIRIES */}
          {activeTab === 'leads' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">Buyer Inquiries & Leads</h2>
                  <p className="text-xs text-slate-400">Prospective land buyers and diaspora investors looking for verified properties</p>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={leadsSearchQuery}
                    onChange={(e) => setLeadsSearchQuery(e.target.value)}
                    placeholder="Search client names or locations..."
                    className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#167A5A]"
                  />
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl">
                {leadsList.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Users className="w-8 h-8 mx-auto text-slate-500" />
                    <p className="text-xs">No client leads submitted yet. Inquiries from the website modal will show up here instantly.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                          <th className="pb-3 font-semibold">Client Name</th>
                          <th className="pb-3 font-semibold">Location Interest</th>
                          <th className="pb-3 font-semibold">Budget (NGN)</th>
                          <th className="pb-3 font-semibold">Contact & Country</th>
                          <th className="pb-3 font-semibold text-right">Direct Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {leadsList
                          .filter(l => l.fullName.toLowerCase().includes(leadsSearchQuery.toLowerCase()) || l.preferredLocation?.toLowerCase().includes(leadsSearchQuery.toLowerCase()))
                          .map((lead, idx) => (
                            <tr key={idx} className="hover:bg-slate-750/50 transition-colors">
                              <td className="py-3.5">
                                <div className="font-bold text-white">{lead.fullName}</div>
                                <div className="text-[10px] text-slate-400">{lead.propertyType} • {lead.purpose}</div>
                              </td>
                              <td className="py-3.5 text-slate-300 font-medium">
                                {lead.preferredLocation || 'Any prime zone'}
                              </td>
                              <td className="py-3.5 font-bold text-emerald-400">
                                ₦{Number(lead.budgetNgn || 0).toLocaleString()}
                              </td>
                              <td className="py-3.5 text-slate-300">
                                <div>{lead.phoneWhatsapp || 'No Phone'}</div>
                                <div className="text-[10px] text-slate-400">{lead.countryOfResidence || 'Nigeria'}</div>
                              </td>
                              <td className="py-3.5 text-right">
                                {lead.phoneWhatsapp && (
                                  <a
                                    href={`https://wa.me/${lead.phoneWhatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.fullName)}!%20This%20is%20Legit%20Properties%20regarding%20your%20property%20request.`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold inline-flex items-center gap-1.5 transition-colors"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DATABASE & SQL SCHEMA */}
          {activeTab === 'database' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">Supabase Schema & Configuration</h2>
                  <p className="text-xs text-slate-400">Run this SQL in your Supabase SQL Editor to set up all tables and RLS security policies</p>
                </div>

                <button
                  onClick={copySqlToClipboard}
                  className="px-4 py-2 bg-[#167A5A] hover:bg-[#13684d] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md cursor-pointer shrink-0"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL Script'}</span>
                </button>
              </div>

              {/* SQL Code Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
                  <span className="font-mono text-emerald-400">supabase_schema_setup.sql</span>
                  <span>PostgreSQL • Ready to execute</span>
                </div>
                <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-2 leading-relaxed">
                  {supabaseSqlSchema}
                </pre>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Property Modal */}
      <PropertyFormModal
        isOpen={isPropertyModalOpen}
        onClose={() => {
          setIsPropertyModalOpen(false);
          setPropertyToEdit(null);
        }}
        onSave={handleSaveProperty}
        propertyToEdit={propertyToEdit}
      />

      {/* Blog Modal */}
      <BlogPostFormModal
        isOpen={isBlogModalOpen}
        onClose={() => {
          setIsBlogModalOpen(false);
          setBlogToEdit(null);
        }}
        onSave={handleSaveBlog}
        postToEdit={blogToEdit}
      />

    </div>
  );
};
