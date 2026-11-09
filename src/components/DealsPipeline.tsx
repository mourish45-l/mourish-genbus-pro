import React, { useState } from 'react';
import type { Deal, CustomerRecord } from '../types';
import { formatINR, formatCompactINR } from '../utils/crypto';
import {
  Target,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  Building2,
  Kanban,
  List,
  Search,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface Props {
  deals: Record<string, Deal>;
  customers: Record<string, CustomerRecord>;
  onSaveDeal: (deal: Deal) => void;
  onDeleteDeal: (id: string) => void;
  editorName: string;
}

const STAGES: { key: Deal['stage']; label: string; color: string }[] = [
  { key: 'QUALIFICATION', label: 'Lead Qualification', color: 'border-slate-500 text-slate-500' },
  { key: 'SITE_SURVEY', label: 'Hospital Site Survey', color: 'border-blue-500 text-blue-500' },
  { key: 'PROPOSAL_SENT', label: 'BOQ / Proposal Sent', color: 'border-indigo-500 text-indigo-500' },
  { key: 'TECHNICAL_EVAL', label: 'Technical Evaluation', color: 'border-purple-500 text-purple-500' },
  { key: 'NEGOTIATION', label: 'Commercial Negotiation', color: 'border-amber-500 text-amber-500' },
  { key: 'WON', label: 'Closed Won', color: 'border-emerald-500 text-emerald-500' },
  { key: 'LOST', label: 'Closed Lost', color: 'border-rose-500 text-rose-500' },
];

export const DealsPipeline: React.FC<Props> = ({
  deals,
  customers,
  onSaveDeal,
  onDeleteDeal,
  editorName,
}) => {
  const dealList = Object.values(deals);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [value, setValue] = useState<number>(250000);
  const [stage, setStage] = useState<Deal['stage']>('SITE_SURVEY');
  const [probability, setProbability] = useState<number>(60);
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [notes, setNotes] = useState('');

  const openCreateModal = () => {
    setActiveDealId(null);
    setTitle('');
    const firstCustId = Object.keys(customers)[0] || '';
    setCustomerId(firstCustId);
    setValue(350000);
    setStage('SITE_SURVEY');
    setProbability(50);
    setExpectedCloseDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSaveDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = activeDealId || `deal_${Date.now()}`;
    const cust = customers[customerId];

    const newDeal: Deal = {
      id,
      bizId: 'mourish_developers_hq',
      title: title.trim(),
      customerId,
      customerName: cust?.name || 'Hospital Client',
      value: Number(value) || 0,
      stage,
      probability: Number(probability) || 50,
      expectedCloseDate,
      notes: notes.trim(),
      assignedTo: editorName,
      createdAt: Date.now(),
    };

    onSaveDeal(newDeal);
    setIsModalOpen(false);
  };

  const handleMoveStage = (deal: Deal, newStage: Deal['stage']) => {
    const probMap: Record<Deal['stage'], number> = {
      QUALIFICATION: 20,
      SITE_SURVEY: 40,
      PROPOSAL_SENT: 60,
      TECHNICAL_EVAL: 75,
      NEGOTIATION: 90,
      WON: 100,
      LOST: 0,
    };
    onSaveDeal({
      ...deal,
      stage: newStage,
      probability: probMap[newStage],
    });
  };

  const totalActivePipeline = dealList
    .filter((d) => d.stage !== 'LOST')
    .reduce((sum, d) => sum + (Number(d.value) || 0), 0);

  const totalWon = dealList
    .filter((d) => d.stage === 'WON')
    .reduce((sum, d) => sum + (Number(d.value) || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            <span>Zoho CRM Sales & Deals Pipeline</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track hospital infrastructure opportunities from initial site survey to commercial negotiation and project won.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-500'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-500'
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" /> New Deal Opportunity
          </button>
        </div>
      </div>

      {/* Pipeline Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl liquid-card border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Total Active Pipeline</span>
          <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
            {formatINR(totalActivePipeline)}
          </div>
        </div>
        <div className="p-4 rounded-2xl liquid-card border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Won Revenue</span>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {formatINR(totalWon)}
          </div>
        </div>
        <div className="p-4 rounded-2xl liquid-card border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Deals Count</span>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {dealList.length} Deals
          </div>
        </div>
        <div className="p-4 rounded-2xl liquid-card border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500">Win Rate</span>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {dealList.length > 0
              ? `${Math.round((dealList.filter((d) => d.stage === 'WON').length / dealList.length) * 100)}%`
              : '0%'}
          </div>
        </div>
      </div>

      {/* Kanban Board Mode */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1200px]">
            {STAGES.map((st) => {
              const stageDeals = dealList.filter((d) => d.stage === st.key);
              const stageTotal = stageDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

              return (
                <div
                  key={st.key}
                  className="w-72 shrink-0 p-3.5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{st.label}</h4>
                      <div className="text-[10px] text-slate-400 font-semibold">{formatCompactINR(stageTotal)}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {stageDeals.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 min-h-[140px]">
                    {stageDeals.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        No deals in stage
                      </div>
                    ) : (
                      stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 text-xs hover:border-indigo-500/50 transition group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="font-bold text-slate-900 dark:text-white leading-tight">
                              {deal.title}
                            </div>
                            <button
                              onClick={() => onDeleteDeal(deal.id)}
                              className="text-slate-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            <span>{deal.customerName}</span>
                          </div>

                          <div className="flex items-center justify-between font-bold">
                            <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">
                              {formatINR(deal.value)}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                              {deal.probability}% Prob
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                            <span>Close: {deal.expectedCloseDate || 'TBD'}</span>
                            
                            {/* Quick Next Stage Switcher */}
                            <select
                              value={deal.stage}
                              onChange={(e) => handleMoveStage(deal, e.target.value as any)}
                              className="bg-transparent font-semibold text-indigo-600 dark:text-indigo-400 focus:outline-none"
                            >
                              {STAGES.map((s) => (
                                <option key={s.key} value={s.key}>
                                  → {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="p-6 rounded-[32px] liquid-card border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Deal Title</th>
                <th className="p-3">Client Hospital</th>
                <th className="p-3">Stage</th>
                <th className="p-3 text-right">Value (₹)</th>
                <th className="p-3 text-center">Probability</th>
                <th className="p-3">Target Close</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {dealList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No deals registered. Click <strong>New Deal Opportunity</strong> to start tracking.
                  </td>
                </tr>
              ) : (
                dealList.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{d.title}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{d.customerName}</td>
                    <td className="p-3">
                      <select
                        value={d.stage}
                        onChange={(e) => handleMoveStage(d, e.target.value as any)}
                        className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold focus:outline-none"
                      >
                        {STAGES.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-right font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                      {formatINR(d.value)}
                    </td>
                    <td className="p-3 text-center font-bold">{d.probability}%</td>
                    <td className="p-3 text-slate-400">{d.expectedCloseDate || 'N/A'}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteDeal(d.id)}
                        className="text-rose-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                New Sales Deal Opportunity
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDealSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. City Care 120-Bed Medical Gas Pipeline & Vacuum"
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Client Hospital *</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  {Object.values(customers).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company || c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Estimated Value (₹) *</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value) || 0)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Initial Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    {STAGES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Win Probability (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={probability}
                    onChange={(e) => setProbability(Number(e.target.value) || 0)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Expected Close Date</label>
                  <input
                    type="date"
                    value={expectedCloseDate}
                    onChange={(e) => setExpectedCloseDate(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Technical Scope Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Requires 2 manifold racks, digital alarm panel, 40 Oxygen outlets"
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
