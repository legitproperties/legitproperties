import React, { useState } from 'react';
import { X, ShieldCheck, Plus, Trash2, MapPin, DollarSign, Image as ImageIcon, Save, AlertCircle, Copy, Check } from 'lucide-react';
import { Property, PropertyType, TitleStatus } from '../../types';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Partial<Property>) => Promise<{ success: boolean; error?: string } | boolean>;
  propertyToEdit?: Property | null;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  propertyToEdit,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(propertyToEdit?.title || '');
  const [slug, setSlug] = useState(propertyToEdit?.slug || '');
  const [type, setType] = useState<PropertyType>(propertyToEdit?.type || 'land');
  const [category, setCategory] = useState<Property['category']>(propertyToEdit?.category || 'prime_land');
  const [purpose, setPurpose] = useState<Property['purpose']>(propertyToEdit?.purpose || 'Personal Home');
  
  const [address, setAddress] = useState(propertyToEdit?.location.address || '');
  const [neighborhood, setNeighborhood] = useState(propertyToEdit?.location.neighborhood || '');
  const [city, setCity] = useState<'Lagos' | 'Abuja' | 'Port Harcourt' | 'Ibadan'>(
    (propertyToEdit?.location.city as any) || 'Lagos'
  );
  const [stateName, setStateName] = useState(propertyToEdit?.location.state || 'Lagos State');
  
  const [priceNgn, setPriceNgn] = useState<number>(propertyToEdit?.priceNgn || 50000000);
  const [sizeSqm, setSizeSqm] = useState<number>(propertyToEdit?.sizeSqm || 600);
  const [plotsCount, setPlotsCount] = useState<number>(propertyToEdit?.plotsCount || 1);
  const [bedrooms, setBedrooms] = useState<number | undefined>(propertyToEdit?.bedrooms);
  const [bathrooms, setBathrooms] = useState<number | undefined>(propertyToEdit?.bathrooms);
  
  const [titleStatus, setTitleStatus] = useState<TitleStatus>(
    propertyToEdit?.titleStatus || 'Certificate of Occupancy (C of O)'
  );
  const [titleVerified, setTitleVerified] = useState<boolean>(propertyToEdit?.titleVerified ?? true);
  const [verificationDocNo, setVerificationDocNo] = useState(propertyToEdit?.verificationDocNo || '');
  
  const [developerName, setDeveloperName] = useState(propertyToEdit?.developerInfo?.name || 'Legit Verified Direct Owner');
  const [developerTrack, setDeveloperTrack] = useState(propertyToEdit?.developerInfo?.trackRecord || '10+ Years Clean Title History');
  const [developerStatus, setDeveloperStatus] = useState(propertyToEdit?.developerInfo?.verifiedStatus || 'CAC & Title Audited');
  
  const [featured, setFeatured] = useState(propertyToEdit?.featured ?? false);
  const [description, setDescription] = useState(propertyToEdit?.description || '');
  const [whatsappNumber, setWhatsappNumber] = useState(propertyToEdit?.whatsappNumber || '+2348030000000');
  const [callNumber, setCallNumber] = useState(propertyToEdit?.callNumber || '+2348030000000');
  
  const [images, setImages] = useState<string[]>(
    propertyToEdit?.images && propertyToEdit.images.length > 0
      ? propertyToEdit.images
      : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80']
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  const [features, setFeatures] = useState<string[]>(
    propertyToEdit?.features && propertyToEdit.features.length > 0
      ? propertyToEdit.features
      : ['100% Dry Land', 'Paved Access Road', 'Registered Title Survey']
  );
  const [newFeatureText, setNewFeatureText] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedError, setCopiedError] = useState(false);

  const handleCopyError = () => {
    if (errorMsg) {
      navigator.clipboard.writeText(errorMsg);
      setCopiedError(true);
      setTimeout(() => setCopiedError(false), 2000);
    }
  };

  // Auto-generate slug from title if empty
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!propertyToEdit) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Property title is required.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    const payload: Partial<Property> = {
      ...(propertyToEdit?.id ? { id: propertyToEdit.id } : {}),
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type,
      category,
      purpose,
      location: {
        address: address.trim() || 'Prime Axis',
        neighborhood: neighborhood.trim() || city,
        city,
        state: stateName
      },
      priceNgn: Number(priceNgn),
      sizeSqm: Number(sizeSqm) || undefined,
      plotsCount: Number(plotsCount) || 1,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      titleStatus,
      titleVerified,
      verificationDocNo: verificationDocNo.trim() || 'LEGIT/VERIFIED/2026',
      developerInfo: {
        name: developerName.trim(),
        trackRecord: developerTrack.trim(),
        verifiedStatus: developerStatus.trim()
      },
      featured,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'],
      description: description.trim() || 'Verified real estate listing with clean title clearance.',
      features,
      nearbyLandmarks: ['Close to Express Road', 'Prime Commercial Hub'],
      paymentPlan: {
        available: true,
        minDownpaymentPercent: 30,
        maxTenorMonths: 12,
        monthlyEstNgn: Math.round(priceNgn * 0.7 / 12)
      },
      dateAdded: propertyToEdit?.dateAdded || new Date().toISOString().split('T')[0],
      verificationNotes: '100% Certified Title Search at Lands Registry',
      whatsappNumber: whatsappNumber.trim() || '+2348030000000',
      callNumber: callNumber.trim() || '+2348030000000'
    };

    const res = await onSave(payload);
    setIsSaving(false);
    
    if (typeof res === 'boolean') {
      if (res) {
        onClose();
      } else {
        setErrorMsg('Failed to save property to Supabase. Please check database permissions or network connection.');
      }
    } else {
      if (res.success) {
        onClose();
      } else {
        // Display exact error message and details from Supabase
        setErrorMsg(res.error || 'Failed to save property to Supabase.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-[#102033] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#167A5A] rounded-xl text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {propertyToEdit ? 'Edit Property Listing' : 'Publish Live Verified Property'}
              </h3>
              <p className="text-xs text-slate-400">Syncs directly to Supabase <code className="text-emerald-400 font-mono">properties</code> table</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs sm:text-sm">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-2xl text-xs space-y-2 animate-in fade-in duration-150">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-950 block mb-0.5">Supabase Operation Error:</span>
                    <p className="font-mono text-[11px] leading-relaxed break-words bg-red-100/70 p-2.5 rounded-xl border border-red-200/80 text-red-900">
                      {errorMsg}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyError}
                  className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-[11px] font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                  title="Copy error message"
                >
                  {copiedError ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedError ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {errorMsg.toLowerCase().includes('row-level security') && (
                <div className="text-[11px] text-red-800 bg-white/80 p-2.5 rounded-xl border border-red-200">
                  <strong className="block text-red-950 mb-1">💡 Row Level Security (RLS) Tip:</strong>
                  Ensure your Supabase table policy allows inserts for authenticated users:
                  <pre className="mt-1 p-2 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[10px] overflow-x-auto">
{`CREATE POLICY "Enable all for authenticated users" 
ON public.properties FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);`}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h4 className="font-bold text-[#102033] text-xs uppercase tracking-wider border-b pb-1">
              1. Title & Classification
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. 600sqm Dry Land in Prime Lekki Phase 1"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PropertyType)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 bg-white"
                >
                  <option value="land">Verified Land Plot</option>
                  <option value="apartment">Luxury Apartment</option>
                  <option value="duplex">Executive Duplex / Villa</option>
                  <option value="terrace">Terrace Duplex</option>
                  <option value="commercial">Commercial Plot / Space</option>
                  <option value="investment">Land Banking Investment</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Homepage Carousel Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 bg-white"
                >
                  <option value="prime_land">Prime Lands & Plots</option>
                  <option value="luxury_apartment">Luxury Apartments</option>
                  <option value="investment_plot">Investment & Land Banking</option>
                  <option value="executive_duplex">Executive Duplexes & Villas</option>
                  <option value="diaspora_choice">Diaspora Choice</option>
                  <option value="newly_listed">Newly Listed Deal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Location & Pricing */}
          <div className="space-y-4">
            <h4 className="font-bold text-[#102033] text-xs uppercase tracking-wider border-b pb-1">
              2. Location & Pricing (NGN)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
                <select
                  value={city}
                  onChange={(e) => {
                    const newCity = e.target.value as any;
                    setCity(newCity);
                    setStateName(newCity === 'Abuja' ? 'Federal Capital Territory' : newCity === 'Port Harcourt' ? 'Rivers State' : 'Lagos State');
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 bg-white"
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                  <option value="Ibadan">Ibadan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Neighborhood / District</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. Lekki Phase 1 / Ikoyi"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Admiralty Way Axis"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Price in NGN (₦) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={500000}
                  value={priceNgn}
                  onChange={(e) => setPriceNgn(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Size (Sqm)</label>
                <input
                  type="number"
                  value={sizeSqm || ''}
                  onChange={(e) => setSizeSqm(Number(e.target.value))}
                  placeholder="e.g. 600"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bedrooms (If building)</label>
                <input
                  type="number"
                  value={bedrooms || ''}
                  onChange={(e) => setBedrooms(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 4"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Title Verification Details */}
          <div className="space-y-4">
            <h4 className="font-bold text-[#102033] text-xs uppercase tracking-wider border-b pb-1">
              3. Legal Title Document Status
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title Document Type</label>
                <select
                  value={titleStatus}
                  onChange={(e) => setTitleStatus(e.target.value as TitleStatus)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 bg-white font-medium"
                >
                  <option value="Certificate of Occupancy (C of O)">Certificate of Occupancy (C of O)</option>
                  <option value="Governor's Consent">Governor's Consent</option>
                  <option value="Gazette">Gazette</option>
                  <option value="Excision Title">Excision Title</option>
                  <option value="Registered Survey & Deed">Registered Survey & Deed</option>
                  <option value="Federal C of O">Federal C of O</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Verification / Ref Doc Number</label>
                <input
                  type="text"
                  value={verificationDocNo}
                  onChange={(e) => setVerificationDocNo(e.target.value)}
                  placeholder="e.g. LAG/GOV/CONSENT/2026/9912"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Images & Media */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#102033] text-xs uppercase tracking-wider border-b pb-1">
              4. Property Photos (Image URLs)
            </h4>

            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste high-res image URL (e.g. https://images.unsplash.com/...)"
                className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 text-xs"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-xs hover:bg-slate-700 cursor-pointer"
              >
                Add Image
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Description & Highlights */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#102033] text-xs uppercase tracking-wider border-b pb-1">
              5. Description & Key Highlights
            </h4>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive details on dry soil condition, road network, power availability, security gate..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Features & Highlights</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  placeholder="e.g. 100% High Dry Soil"
                  className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Add Feature
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {features.map((feat, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs border border-slate-200">
                    <span>{feat}</span>
                    <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-slate-400 hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Direct Contact Numbers */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#102033] text-xs uppercase tracking-wider border-b pb-1">
              6. Direct Verified Contact Numbers
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. +2348030000000"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 text-xs sm:text-sm font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Direct Call Number</label>
                <input
                  type="text"
                  value={callNumber}
                  onChange={(e) => setCallNumber(e.target.value)}
                  placeholder="e.g. +2348030000000"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 text-xs sm:text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#167A5A] hover:bg-[#13684d] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{propertyToEdit ? 'Save Property Changes' : 'Publish Property to Supabase'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
