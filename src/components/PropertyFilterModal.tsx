import React from 'react';
import { FilterOptions } from '../types';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

interface PropertyFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterOptions: FilterOptions;
  onFilterChange: (updated: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const PropertyFilterModal: React.FC<PropertyFilterModalProps> = ({
  isOpen,
  onClose,
  filterOptions,
  onFilterChange,
  onResetFilters,
  totalResultsCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-base">Filter Properties</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Form Body */}
        <div className="space-y-4 text-xs">
          
          {/* Property Type */}
          <div>
            <label className="font-bold text-slate-700 block mb-2 uppercase tracking-wider text-[11px]">
              Property Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'All', value: 'all' },
                { label: 'Lands', value: 'land' },
                { label: 'Apartments', value: 'apartment' },
                { label: 'Duplexes', value: 'duplex' }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => onFilterChange({ type: item.value as any })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    filterOptions.type === item.value
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* City / Region */}
          <div>
            <label className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[11px]">
              Location / City
            </label>
            <select
              value={filterOptions.city}
              onChange={(e) => onFilterChange({ city: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">All Locations (Lagos, Abuja, Port Harcourt)</option>
              <option value="Lagos">Lagos State (Lekki, Ikoyi, VGC, Epe)</option>
              <option value="Abuja">Abuja FCT (Maitama, Guzape, Katampe)</option>
              <option value="Port Harcourt">Port Harcourt (Trans Amadi)</option>
            </select>
          </div>

          {/* Title Document Type */}
          <div>
            <label className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[11px]">
              Verified Title Status
            </label>
            <select
              value={filterOptions.titleStatus}
              onChange={(e) => onFilterChange({ titleStatus: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">Any Verified Title</option>
              <option value="C of O">Certificate of Occupancy (C of O)</option>
              <option value="Governor's Consent">Governor's Consent</option>
              <option value="Federal C of O">Federal C of O</option>
              <option value="Gazette">Gazette Title</option>
            </select>
          </div>

          {/* Maximum Price Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Maximum Price (₦ NGN)
              </label>
              <span className="font-extrabold text-emerald-700 text-xs">
                {filterOptions.maxPrice >= 1000000000
                  ? 'No Limit'
                  : `₦${(filterOptions.maxPrice / 1000000).toFixed(0)}M`}
              </span>
            </div>
            <input
              type="range"
              min="15000000"
              max="1500000000"
              step="15000000"
              value={filterOptions.maxPrice || 1500000000}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Show {totalResultsCount} Matching Properties
          </button>
        </div>

      </div>
    </div>
  );
};
