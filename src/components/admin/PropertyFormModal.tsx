import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Video,
  AlertCircle,
  Copy,
  Check,
  Image as ImageIcon,
  DollarSign,
  Phone,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Property, SupportedCity, ListingType, PriceUnit, TitleStatus } from '../../types';

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
  propertyToEdit
}) => {
  if (!isOpen) return null;

  // 1. Basic Fields
  const [title, setTitle] = useState(propertyToEdit?.title || '');
  const [description, setDescription] = useState(
    propertyToEdit?.description ||
      'Verified luxury accommodation featuring uninterrupted 24/7 power, high-speed fiber internet, executive security, and modern designer furnishings.'
  );

  // 2. Listing Type & Price Unit
  const [listingType, setListingType] = useState<ListingType>(
    propertyToEdit?.listing_type ||
      (propertyToEdit?.category === 'short_stay' || propertyToEdit?.property_type === 'short_stay'
        ? 'short_stay'
        : 'short_stay')
  );

  const [priceUnit, setPriceUnit] = useState<PriceUnit>(
    propertyToEdit?.price_unit || (listingType === 'short_stay' ? 'per_night' : 'total')
  );

  // 3. Location
  const [city, setCity] = useState<SupportedCity>(
    (propertyToEdit?.location?.city as SupportedCity) || 'Lagos'
  );
  const [neighborhood, setNeighborhood] = useState(propertyToEdit?.location?.neighborhood || '');
  const [address, setAddress] = useState(propertyToEdit?.location?.address || '');

  // 4. Price & Specs
  const [priceNgn, setPriceNgn] = useState<number>(propertyToEdit?.priceNgn || 120000);
  const [bedrooms, setBedrooms] = useState<number>(propertyToEdit?.bedrooms || 2);
  const [bathrooms, setBathrooms] = useState<number>(propertyToEdit?.bathrooms || 2);

  // 5. Contact Numbers
  const [whatsappNumber, setWhatsappNumber] = useState(
    propertyToEdit?.whatsappNumber || '+2348030000000'
  );
  const [callNumber, setCallNumber] = useState(
    propertyToEdit?.callNumber || '+2348030000000'
  );

  // 6. Media: Main Image & 4 Separate Gallery Images
  const existingImages = propertyToEdit?.images || [];
  const [mainImageUrl, setMainImageUrl] = useState(
    propertyToEdit?.property_image ||
      existingImages[0] ||
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  );

  const [galleryImg1, setGalleryImg1] = useState(existingImages[1] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80');
  const [galleryImg2, setGalleryImg2] = useState(existingImages[2] || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80');
  const [galleryImg3, setGalleryImg3] = useState(existingImages[3] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
  const [galleryImg4, setGalleryImg4] = useState(existingImages[4] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80');

  // 7. Video & Availability
  const [propertyVideo, setPropertyVideo] = useState(
    propertyToEdit?.property_video || propertyToEdit?.virtualTourUrl || ''
  );
  const [propertyAvailability, setPropertyAvailability] = useState<'available' | 'sold'>(
    propertyToEdit?.property_availability === 'sold' ? 'sold' : 'available'
  );

  // 8. Title Status
  const [titleStatus, setTitleStatus] = useState<TitleStatus>(
    propertyToEdit?.titleStatus || (listingType === 'short_stay' ? 'Short Stay Verified License' : 'Certificate of Occupancy (C of O)')
  );

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedError, setCopiedError] = useState(false);

  // Automatic synchronization: when listingType switches, align default priceUnit & titleStatus
  const handleListingTypeChange = (type: ListingType) => {
    setListingType(type);
    if (type === 'short_stay') {
      setPriceUnit('per_night');
      if (priceNgn > 5000000) setPriceNgn(150000);
      setTitleStatus('Short Stay Verified License');
    } else {
      setPriceUnit('total');
      if (priceNgn < 1000000) setPriceNgn(75000000);
      setTitleStatus('Certificate of Occupancy (C of O)');
    }
  };

  const handleCopyError = () => {
    if (errorMsg) {
      navigator.clipboard.writeText(errorMsg);
      setCopiedError(true);
      setTimeout(() => setCopiedError(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Property title is required.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    // Build gallery images array
    const galleryArray = [
      mainImageUrl.trim(),
      galleryImg1.trim(),
      galleryImg2.trim(),
      galleryImg3.trim(),
      galleryImg4.trim()
    ].filter(Boolean);

    const stateMap: Record<SupportedCity, string> = {
      Lagos: 'Lagos State',
      Abuja: 'Federal Capital Territory',
      'Port Harcourt': 'Rivers State',
      Ibadan: 'Oyo State',
      Edo: 'Edo State',
      Enugu: 'Enugu State',
      Anambra: 'Anambra State'
    };

    const payload: Partial<Property> = {
      ...(propertyToEdit?.id ? { id: propertyToEdit.id } : {}),
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: description.trim(),
      listing_type: listingType,
      property_type: listingType === 'short_stay' ? 'short_stay' : 'for_sale',
      type: (listingType === 'short_stay' ? 'short_stay' : 'apartment') as any,
      price_unit: priceUnit,
      category: listingType === 'short_stay' ? 'short_stay' : 'luxury_apartment',
      purpose: listingType === 'short_stay' ? 'Vacation & Short Stay' : 'Investment',
      location: {
        address: address.trim() || `${neighborhood || city}, ${stateMap[city]}`,
        neighborhood: neighborhood.trim() || city,
        city,
        state: stateMap[city]
      },
      priceNgn: Number(priceNgn),
      bedrooms: Number(bedrooms) || undefined,
      bathrooms: Number(bathrooms) || undefined,
      whatsappNumber: whatsappNumber.trim(),
      callNumber: callNumber.trim(),
      property_image: mainImageUrl.trim(),
      gallery_images: galleryArray,
      images: galleryArray,
      property_video: propertyVideo.trim() || undefined,
      virtualTourUrl: propertyVideo.trim() || undefined,
      property_availability: propertyAvailability,
      titleStatus,
      titleVerified: true,
      verificationDocNo: propertyToEdit?.verificationDocNo || `LEGIT/${city.toUpperCase()}/2026`,
      developerInfo: propertyToEdit?.developerInfo || {
        name: 'Legit Verified Direct Host',
        trackRecord: '5+ Years Clean Inspection Record',
        verifiedStatus: 'CAC & Identity Audited'
      },
      featured: true,
      features: listingType === 'short_stay' 
        ? ['24/7 Power', 'High Speed Fiber Wi-Fi', 'Security & Access Control', 'Dedicated Chef / Concierge']
        : ['100% Dry Land / Prime Building', 'Registered Title Survey', 'Paved Access Road'],
      amenities: ['Air Conditioning', 'Smart TV with Netflix', 'Fully Equipped Kitchen', '24/7 Security Patrol'],
      nearbyLandmarks: ['Close to Premium Hubs', 'Airport Corridor Access'],
      dateAdded: propertyToEdit?.dateAdded || new Date().toISOString().split('T')[0],
      verificationNotes: 'Audited & certified by Legit Properties Verification Desk'
    };

    const res = await onSave(payload);
    setIsSaving(false);

    if (typeof res === 'boolean') {
      if (res) onClose();
      else setErrorMsg('Failed to save property. Please check database permissions.');
    } else {
      if (res.success) onClose();
      else setErrorMsg(res.error || 'Failed to save property to database.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700 rounded-xl text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {propertyToEdit ? 'Edit Property Listing' : 'Add New Property Listing'}
              </h3>
              <p className="text-xs text-slate-400">
                Syncs live to the <code className="text-emerald-400 font-mono">properties</code> database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs sm:text-sm">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-2xl text-xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-950 block">Database Sync Notice:</span>
                    <p className="font-mono text-[11px] leading-relaxed break-words bg-red-100 p-2 rounded-xl text-red-900">
                      {errorMsg}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyError}
                  className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-[11px] font-semibold flex items-center gap-1 shrink-0"
                >
                  {copiedError ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedError ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Section 1: Classification & Type */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
              1. Title, Classification & Availability
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Luxury 2-Bedroom Waterfront Penthouse with Lagoon View"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Listing Type Dropdown: short_stay vs for_sale */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Listing Type *
                  </label>
                  <select
                    value={listingType}
                    onChange={(e) => handleListingTypeChange(e.target.value as ListingType)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 bg-white font-bold cursor-pointer"
                  >
                    <option value="short_stay">🏨 Short Stay (Airbnb / Vacation)</option>
                    <option value="for_sale">🏡 Property for Sale (Purchase)</option>
                  </select>
                </div>

                {/* Location Dropdown: Lagos, Abuja, Port Harcourt, Ibadan, Edo, Enugu, Anambra */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Location City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as SupportedCity)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 bg-white font-bold cursor-pointer"
                  >
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                    <option value="Ibadan">Ibadan</option>
                    <option value="Edo">Edo</option>
                    <option value="Enugu">Enugu</option>
                    <option value="Anambra">Anambra</option>
                  </select>
                </div>

                {/* Property Availability: available vs sold */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Property Availability *
                  </label>
                  <select
                    value={propertyAvailability}
                    onChange={(e) => setPropertyAvailability(e.target.value as 'available' | 'sold')}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 bg-white font-bold cursor-pointer"
                  >
                    <option value="available">🟢 Available (Live & Bookable)</option>
                    <option value="sold">🔴 Sold (Unavailable / Booked)</option>
                  </select>
                </div>

              </div>

              {/* Neighborhood & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Neighborhood / District</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. Ikoyi / Maitama / Old GRA / Bodija"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specific Address / Landmark</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Off Alexander Avenue"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Pricing Unit */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
              2. Price in Naira & Price Unit
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Price in Naira (NGN ₦) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-slate-500">₦</span>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={priceNgn}
                    onChange={(e) => setPriceNgn(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Price Unit Dropdown: per night vs total */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Price Unit *
                </label>
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value as PriceUnit)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 bg-white font-semibold cursor-pointer"
                >
                  <option value="per_night">per night (Short Stay)</option>
                  <option value="total">total (Purchase Price)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bedrooms / Baths</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={1}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    placeholder="Beds"
                    className="w-full px-2 py-2.5 border border-slate-300 rounded-xl text-center font-bold"
                  />
                  <input
                    type="number"
                    min={1}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    placeholder="Baths"
                    className="w-full px-2 py-2.5 border border-slate-300 rounded-xl text-center font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Agent Direct Contact Numbers */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
              3. Dual Agent Contact (WhatsApp & Direct Call)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number *</label>
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+234 803 000 0000"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Direct Call Number *</label>
                <input
                  type="text"
                  required
                  value={callNumber}
                  onChange={(e) => setCallNumber(e.target.value)}
                  placeholder="+234 803 000 0000"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Main Image & 4 Separate Gallery Image URLs */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
              4. Main Property Image URL & 4 Separate Gallery Images
            </h4>

            <div className="space-y-3">
              {/* Main Image */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Main Property Image URL (Card Thumbnail & Hero) *
                </label>
                <input
                  type="url"
                  required
                  value={mainImageUrl}
                  onChange={(e) => setMainImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 text-xs"
                />
              </div>

              {/* 4 Separate Gallery Image URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">
                    Gallery Image 1 URL
                  </label>
                  <input
                    type="url"
                    value={galleryImg1}
                    onChange={(e) => setGalleryImg1(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">
                    Gallery Image 2 URL
                  </label>
                  <input
                    type="url"
                    value={galleryImg2}
                    onChange={(e) => setGalleryImg2(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">
                    Gallery Image 3 URL
                  </label>
                  <input
                    type="url"
                    value={galleryImg3}
                    onChange={(e) => setGalleryImg3(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">
                    Gallery Image 4 URL
                  </label>
                  <input
                    type="url"
                    value={galleryImg4}
                    onChange={(e) => setGalleryImg4(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Property Video Walkthrough (YouTube / Vimeo) */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
              5. Video Walkthrough & Virtual Tour
            </h4>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-emerald-700" />
                <span>Property Video Link (`property_video`)</span>
              </label>
              <input
                type="url"
                value={propertyVideo}
                onChange={(e) => setPropertyVideo(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Walkthrough tour for verified diaspora buyers and guests looking for authentic views.
              </p>
            </div>
          </div>

          {/* Section 6: Full Description */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-700">
              Full Property Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 text-xs sm:text-sm leading-relaxed"
            />
          </div>

          {/* Footer Save Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Saving to Database...' : propertyToEdit ? 'Update Property' : 'Publish Property'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
