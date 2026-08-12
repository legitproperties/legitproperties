import React from 'react';
import { ShieldCheck, Lock, UserCheck, CalendarDays, ArrowRight } from 'lucide-react';

interface TrustBarProps {
  onOpenTitleCheck: () => void;
}

export const TrustBar: React.FC<TrustBarProps> = ({ onOpenTitleCheck }) => {
  return (
    <section className="py-12 bg-slate-900 text-white border-t border-b border-slate-800 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/80">
            Guaranteed Legit Real Estate
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Why buyers trust legitproperties.com.ng
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            We solve the biggest fear in Nigerian real estate: land disputes and invalid titles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">1. Ministry Title Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Every property title (C of O, Consent, Gazette) is verified with Alausa Lands Bureau & FCT AGIS before public listing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">2. Zero Omonile Risk</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              100% protection against illegal land-grabbers, double allocations, or community disputes. Instant physical allocation guaranteed.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">3. Direct Owner Deals</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Deal directly with verified title holders and authorized representatives without inflated middleman markups.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">4. Flexible Payment Plans</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Spread payments over 3 to 12 months on select land developments and off-plan luxury apartments.
            </p>
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onOpenTitleCheck}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <span>Verify Any Title Reference Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
