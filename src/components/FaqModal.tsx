import React, { useState } from 'react';
import { X, HelpCircle, ChevronDown, ChevronUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTitleCheck: () => void;
}

interface FaqItem {
  q: string;
  a: string;
  category: 'Titles' | 'Payments' | 'Diaspora' | 'Verification';
}

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose, onOpenTitleCheck }) => {
  if (!isOpen) return null;

  const faqs: FaqItem[] = [
    {
      q: 'How does legitproperties guarantee 100% title verification?',
      a: 'Before any property is published, our team of property lawyers conducts a physical search at the Alausa Lands Registry (Lagos), AGIS (Abuja), or the respective State Ministry of Lands. We verify file numbers, chart survey coordinates against government acquisitions, and confirm zero pending litigation.',
      category: 'Verification'
    },
    {
      q: 'What is the difference between C of O and Governor\'s Consent?',
      a: 'A Certificate of Occupancy (C of O) is the first statutory lease issued directly by the State Governor. A Governor\'s Consent is the official government endorsement required whenever land with an existing C of O is sold or transferred to a new buyer.',
      category: 'Titles'
    },
    {
      q: 'I am in the Diaspora (UK, US, Canada). How do I safely inspect & buy?',
      a: 'We provide full live video inspections, send beacon survey coordinates to your independent surveyor for cross-charting, and process contract allocations digitally. Payments are made directly into verified developer escrow bank accounts with official receipts.',
      category: 'Diaspora'
    },
    {
      q: 'Are installment payment plans available on land plots?',
      a: 'Yes! Most verified land plots offer flexible downpayment deposits (typically 20% - 30%) with spread tenors over 3, 6, or 12 months. Physical allocation is issued immediately upon downpayment.',
      category: 'Payments'
    },
    {
      q: 'What happens if a property fails a title search?',
      a: 'We immediately reject and unlist any property that fails coordinate charting or shows encumbrance/omonile claims. Buyers who run title checks on unverified external lands receive a full diagnostic report.',
      category: 'Verification'
    },
    {
      q: 'How do I obtain the Certified True Copy (CTC) after purchase?',
      a: 'Upon completion of your purchase contract, legitproperties handles the filing and retrieval of your official CTC legal documents directly from the Lands Bureau and delivers them to your location or client vault.',
      category: 'Titles'
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const filteredFaqs = selectedCat === 'All'
    ? faqs
    : faqs.filter(f => f.category === selectedCat);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-[#102033] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#167A5A] text-white flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Buyer Protection & Clarity
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Frequently Asked Questions (FAQ)
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

        {/* Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-5 text-slate-700">
          
          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
            {['All', 'Verification', 'Titles', 'Diaspora', 'Payments'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-[#102033] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 transition-all"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#102033] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/60"
                  >
                    <span>{faq.q}</span>
                    <span className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Banner Prompt */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#167A5A]">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Have a specific survey file number to verify?</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenTitleCheck();
              }}
              className="px-4 py-2 bg-[#102033] hover:bg-[#167A5A] text-white font-bold rounded-xl transition-all cursor-pointer flex-shrink-0"
            >
              Run Audit Now
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#102033] hover:bg-[#167A5A] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Close FAQ
          </button>
        </div>

      </div>
    </div>
  );
};
