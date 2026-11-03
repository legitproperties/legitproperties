import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Sparkles,
  ExternalLink,
  Tag,
  Eye,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Filter,
  Flame
} from 'lucide-react';
import { BlogPost, Property } from '../../types';
import { fetchBlogPostsFromSupabase } from '../../lib/supabase';
import { getBlogPostSlug, getBlogUrl, copyBlogLinkToClipboard, parseBlogSlugFromUrl } from '../../utils/blogUrl';

// Curated authoritative real estate articles if Supabase database is fresh or offline
const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'guide-c-of-o-verification',
    title: 'How to Verify a Lagos State Certificate of Occupancy (C of O) at Alausa Lands Registry',
    slug: 'how-to-verify-lagos-state-c-of-o-alausa',
    excerpt: 'A comprehensive step-by-step legal blueprint on conducting genuine title searches at the Lagos State Lands Bureau, Alausa, avoiding forged deeds and cloned survey plans.',
    content: `Acquiring property in Lagos without conducting an exhaustive title audit at the Lands Bureau, Alausa, is the single greatest risk a real estate investor or diaspora buyer can take. Every year, millions of naira are lost to duplicate allocations, excisions under revocation, and counterfeit survey beacons.

### Step 1: Obtain the Certified True Copy (CTC)
Before making any financial commitment, demand a complete Certified True Copy (CTC) of the Certificate of Occupancy from the vendor. A genuine C of O must have:
* The official Lagos State seal and Governor's signature (or designated Commissioner).
* A registered Lands Registry volume, page, and number (e.g., Vol. 45, Page 45 in the Registry of Deeds).
* A registered beacon survey plan detailing the coordinate boundaries.

### Step 2: The Alausa Charting and Coordinate Search
Do not rely on the document's physical paper appearance. Commission a licensed registered surveyor to chart the coordinate beacons at the Office of the Surveyor-General of Lagos State. This confirms:
1. Whether the land falls within a committed government acquisition (e.g., agricultural reserves, pipeline corridors, or coastal road right-of-way).
2. Whether the land is covered by a valid Gazette or an active Global Acquisition excision.

### Step 3: Legal Search at the Registry of Deeds
Your legal practitioner must inspect the folio register to identify encumbrances, pending mortgages, court injunctions, or family disputes. A clean title search report is the only guarantee of indisputable ownership.

### Legit Properties Guarantee
Every property featured on Legit Properties undergoes this mandatory 3-tier Alausa verification before being published. We verify coordinates, Governor's consent stamps, and probate records so our buyers never face ownership disputes.`,
    category: 'Land Verification Guides',
    author: 'Barr. Folake Adeleke (Senior Title Counsel)',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    published: true,
    viewsCount: 1420,
    createdAt: '2025-01-15T09:00:00Z'
  },
  {
    id: 'guide-shortlet-yields-lagos',
    title: 'Top 5 High-Yield Short-Stay Neighborhoods in Lagos (Ikoyi, Lekki Phase 1 & Oniru)',
    slug: 'top-high-yield-short-stay-neighborhoods-lagos',
    excerpt: 'Detailed financial analysis of average occupancy rates, per-night rates, 24/7 power overheads, and annual net rental yields for luxury shortlet apartments in Lagos.',
    content: `The short-stay hospitality sector in Lagos has emerged as one of West Africa's most lucrative real estate investment classes, consistently outperforming conventional annual residential rentals by 150% to 220% in net dollar yields.

### 1. Lekki Phase 1: The Corporate & Leisure Epicenter
* **Average Occupancy Rate:** 78% – 85%
* **Typical Nightly Rate (2-Bed Luxury):** ₦120,000 – ₦250,000
* **Key Drivers:** Admiralty Way nightlife, tech founders, diaspora holidaymakers, and business travelers seeking quick access to Victoria Island without island traffic.

### 2. Ikoyi (Old Ikoyi & Banana Island): Ultra-High Net Worth Executives
* **Average Occupancy Rate:** 70% – 76%
* **Typical Nightly Rate (3-Bed Luxury Penthouse):** ₦350,000 – ₦850,000
* **Key Drivers:** Diplomatic missions, multinational C-suite executives, and ultra-high-net-worth individuals requiring high-security gates, private boat jetties, and Olympic-grade gym facilities.

### 3. Victoria Island & Oniru: Medical & Financial Hub
* **Average Occupancy Rate:** 80% – 88%
* **Typical Nightly Rate (1-Bed Executive Studio):** ₦85,000 – ₦160,000
* **Key Drivers:** Proximity to financial headquarters, international embassies, corporate summits, and premium beach clubs like Landmark.

### The Non-Negotiable Operational Standard
To achieve 80%+ occupancy in Lagos, three factors are non-negotiable:
1. **Uninterrupted 24/7 Electricity:** Redundant dual silent generators paired with commercial lithium solar inverter banks.
2. **Dedicated Fiber Wi-Fi:** Minimum 100Mbps dedicated low-latency bandwidth for international remote workers.
3. **Immaculate Housekeeping & Verified Smart Locks:** Keyless automated check-in and round-the-clock host concierge response.`,
    category: 'Short Stay & Hospitality',
    author: 'Kelechi Nwosu (Hospitality & Yield Director)',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    published: true,
    viewsCount: 2180,
    createdAt: '2025-01-22T11:30:00Z'
  },
  {
    id: 'guide-governors-consent-vs-gazette',
    title: 'Governor’s Consent vs. Gazette: What Every Nigerian Property Buyer Must Know',
    slug: 'governors-consent-vs-gazette-legal-breakdown',
    excerpt: 'Understand the legal distinctions between Governor\'s Consent, Government Gazette, Excision, and Deed of Assignment before wiring property funds.',
    content: `When purchasing real estate in Lagos, brokers often throw around phrases like "It has a Gazette" or "Governor's Consent in view". Knowing the exact legal weight of each title status will protect your hard-earned wealth.

### What is a Gazette?
A Gazette is an official record book of the State Government that chronicles community lands that have been formally excised and freed from government acquisition. When an excision is gazetted, it signifies that the ancestral family has legal title to sell within defined coordinates. However, a Gazette is not a personal deed of ownership—it is a global umbrella document.

### What is Governor’s Consent?
Under Section 22 of the Land Use Act of 1978, no holder of a statutory right of occupancy can transfer, mortgage, or assign ownership without the consent of the State Governor. 
When you buy land from someone who has a C of O, the deed of assignment signed between you and the seller must be submitted to the government for the Governor's official endorsement. This endorsement is the **Governor's Consent**.

### Key Differences at a Glance:
* **Initial Title:** C of O is issued by the government once to the first titleholder.
* **Subsequent Sales:** Governor's Consent is obtained for every subsequent transaction or transfer of that property.
* **Gazette:** Global release of communal land; individual buyers still need to perfect their title by registering their deed and securing Governor's Consent.

### Pro Tip for Buyers:
Never accept "Governor's Consent in Process" as a finished title. Always audit the file number at Alausa to confirm that application fees have been assessed and that the deed is genuinely before the Directorate of Land Services.`,
    category: 'Land Verification Guides',
    author: 'Barr. Folake Adeleke (Senior Title Counsel)',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    published: true,
    viewsCount: 980,
    createdAt: '2025-02-04T14:15:00Z'
  },
  {
    id: 'guide-diaspora-buying-guide',
    title: 'Diaspora Property Investment: 6 Red Flags When Buying Real Estate Remotely',
    slug: 'diaspora-property-investment-six-red-flags',
    excerpt: 'Essential safeguards for Nigerians living in the UK, USA, and Canada investing in Lagos property without getting swindled by unscrupulous relatives or unverified agents.',
    content: `Investing in Nigerian real estate from abroad is one of the most rewarding ways to build generational wealth and hedge against currency devaluation. However, diaspora investors face unique challenges—primarily remote oversight and reliance on third parties.

### 1. Red Flag #1: "Send the Money to My Personal Account"
Never transfer funds for property acquisition to an individual family member or agent's personal account. Legitimate transactions must flow through:
* A registered corporate account with a verifiable Tax Identification Number (TIN).
* An escrow account managed by a recognized real estate advisory firm or registered notary.

### 2. Red Flag #2: Refusal to Disclose Exact Survey Coordinates
If a seller or developer refuses to share the exact beacon coordinates on a signed survey plan before payment, walk away. They may be selling you land committed for future highways or airport expansion.

### 3. Red Flag #3: Pricing Unusually Below Market Value
If standard dry land in Sangotedo or Chevron Drive trades at ₦80M, and someone offers you a plot for ₦28M with "urgent owner traveling" excuses, you are almost certainly looking at contested family land or an active demolition notice.

### 4. Red Flag #4: Lack of Live Video Inspections & Beacon Sightings
Always insist on a timestamped, live video inspection showing the physical land beacons, boundary walls, and access roads. At Legit Properties, we provide our diaspora clients with high-resolution drone footage and coordinate verification reports before a single naira changes hands.

### 5. Red Flag #5: Reluctance to Allow Independent Legal Due Diligence
A reputable developer will welcome your independent lawyer inspecting original title files at Alausa. Anyone who pressures you with "other buyers are waiting, wire now or lose it" is using artificial urgency to bypass legal scrutiny.`,
    category: 'Diaspora Investment',
    author: 'Babajide Martins (Head of Diaspora Relations)',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    published: true,
    viewsCount: 3120,
    createdAt: '2025-02-18T16:00:00Z'
  }
];

interface BlogsPageProps {
  onNavigateHome: () => void;
  onSelectProperty?: (property: Property) => void;
  onOpenPropertiesForSale?: () => void;
  onOpenShortStays?: () => void;
}

export const BlogsPage: React.FC<BlogsPageProps> = ({
  onNavigateHome,
  onOpenPropertiesForSale,
  onOpenShortStays,
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Load published blog posts from Supabase or fallback
  useEffect(() => {
    let isMounted = true;
    async function loadBlogs() {
      setIsLoading(true);
      try {
        const fetched = await fetchBlogPostsFromSupabase();
        if (isMounted) {
          // Filter only published
          const publishedPosts = fetched.filter((p) => p.published);
          if (publishedPosts.length > 0) {
            setPosts(publishedPosts);
          } else {
            // If Supabase table is empty or fresh, display high-quality fallback articles
            setPosts(FALLBACK_BLOG_POSTS);
          }
        }
      } catch (e) {
        console.warn('Error loading blogs from Supabase, using curated insights:', e);
        if (isMounted) {
          setPosts(FALLBACK_BLOG_POSTS);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  // Check URL on load for direct article reading (e.g. /blogs#slug or /blogs/:slug)
  useEffect(() => {
    const directSlug = parseBlogSlugFromUrl();
    if (directSlug && posts.length > 0) {
      const match = posts.find(
        (p) =>
          p.slug === directSlug ||
          p.id === directSlug ||
          getBlogPostSlug(p) === directSlug
      );
      if (match) {
        setActiveArticle(match);
      }
    }
  }, [posts]);

  // Set document title & SEO
  useEffect(() => {
    if (activeArticle) {
      document.title = `${activeArticle.title} | Legit Properties Journal`;
    } else {
      document.title = 'Real Estate & Short Stay Insights | Legit Properties';
    }
  }, [activeArticle]);

  // Categories list derived from posts
  const categories = useMemo(() => {
    const list = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
    return ['all', ...list];
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory =
        selectedCategory === 'all' ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query);

      return matchCategory && matchQuery;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Featured post (first one or highest views)
  const featuredPost = useMemo(() => {
    if (filteredPosts.length === 0) return null;
    return filteredPosts[0];
  }, [filteredPosts]);

  const secondaryPosts = useMemo(() => {
    if (filteredPosts.length <= 1) return filteredPosts;
    return filteredPosts.slice(1);
  }, [filteredPosts]);

  // Estimate reading time in minutes
  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(2, Math.round(words / 200));
    return `${minutes} min read`;
  };

  // Open an article and update browser URL
  const handleOpenArticle = (post: BlogPost) => {
    setActiveArticle(post);
    if (typeof window !== 'undefined') {
      const slug = getBlogPostSlug(post);
      window.history.pushState(null, '', `/blogs#${encodeURIComponent(slug)}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Close active article
  const handleCloseArticle = () => {
    setActiveArticle(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/blogs');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle share article
  const handleShare = async (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    const success = await copyBlogLinkToClipboard(post);
    if (success) {
      setCopiedSlug(post.id);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      
      {/* 1. Breadcrumbs & Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center space-y-0 space-x-2 text-xs font-semibold text-slate-500">
            <button
              onClick={onNavigateHome}
              className="hover:text-slate-950 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => {
                if (activeArticle) handleCloseArticle();
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className={`hover:text-slate-950 transition-colors cursor-pointer ${
                !activeArticle ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              <span>Blogs & Insights</span>
            </button>
            {activeArticle && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">
                  {activeArticle.title}
                </span>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {onOpenShortStays && (
              <button
                onClick={onOpenShortStays}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <span>Short Stays</span>
              </button>
            )}
            {onOpenPropertiesForSale && (
              <button
                onClick={onOpenPropertiesForSale}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <span>Properties for Sale</span>
              </button>
            )}
            {activeArticle && (
              <button
                onClick={handleCloseArticle}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Articles</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Full Article View */}
      {activeArticle ? (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          
          {/* Back button */}
          <button
            onClick={handleCloseArticle}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to all published articles</span>
          </button>

          {/* Article Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                {activeArticle.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {calculateReadTime(activeArticle.content)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(activeArticle.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              {activeArticle.viewsCount ? (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium ml-auto">
                  <Eye className="w-3.5 h-3.5" />
                  {activeArticle.viewsCount.toLocaleString()} reads
                </span>
              ) : null}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-snug sm:leading-tight mb-4">
              {activeArticle.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal mb-6">
              {activeArticle.excerpt}
            </p>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {activeArticle.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                    <span>{activeArticle.author}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xs text-slate-500">Legit Properties Editorial & Advisory Desk</div>
                </div>
              </div>

              <button
                onClick={(e) => handleShare(e, activeArticle)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                {copiedSlug === activeArticle.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-500" />
                    <span>Share Guide</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Cover image if available */}
          {activeArticle.coverImage && (
            <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-md mb-10 max-h-[500px]">
              <img
                src={activeArticle.coverImage}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body Content */}
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-xs mb-10">
            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-base sm:text-lg space-y-6">
              {activeArticle.content.split('\n\n').map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl sm:text-2xl font-black text-slate-950 pt-4 pb-1">
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                  const items = trimmed.split('\n').map((li) => li.replace(/^[*•-]\s*/, ''));
                  return (
                    <ul key={index} className="space-y-2 my-4 list-disc list-inside text-slate-700">
                      {items.map((it, i) => (
                        <li key={i} className="pl-1 leading-relaxed">
                          {it}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (trimmed.match(/^\d+\.\s/)) {
                  const items = trimmed.split('\n').map((li) => li.replace(/^\d+\.\s*/, ''));
                  return (
                    <ol key={index} className="space-y-2 my-4 list-decimal list-inside text-slate-700">
                      {items.map((it, i) => (
                        <li key={i} className="pl-1 leading-relaxed">
                          {it}
                        </li>
                      ))}
                    </ol>
                  );
                }
                return (
                  <p key={index} className="text-slate-700 leading-relaxed font-normal">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Verification Seal & Advisory Note */}
            <div className="mt-12 p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    Need Independent Due Diligence on a Specific Land or Building?
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Our legal desk checks beacon coordinates against Alausa Master Plans, gazettes, and excision orders.
                  </p>
                </div>
              </div>

              {onOpenPropertiesForSale && (
                <button
                  onClick={onOpenPropertiesForSale}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  Browse Audited Properties
                </button>
              )}
            </div>
          </div>

          {/* More Articles Carousel / Grid */}
          <div className="pt-6">
            <h3 className="text-xl font-extrabold text-slate-950 mb-6 flex items-center justify-between">
              <span>More Articles & Insights</span>
              <button
                onClick={handleCloseArticle}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                View all →
              </button>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts
                .filter((p) => p.id !== activeArticle.id)
                .slice(0, 2)
                .map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handleOpenArticle(post)}
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                        <span className="font-bold text-emerald-700">{post.category}</span>
                        <span>{calculateReadTime(post.content)}</span>
                      </div>
                      <h4 className="font-bold text-base text-slate-950 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      <span>Read Guide</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </article>
      ) : (
        /* 3. Main Blogs Catalog Page */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
          
          {/* Header Banner */}
          <div className="relative rounded-3xl bg-slate-950 text-white overflow-hidden p-8 sm:p-14 mb-10 border border-slate-800 shadow-xl">
            {/* Background Decorative Accents */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-400 text-xs font-bold mb-4">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Legit Properties Intelligence & Field Guides</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight mb-4">
                Verified Lagos Real Estate & Short-Stay Journal
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                Authoritative insights on title verification at Alausa Land Registry, Governor's Consent procedures, high-yield shortlet hosting in Ikoyi & Lekki, and diaspora property acquisition.
              </p>

              {/* Search Bar inside Hero */}
              <div className="relative max-w-xl">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles by title, C of O, shortlet yield, or topic..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-950 placeholder-slate-400 focus:placeholder-slate-500 border border-white/20 focus:border-white focus:outline-none text-xs sm:text-sm font-medium transition-all shadow-inner backdrop-blur-md"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline-flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Categories:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 hover:text-slate-950'
                }`}
              >
                {cat === 'all' ? 'All Publications' : cat}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
              <p className="text-xs font-semibold">Loading published articles from database...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            /* Empty State */
            <div className="py-20 bg-white rounded-3xl border border-slate-200 text-center p-8 max-w-lg mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-950 mb-1">No articles found</h3>
              <p className="text-xs text-slate-500 mb-6">
                We couldn't find any published blog posts matching your search query "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured Article Card (if first post available and not filtered out) */}
              {featuredPost && !searchQuery && selectedCategory === 'all' && (
                <div
                  onClick={() => handleOpenArticle(featuredPost)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-xl transition-all duration-300 mb-12 cursor-pointer group grid grid-cols-1 lg:grid-cols-12"
                >
                  <div className="lg:col-span-7 h-64 sm:h-80 lg:h-auto relative overflow-hidden bg-slate-100">
                    <img
                      src={featuredPost.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 text-xs font-extrabold border border-white/20">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        Featured Guide
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 text-xs text-slate-500 mb-3">
                        <span className="font-extrabold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          {featuredPost.category}
                        </span>
                        <span>•</span>
                        <span>{calculateReadTime(featuredPost.content)}</span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-slate-950 group-hover:text-emerald-700 transition-colors leading-snug mb-3">
                        {featuredPost.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 sm:line-clamp-4 leading-relaxed mb-6 font-normal">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                          {featuredPost.author.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{featuredPost.author}</div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(featuredPost.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-950 group-hover:text-emerald-700">
                        <span>Read Full Guide</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of Articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchQuery || selectedCategory !== 'all' ? filteredPosts : secondaryPosts).map((post) => (
                  <article
                    key={post.id}
                    onClick={() => handleOpenArticle(post)}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Cover Image */}
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img
                          src={post.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-white/95 backdrop-blur-md text-slate-900 shadow-2xs">
                            {post.category}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleShare(e, post)}
                          aria-label="Share article"
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/95 backdrop-blur-md text-slate-700 hover:text-slate-950 shadow-2xs transition-colors cursor-pointer"
                        >
                          {copiedSlug === post.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2.5">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {calculateReadTime(post.content)}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-950 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 mb-2.5">
                          {post.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-6 pt-0">
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                            {post.author.charAt(0)}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-800 truncate max-w-[140px]">
                            {post.author}
                          </span>
                        </div>

                        <span className="text-xs font-extrabold text-slate-950 group-hover:text-emerald-700 flex items-center gap-1">
                          <span>Read</span>
                          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {/* Bottom Callout for Property Buyers & Guests */}
          <div className="mt-16 rounded-3xl bg-emerald-950 text-white p-8 sm:p-12 border border-emerald-900/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-400 text-xs font-bold border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Title Risk Guarantee</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Inspect Legally Audited Lagos Properties
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed font-normal">
                Every land parcel, executive terrace, and short stay apartment featured on Legit Properties is verified against official Alausa survey records and titles.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {onOpenPropertiesForSale && (
                <button
                  onClick={onOpenPropertiesForSale}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  View Verified Properties for Sale
                </button>
              )}
              {onOpenShortStays && (
                <button
                  onClick={onOpenShortStays}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all border border-emerald-700 cursor-pointer"
                >
                  Book Luxury Short Stay
                </button>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
