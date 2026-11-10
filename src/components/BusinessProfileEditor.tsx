import React, { useEffect, useState } from 'react';
import type { BusinessProfile } from '../types';
import { Building, ShieldCheck, Phone, Globe, MapPin, Save, Landmark, UserCheck, Mail, Upload, X } from 'lucide-react';
import { DocumentPdfViewer } from './DocumentPdfViewer';

interface Props {
  profile: BusinessProfile;
  onSaveProfile: (updated: Partial<BusinessProfile>) => void;
  editorName: string;
}

const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const MAX_LOGO_BYTES = 300 * 1024;

export const BusinessProfileEditor: React.FC<Props> = ({ profile, onSaveProfile, editorName }) => {
  const [name, setName] = useState(profile.name || '');
  const [gstin, setGstin] = useState(profile.gstin || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [email, setEmail] = useState(profile.email || '');
  const [website, setWebsite] = useState(profile.website || '');
  const [address, setAddress] = useState(profile.address || '');
  const [bankName, setBankName] = useState(profile.bankName || '');
  const [bankAccountNo, setBankAccountNo] = useState(profile.bankAccountNo || '');
  const [bankIfsc, setBankIfsc] = useState(profile.bankIfsc || '');
  const [bankBranch, setBankBranch] = useState(profile.bankBranch || '');
  const [signatoryName, setSignatoryName] = useState(profile.signatoryName || '');
  const [signatoryTitle, setSignatoryTitle] = useState(profile.signatoryTitle || '');
  const [logoUrl, setLogoUrl] = useState(profile.logoUrl || '');
  const [gstinError, setGstinError] = useState('');
  const [logoError, setLogoError] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    setName(profile.name || '');
    setGstin(profile.gstin || '');
    setPhone(profile.phone || '');
    setEmail(profile.email || '');
    setWebsite(profile.website || '');
    setAddress(profile.address || '');
    setBankName(profile.bankName || '');
    setBankAccountNo(profile.bankAccountNo || '');
    setBankIfsc(profile.bankIfsc || '');
    setBankBranch(profile.bankBranch || '');
    setSignatoryName(profile.signatoryName || '');
    setSignatoryTitle(profile.signatoryTitle || '');
    setLogoUrl(profile.logoUrl || '');
  }, [profile]);

  const handleGstinChange = (value: string) => {
    const normalized = value.toUpperCase().replace(/\s/g, '');
    setGstin(normalized);
    setGstinError(normalized && !GSTIN_PATTERN.test(normalized)
      ? 'Enter a valid 15-character Indian GSTIN format.'
      : '');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setLogoError('Choose a PNG, JPEG, or WebP image.');
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('Logo must be 300 KB or smaller.');
      return;
    }
    setLogoError('');
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => setLogoError('Could not read the selected image.');
    reader.readAsDataURL(file);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (gstin && !GSTIN_PATTERN.test(gstin)) {
      setGstinError('Enter a valid 15-character Indian GSTIN format.');
      return;
    }
    onSaveProfile({
      name: name.trim(), gstin: gstin.trim().toUpperCase(), phone: phone.trim(),
      email: email.trim(), website: website.trim(), address: address.trim(),
      bankName: bankName.trim(), bankAccountNo: bankAccountNo.trim(),
      bankIfsc: bankIfsc.trim().toUpperCase(), bankBranch: bankBranch.trim(),
      signatoryName: signatoryName.trim(), signatoryTitle: signatoryTitle.trim(),
      logoUrl, lastEditedBy: editorName,
    });
    setSavedFeedback(true);
    window.setTimeout(() => setSavedFeedback(false), 3000);
  };

  const fieldClass = 'w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">Business Profile & Invoicing Settings</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Add your India-based business details, GSTIN, and logo for documents. No sample values are required.</p>
      </div>

      <form onSubmit={handleSave} className="p-6 lg:p-8 rounded-[32px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xl">
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2"><Building className="w-4 h-4 text-indigo-500" /> Business Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Business Name *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} required /></div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> GSTIN (India)</label>
              <input type="text" value={gstin} onChange={(e) => handleGstinChange(e.target.value)} maxLength={15} autoCapitalize="characters" placeholder="15-character GSTIN" aria-invalid={Boolean(gstinError)} className={`${fieldClass} font-mono uppercase ${gstinError ? 'border-rose-500' : ''}`} />
              {gstinError && <p className="mt-1 text-[11px] text-rose-600" role="alert">{gstinError}</p>}
              <p className="mt-1 text-[10px] text-slate-400">Format check only; confirm registration details with the GST portal.</p>
            </div>
            <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-500" /> Phone *</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} required /></div>
            <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-500" /> Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} /></div>
            <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-indigo-500" /> Website</label><input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" className={fieldClass} /></div>
            <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-500" /> Address</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={fieldClass} /></div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Business Logo</h4>
          <div className="flex flex-wrap items-center gap-4">
            {logoUrl ? <img src={logoUrl} alt="Business logo preview" className="w-20 h-20 rounded-xl border border-slate-200 bg-white object-contain p-1" /> : <div className="w-20 h-20 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-400">No logo</div>}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"><Upload className="w-4 h-4" /> Upload logo<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleLogoUpload} /></label>
              {logoUrl && <button type="button" onClick={() => setLogoUrl('')} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs"><X className="w-3.5 h-3.5" /> Remove</button>}
            </div>
          </div>
          <p className="text-[10px] text-slate-400">PNG, JPEG, or WebP, up to 300 KB. Saved with your business profile.</p>
          {logoError && <p className="text-xs text-rose-600" role="alert">{logoError}</p>}
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2"><Landmark className="w-4 h-4 text-emerald-500" /> Payment Details <span className="font-normal normal-case text-slate-400">(optional)</span></h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div><label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Bank Name</label><input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} className={fieldClass} /></div>
            <div><label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Account Number</label><input type="text" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} className={fieldClass} /></div>
            <div><label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">IFSC Code</label><input type="text" value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value.toUpperCase())} className={`${fieldClass} font-mono`} /></div>
            <div><label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Branch</label><input type="text" value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} className={fieldClass} /></div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2"><UserCheck className="w-4 h-4 text-purple-500" /> Authorized Signatory</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Name</label><input type="text" value={signatoryName} onChange={(e) => setSignatoryName(e.target.value)} className={fieldClass} /></div>
            <div><label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Title</label><input type="text" value={signatoryTitle} onChange={(e) => setSignatoryTitle(e.target.value)} className={fieldClass} /></div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <DocumentPdfViewer />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-400">Last modified by <strong>{profile.lastEditedBy || editorName}</strong></div>
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"><Save className="w-4 h-4" /><span>{savedFeedback ? 'Saved!' : 'Save Business Profile'}</span></button>
        </div>
      </form>
    </div>
  );
};
