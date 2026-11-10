import React, { useState } from 'react';
import type { Deal, CustomerRecord } from '../types';
import { formatINR, formatCompactINR } from '../utils/crypto';
import {
  TrendingUp,
  FileText,
  Receipt,
  Truck,
  Target,
  HardHat,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  ArrowUpRight,
  Sparkles,
  Building2,
  Clock,
  ShieldCheck,
  Navigation,
} from 'lucide-react';

interface Props {
  quotations: Record<string, Quotation>;
  invoices: Record<string, Invoice>;
  deliveries?: Record<string, DeliveryChallan>;
  deals: Record<string, Deal>;
  projects: Record<string, Project>;
  customers: Record<string, CustomerRecord>;
  onNavigateTab: (tab: BusinessTab) => void;
  onCreateQuote: () => void;
  onCreateInvoice: () => void;
}

export const ExecutiveDashboard: React.FC<Props> = ({
  quotations,
  invoices,
  deliveries = {},
  deals,
  projects,
  customers,
  onNavigateTab,
  onCreateQuote,
  onCreateInvoice,
}) => {
  const quoteList = Object.values(quotations);
  const invoiceList = Object.values(invoices);
  const deliveryList = Object.values(deliveries);
  const dealList = Object.values(deals);
  const projectList = Object.values(projects);
  const customerList = Object.values(customers);

  const totalQuotedValue = quoteList.reduce((sum, q) => {
    let sub = 0;
    let tax = 0;
    (q.items || []).forEach((it) => {
      const line = (Number(it.qty) || 0) * (Number(it.rate) || 0);
      sub += line;
      tax += line * ((Number(it.gst) || 0) / 100);
    });
    return sum + Math.max(0, sub + tax - Number(q.discount || 0));
  }, 0);

  const totalInvoicedValue = invoiceList.reduce((sum, inv) => {
    let sub = 0;
    let tax = 0;
    (inv.items || []).forEach((it) => {
      const line = (Number(it.qty) || 0) * (Number(it.rate) || 0);
      sub += line;
      tax += line * ((Number(it.gst) || 0) / 100);
    });
    return sum + Math.max(0, sub + tax - Number(inv.discount || 0));
  }, 0);

  const totalCollected = invoiceList.reduce((sum, inv) => sum + (Number(inv.paidAmount) || 0), 0);
  const outstandingReceivables = Math.max(0, totalInvoicedValue - totalCollected);

  const totalPipelineValue = dealList
    .filter((d) => d.stage !== 'LOST')
    .reduce((sum, d) => sum + (Number(d.value) || 0), 0);

  const wonDealsValue = dealList
    .filter((d) => d.stage === 'WON')
    .reduce((sum, d) => sum + (Number(d.value) || 0), 0);

  const activeProjects = projectList.filter((p) => p.status !== 'COMMISSIONED');

  return (
    <div className="space-y-6">
      <div className="p-6 lg:p-8 rounded-[32px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Business Operations Suite
              </span>
              <span className="text-xs text-slate-400">· Live workspace</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">
              Executive Business Overview
            </h1>
            <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Turnkey project delivery, business operations, GST invoicing, CRM pipeline & material dispatches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onCreateQuote}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" /> New Estimate / Quote
            </button>
            <button
              onClick={onCreateInvoice}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <Receipt className="w-4 h-4" /> New Tax Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => onNavigateTab('invoices')} className="p-5 rounded-[28px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-3 cursor-pointer hover:border-indigo-500/50 transition group">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Invoiced Value</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{formatINR(totalInvoicedValue)}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Collected: {formatINR(totalCollected)}</span>
            </div>
          </div>
        </div>

        <div onClick={() => onNavigateTab('invoices')} className="p-5 rounded-[28px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-3 cursor-pointer hover:border-amber-500/50 transition group">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Pending Receivables</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">{formatINR(outstandingReceivables)}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">From {invoiceList.filter((inv) => inv.status !== 'PAID').length} pending client invoices</div>
          </div>
        </div>

        <div onClick={() => onNavigateTab('deals')} className="p-5 rounded-[28px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-3 cursor-pointer hover:border-indigo-500/50 transition group">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>CRM Pipeline Value</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{formatINR(totalPipelineValue)}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-medium">
              <span>{dealList.length} active client deals ({formatCompactINR(wonDealsValue)} won)</span>
            </div>
          </div>
        </div>

        <div onClick={() => onNavigateTab('projects')} className="p-5 rounded-[28px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-3 cursor-pointer hover:border-purple-500/50 transition group">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Active Projects</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 tabular-nums">{activeProjects.length} Projects</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">project delivery & handover</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 p-6 rounded-[32px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-500" /> Business Workflows
            </h3>
            <span className="text-xs text-slate-400">Integrated Modules</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button onClick={() => onNavigateTab('quotations')} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 text-left transition group">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-105 transition"><FileText className="w-5 h-5" /></div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Estimates / Quotes</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{quoteList.length} Quotes · Fast Convert</div>
            </button>

            <button onClick={() => onNavigateTab('invoices')} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 text-left transition group">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition"><Receipt className="w-5 h-5" /></div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">GST Invoices</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{invoiceList.length} Invoices · Bank NEFT</div>
            </button>

            <button onClick={() => onNavigateTab('deliveries')} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 text-left transition group">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition"><Truck className="w-5 h-5" /></div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Delivery Challans</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{deliveryList.length} Dispatches · Rule 55</div>
            </button>

            <button onClick={() => onNavigateTab('deals')} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 text-left transition group">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition"><Target className="w-5 h-5" /></div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">CRM Deals Pipeline</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{dealList.length} Deals · Stages</div>
            </button>

            <button onClick={() => onNavigateTab('projects')} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-left transition group">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition"><HardHat className="w-5 h-5" /></div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Projects</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{projectList.length} Active Work Orders</div>
            </button>

            <button onClick={() => onNavigateTab('customers')} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 text-left transition group">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2 group-hover:scale-105 transition"><Users className="w-5 h-5" /></div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Business Clients</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{customerList.length} Accounts & Contacts</div>
            </button>

          </div>
        </div>

        <div className="lg:col-span-4 p-6 rounded-[32px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2"><Truck className="w-4 h-4 text-blue-500" /> Dispatches & Waybills</h4>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">{deliveryList.length} Total</span>
          </div>

          {deliveryList.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 space-y-2">
              <Truck className="w-8 h-8 text-blue-500 mx-auto opacity-70" />
              <p>No dispatches created yet. Create GST delivery challans to track transit to client sites.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {deliveryList.slice(0, 5).map((challan) => (
                <div key={challan.id} className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white truncate max-w-[160px]">{challan.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{challan.challanNumber} · {challan.vehicleOrLrNumber ? `LR: ${challan.vehicleOrLrNumber}` : challan.carrierName}</div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${challan.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : challan.status === 'IN_TRANSIT' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                      {challan.status.replace('_', ' ')}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{challan.dispatchDate}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => onNavigateTab('deliveries')} className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2">
            <span>Manage Delivery Challans & Waybills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

