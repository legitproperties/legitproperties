import React from 'react';
import { Property, CurrencyCode } from '../types';
import { formatCompactPrice, createWhatsAppInquiryUrl } from '../utils/formatters';
import { ShieldCheck, MapPin, Bookmark, Bed, Bath, Maximize2, MessageCircle } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  currency: CurrencyCode;
  isSaved: boolean;
  onToggleSave: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  currency,
  isSaved,
  onToggleSave,
  onSelectProperty,
}) => {
  const priceFormatted = formatCompactPrice(property.priceNgn, currency);
  const whatsappUrl = createWhatsAppInquiryUrl(property.title, property.id, priceFormatted);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col h-full w-[300px] sm:w-[340px] flex-shrink-0">
      
      {/* Image Thumbnail Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelectProperty(property)}>
        <img
          src={property.images[0]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Dark overlay gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Title Status Verification Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{property.titleStatus}</span>
        </div>

        {/* Bookmark Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(property.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-xs cursor-pointer ${
            isSaved
              ? 'bg-[#167A5A] text-white'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-slate-900'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save Property'}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>

        {/* Property Category Tag */}
        <div className="absolute bottom-3 left-3 text-white text-[10px] uppercase font-extrabold tracking-wider bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
          {property.type === 'land' ? 'Verified Land Plot' : property.type}
        </div>

        {/* Image count indicator if multiple */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 text-white text-[10px] font-bold bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
            1/{property.images.length} Photos
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        
        <div className="space-y-2">
          {/* Location Line */}
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{property.location.neighborhood}, {property.location.city}</span>
          </div>

          {/* Title Heading */}
          <h3
            onClick={() => onSelectProperty(property)}
            className="text-sm sm:text-base font-bold text-[#102033] line-clamp-2 cursor-pointer hover:text-[#167A5A] transition-colors leading-snug"
          >
            {property.title}
          </h3>
        </div>

        {/* Specs Highlights */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600 font-semibold">
          {property.type === 'land' ? (
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.sizeSqm ? `${property.sizeSqm} sqm` : 'Standard Plot'}</span>
              {property.plotsCount && property.plotsCount > 1 && (
                <span className="text-slate-400">({property.plotsCount} Plots)</span>
              )}
            </div>
          ) : (
            <>
              {property.bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  <span>{property.bedrooms} Beds</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              )}
            </>
          )}

          {property.paymentPlan?.available && (
            <span className="ml-auto text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-50 text-[#167A5A] rounded-md border border-emerald-200">
              Payment Plan
            </span>
          )}
        </div>

        {/* Price & Action Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Verified Price</div>
            <div className="text-base sm:text-lg font-extrabold text-[#102033] tracking-tight">
              {priceFormatted}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectProperty(property)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-[#102033] text-xs font-semibold transition-colors cursor-pointer"
            >
              Details
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-[#102033] hover:bg-[#167A5A] text-white transition-colors cursor-pointer"
              title="Quick WhatsApp Inquiry"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
