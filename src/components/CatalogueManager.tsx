import React, { useState } from 'react';
import type { CatalogueItem } from '../types';
import { Plus, Edit2, Trash2, Tag, IndianRupee, Layers } from 'lucide-react';

interface Props {
  catalogue: Record<string, CatalogueItem>;
  onSaveItem: (item: Partial<CatalogueItem>) => void;
  onDeleteItem: (id: string) => void;
  editorName: string;
}

export const CatalogueManager: React.FC<Props> = ({
  catalogue,
  onSaveItem,
  onDeleteItem,
  editorName,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [rate, setRate] = useState<number | ''>('');
  const [gst, setGst] = useState<number | ''>(18);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveItem({
      id: editingId || undefined,
      name: name.trim(),
      category: category.trim() || 'General Infrastructure',
      rate: Number(rate) || 0,
      gst: Number(gst) || 18,
      updatedBy: editorName,
    });

    // Reset form
    setEditingId(null);
    setName('');
    setCategory('');
    setRate('');
    setGst(18);
  };

  const handleEdit = (item: CatalogueItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setRate(item.rate);
    setGst(item.gst);
  };

  const catList = Object.values(catalogue);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Product & Service Catalogue
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define standardized equipment, manifold pipelines, and software line items to insert into quotations with 1-click.
          </p>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          {catList.length} Items Live in Singapore RTDB
        </span>
      </div>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="p-5 rounded-[28px] liquid-card border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 md:grid-cols-6 gap-3 items-end shadow-md"
      >
        <div className="md:col-span-2">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
            Item / Specification Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Medical Oxygen Manifold Pipeline System"
            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Healthcare / Web"
            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
            Base Unit Rate (₹)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="145000"
            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
            GST Tax %
          </label>
          <input
            type="number"
            value={gst}
            onChange={(e) => setGst(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="18"
            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
          >
            {editingId ? 'Update Item' : '+ Add Item'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName('');
                setCategory('');
                setRate('');
                setGst(18);
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Catalogue Grid */}
      {catList.length === 0 ? (
        <div className="p-12 text-center rounded-[28px] liquid-card border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          No items in catalogue yet. Fill in the form above and click "+ Add Item" to register your first product or service.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {catList.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-[24px] liquid-card border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all shadow-sm"
            >
            <div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {item.category || 'General'}
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2 leading-snug">
                {item.name}
              </h4>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                ₹{Number(item.rate).toLocaleString('en-IN')}{' '}
                <span className="text-xs text-slate-400 font-normal">+ {item.gst}% GST</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleEdit(item)}
                className="flex-1 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                title="Delete from catalogue"
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
