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
  Landmark,
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
  const [name, setName] = useState('');
  const [gstin, setGstin] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [signatoryName, setSignatoryName] = useState('');
  const [signatoryTitle, setSignatoryTitle] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

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
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Business Setup</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Business Profile & Payment Details
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your own business details. No sample information is pre-filled.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Business Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your business name" className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /><span>Tax ID</span></label>
                  <input type="text" value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="Enter tax ID if applicable" className="w-full mt-1 p-2.5 font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-500" /><span>Phone *</span></label>
                  <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter business phone" className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-indigo-500" /><span>Website</span></label>
                  <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-500" /><span>Business Address</span></label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white" />
              </div>

              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => setStep(2)} className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2">
                  <span>Next: Payment Details</span><ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                <Landmark className="w-4 h-4 shrink-0" />
                <span>Payment details are optional and can be added when you are ready.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="font-semibold text-slate-700 dark:text-slate-300">Bank Name</label><input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Enter bank name" className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white" /></div>
                <div><label className="font-semibold text-slate-700 dark:text-slate-300">Account Number</label><input type="text" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} placeholder="Enter account number" className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white" /></div>
                <div><label className="font-semibold text-slate-700 dark:text-slate-300">Bank Routing / IFSC Code</label><input type="text" value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value.toUpperCase())} placeholder="Enter bank code" className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white" /></div>
                <div><label className="font-semibold text-slate-700 dark:text-slate-300">Branch</label><input type="text" value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} placeholder="Enter branch" className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white" /></div>
                <div><label className="font-semibold text-slate-700 dark:text-slate-300">Authorized Signatory</label><input type="text" value={signatoryName} onChange={(e) => setSignatoryName(e.target.value)} placeholder="Enter signatory name" className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white" /></div>
                <div><label className="font-semibold text-slate-700 dark:text-slate-300">Signatory Title</label><input type="text" value={signatoryTitle} onChange={(e) => setSignatoryTitle(e.target.value)} placeholder="Enter title" className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white" /></div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">← Back</button>
                <button type="submit" className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20">
                  <CheckCircle2 className="w-4 h-4" /><span>Save Profile</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
