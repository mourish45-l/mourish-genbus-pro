import React, { useState } from 'react';
import type { BusinessProfile } from '../types';
import { Building, ShieldCheck, Phone, Globe, MapPin, CreditCard, Save, Landmark, UserCheck, Mail } from 'lucide-react';

interface Props {
  profile: BusinessProfile;
  onSaveProfile: (updated: Partial<BusinessProfile>) => void;
  editorName: string;
}

export const BusinessProfileEditor: React.FC<Props> = ({
  profile,
  onSaveProfile,
  editorName,
}) => {
  const [name, setName] = useState(profile.name || 'Mourish Developers & Life Gas System');
  const [gstin, setGstin] = useState(profile.gstin || '33CQLPT6813M1Z7');
  const [phone, setPhone] = useState(profile.phone || '9659233313 / 9487410078');
  const [email, setEmail] = useState(profile.email || 'lifegas1987@gmail.com');
  const [website, setWebsite] = useState(profile.website || 'https://mourishdevelopers.vercel.app/');
  const [address, setAddress] = useState(profile.address || 'Medical Gas Pipeline (MGPS), Modular OT, Hospital Fire Safety & Digital Solutions, Tamil Nadu, India');
  const [bankName, setBankName] = useState(profile.bankName || 'HDFC Bank');
  const [bankAccountNo, setBankAccountNo] = useState(profile.bankAccountNo || '50200084920193');
  const [bankIfsc, setBankIfsc] = useState(profile.bankIfsc || 'HDFC0001824');
  const [bankBranch, setBankBranch] = useState(profile.bankBranch || 'Commercial Branch, Tamil Nadu');
  const [signatoryName, setSignatoryName] = useState(profile.signatoryName || 'Mourish Nithin');
  const [signatoryTitle, setSignatoryTitle] = useState(profile.signatoryTitle || 'Managing Director');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
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
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          Company Profile & Invoicing Bank Settings
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          These details are stamped on all finalized quotations, GST Tax Invoices, and Customer Portal lookups in realtime.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="p-6 lg:p-8 rounded-[32px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xl"
      >
        {/* Section 1: Company Profile */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-500" /> Organization & Legal Entity
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Business Legal Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>GSTIN / Tax Identification *</span>
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                <span>Primary Phone Numbers *</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>Official Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                <span>Website / Online Domain</span>
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>Operating Address</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Official Bank NEFT / RTGS Details for GST Invoicing */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-500" /> Bank Remittance Details (For Invoice Netbanking & NEFT)
            </h4>
            <span className="text-[11px] text-slate-400">Zero Gateway Fees</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. HDFC Bank"
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Account Number</label>
              <input
                type="text"
                value={bankAccountNo}
                onChange={(e) => setBankAccountNo(e.target.value)}
                placeholder="e.g. 50200084920193"
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">IFSC Code</label>
              <input
                type="text"
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                placeholder="e.g. HDFC0001824"
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Branch Location</label>
              <input
                type="text"
                value={bankBranch}
                onChange={(e) => setBankBranch(e.target.value)}
                placeholder="e.g. Commercial Branch"
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Authorized Signatory */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-purple-500" /> Authorized Signatory Footnote
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Signatory Full Name</label>
              <input
                type="text"
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Official Title / Designation</label>
              <input
                type="text"
                value={signatoryTitle}
                onChange={(e) => setSignatoryTitle(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-400">
            Last modified by <strong>{profile.lastEditedBy || editorName}</strong>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
          >
            <Save className="w-4 h-4" />
            <span>{savedFeedback ? 'Saved to Realtime DB!' : 'Save Company Profile & Bank Settings'}</span>
          </button>
        </div>
      </form>

    </div>
  );
};
