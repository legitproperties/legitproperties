import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Layers, BookOpen, ExternalLink } from 'lucide-react';

interface LegalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTitleCheck: () => void;
}

export const LegalGuideModal: React.FC<LegalGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenTitleCheck,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-[#102033] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#167A5A] text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Nigerian Real Estate Legal Framework
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Title Verification & Land Audit Policy
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-slate-700">
          
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5 text-xs text-slate-800">
            <div className="flex items-center gap-2 font-extrabold text-[#167A5A]">
              <ShieldCheck className="w-4 h-4" />
              <span>Understanding Nigerian Title Hierarchy</span>
            </div>
            <p className="leading-relaxed">
              In accordance with the Land Use Act of 1978, all land in a State is vested in the State Governor. Here is how legitproperties audits and classifies titles before listing.
            </p>
          </div>

          {/* Titles Guide Grid */}
          <div className="space-y-4">
            
            {/* 1. C of O */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#102033] uppercase">1. Certificate of Occupancy (C of O)</span>
                <span className="text-[10px] bg-emerald-100 text-[#167A5A] font-extrabold px-2 py-0.5 rounded-md">Highest Rating</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct statutory lease granted by the Governor for a 99-year term. Verified directly at Alausa Lands Registry or FCT AGIS.
              </p>
            </div>

            {/* 2. Governor's Consent */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#102033] uppercase">2. Governor's Consent</span>
                <span className="text-[10px] bg-emerald-100 text-[#167A5A] font-extrabold px-2 py-0.5 rounded-md">Fully Cleared</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Required for subsequent transactions on land with an existing C of O. Confirms the state governor officially recognizes the new owner.
              </p>
            </div>

            {/* 3. Gazette & Excision */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#102033] uppercase">3. Gazette & Excision</span>
                <span className="text-[10px] bg-emerald-100 text-[#167A5A] font-extrabold px-2 py-0.5 rounded-md">Verified</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official government publication recording land excised and released back to indigenous communities. Safe for perfection into Governor's Consent.
              </p>
            </div>

            {/* 4. Registered Survey Plan */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#102033] uppercase">4. Registered Survey & Beacon Coordinates</span>
                <span className="text-[10px] bg-emerald-100 text-[#167A5A] font-extrabold px-2 py-0.5 rounded-md">Required</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drawn by a licensed surveyor and lodged at the Surveyor General’s office. Ensures exact GPS coordinates don't overlap government acquisitions.
              </p>
            </div>

          </div>

          {/* Verification Steps */}
          <div className="p-5 bg-[#102033] text-white rounded-2xl space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Our 7-Step Verification Workflow</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>1. Surveyor General Charting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Alausa / AGIS Title File Search</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Physical Ground Demarcation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>4. Court Litigation Clearance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>5. CAC Developer Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>6. Instant CTC Deed Issue</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenTitleCheck();
            }}
            className="text-xs font-bold text-[#167A5A] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Search Title Reference Number</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#102033] hover:bg-[#167A5A] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
