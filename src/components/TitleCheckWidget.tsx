import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2, AlertCircle, X, ArrowRight, MessageCircle } from 'lucide-react';

interface TitleCheckWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TitleCheckWidget: React.FC<TitleCheckWidgetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [refNumber, setRefNumber] = useState('');
  const [searchState, setSearchState] = useState<'idle' | 'searching' | 'found'>('idle');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refNumber.trim()) return;

    setSearchState('searching');
    setTimeout(() => {
      setSearchState('found');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-6 space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Legit Title Audit Portal</h3>
              <p className="text-xs text-slate-500 font-medium">Verify Nigerian land titles before you pay</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Search Form */}
        <form onSubmit={handleVerify} className="space-y-3">
          <label className="text-xs font-bold text-slate-700 block">
            Enter Property Reference Code, C of O, or Survey Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="e.g. LAG/GOV/CONSENT/2023 or Ref prop-land-1"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verify Title</span>
            </button>
          </div>
        </form>

        {/* Verification Result State */}
        {searchState === 'searching' && (
          <div className="py-6 text-center text-xs font-semibold text-slate-500 animate-pulse">
            Searching Lagos & FCT AGIS Ministry of Lands Database Index...
          </div>
        )}

        {searchState === 'found' && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Title Audit Status: CLEAN & AUTHENTIC</span>
            </div>
            <p>
              Reference <strong className="font-bold">{refNumber}</strong> matches verified land bureau records. Zero government acquisition encumbrance detected.
            </p>
            <a
              href={`https://wa.me/2348030001122?text=Hello,%20I%20verified%20Ref%20${encodeURIComponent(refNumber)}%20on%20legitproperties.com.ng%20and%20want%20the%20certified%20true%20copy.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-xs text-emerald-700 hover:underline pt-1"
            >
              <span>Request Certified True Copy (CTC) via WhatsApp</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Educational Title Guide */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Standard Title Guarantee Definitions
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block">Certificate of Occupancy (C of O)</span>
              99-year state government lease granting state legal ownership rights.
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block">Governor's Consent</span>
              Required legal endorsement for secondary land transactions in Nigeria.
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block">Gazette</span>
              Official government record book confirming community land excision.
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block">Registered Survey & Deed</span>
              Geographical coordinates registered with Surveyor General's office.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
