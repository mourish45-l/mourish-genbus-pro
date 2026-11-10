import React, { useEffect, useState } from 'react';
import type { BusinessProfile, DocumentTheme, AccentColor } from '../types';
import {
  Building2,
  ShieldCheck,
  Phone,
  Globe,
  MapPin,
  Save,
  Landmark,
  UserCheck,
  Mail,
  Palette,
} from 'lucide-react';
import { LogoUploader } from './LogoUploader';
import { TemplateAccentBar } from './TemplateAccentBar';
import { DocumentPdfViewer } from './DocumentPdfViewer';

interface Props {
  profile: BusinessProfile;
  onSaveProfile: (updated: Partial<BusinessProfile>) => void;
  editorName: string;
}

const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

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
  const [themeTemplate, setThemeTemplate] = useState<DocumentTheme>(profile.themeTemplate || 'bold');
  const [accentColor, setAccentColor] = useState<AccentColor>(profile.accentColor || 'indigo');
  const [gstinError, setGstinError] = useState('');
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
    setThemeTemplate(profile.themeTemplate || 'bold');
    setAccentColor(profile.accentColor || 'indigo');
  }, [profile]);

  const handleGstinChange = (value: string) => {
    const normalized = value.toUpperCase().replace(/\s/g, '');
    setGstin(normalized);
    setGstinError(
      normalized && !GSTIN_PATTERN.test(normalized)
        ? 'Enter a valid 15-character Indian GSTIN format.'
        : ''
    );
  };

  const handleLogoUpload = (dataUrl: string) => {
    setLogoUrl(dataUrl);
    // Instant sync to Firebase
    onSaveProfile({ logoUrl: dataUrl, lastEditedBy: editorName });
  };

  const handleLogoRemove = () => {
    setLogoUrl('');
    // Instant sync removal
    onSaveProfile({ logoUrl: '', lastEditedBy: editorName });
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (gstin && !GSTIN_PATTERN.test(gstin)) {
      setGstinError('Enter a valid 15-character Indian GSTIN format.');
      return;
    }
    onSaveProfile({
      name: name.trim(),
      gstin: gstin.trim().toUpperCase(),
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
      address: address.trim(),
      bankName: bankName.trim(),
      bankAccountNo: bankAccountNo.trim(),
      bankIfsc: bankIfsc.trim().toUpperCase(),
      bankBranch: bankBranch.trim(),
      signatoryName: signatoryName.trim(),
      signatoryTitle: signatoryTitle.trim(),
      logoUrl,
      themeTemplate,
      accentColor,
      lastEditedBy: editorName,
    });
    setSavedFeedback(true);
    window.setTimeout(() => setSavedFeedback(false), 3000);
  };

  const fieldClass =
    'w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          Business Profile, Logo & Design Templates
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure official details, upload company logo, and pick default templates & accent colors for all documents.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="p-6 lg:p-8 rounded-[32px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xl"
      >
        {/* Section 1: Logo Uploader */}
        <LogoUploader
          logoUrl={logoUrl}
          onUpload={handleLogoUpload}
          onRemove={handleLogoRemove}
        />

        {/* Section 2: Default Template & Accent Color Selection */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Default Document Style & Accent Color
            </h4>
          </div>
          <TemplateAccentBar
            activeTemplate={themeTemplate}
            activeAccent={accentColor}
            onSelectTemplate={(t) => setThemeTemplate(t)}
            onSelectAccent={(a) => setAccentColor(a)}
          />
        </div>

        {/* Section 3: Legal Business Details */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" /> Business Details
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
                placeholder="e.g. Sri Krishna Enterprises"
                className={fieldClass}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> GSTIN (India)
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => handleGstinChange(e.target.value)}
                maxLength={15}
                autoCapitalize="characters"
                placeholder="15-character GSTIN (e.g. 27AAAAA0000A1Z5)"
                aria-invalid={Boolean(gstinError)}
                className={`${fieldClass} font-mono uppercase ${gstinError ? 'border-rose-500' : ''}`}
              />
              {gstinError && (
                <p className="mt-1 text-[11px] text-rose-600" role="alert">
                  {gstinError}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-500" /> Primary Phone *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className={fieldClass}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500" /> Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@business.in"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" /> Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Operating / Registered Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete address"
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Bank Remittance Details */}
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
                placeholder="State Bank of India / HDFC"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Account Number</label>
              <input
                type="text"
                value={bankAccountNo}
                onChange={(e) => setBankAccountNo(e.target.value)}
                placeholder="Account number"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">IFSC Code</label>
              <input
                type="text"
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                placeholder="IFSC code"
                className={`${fieldClass} font-mono`}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Branch</label>
              <input
                type="text"
                value={bankBranch}
                onChange={(e) => setBankBranch(e.target.value)}
                placeholder="Branch name"
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Authorized Signatory */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-purple-500" /> Authorized Signatory
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Signatory Full Name</label>
              <input
                type="text"
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                placeholder="Full name"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Official Title / Designation</label>
              <input
                type="text"
                value={signatoryTitle}
                onChange={(e) => setSignatoryTitle(e.target.value)}
                placeholder="Managing Director / Proprietor"
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        {/* Section 6: In-browser PDF Document Previewer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <DocumentPdfViewer />
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-400">
            Last modified by <strong>{profile.lastEditedBy || editorName}</strong>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
          >
            <Save className="w-4 h-4" />
            <span>{savedFeedback ? 'Saved & Synced!' : 'Save Business Settings & Templates'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
