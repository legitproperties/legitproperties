import React from 'react';
import { ShieldCheck, Lock, UserCheck, CalendarDays, ArrowRight, FileCheck2, Scale } from 'lucide-react';

interface TrustBarProps {
  onOpenTitleCheck: () => void;
}

export const TrustBar: React.FC<TrustBarProps> = ({ onOpenTitleCheck }) => {
  return (
    <section className="py-16 bg-slate-50 text-slate-900 border-t border-b border-slate-200 my-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200/80 border border-slate-300 text-slate-800 text-xs font-bold tracking-widest uppercase shadow-xs">
            <Scale className="w-3.5 h-3.5 text-slate-700" />
            <span>Guaranteed Land Title & Legal Security</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
            Why High-Net-Worth & Diaspora Buyers Trust <span className="text-slate-700">legitproperties</span>
          </h2>
          
          <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed">
            Eliminating the risk of double allocations, invalid family surveys, and land grabbers with institutional legal due diligence.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-3 group shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              1. Ministry Title Verification
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Every property title (C of O, Governor's Consent, Gazette) is verified with Alausa Lands Bureau & FCT AGIS before public listing.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-3 group shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Lock className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              2. Zero Omonile Risk
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              100% protection against illegal land-grabbers or community disputes. Instant physical beaconing and allocation guaranteed.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-3 group shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <UserCheck className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              3. Direct Principal Pricing
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Deal directly with verified title owners and authorized developers without predatory agent inflation or hidden charges.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-3 group shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <CalendarDays className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              4. Structured Payment Plans
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Spread investments seamlessly over 3 to 12 months on select land developments and luxury off-plan apartments.
            </p>
          </div>

        </div>

        {/* Interactive Title Audit Banner Callout */}
        <div className="mt-12 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-wider">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Independent Land Title Audit</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Already have an eye on a property in Lagos or Abuja?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Enter any survey reference number or title deed to verify ownership and avoid disputes.
            </p>
          </div>

          <button
            onClick={onOpenTitleCheck}
            className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Launch Free Title Audit</span>
            <ArrowRight className="w-4 h-4 text-slate-900" />
          </button>
        </div>

      </div>
    </section>
  );
};
