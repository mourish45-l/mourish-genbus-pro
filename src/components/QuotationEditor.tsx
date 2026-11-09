import React, { useState } from 'react';
import type { Quotation, CustomerRecord, CatalogueItem } from '../types';
import {
  Plus,
  Printer,
  Trash2,
  CheckCircle,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  Receipt,
  FileCheck,
} from 'lucide-react';

interface Props {
  quotations: Record<string, Quotation>;
  activeQuoteId: string | null;
  onSelectQuote: (id: string) => void;
  onSaveQuoteField: (id: string, field: keyof Quotation, value: any) => void;
  onUpdateLineItem: (id: string, idx: number, key: string, val: any) => void;
  onAddLineItem: (id: string, item?: Partial<CatalogueItem>) => void;
  onRemoveLineItem: (id: string, idx: number) => void;
  onCreateNewQuote: () => void;
  onDeleteQuote: (id: string) => void;
  onConvertToInvoice?: (quoteId: string) => void;
  customers: Record<string, CustomerRecord>;
  catalogue: Record<string, CatalogueItem>;
  editorName: string;
}

export const QuotationEditor: React.FC<Props> = ({
  quotations,
  activeQuoteId,
  onSelectQuote,
  onSaveQuoteField,
  onUpdateLineItem,
  onAddLineItem,
  onRemoveLineItem,
  onCreateNewQuote,
  onDeleteQuote,
  onConvertToInvoice,
  customers,
  catalogue,
  editorName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'list' | 'editor'>('editor');

  const quoteList = Object.values(quotations);
  const activeQuote = activeQuoteId ? quotations[activeQuoteId] : quoteList[0];

  // Filtered Quotations
  const filteredQuotes = quoteList.filter((q) => {
    const qStr = `${q.quoteNumber} ${q.title} ${q.customerName} ${q.status}`.toLowerCase();
    return qStr.includes(searchQuery.toLowerCase());
  });

  const handleCreateQuoteClick = () => {
    onCreateNewQuote();
    setMobileTab('editor');
  };

  // Quick Catalogue Insert
  const handleInsertFromCatalogue = () => {
    if (!activeQuote || !selectedCatId) return;
    const catItem = catalogue[selectedCatId];
    if (catItem) {
      onAddLineItem(activeQuote.id, {
        name: catItem.name,
        rate: catItem.rate,
        gst: catItem.gst,
      });
    }
  };

  // Totals Calculation
  let subtotal = 0;
  let totalTax = 0;
  if (activeQuote && activeQuote.items) {
    activeQuote.items.forEach((item) => {
      const lineRaw = (Number(item.qty) || 0) * (Number(item.rate) || 0);
      const lineTax = lineRaw * ((Number(item.gst) || 0) / 100);
      subtotal += lineRaw;
      totalTax += lineTax;
    });
  }
  const discount = Number(activeQuote?.discount || 0);
  const grandTotal = Math.max(0, subtotal + totalTax - discount);

  return (
    <div className="space-y-4">
      {/* Tablet & Mobile View Mode Switcher (visible on screens < 1280px) */}
      <div className="xl:hidden flex items-center justify-between p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => setMobileTab('list')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition ${
              mobileTab === 'list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            All Quotes ({quoteList.length})
          </button>
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition ${
              mobileTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            {activeQuote ? `Editor: ${activeQuote.quoteNumber}` : 'Active Editor'}
          </button>
        </div>

        <button
          onClick={handleCreateQuoteClick}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
        >
          <Plus className="w-3.5 h-3.5" /> + New Quote
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Quotation Master List & Quota Tracker */}
        <div
          className={`xl:col-span-4 p-5 rounded-[28px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-4 ${
            mobileTab === 'list' ? 'block' : 'hidden xl:block'
          }`}
        >
        
        {/* Header & New Quote Button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              All Quotations
            </h3>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Synced Singapore Realtime DB
            </div>
          </div>

          <button
            onClick={handleCreateQuoteClick}
            className="px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
            title="Create New Quotation"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Quote</span>
          </button>
        </div>

        {/* Proposals Overview Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              Quotation Proposals
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {quoteList.length} Active
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Unlimited Proposals · Singapore Realtime DB</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quote #, customer, status..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-white"
          />
        </div>

        {/* List of Quotations */}
        <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
          {filteredQuotes.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              {quoteList.length === 0
                ? 'No quotations yet. Click "New Quote" above to create your first proposal.'
                : 'No quotations match your search.'}
            </div>
          ) : (
            filteredQuotes.map((q) => {
              const isSelected = q.id === activeQuote?.id;
              const isFinal = q.status === 'FINALIZED';

              return (
                <div
                  key={q.id}
                  onClick={() => onSelectQuote(q.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-indigo-600/15 dark:bg-indigo-600/25 border-indigo-500 dark:border-indigo-500 shadow-sm'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400">
                      {q.quoteNumber || 'QT-DRAFT'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFinal
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-slate-900 dark:text-white mt-1 truncate">
                    {q.title || 'Untitled Quotation'}
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Client: {q.customerName || 'Unassigned'}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                    <span>By: <strong className="text-slate-700 dark:text-slate-300">{q.lastEditedBy || 'Team'}</strong></span>
                    <span>{q.lastEditedAt || ''}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Realtime Active Quotation Workspace & Line Items */}
      {activeQuote ? (
        <div
          id="printableQuotation"
          className="xl:col-span-8 p-6 lg:p-8 rounded-[32px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xl"
        >
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    activeQuote.status === 'FINALIZED'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {activeQuote.status}
                </span>

                <input
                  type="text"
                  value={activeQuote.quoteNumber || ''}
                  onChange={(e) => onSaveQuoteField(activeQuote.id, 'quoteNumber', e.target.value)}
                  className="bg-transparent font-black text-xl text-slate-900 dark:text-white border-b border-transparent focus:border-indigo-500 focus:outline-none w-48"
                  placeholder="QT-2026-001"
                />
              </div>

              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Last edited by {activeQuote.lastEditedBy || editorName} at {activeQuote.lastEditedAt || 'now'}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 no-print">
              {activeQuote.customerApproved && (
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Approved by Client ({activeQuote.customerSignatory || 'Signed'})</span>
                </span>
              )}

              {onConvertToInvoice && (
                <button
                  onClick={() => onConvertToInvoice(activeQuote.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
                  title="1-Click Convert Quote to official GST Tax Invoice"
                >
                  <Receipt className="w-4 h-4" /> Convert to Invoice
                </button>
              )}

              <button
                onClick={() => onSaveQuoteField(activeQuote.id, 'status', 'DRAFT')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition"
              >
                Mark Draft
              </button>

              <button
                onClick={() => onSaveQuoteField(activeQuote.id, 'status', 'FINALIZED')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
              >
                <CheckCircle className="w-4 h-4" /> Finalize for Customer
              </button>

              <button
                onClick={() => window.print()}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                title="Print or Export PDF"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDeleteQuote(activeQuote.id)}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition"
                title="Delete Quotation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quotation Meta Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Assign Customer
              </label>
              <select
                value={activeQuote.customerId || ''}
                onChange={(e) => {
                  const custId = e.target.value;
                  const c = customers[custId];
                  onSaveQuoteField(activeQuote.id, 'customerId', custId);
                  if (c) onSaveQuoteField(activeQuote.id, 'customerName', c.name);
                }}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-white"
              >
                <option value="">Select Customer...</option>
                {Object.values(customers).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Project / Subject Title
              </label>
              <input
                type="text"
                value={activeQuote.title || ''}
                onChange={(e) => onSaveQuoteField(activeQuote.id, 'title', e.target.value)}
                placeholder="e.g. Turnkey Medical Gas Pipeline System"
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Valid Until
              </label>
              <input
                type="date"
                value={activeQuote.validUntil || ''}
                onChange={(e) => onSaveQuoteField(activeQuote.id, 'validUntil', e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Quick Insert from Catalogue Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" /> Quick Insert from Catalogue:
            </div>

            <div className="flex flex-1 items-center gap-2 min-w-[260px]">
              <select
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                <option value="">Select item from catalogue...</option>
                {Object.values(catalogue).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — ₹{Number(item.rate).toLocaleString('en-IN')} ({item.gst}% GST)
                  </option>
                ))}
              </select>

              <button
                onClick={handleInsertFromCatalogue}
                disabled={!selectedCatId}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition"
              >
                + Add Item
              </button>

              <button
                onClick={() => onAddLineItem(activeQuote.id)}
                className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
              >
                + Custom Row
              </button>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-2">Item / Specification</th>
                  <th className="py-2.5 px-2 w-20 text-center">Qty</th>
                  <th className="py-2.5 px-2 w-32 text-right">Rate (₹)</th>
                  <th className="py-2.5 px-2 w-24 text-right">GST %</th>
                  <th className="py-2.5 px-2 w-32 text-right">Total (₹)</th>
                  <th className="py-2.5 px-2 w-10 no-print"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {(activeQuote.items || []).map((item, idx) => {
                  const qty = Number(item.qty) || 0;
                  const rate = Number(item.rate) || 0;
                  const gst = Number(item.gst) || 0;
                  const lineRaw = qty * rate;
                  const lineTotal = lineRaw + lineRaw * (gst / 100);

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.name || ''}
                          onChange={(e) => onUpdateLineItem(activeQuote.id, idx, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                          placeholder="Item description..."
                        />
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={qty}
                          onChange={(e) => onUpdateLineItem(activeQuote.id, idx, 'qty', Number(e.target.value))}
                          className="w-full text-center px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                        />
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={rate}
                          onChange={(e) => onUpdateLineItem(activeQuote.id, idx, 'rate', Number(e.target.value))}
                          className="w-full text-right px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                        />
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={gst}
                          onChange={(e) => onUpdateLineItem(activeQuote.id, idx, 'gst', Number(e.target.value))}
                          className="w-full text-right px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                        />
                      </td>

                      <td className="py-2 px-2 text-right font-extrabold text-slate-900 dark:text-white tabular-nums">
                        ₹{lineTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>

                      <td className="py-2 px-2 text-right no-print">
                        <button
                          onClick={() => onRemoveLineItem(activeQuote.id, idx)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Remove Line Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Notes & Summary Calculation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Terms & Conditions / Notes
              </label>
              <textarea
                rows={4}
                value={activeQuote.notes || ''}
                onChange={(e) => onSaveQuoteField(activeQuote.id, 'notes', e.target.value)}
                placeholder="Payment: 50% advance along with confirmed PO, balance upon commissioning. Delivery within 14 days."
                className="w-full mt-1 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Taxable Subtotal:</span>
                <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                  ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Total GST Tax:</span>
                <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                  ₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Special Discount (₹):</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => onSaveQuoteField(activeQuote.id, 'discount', Number(e.target.value) || 0)}
                  className="w-28 text-right px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">Grand Total:</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                  ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="xl:col-span-8 p-16 text-center rounded-[32px] liquid-card border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Plus className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-base text-slate-900 dark:text-white">No Quotation Selected</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Create a new quotation proposal or select one from the left sidebar to start editing.
            </p>
          </div>
          <button
            onClick={handleCreateQuoteClick}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" /> Create New Quotation
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

