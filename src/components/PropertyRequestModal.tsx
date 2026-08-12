import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Send, CheckCircle2, MapPin, DollarSign, Calendar, MessageCircle } from 'lucide-react';
import { PropertyRequestLead } from '../types';

interface PropertyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLead: (lead: PropertyRequestLead) => void;
}

export const PropertyRequestModal: React.FC<PropertyRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmitLead,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneWhatsapp: '',
    countryOfResidence: 'Nigeria',
    preferredLocation: 'Lekki Phase 1 / Ikoyi / Victoria Island',
    propertyType: 'Verified Land Plot',
    budgetNgn: 50000000,
    purpose: 'Personal Home Construction',
    timeline: 'Immediate (Next 30 Days)',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneWhatsapp) return;

    const leadRecord: PropertyRequestLead = {
      ...formData,
      createdAt: new Date().toISOString()
    };

    onSubmitLead(leadRecord);
    setSubmitted(true);
  };

  const whatsappMessage = `Hello legitproperties.com.ng! I submitted a Custom Property Request:\n\nName: ${formData.fullName}\nLocation: ${formData.preferredLocation}\nType: ${formData.propertyType}\nBudget: ₦${(formData.budgetNgn / 1000000).toFixed(1)}M\nPurpose: ${formData.purpose}\nPhone/WA: ${formData.phoneWhatsapp}\nCountry: ${formData.countryOfResidence}`;
  const whatsappUrl = `https://wa.me/2348030001122?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#167A5A]/10 rounded-xl text-[#167A5A]">
              <Sparkles className="w-5 h-5 text-[#167A5A]" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#102033] text-base sm:text-lg">Custom Property Match Finder</h3>
              <p className="text-xs text-slate-500 font-medium">Tell us your budget & location — we match you with verified titles</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-[#102033] transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Dr. Babatunde Ogunlesi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#102033] focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phoneWhatsapp}
                  onChange={(e) => setFormData({ ...formData, phoneWhatsapp: e.target.value })}
                  placeholder="+23480... or +447..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#102033] focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Country of Residence</label>
                <select
                  value={formData.countryOfResidence}
                  onChange={(e) => setFormData({ ...formData, countryOfResidence: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#102033] focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="United Kingdom">United Kingdom (Diaspora)</option>
                  <option value="United States">United States (Diaspora)</option>
                  <option value="Canada">Canada (Diaspora)</option>
                  <option value="Europe / Other">Europe / Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Target Location</label>
                <input
                  type="text"
                  value={formData.preferredLocation}
                  onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                  placeholder="e.g. Lekki, Ikoyi, Katampe, Epe"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#102033] focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Property Type</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#102033] focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20"
                >
                  <option value="Verified Land Plot">Verified Dry Land Plot</option>
                  <option value="Luxury Apartment">Luxury Apartment / Penthouse</option>
                  <option value="Executive Duplex">Executive Duplex / Villa</option>
                  <option value="Commercial Land">Commercial Plot / Warehouse</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Maximum Budget (NGN)</label>
                <select
                  value={formData.budgetNgn}
                  onChange={(e) => setFormData({ ...formData, budgetNgn: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#102033] focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20"
                >
                  <option value={20000000}>Under ₦20 Million</option>
                  <option value={50000000}>₦20M - ₦50 Million</option>
                  <option value={150000000}>₦50M - ₦150 Million</option>
                  <option value={400000000}>₦150M - ₦400 Million</option>
                  <option value={1000000000}>₦400M+ (Luxury Enclave)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Specific Requirements / Preferred Title</label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Mention specific requirements e.g. Governor's Consent, C of O, installment payment preferred..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#102033] focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#167A5A] hover:bg-[#126248] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Request</span>
              </button>
            </div>

          </form>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#167A5A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-[#102033]">Property Request Logged!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Our Senior Land Verifier is analyzing matched verified titles for your budget. Connect immediately on WhatsApp for direct CTC files.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#102033] hover:bg-[#167A5A] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Open Instant WhatsApp Chat</span>
              </a>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
