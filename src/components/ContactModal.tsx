import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Clock, Globe } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Site Inspection Schedule',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitted(true);
  };

  const whatsappMessage = `Hello legitproperties! My name is ${form.name}. I would like to schedule a site inspection / inquiry regarding ${form.subject}. Phone: ${form.phone}`;
  const whatsappUrl = `https://wa.me/2348030001122?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-[#102033] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#167A5A] text-white flex items-center justify-center font-bold">
              <Phone className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Direct Advisory & Advisory Team
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Contact & Physical Offices
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
          
          {/* Quick contact channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="tel:+2348030001122"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-1 block"
            >
              <div className="flex items-center gap-2 text-[#167A5A] font-bold text-xs">
                <Phone className="w-4 h-4" />
                <span>Call Hotline</span>
              </div>
              <div className="font-extrabold text-sm text-[#102033]">+234 803 000 1122</div>
              <div className="text-[10px] text-slate-500 font-medium">Toll-free across Nigeria</div>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-[#102033] text-white hover:bg-[#167A5A] transition-all space-y-1 block"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp</span>
              </div>
              <div className="font-extrabold text-sm text-white">24/7 Advisory Chat</div>
              <div className="text-[10px] text-slate-300 font-medium">Immediate document files</div>
            </a>

            <a
              href="mailto:info@legitproperties.com.ng"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-1 block"
            >
              <div className="flex items-center gap-2 text-[#167A5A] font-bold text-xs">
                <Mail className="w-4 h-4" />
                <span>Email Registry</span>
              </div>
              <div className="font-extrabold text-sm text-[#102033] truncate">info@legitproperties...</div>
              <div className="text-[10px] text-slate-500 font-medium">Official CTC legal replies</div>
            </a>
          </div>

          {/* Form or Success message */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-extrabold text-[#102033] uppercase tracking-wider">
                Send Direct Message / Schedule Inspection
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Engr. Chidi Okafor"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#102033] focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+234 80... or +44..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#102033] focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="c.okafor@example.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#102033] focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Inquiry Purpose</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#102033] focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20"
                  >
                    <option value="Site Inspection Schedule">Physical Site Inspection</option>
                    <option value="Title Audit Request">Title Verification & Survey Charting</option>
                    <option value="Diaspora Allocation">Diaspora Remote Allocation</option>
                    <option value="Developer Partnership">Developer Bulk Listing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Inquiry Notes / Specific Property ID</label>
                <textarea
                  rows={2}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Mention preferred inspection date or land location..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-[#102033] focus:outline-none focus:ring-2 focus:ring-[#167A5A]/20"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#167A5A] hover:bg-[#126248] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          ) : (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#167A5A] mx-auto" />
              <h4 className="font-extrabold text-[#102033] text-base">Inquiry Submitted Successfully!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                A Senior Land Verifier has received your message and will reach out on WhatsApp within 15 minutes.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#102033] text-white font-bold text-xs rounded-xl hover:bg-[#167A5A] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Open Instant WhatsApp Chat Now</span>
              </a>
            </div>
          )}

          {/* Physical Location Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-[#102033]">
                <MapPin className="w-4 h-4 text-[#167A5A]" />
                <span>Lagos State Headquarters</span>
              </div>
              <p className="text-xs text-slate-500">
                Admiralty Way, Lekki Phase 1, Lagos State, Nigeria
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-[#102033]">
                <MapPin className="w-4 h-4 text-[#167A5A]" />
                <span>Abuja FCT Regional Office</span>
              </div>
              <p className="text-xs text-slate-500">
                Diplomatic Drive, Maitama District, FCT Abuja
              </p>
            </div>
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
