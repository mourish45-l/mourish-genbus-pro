import React, { useEffect, useState } from 'react';
import { Download, FileUp, FileText } from 'lucide-react';

const MAX_PDF_SIZE = 20 * 1024 * 1024;

export const DocumentPdfViewer: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Choose a PDF file.');
      return;
    }
    if (file.size > MAX_PDF_SIZE) {
      setError('PDF must be 20 MB or smaller.');
      return;
    }
    setError('');
    setFileName(file.name);
    setPdfUrl(URL.createObjectURL(file));
  };

  return (
    <section className="space-y-3" aria-label="PDF viewer">
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-500" /> PDF Viewer</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Open a PDF in the browser to preview it or download the original file.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"><FileUp className="w-4 h-4" /> Open PDF<input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={handleFile} /></label>
        {pdfUrl && <a href={pdfUrl} download={fileName || 'document.pdf'} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"><Download className="w-4 h-4" /> Download PDF</a>}
        {fileName && <span className="text-xs text-slate-500 truncate max-w-xs">{fileName}</span>}
      </div>
      {error && <p className="text-xs text-rose-600" role="alert">{error}</p>}
      {pdfUrl && <iframe title={`PDF preview: ${fileName}`} src={pdfUrl} className="w-full h-[min(70vh,800px)] rounded-xl border border-slate-200 dark:border-slate-700 bg-white" />}
    </section>
  );
};
