import React, { useState } from 'react';
import type { Invoice, CustomerRecord, CatalogueItem, BusinessProfile } from '../types';
import { formatINR } from '../utils/crypto';
import {
  Receipt,
  Plus,
  Printer,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  Building2,
  Calendar,
  AlertCircle,
  CreditCard,
  FileCheck,
  Send,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { downloadHighQualityPdf } from '../utils/pdfGenerator';

interface Props {
  invoices: Record<string, Invoice>;
  customers: Record<string, CustomerRecord>;
  catalogue: Record<string, CatalogueItem>;
  businessProfile: BusinessProfile;
  onSaveInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  editorName: string;
}

export const InvoiceManager: React.FC<Props> = ({
  invoices,
  customers,
  catalogue,
  businessProfile,
  onSaveInvoice,
  onDeleteInvoice,
  editorName,
}) => {
  const invoiceList = Object.values(invoices);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(
    invoiceList[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [paymentAmountInput, setPaymentAmountInput] = useState<number>(0);
  const [paymentModeInput, setPaymentModeInput] = useState<'BANK_NEFT_RTGS' | 'CHEQUE' | 'ONLINE_TRANSFER' | 'CASH'>('BANK_NEFT_RTGS');
  const [paymentRefInput, setPaymentRefInput] = useState('');

  const activeInvoice = activeInvoiceId ? invoices[activeInvoiceId] : invoiceList[0];

  const filteredInvoices = invoiceList.filter((inv) => {
    const matchesSearch = `${inv.invoiceNumber} ${inv.customerName} ${inv.status}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate Totals for Active Invoice
  let subtotal = 0;
  let totalTax = 0;
  if (activeInvoice && activeInvoice.items) {
    activeInvoice.items.forEach((it) => {
      const line = (Number(it.qty) || 0) * (Number(it.rate) || 0);
      subtotal += line;
      totalTax += line * ((Number(it.gst) || 0) / 100);
    });
  }
  const discount = Number(activeInvoice?.discount || 0);
  const grandTotal = Math.max(0, subtotal + totalTax - discount);
  const paidAmount = Number(activeInvoice?.paidAmount || 0);
  const balanceDue = Math.max(0, grandTotal - paidAmount);

  // Create New Invoice Directly
  const handleCreateNewInvoice = () => {
    const newId = `inv_${Date.now()}`;
    const firstCustId = Object.keys(customers)[0] || '';
    const cust = customers[firstCustId];
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];

    const newInv: Invoice = {
      id: newId,
      bizId: businessProfile.bizId || 'mourish_developers_hq',
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: firstCustId,
      customerName: cust?.name || 'Unassigned Client',
      customerGstin: cust?.gstin || '',
      customerAddress: cust?.address || '',
      issueDate: today,
      dueDate: due,
      status: 'DRAFT',
      items: [],
      discount: 0,
      paidAmount: 0,
      notes: 'Thank you for your business. Please remit payment via NEFT/RTGS to the official bank account detailed below.',
      terms: 'Payment due within 15 days of invoice date via Bank NEFT / RTGS transfer. Interest applicable for delayed payments as per standard terms.',
      createdAt: Date.now(),
    };

    onSaveInvoice(newInv);
    setActiveInvoiceId(newId);
  };

  const handleUpdateField = (field: keyof Invoice, val: any) => {
    if (!activeInvoice) return;
    const updated = { ...activeInvoice, [field]: val };
    onSaveInvoice(updated);
  };

  const handleUpdateLineItem = (idx: number, field: string, val: any) => {
    if (!activeInvoice) return;
    const items = [...(activeInvoice.items || [])];
    items[idx] = { ...items[idx], [field]: val };
    onSaveInvoice({ ...activeInvoice, items });
  };

  const handleAddLineItem = () => {
    if (!activeInvoice) return;
    const items = [
      ...(activeInvoice.items || []),
      { name: '', hsn: '', qty: 1, rate: 0, gst: 18, unit: 'Nos' },
    ];
    onSaveInvoice({ ...activeInvoice, items });
  };

  const handleRemoveLineItem = (idx: number) => {
    if (!activeInvoice) return;
    const items = activeInvoice.items.filter((_, i) => i !== idx);
    onSaveInvoice({ ...activeInvoice, items });
  };

  const handleRecordPaymentSubmit = () => {
    if (!activeInvoice) return;
    const newPaid = Math.min(grandTotal, paidAmount + Number(paymentAmountInput));
    const newStatus = newPaid >= grandTotal ? 'PAID' : newPaid > 0 ? 'PARTIAL' : activeInvoice.status;

    const updated: Invoice = {
      ...activeInvoice,
      paidAmount: newPaid,
      status: newStatus,
      paymentMethod: paymentModeInput,
      paymentReference: paymentRefInput.trim(),
      paidAt: new Date().toISOString().split('T')[0],
    };
    onSaveInvoice(updated);
    setIsRecordPaymentOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-500" />
            <span>Zoho-Grade GST Invoices</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate compliant Tax Invoices with HSN/SAC codes, CGST/SGST breakdown, and official Bank NEFT/RTGS remittance details.
          </p>
        </div>

        <button
          onClick={handleCreateNewInvoice}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
        >
          <Plus className="w-4 h-4" /> New Tax Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* Left: Invoice Master List */}
        <div className="xl:col-span-4 p-5 rounded-[28px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-4">
          
          {/* Search & Status Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoice #, customer..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
              {['ALL', 'DRAFT', 'SENT', 'PARTIAL', 'PAID', 'OVERDUE'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                    filterStatus === st
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Invoices List */}
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filteredInvoices.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No invoices found. Click <strong>New Tax Invoice</strong> to generate one.
              </div>
            ) : (
              filteredInvoices.map((inv) => {
                let invTotal = 0;
                (inv.items || []).forEach((it) => {
                  const line = (Number(it.qty) || 0) * (Number(it.rate) || 0);
                  invTotal += line + line * ((Number(it.gst) || 0) / 100);
                });
                invTotal = Math.max(0, invTotal - Number(inv.discount || 0));

                const isSelected = activeInvoice?.id === inv.id;

                return (
                  <div
                    key={inv.id}
                    onClick={() => setActiveInvoiceId(inv.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="font-mono text-slate-900 dark:text-white">{inv.invoiceNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : inv.status === 'PARTIAL'
                            ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                            : inv.status === 'OVERDUE'
                            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                            : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
                      {inv.customerName || 'Unassigned Client'}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span>Due: {inv.dueDate || 'Immediate'}</span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatINR(invTotal)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right: Active Invoice View / Editor & GST Print Area */}
        {activeInvoice ? (
          <div
            id="printableInvoice"
            className="xl:col-span-8 p-6 lg:p-8 rounded-[32px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xl"
          >
            
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 no-print">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    activeInvoice.status === 'PAID'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : activeInvoice.status === 'PARTIAL'
                      ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {activeInvoice.status}
                </span>

                <input
                  type="text"
                  value={activeInvoice.invoiceNumber}
                  onChange={(e) => handleUpdateField('invoiceNumber', e.target.value)}
                  className="bg-transparent font-black text-xl text-slate-900 dark:text-white border-b border-transparent focus:border-indigo-500 focus:outline-none w-48 font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                
                {/* Status Switchers */}
                <select
                  value={activeInvoice.status}
                  onChange={(e) => handleUpdateField('status', e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="DRAFT">Mark Draft</option>
                  <option value="SENT">Mark Sent</option>
                  <option value="PARTIAL">Mark Partial</option>
                  <option value="PAID">Mark Paid</option>
                  <option value="OVERDUE">Mark Overdue</option>
                </select>

                <button
                  onClick={() => {
                    setPaymentAmountInput(balanceDue);
                    setIsRecordPaymentOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Record Payment
                </button>

                <button
                  onClick={() => downloadHighQualityPdf('printableInvoice', `Tax_Invoice_${activeInvoice.invoiceNumber}`)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
                  title="Download High-Quality PDF"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                  title="Print GST Tax Invoice"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteInvoice(activeInvoice.id)}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition"
                  title="Delete Invoice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>
            </div>

            {/* Print Header: Official Tax Invoice Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-200 dark:border-slate-800 pb-6 text-xs">
              
              {/* Supplier with Logo */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Supplier Details</div>
                <div className="flex items-center gap-3">
                  {businessProfile.logoUrl ? (
                    <img src={businessProfile.logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-white" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      {businessProfile.name?.charAt(0) || 'B'}
                    </div>
                  )}
                  <div>
                    <div className="text-base font-black text-slate-900 dark:text-white">{businessProfile.name}</div>
                    <div className="text-slate-600 dark:text-slate-400">GSTIN: <strong className="text-slate-900 dark:text-white font-mono">{businessProfile.gstin}</strong></div>
                  </div>
                </div>
                <div className="text-slate-600 dark:text-slate-400">{businessProfile.address}</div>
                <div className="text-slate-600 dark:text-slate-400">Phone: {businessProfile.phone} · Email: {businessProfile.email}</div>
              </div>

              {/* Buyer / Client Details */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Billed To (Client / Customer)</div>
                <select
                  value={activeInvoice.customerId}
                  onChange={(e) => {
                    const c = customers[e.target.value];
                    handleUpdateField('customerId', e.target.value);
                    if (c) {
                      handleUpdateField('customerName', c.name);
                      handleUpdateField('customerGstin', c.gstin || '');
                      handleUpdateField('customerAddress', c.address || '');
                    }
                  }}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select Client Account...</option>
                  {Object.values(customers).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company || c.phone})
                    </option>
                  ))}
                </select>

                <div className="text-slate-600 dark:text-slate-400">
                  GSTIN: {activeInvoice.customerGstin || 'Unregistered'}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {activeInvoice.customerAddress || 'Address on record'}
                </div>
              </div>

            </div>

            {/* Dates & Reference */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Invoice Date</label>
                <input
                  type="date"
                  value={activeInvoice.issueDate || ''}
                  onChange={(e) => handleUpdateField('issueDate', e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500">Due Date</label>
                <input
                  type="date"
                  value={activeInvoice.dueDate || ''}
                  onChange={(e) => handleUpdateField('dueDate', e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500">Linked Quote #</label>
                <div className="mt-2 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  {activeInvoice.quoteNumber || 'Direct Invoice'}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500">Payment Due</label>
                <div className="mt-2 text-base font-black text-rose-600 dark:text-rose-400 tabular-nums">
                  {formatINR(balanceDue)}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Item Description</th>
                    <th className="p-3">HSN/SAC</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Rate (₹)</th>
                    <th className="p-3 text-center">GST %</th>
                    <th className="p-3 text-right">Taxable (₹)</th>
                    <th className="p-3 text-right">Total (₹)</th>
                    <th className="p-3 no-print text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {(activeInvoice.items || []).map((it, idx) => {
                    const raw = (Number(it.qty) || 0) * (Number(it.rate) || 0);
                    const tax = raw * ((Number(it.gst) || 0) / 100);
                    const total = raw + tax;

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="p-3 text-slate-400">{idx + 1}</td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={it.name}
                            onChange={(e) => handleUpdateLineItem(idx, 'name', e.target.value)}
                            className="w-full bg-transparent font-medium text-slate-900 dark:text-white focus:outline-none"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={it.hsn || '9019'}
                            onChange={(e) => handleUpdateLineItem(idx, 'hsn', e.target.value)}
                            className="w-16 bg-transparent text-slate-500 font-mono focus:outline-none"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min={1}
                            value={it.qty}
                            onChange={(e) => handleUpdateLineItem(idx, 'qty', Number(e.target.value) || 1)}
                            className="w-14 text-center bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none font-bold"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <input
                            type="number"
                            value={it.rate}
                            onChange={(e) => handleUpdateLineItem(idx, 'rate', Number(e.target.value) || 0)}
                            className="w-20 text-right bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none font-bold tabular-nums"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <select
                            value={it.gst}
                            onChange={(e) => handleUpdateLineItem(idx, 'gst', Number(e.target.value) || 0)}
                            className="bg-transparent font-semibold focus:outline-none"
                          >
                            <option value={18}>18%</option>
                            <option value={12}>12%</option>
                            <option value={5}>5%</option>
                            <option value={0}>0%</option>
                          </select>
                        </td>
                        <td className="p-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                          {formatINR(raw)}
                        </td>
                        <td className="p-3 text-right tabular-nums font-bold text-slate-900 dark:text-white">
                          {formatINR(total)}
                        </td>
                        <td className="p-3 no-print text-center">
                          <button
                            onClick={() => handleRemoveLineItem(idx)}
                            className="text-rose-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="pt-2 no-print">
                <button
                  onClick={handleAddLineItem}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Line Item
                </button>
              </div>
            </div>

            {/* Calculations & Bank Details Box (Strictly No UPI ID) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              
              {/* Official Bank Account Details for NEFT / RTGS Remittance */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" /> Bank Transfer & Remittance Instructions
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                  <div>Bank Name: <strong className="text-slate-900 dark:text-white">{businessProfile.bankName || 'HDFC Bank'}</strong></div>
                  <div>Account Number: <strong className="text-slate-900 dark:text-white font-mono">{businessProfile.bankAccountNo || '50200084920193'}</strong></div>
                  <div>IFSC Code: <strong className="text-slate-900 dark:text-white font-mono">{businessProfile.bankIfsc || 'HDFC0001824'}</strong></div>
                  <div>Branch: <strong className="text-slate-900 dark:text-white">{businessProfile.bankBranch || 'Commercial Branch, Tamil Nadu'}</strong></div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Please mention Invoice #{activeInvoice.invoiceNumber} in NEFT / RTGS transfer remarks.
                  </div>
                </div>
              </div>

              {/* Subtotal, GST & Balance Due */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Taxable Subtotal:</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>CGST (9%) + SGST (9%):</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{formatINR(totalTax)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Discount (₹):</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => handleUpdateField('discount', Number(e.target.value) || 0)}
                    className="w-24 text-right px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-black">
                  <span>Invoice Total:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">{formatINR(grandTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-semibold text-indigo-600 tabular-nums">{formatINR(paidAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-rose-600 dark:text-rose-400 border-t border-dashed border-slate-200 dark:border-slate-800 pt-1.5">
                  <span>Balance Due:</span>
                  <span className="tabular-nums">{formatINR(balanceDue)}</span>
                </div>
              </div>

            </div>

            {/* Authorized Signatory Footnote */}
            <div className="pt-8 flex justify-between items-end text-xs text-slate-500">
              <div>
                <p className="max-w-md">{activeInvoice.terms || 'Payment terms: Due on presentation.'}</p>
              </div>
              <div className="text-right space-y-8">
                <div>For <strong>{businessProfile.name}</strong></div>
                <div className="border-t border-slate-400 pt-1 font-bold text-slate-900 dark:text-white">
                  {businessProfile.signatoryName || 'Mourish Nithin'}
                  <div className="text-[10px] text-slate-400 font-normal">{businessProfile.signatoryTitle || 'Managing Director'}</div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="xl:col-span-8 p-16 text-center rounded-[32px] liquid-card border border-slate-200 dark:border-slate-800 space-y-4">
            <Receipt className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="font-bold text-base text-slate-900 dark:text-white">No Invoice Selected</h4>
            <p className="text-xs text-slate-500">Select an invoice from the left or create a new one.</p>
            <button
              onClick={handleCreateNewInvoice}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              <Plus className="w-4 h-4 inline mr-1" /> Create First Invoice
            </button>
          </div>
        )}

      </div>

      {/* Record Payment Modal */}
      {isRecordPaymentOpen && activeInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-500" /> Record Client Payment
              </h3>
              <button
                onClick={() => setIsRecordPaymentOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Payment Amount (₹)</label>
                <input
                  type="number"
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(Number(e.target.value) || 0)}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Payment Method</label>
                <select
                  value={paymentModeInput}
                  onChange={(e) => setPaymentModeInput(e.target.value as any)}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="BANK_NEFT_RTGS">Bank NEFT / RTGS / IMPS</option>
                  <option value="CHEQUE">Bank Cheque</option>
                  <option value="ONLINE_TRANSFER">Online Bank Transfer</option>
                  <option value="CASH">Cash Payment</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Bank Ref / UTR / Cheque Number</label>
                <input
                  type="text"
                  value={paymentRefInput}
                  onChange={(e) => setPaymentRefInput(e.target.value)}
                  placeholder="e.g. HDFCN8492049182 / Cheque #004910"
                  className="w-full mt-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-500">
                Total Invoice Value: <strong>{formatINR(grandTotal)}</strong> · Outstanding: <strong>{formatINR(balanceDue)}</strong>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRecordPaymentOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRecordPaymentSubmit}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Confirm & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
