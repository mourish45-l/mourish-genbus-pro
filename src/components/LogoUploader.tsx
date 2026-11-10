import React, { useRef, useState } from 'react';
import { Upload, X, Check, Building2, Image as ImageIcon } from 'lucide-react';
import { processImageFile } from '../utils/imageUtils';

interface Props {
  logoUrl?: string;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
  compact?: boolean;
  label?: string;
}

export const LogoUploader: React.FC<Props> = ({
  logoUrl,
  onUpload,
  onRemove,
  compact = false,
  label = 'Official Company Logo',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset input so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (!file) return;

    setIsProcessing(true);
    setErrorMsg('');
    try {
      const dataUrl = await processImageFile(file, 400, 0.88);
      onUpload(dataUrl);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 2500);
    } catch (err: any) {
      console.error('Error processing logo:', err);
      setErrorMsg(err.message || 'Could not process image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerPicker = () => {
    setErrorMsg('');
    fileInputRef.current?.click();
  };

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {logoUrl ? (
          <div className="relative group">
            <img
              src={logoUrl}
              alt="Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 dark:border-slate-700 p-0.5 shadow-sm"
            />
            <button
              type="button"
              onClick={triggerPicker}
              className="absolute inset-0 bg-black/50 text-white rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold transition"
              title="Change logo"
            >
              Edit
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={triggerPicker}
            disabled={isProcessing}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Processing...' : '+ Add Logo'}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-indigo-500" />
          <span>{label}</span>
        </span>
        <span className="text-[11px] text-slate-400">Printed on Quotes, Invoices & Client Portal</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center gap-4">
        {logoUrl ? (
          <div className="relative w-16 h-16 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
            <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain rounded-xl" />
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow"
              title="Remove Logo"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 shrink-0 bg-white dark:bg-slate-800">
            <ImageIcon className="w-6 h-6 opacity-60" />
          </div>
        )}

        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={triggerPicker}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Processing Image...' : logoUrl ? 'Change Logo Image' : 'Upload Business Logo'}</span>
            </button>

            {logoUrl && (
              <button
                type="button"
                onClick={onRemove}
                className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 text-xs font-semibold transition"
              >
                Remove
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-400">
            PNG, JPG, WEBP, or SVG. Automatically optimized for crisp printing & PDF export.
          </p>

          {successMsg && (
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Logo updated successfully!</span>
            </div>
          )}

          {errorMsg && (
            <div className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
