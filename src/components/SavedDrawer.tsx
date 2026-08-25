import React from 'react';
import { Property, CurrencyCode } from '../types';
import { formatCompactPrice, formatCurrency } from '../utils/formatters';
import { X, Trash2, MessageCircle, ShieldCheck } from 'lucide-react';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  currency: CurrencyCode;
  onRemoveSaved: (id: string) => void;
  onClearAll?: () => void;
  onSelectProperty: (property: Property) => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  currency,
  onRemoveSaved,
  onClearAll,
  onSelectProperty,
}) => {
  if (!isOpen) return null;

  const totalValueNgn = savedProperties.reduce((sum, p) => sum + p.priceNgn, 0);

  const bulkWhatsappMessage = `Hello legitproperties! I have saved ${savedProperties.length} verified properties on your website and would like a combined title verification report & site inspection schedule:\n\n` +
    savedProperties.map((p, idx) => `${idx + 1}. ${p.title} (${formatCompactPrice(p.priceNgn, currency)})`).join('\n') +
    `\n\nTotal Portfolio Value: ${formatCurrency(totalValueNgn, currency)}`;

  const bulkWhatsappUrl = `https://wa.me/2348030001122?text=${encodeURIComponent(bulkWhatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-800 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base tracking-tight">Saved Properties ({savedProperties.length})</h3>
          </div>
          <div className="flex items-center gap-2">
            {savedProperties.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded-md bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
                title="Clear all saved properties"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedProperties.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-700">No saved properties yet</p>
              <p className="text-xs text-slate-500 max-w-xs">Click the bookmark icon on any verified property to save it for easy comparison and instant WhatsApp inquiry.</p>
            </div>
          ) : (
            savedProperties.map((property) => (
              <div
                key={property.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-xs transition-all flex gap-3 items-center"
              >
                <img
                  src={property.images[0]}
                  alt={property.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    onSelectProperty(property);
                    onClose();
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-black text-slate-500 tracking-wider">{property.titleStatus}</div>
                  <h4
                    onClick={() => {
                      onSelectProperty(property);
                      onClose();
                    }}
                    className="text-xs font-bold text-slate-900 truncate cursor-pointer hover:text-slate-700 transition-colors"
                  >
                    {property.title}
                  </h4>
                  <div className="text-xs font-black text-slate-900 mt-0.5">
                    {formatCompactPrice(property.priceNgn, currency)}
                  </div>
                </div>

                <button
                  onClick={() => onRemoveSaved(property.id)}
                  className="p-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedProperties.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-wider">Combined Saved Value</span>
              <span className="text-base font-black text-slate-900">
                {formatCurrency(totalValueNgn, currency)}
              </span>
            </div>

            <a
              href={bulkWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Inquire All Saved Properties on WhatsApp</span>
            </a>
          </div>
        )}

      </div>

    </div>
  );
};
