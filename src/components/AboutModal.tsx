import React from 'react';
import { X, ShieldCheck, Award, MapPin, CheckCircle2, Users, FileCheck, Lock, Building2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTitleCheck: () => void;
  onOpenLeadModal: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenTitleCheck,
  onOpenLeadModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-[#102033] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#167A5A] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Nigeria's #1 Title Audit Real Estate
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                About legitproperties
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

        {/* Scrollable Content */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-slate-700">
          
          {/* Mission Banner */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 className="text-sm font-extrabold text-[#102033] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#167A5A]" />
              <span>Our Core Purpose</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>legitproperties</strong> was founded to permanently eradicate land grabbing, double-allocation fraud, and unverified titles in the Nigerian real estate sector. Every land plot, residential duplex, or luxury apartment listed on our platform undergoes a mandatory 7-stage legal search at Alausa Land Registry (Lagos) and AGIS (Abuja).
            </p>
          </div>

          {/* Key Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#167A5A] flex items-center justify-center font-bold">
                <FileCheck className="w-4 h-4" />
              </div>
              <h5 className="font-extrabold text-xs text-[#102033]">100% C of O & Consent</h5>
              <p className="text-[11px] text-slate-500 leading-normal">
                We accept zero properties with pending disputes or government acquisition encumbrances.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#167A5A] flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <h5 className="font-extrabold text-xs text-[#102033]">Diaspora Protection</h5>
              <p className="text-[11px] text-slate-500 leading-normal">
                End-to-end video verification, beacon coordinate matching, and direct bank escrow accounts.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#167A5A] flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <h5 className="font-extrabold text-xs text-[#102033]">Zero Omonile Risk</h5>
              <p className="text-[11px] text-slate-500 leading-normal">
                All land allocations are physically demarcated with registered survey plans before payment.
              </p>
            </div>
          </div>

          {/* Office Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#102033] uppercase tracking-wider">
              Physical Corporate Headquarters
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#167A5A] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#102033]">Lagos State HQ</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Admiralty Way, Lekki Phase 1, Lagos State, Nigeria
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700 mt-1">Mon - Sat: 8:00 AM - 6:00 PM</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#167A5A] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#102033]">Abuja FCT Regional Office</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Diplomatic Drive, Maitama District, FCT Abuja
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700 mt-1">Mon - Sat: 8:00 AM - 6:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="p-4 rounded-2xl bg-[#102033] text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-sm">Need Title Audit for Existing Land?</div>
              <p className="text-slate-300 text-xs">Run a search using survey coordinate plan numbers.</p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenTitleCheck();
              }}
              className="px-4 py-2.5 bg-[#167A5A] hover:bg-emerald-600 text-white font-bold rounded-xl transition-all cursor-pointer flex-shrink-0"
            >
              Run Free Title Audit
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#102033] hover:bg-[#167A5A] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
