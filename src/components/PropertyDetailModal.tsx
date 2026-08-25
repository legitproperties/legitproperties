import React, { useState } from 'react';
import { Property, CurrencyCode } from '../types';
import { formatCurrency, createWhatsAppInquiryUrl } from '../utils/formatters';
import {
  X,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Bookmark,
  Share2,
  MessageCircle,
  Calculator,
  Bed,
  Bath,
  Maximize2,
  Check,
  Award
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  currency: CurrencyCode;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (id: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  currency,
  isSaved,
  onClose,
  onToggleSave,
}) => {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downpaymentPercent, setDownpaymentPercent] = useState(
    property.paymentPlan?.minDownpaymentPercent || 30
  );
  const [tenorMonths, setTenorMonths] = useState(6);

  const priceFormatted = formatCurrency(property.priceNgn, currency);
  const whatsappUrl = createWhatsAppInquiryUrl(property.title, property.id, priceFormatted);

  // Installment calculation logic
  const downpaymentAmount = (property.priceNgn * downpaymentPercent) / 100;
  const balanceAmount = property.priceNgn - downpaymentAmount;
  const monthlyPayment = balanceAmount / (tenorMonths || 1);

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Sticky Header */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">
                Audited Title Ref: {property.verificationDocNo || 'LAG/TIT/VERIFIED'}
              </div>
              <h3 className="text-sm sm:text-base font-black truncate max-w-md sm:max-w-xl">
                {property.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(property.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isSaved ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
              }`}
              title="Bookmark Property"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={handleCopyShareLink}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
              title="Share Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Gallery Showcase */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
              <img
                src={property.images[activeImageIndex] || property.images[0]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% {property.titleStatus}</span>
              </div>
            </div>

            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-all ${
                      activeImageIndex === idx ? 'border-slate-900 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Info Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.location.address}, {property.location.neighborhood}, {property.location.city}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {priceFormatted}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Inquire Title & Documents</span>
              </a>
            </div>
          </div>

          {/* Verification Audit Highlight Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Official Verification Notes & Search Result</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {property.verificationNotes || 'Title search conducted directly at state registry. Zero overlap, zero omonile risk, and completely free of court litigation.'}
            </p>
          </div>

          {/* Main Grid: Description + Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Description & Features (2 cols) */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Property Overview</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {property.features && property.features.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">Key Features & Highlights</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {property.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.nearbyLandmarks && property.nearbyLandmarks.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Neighborhood Proximity</h4>
                  <div className="space-y-1.5">
                    {property.nearbyLandmarks.map((high, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{high}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Specs & Installment Calculator (1 col) */}
            <div className="space-y-4">
              
              {/* Specs Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Property Specifications</h4>
                
                <div className="space-y-2 text-xs text-slate-700 font-semibold">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Property Type</span>
                    <span className="font-bold uppercase text-slate-900">{property.type}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Location</span>
                    <span className="font-bold text-slate-900">{property.location.city}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Title Document</span>
                    <span className="font-bold text-slate-900">{property.titleStatus}</span>
                  </div>
                  {property.sizeSqm && (
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500 font-medium">Land Size</span>
                      <span className="font-bold text-slate-900">{property.sizeSqm} sqm</span>
                    </div>
                  )}
                  {property.bedrooms && (
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500 font-medium">Bedrooms</span>
                      <span className="font-bold text-slate-900">{property.bedrooms} Ensuite</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Installment Estimator */}
              {property.paymentPlan?.available && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                    <Calculator className="w-4 h-4 text-slate-700" />
                    <span>Flexible Installment Calculator</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                        <span>Downpayment</span>
                        <span>{downpaymentPercent}% ({formatCurrency(downpaymentAmount, currency)})</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="60"
                        step="5"
                        value={downpaymentPercent}
                        onChange={(e) => setDownpaymentPercent(Number(e.target.value))}
                        className="w-full accent-slate-900"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                        <span>Payment Duration</span>
                        <span>{tenorMonths} Months</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {[3, 6, 12].map((m) => (
                          <button
                            key={m}
                            onClick={() => setTenorMonths(m)}
                            className={`py-1 rounded-md text-[11px] font-bold border transition-colors cursor-pointer ${
                              tenorMonths === m
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {m} Months
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[11px] text-slate-500 font-bold">Monthly Payment</span>
                      <span className="text-sm font-black text-slate-900">
                        {formatCurrency(monthlyPayment, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              LP
            </div>
            <div>
              <div className="font-bold text-slate-900">{property.developerInfo.name}</div>
              <div className="text-[10px] text-emerald-700 font-bold">{property.developerInfo.verifiedStatus}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 rounded-xl font-semibold text-slate-700 cursor-pointer"
            >
              Close
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Contact Senior Verifier</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
