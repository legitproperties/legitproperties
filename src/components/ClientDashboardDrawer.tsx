import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Download, CheckCircle2, Clock, CreditCard, ChevronRight, User, Award } from 'lucide-react';
import { DashboardUser, DocumentItem, PaymentRecord } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ClientDashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'NGN' | 'USD' | 'GBP';
}

export const ClientDashboardDrawer: React.FC<ClientDashboardDrawerProps> = ({
  isOpen,
  onClose,
  currency,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'vault' | 'payments' | 'stages'>('vault');

  const mockUser: DashboardUser = {
    id: 'usr-9821',
    name: 'Chief Adeleke Davies',
    email: 'a.davies@legitclient.com',
    phone: '+234 803 111 2233',
    residenceCountry: 'United Kingdom',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    currentStep: 'Documentation',
    activePropertyName: '600sqm Dry Land in Prime Lekki Phase 1 (Ref: prop-land-1)',
    totalPaidNgn: 126000000,
    totalContractNgn: 420000000,
    nextPaymentDueDate: '15th September 2026',
    nextPaymentAmountNgn: 24500000
  };

  const mockDocs: DocumentItem[] = [
    {
      id: 'doc-01',
      name: 'Governor Consent Certified True Copy (CTC)',
      category: 'Title Document',
      date: '2026-08-01',
      status: 'Verified',
      fileSize: '4.2 MB'
    },
    {
      id: 'doc-02',
      name: 'Registered Survey Plan & Beacon Coordinates',
      category: 'Title Document',
      date: '2026-08-02',
      status: 'Verified',
      fileSize: '2.8 MB'
    },
    {
      id: 'doc-03',
      name: 'Contract of Sale & Allocation Letter',
      category: 'Purchase Agreement',
      date: '2026-08-03',
      status: 'Verified',
      fileSize: '1.9 MB'
    },
    {
      id: 'doc-04',
      name: 'Initial 30% Downpayment Official Receipt',
      category: 'Payment Receipt',
      date: '2026-08-03',
      status: 'Verified',
      fileSize: '840 KB'
    }
  ];

  const mockPayments: PaymentRecord[] = [
    {
      id: 'pay-01',
      reference: 'LP-TXN-2026-9912',
      date: '3rd August 2026',
      amountNgn: 126000000,
      purpose: '30% Downpayment Deposit',
      status: 'Completed'
    },
    {
      id: 'pay-02',
      reference: 'LP-TXN-2026-9913',
      date: '15th September 2026',
      amountNgn: 24500000,
      purpose: 'Installment Tranche 1 of 12',
      status: 'Upcoming'
    }
  ];

  const percentComplete = Math.round((mockUser.totalPaidNgn / mockUser.totalContractNgn) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="relative bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-5 bg-[#102033] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#167A5A] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Encrypted Client Vault
              </div>
              <h3 className="font-extrabold text-base text-white">
                {mockUser.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Summary Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">Active Property</div>
            <div className="font-bold text-[#102033] line-clamp-1">{mockUser.activePropertyName}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-100 text-[#167A5A] font-bold rounded-md text-[11px] border border-emerald-200">
              {percentComplete}% Contract Paid
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-white px-4 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('vault')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'vault'
                ? 'border-[#167A5A] text-[#167A5A]'
                : 'border-transparent text-slate-500 hover:text-[#102033]'
            }`}
          >
            Document Vault (4 Files)
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'payments'
                ? 'border-[#167A5A] text-[#167A5A]'
                : 'border-transparent text-slate-500 hover:text-[#102033]'
            }`}
          >
            Payment Schedule
          </button>
          <button
            onClick={() => setActiveTab('stages')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'stages'
                ? 'border-[#167A5A] text-[#167A5A]'
                : 'border-transparent text-slate-500 hover:text-[#102033]'
            }`}
          >
            Ownership Pipeline
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          
          {activeTab === 'vault' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-[#102033] uppercase tracking-wider">
                  Verified Legal Documents
                </h4>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  100% C of O Cleared
                </span>
              </div>

              <div className="space-y-2">
                {mockDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/80 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#167A5A]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#102033]">{doc.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {doc.category} • {doc.date} • {doc.fileSize}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Downloading verified CTC document: ${doc.name}`)}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-bold text-[#102033] rounded-xl hover:bg-[#167A5A] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#102033] text-white space-y-2">
                <div className="text-xs text-slate-300 font-medium">Contract Overview</div>
                <div className="text-2xl font-extrabold text-white">
                  {formatCurrency(mockUser.totalPaidNgn, currency)} <span className="text-xs text-slate-400 font-normal">of {formatCurrency(mockUser.totalContractNgn, currency)}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
                  <div className="bg-[#167A5A] h-full" style={{ width: `${percentComplete}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-[#102033] uppercase tracking-wider">Transaction History</h4>
                {mockPayments.map((pay) => (
                  <div key={pay.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-[#102033]">{pay.purpose}</div>
                      <div className="text-[10px] text-slate-500">Ref: {pay.reference} • {pay.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-extrabold text-[#102033]">{formatCurrency(pay.amountNgn, currency)}</div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pay.status === 'Completed' ? 'bg-emerald-100 text-[#167A5A]' : 'bg-amber-100 text-amber-800'}`}>
                        {pay.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stages' && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-[#102033] uppercase tracking-wider">
                Title Transfer & Physical Allocation Timeline
              </h4>

              <div className="space-y-3 relative pl-4 border-l-2 border-slate-200">
                <div className="relative pl-4 space-y-1">
                  <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-[#167A5A]" />
                  <div className="text-xs font-bold text-[#102033]">1. Property Selection & Title Search</div>
                  <div className="text-[11px] text-slate-500">Ministry of Lands Alausa & FCT AGIS search cleared.</div>
                </div>

                <div className="relative pl-4 space-y-1">
                  <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-[#167A5A]" />
                  <div className="text-xs font-bold text-[#102033]">2. Downpayment Deposit & Allocation</div>
                  <div className="text-[11px] text-slate-500">30% deposit received. Physical beacon assignment complete.</div>
                </div>

                <div className="relative pl-4 space-y-1">
                  <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-amber-500" />
                  <div className="text-xs font-bold text-amber-800">3. Governor's Consent Endorsement (In Progress)</div>
                  <div className="text-[11px] text-slate-500">Legal deed filed with Lagos Land Bureau for final endorsement.</div>
                </div>

                <div className="relative pl-4 space-y-1 opacity-50">
                  <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-slate-300" />
                  <div className="text-xs font-bold text-slate-700">4. Handover of Final Governor's Consent CTC</div>
                  <div className="text-[11px] text-slate-500">Issued upon completion of installment schedule.</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Vault Security Code: <strong className="font-mono text-[#102033]">LEGIT-2026-VAULT</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#102033] hover:bg-[#167A5A] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
};
