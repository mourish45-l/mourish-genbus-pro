import React, { useState } from 'react';
import type { BusinessProfile } from '../types';
import {
  Building2,
  ShieldCheck,
  Phone,
  Globe,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Stethoscope,
  Flame,
  Landmark,
  UserCheck,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: BusinessProfile;
  onSaveProfile: (profile: BusinessProfile) => void;
  editorName: string;
}

export const BusinessOnboardingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  editorName,
}) => {
  const [name, setName] = useState(currentProfile.name || 'Mourish Developers & Life Gas System');
  const [gstin, setGstin] = useState(currentProfile.gstin || '33CQLPT6813M1Z7');
  const [phone, setPhone] = useState(currentProfile.phone || '9659233313 / 9487410078');
  const [email, setEmail] = useState(currentProfile.email || 'lifegas1987@gmail.com');
  const [website, setWebsite] = useState(currentProfile.website || 'https://mourishdevelopers.vercel.app/');
  const [address, setAddress] = useState(
    currentProfile.address ||
      'Medical Gas Pipeline (MGPS), Modular OT, Hospital Fire Safety & Digital Solutions, Tamil Nadu, India'
  );
  const [bankName, setBankName] = useState(currentProfile.bankName || 'HDFC Bank');
  const [bankAccountNo, setBankAccountNo] = useState(currentProfile.bankAccountNo || '50200084920193');
  const [bankIfsc, setBankIfsc] = useState(currentProfile.bankIfsc || 'HDFC0001824');
  const [bankBranch, setBankBranch] = useState(currentProfile.bankBranch || 'Commercial Branch');
  const [signatoryName, setSignatoryName] = useState(currentProfile.signatoryName || 'Mourish Nithin');
  const [signatoryTitle, setSignatoryTitle] = useState(currentProfile.signatoryTitle || 'Managing Director');

  const [step, setStep] = useState<1 | 2>(1);
  const [sector, setSector] = useState<'healthcare' | 'turnkey' | 'general'>('healthcare');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BusinessProfile = {
      bizId: currentProfile.bizId || 'mourish_developers_hq',
      name: name.trim(),
      gstin: gstin.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
      address: address.trim(),
      bankName: bankName.trim(),
      bankAccountNo: bankAccountNo.trim(),
      bankIfsc: bankIfsc.trim(),
      bankBranch: bankBranch.trim(),
      signatoryName: signatoryName.trim(),
      signatoryTitle: signatoryTitle.trim(),
      lastEditedBy: editorName,
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zoho-Grade Business Entity Setup</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Enterprise Profile & Bank Details
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pre-populated with verified legal details from Mourish-genbus & Life Gas System.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 ? (
            <div className="space-y-4 text-xs">
              
              {/* Sector Pre-Selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Core Engineering Domain
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setSector('healthcare')}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                      sector === 'healthcare'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <Stethoscope className="w-5 h-5 text-indigo-500" />
                    <div>
                      <div>Hospital MGPS & Modular OT</div>
                      <div className="text-[10px] text-slate-400 font-normal">Life Gas System Turnkey</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSector('general')}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                      sector === 'general'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-indigo-500" />
                    <div>
                      <div>General Engineering & Tech</div>
                      <div className="text-[10px] text-slate-400 font-normal">Mourish Developers Tech</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal Name */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Business Entity / Legal Trading Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* GSTIN & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>GSTIN Registration *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full mt-1 p-2.5 font-mono font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Primary Contact Phones *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Email & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Official Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Registered Office Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <span>Next: Bank Remittance Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                <Landmark className="w-4 h-4 shrink-0" />
                <span>Bank details are printed on all official Tax Invoices for client NEFT / RTGS transfers.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Bank Name *</label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. HDFC Bank"
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Account Number *</label>
                  <input
                    type="text"
                    required
                    value={bankAccountNo}
                    onChange={(e) => setBankAccountNo(e.target.value)}
                    placeholder="e.g. 50200084920193"
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">IFSC Code *</label>
                  <input
                    type="text"
                    required
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                    placeholder="e.g. HDFC0001824"
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Branch Name</label>
                  <input
                    type="text"
                    value={bankBranch}
                    onChange={(e) => setBankBranch(e.target.value)}
                    placeholder="e.g. Commercial Branch, Tamil Nadu"
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Authorized Signatory Name</label>
                  <input
                    type="text"
                    value={signatoryName}
                    onChange={(e) => setSignatoryName(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Signatory Title</label>
                  <input
                    type="text"
                    value={signatoryTitle}
                    onChange={(e) => setSignatoryTitle(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Launch Production Suite</span>
                </button>
              </div>
            </div>
          )}
        </form>

      </div>
    </div>
  );
};
