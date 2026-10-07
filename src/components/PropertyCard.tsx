import React from 'react';
import { Property, CurrencyCode } from '../types';
import { ShieldCheck, MapPin, Bookmark, Bed, Bath, Maximize2, MessageCircle, Phone, ArrowUpRight, Flame, Calendar } from 'lucide-react';
import { formatDualPrice } from '../utils/formatters';

interface PropertyCardProps {
  property: Property;
  currency: CurrencyCode;
  isSaved: boolean;
  onToggleSave: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenBooking?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  currency,
  isSaved,
  onToggleSave,
  onSelectProperty,
  onOpenBooking
}) => {
  const isShortStay =
    property.listing_type === 'short_stay' ||
    property.price_unit === 'per_night' ||
    property.category === 'short_stay';

  const priceUnitLabel = isShortStay ? ' / night' : '';
  const dualPrice = formatDualPrice(property.priceNgn, property.priceUsd, priceUnitLabel);
  const cleanWhatsapp = (property.whatsappNumber || '+2348030000000').replace(/[^0-9]/g, '');
  const cleanCall = property.callNumber || property.whatsappNumber || '+2348030000000';
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Hello Legit Properties! I am inquiring about: ${property.title} in ${property.location.neighborhood || property.location.city} (${dualPrice.combined}). Is it available?`
  )}`;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full w-[310px] sm:w-[350px] flex-shrink-0">
      
      {/* Image Thumbnail Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelectProperty(property)}>
        <img
          src={property.images[0] || property.property_image}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Dark overlay gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Title Status Verification Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{property.titleStatus}</span>
        </div>

        {/* Sold Badge */}
        {property.property_availability === 'sold' && (
          <div className="absolute top-11 left-3 px-2.5 py-0.5 rounded-full bg-red-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-md">
            Sold Out
          </div>
        )}

        {/* Bookmark Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(property.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
            isSaved
              ? 'bg-slate-900 text-white'
              : 'bg-black/40 text-white hover:bg-slate-900 hover:text-white border border-white/20'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save Property'}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>

        {/* Property Category Tag & Location */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="text-white text-[10px] uppercase font-black tracking-wider bg-slate-900/90 px-2.5 py-0.5 rounded-md backdrop-blur-xs shadow-xs">
            {isShortStay ? 'Short Stay' : property.type === 'land' ? 'Verified Land' : 'For Sale'}
          </span>
          {property.featured && (
            <span className="text-white text-[10px] uppercase font-bold tracking-wider bg-amber-600/90 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-yellow-300" /> Hot
            </span>
          )}
        </div>

        {/* Image count indicator if multiple */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          {(property.property_video || property.virtualTourUrl) && (
            <div className="text-white text-[10px] font-bold bg-red-600/90 border border-white/10 px-2 py-0.5 rounded-md backdrop-blur-xs">
              Video
            </div>
          )}
          {property.images.length > 1 && (
            <div className="text-white text-[10px] font-bold bg-black/60 border border-white/10 px-2 py-0.5 rounded-md backdrop-blur-xs">
              1/{property.images.length}
            </div>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-white">
        
        <div className="space-y-2">
          {/* Location Line */}
          <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{property.location.neighborhood}, {property.location.city}</span>
          </div>

          {/* Title Heading */}
          <h3
            onClick={() => onSelectProperty(property)}
            className="text-sm sm:text-base font-extrabold text-slate-900 line-clamp-2 cursor-pointer hover:text-slate-700 transition-colors leading-snug"
          >
            {property.title}
          </h3>
        </div>

        {/* Specs Highlights */}
        <div className="flex items-center gap-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 font-semibold">
          {property.type === 'land' ? (
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{property.sizeSqm ? `${property.sizeSqm} sqm` : 'Standard Plot'}</span>
            </div>
          ) : (
            <>
              {property.bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-slate-500" />
                  <span>{property.bedrooms} Beds</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-slate-500" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              )}
            </>
          )}

          {property.paymentPlan?.available && (
            <span className="ml-auto text-[10px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
              Payment Plan
            </span>
          )}
        </div>

        {/* Price & Primary CTA */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5 mt-auto">
          
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">Price (₦ / $)</div>
            <div className="text-right">
              <span className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-tight">
                {dualPrice.ngnFormatted}
              </span>
              <span className="ml-1.5 text-xs font-bold text-emerald-700 font-mono">
                ({dualPrice.usdFormatted})
              </span>
            </div>
          </div>

          {/* Instant Book or Inquire Button */}
          <button
            onClick={() => onOpenBooking ? onOpenBooking(property) : onSelectProperty(property)}
            className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isShortStay ? 'Instant Book' : 'Inquire / Request Tour'}</span>
          </button>

          {/* Dual Agent Contact: Direct Call & WhatsApp Integration */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${cleanCall}`}
              className="py-2 px-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3 h-3 text-slate-600" />
              <span>Direct Call</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2 px-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
