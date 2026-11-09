import React, { useState } from 'react';
import type { CustomerRecord } from '../types';
import { UserPlus, MessageSquare, Phone, Mail, Building, Trash2, Edit2, Sparkles, PlusCircle } from 'lucide-react';
import { COMMON_INDIAN_HOSPITALS } from '../utils/indianHospitals';

interface Props {
  customers: Record<string, CustomerRecord>;
  onSaveCustomer: (cust: Partial<CustomerRecord>) => void;
  onDeleteCustomer: (id: string) => void;
  onOpenCustomerChat: (id: string) => void;
  editorName: string;
}

export const CustomerCrm: React.FC<Props> = ({
  customers,
  onSaveCustomer,
  onDeleteCustomer,
  onOpenCustomerChat,
  editorName,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  const handleLoadIndianHospitals = () => {
    COMMON_INDIAN_HOSPITALS.forEach((hosp) => {
      onSaveCustomer(hosp);
    });
  };

  const handleSelectPreset = (h: CustomerRecord) => {
    setName(h.name);
    setPhone(h.phone);
    setEmail(h.email);
    setCompany(h.company);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveCustomer({
      id: editingId || undefined,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      company: company.trim() || 'Client Organization',
      updatedBy: editorName,
    });

    setEditingId(null);
    setName('');
    setPhone('');
    setEmail('');
    setCompany('');
  };

  const handleEdit = (c: CustomerRecord) => {
    setEditingId(c.id);
    setName(c.name);
    setPhone(c.phone);
    setEmail(c.email);
    setCompany(c.company);
  };

  const custList = Object.values(customers);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Customer Directory & Hospital CRM
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Registered Indian hospitals can use their Phone or Email in the Free Customer Portal to view finalized quotations, invoices, dispatches, and SHA-256 chat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadIndianHospitals}
            className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1.5 transition"
            title="Import all verified Indian Hospitals (Apollo, Kauvery, KMCH, MMHRC, SRMC, GRH, etc.)"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Load Common Indian Hospitals</span>
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold px-2">
            {custList.length} Registered
          </span>
        </div>
      </div>

      {/* Quick Indian Hospital Preset Chips */}
      <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          Quick Preset: Authentic Indian Hospitals
        </span>
        <div className="flex flex-wrap gap-2">
          {COMMON_INDIAN_HOSPITALS.slice(0, 6).map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => handleSelectPreset(h)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-xs transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>{h.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add / Edit Customer Form */}
      <form
        onSubmit={handleSubmit}
        className="p-5 rounded-[28px] liquid-card border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 md:grid-cols-5 gap-3 items-end shadow-md"
      >
        <div>
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
            Hospital / Healthcare Entity Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Apollo Speciality Hospitals / Kauvery Hospital"
            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
            Phone Number (Lookup Key)
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9659233313"
            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@lifegassystem.in"
            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
            City / Organization
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Tamil Nadu, India"
            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            {editingId ? 'Update Client' : '+ Add Client'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName('');
                setPhone('');
                setEmail('');
                setCompany('');
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Customers Cards Grid */}
      {custList.length === 0 ? (
        <div className="p-12 text-center rounded-[28px] liquid-card border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          No customer profiles registered yet. Use the form above to add your first customer so they can view finalized quotations in the Free Customer Portal.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {custList.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-[24px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm hover:border-indigo-500/40 transition-all"
            >
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {c.name}
              </h4>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                {c.company || 'Partner'}
              </span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                <span>{c.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span className="truncate">{c.email || 'No email registered'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleEdit(c)}
                className="flex-1 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onOpenCustomerChat(c.id)}
                className="flex-1 py-1.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center gap-1 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Chat
              </button>
              <button
                onClick={() => onDeleteCustomer(c.id)}
                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                title="Delete customer record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

    </div>
  );
};
