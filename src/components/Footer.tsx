import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, MessageCircle, ArrowUp, Lock, CheckCircle2, Info, BookOpen, HelpCircle } from 'lucide-react';

interface FooterProps {
  onOpenTitleCheck: () => void;
  onOpenAbout: () => void;
  onOpenLegalGuide: () => void;
  onOpenContact: () => void;
  onOpenFaq: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTitleCheck,
  onOpenAbout,
  onOpenLegalGuide,
  onOpenContact,
  onOpenFaq,
  onScrollToTop,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold shadow-xs border border-slate-700">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                legit<span className="text-slate-300">properties</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Nigeria’s premier title-verified real estate platform. We eliminate land-grabbing and title fraud by verifying every land plot, mansion, and luxury apartment before listing.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ministry Land Audit & AGIS Certified</span>
            </div>
          </div>

          {/* Physical Offices & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Physical Offices</h4>
            <div className="space-y-2.5 text-slate-400 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block font-semibold">Lagos HQ:</strong>
                  Admiralty Way, Lekki Phase 1, Lagos, Nigeria
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block font-semibold">Abuja Office:</strong>
                  Diplomatic Drive, Maitama District, FCT Abuja
                </span>
              </div>
              <button
                onClick={onOpenContact}
                className="text-slate-300 font-bold hover:underline hover:text-white flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>View Full Office & Advisory Details →</span>
              </button>
            </div>
          </div>

          {/* Verification Services & Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Pages & Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={onOpenTitleCheck} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Search C of O & Consent Records</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenAbout} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>About Our Title Verification</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenLegalGuide} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Title Audit & Legal Policy</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenFaq} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Buyer Frequently Asked Questions</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Direct Advisory Hotline</h4>
            <div className="space-y-2 text-slate-400">
              <a href="tel:+2348030001122" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>+234 803 000 1122</span>
              </a>
              <a href="mailto:info@legitproperties.com.ng" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>info@legitproperties.com.ng</span>
              </a>
              <a
                href="https://wa.me/2348030001122?text=Hello%20legitproperties"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all shadow-xs mt-1 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Advisory</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-300">legitproperties</strong>. All Rights Reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenLegalGuide}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Title Audit Policy
            </button>
            <button
              onClick={onOpenContact}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact Support
            </button>
            <button
              onClick={onScrollToTop}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 transition-colors flex items-center gap-1 cursor-pointer border border-slate-700"
              title="Back to Top"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3 text-slate-300" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
