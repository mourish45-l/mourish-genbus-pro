import React, { useState } from 'react';
import type { DocumentTheme, AccentColor } from '../types';
import {
  DOCUMENT_STYLES,
  ACCENT_COLORS,
  INDUSTRY_TEMPLATES,
  IndustryTemplate
} from '../utils/documentTemplates';
import { Palette, Sparkles, Check, ChevronDown, Wand2 } from 'lucide-react';

interface Props {
  activeTemplate: DocumentTheme;
  activeAccent: AccentColor;
  onSelectTemplate: (theme: DocumentTheme) => void;
  onSelectAccent: (color: AccentColor) => void;
  onApplyIndustryTemplate?: (template: IndustryTemplate) => void;
}

export const TemplateAccentBar: React.FC<Props> = ({
  activeTemplate,
  activeAccent,
  onSelectTemplate,
  onSelectAccent,
  onApplyIndustryTemplate,
}) => {
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);

  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 no-print">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Document Template & Accent Color
          </span>
        </div>

        {onApplyIndustryTemplate && (
          <button
            type="button"
            onClick={() => setIsIndustryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 font-bold text-xs transition border border-indigo-200 dark:border-indigo-800"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Load Industry Starter Items</span>
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Templates Selector */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Layout Style
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {DOCUMENT_STYLES.map((style) => {
              const isSelected = activeTemplate === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onSelectTemplate(style.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md ring-2 ring-indigo-500/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={style.description}
                >
                  <i className={`bx ${style.icon} text-sm`}></i>
                  <span>{style.name.split(' ')[0]}</span>
                  {isSelected && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Colors Palette */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Brand Accent Color
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {ACCENT_COLORS.map((c) => {
              const isSelected = activeAccent === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectAccent(c.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${c.bgClass} ${
                    isSelected
                      ? 'scale-110 ring-2 ring-offset-2 ring-slate-900 dark:ring-offset-slate-950 dark:ring-white shadow-md'
                      : 'opacity-80 hover:opacity-100 hover:scale-105'
                  }`}
                  title={`${c.name} Accent`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Industry Starter Modal */}
      {isIndustryModalOpen && onApplyIndustryTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Choose Industry Starter Template</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  1-Click populate clean standard items, HSN codes, and commercial terms.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsIndustryModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {INDUSTRY_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    onApplyIndustryTemplate(tmpl);
                    setIsIndustryModalOpen(false);
                  }}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-left transition group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <i className={`bx ${tmpl.icon} text-base text-indigo-600`}></i>
                      <span>{tmpl.name}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                      {tmpl.items.length} items
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {tmpl.items.map((i) => i.name).join(' · ')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
