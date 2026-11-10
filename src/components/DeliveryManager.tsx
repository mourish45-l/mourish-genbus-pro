import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Calendar,
  Phone,
  MapPin,
  PackageCheck,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Trash2,
  Edit3,
  X,
  FileText,
  ShieldCheck,
  Navigation,
  UserCheck
} from 'lucide-react';
import { downloadHighQualityPdf } from '../utils/pdfGenerator';
import type { DeliveryChallan, DeliveryItem, CustomerRecord, BusinessProfile, Quotation, Invoice } from '../types';

interface DeliveryManagerProps {
  deliveries: Record<string, DeliveryChallan>;
  customers: Record<string, CustomerRecord>;
  quotations: Record<string, Quotation>;
  invoices: Record<string, Invoice>;
  businessProfile: BusinessProfile;
  currentUserEmail?: string;
  onSaveDelivery: (challan: Partial<DeliveryChallan>) => void;
  onDeleteDelivery: (id: string) => void;
}

const STATUS_CONFIG = {
  PREPARING: {
    label: 'Preparing Dispatch',
    bg: 'bg-amber-500/15',
    text: 'text-amber-800',
    border: 'border-amber-300',
    icon: Clock
  },
  DISPATCHED: {
    label: 'Dispatched',
    bg: 'bg-blue-500/15',
    text: 'text-blue-800',
    border: 'border-blue-300',
    icon: Truck
  },
  IN_TRANSIT: {
    label: 'In Transit',
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-800',
    border: 'border-indigo-300',
    icon: Navigation
  },
  DELIVERED: {
    label: 'Delivered',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    icon: CheckCircle2
  }
};

export const DeliveryManager: React.FC<DeliveryManagerProps> = ({
  deliveries,
  customers,
  quotations,
  invoices,
  businessProfile,
  onSaveDelivery,
  onDeleteDelivery
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | DeliveryChallan['status']>('ALL');
  const [editingChallan, setEditingChallan] = useState<Partial<DeliveryChallan> | null>(null);
  const [printingChallan, setPrintingChallan] = useState<DeliveryChallan | null>(null);

  const deliveryList = Object.values(deliveries || {}).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const filteredDeliveries = deliveryList.filter((d) => {
    const matchesSearch =
      (d.challanNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.carrierName || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.vehicleOrLrNumber || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const generateChallanNumber = () => {
    const count = Object.keys(deliveries || {}).length + 1;
    const year = new Date().getFullYear();
    return `DC-${year}-${String(count).padStart(3, '0')}`;
  };

  const handleOpenNew = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
    setEditingChallan({
      challanNumber: generateChallanNumber(),
      customerId: '',
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      dispatchDate: today,
      expectedDeliveryDate: nextWeek,
      carrierName: 'Dedicated Logistics / Direct Transit',
      vehicleOrLrNumber: '',
      driverContact: '',
      status: 'PREPARING',
      items: []
    });
  };

  const handleCustomerSelect = (customerId: string) => {
    const cust = customers[customerId];
    if (cust && editingChallan) {
      setEditingChallan({
        ...editingChallan,
        customerId: cust.id,
        customerName: cust.name,
        customerPhone: cust.phone,
        customerAddress: cust.address || ''
      });
    }
  };

  const handleAddItem = () => {
    if (!editingChallan) return;
    const currentItems = editingChallan.items || [];
    setEditingChallan({
      ...editingChallan,
      items: [...currentItems, { name: '', qtyDispatched: 1, unit: 'Nos', notes: '' }]
    });
  };

  const handleRemoveItem = (index: number) => {
    if (!editingChallan) return;
    const currentItems = [...(editingChallan.items || [])];
    currentItems.splice(index, 1);
    setEditingChallan({ ...editingChallan, items: currentItems });
  };

  const handleItemChange = (index: number, field: keyof DeliveryItem, value: string | number) => {
    if (!editingChallan) return;
    const currentItems = [...(editingChallan.items || [])];
    currentItems[index] = { ...currentItems[index], [field]: value };
    setEditingChallan({ ...editingChallan, items: currentItems });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChallan) return;
    if (!editingChallan.customerName || !editingChallan.challanNumber) {
      alert('Please fill in Customer Name and Challan Number');
      return;
    }
    onSaveDelivery(editingChallan);
    setEditingChallan(null);
  };

  const handleQuickStatusChange = (challan: DeliveryChallan, nextStatus: DeliveryChallan['status']) => {
    let updateData: Partial<DeliveryChallan> = { id: challan.id, status: nextStatus };
    if (nextStatus === 'DELIVERED') {
      const recipient = prompt('Enter name of receiving officer / store in-charge:', 'Store In-Charge');
      if (recipient) {
        updateData.receivedBy = recipient;
        updateData.deliveredAt = new Date().toISOString();
      }
    }
    onSaveDelivery(updateData);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-stone-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif">Delivery & Dispatch Management</h2>
              <p className="text-xs text-stone-500">Track shipments, GST Delivery Challans (Rule 55), LR Waybills & proof of delivery</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-2xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Delivery Challan</span>
        </button>
      </div>

      {/* Filter and stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'All Dispatches', count: deliveryList.length, status: 'ALL', color: 'border-stone-300' },
          { label: 'Preparing', count: deliveryList.filter((d) => d.status === 'PREPARING').length, status: 'PREPARING', color: 'border-amber-400' },
          { label: 'In Transit', count: deliveryList.filter((d) => d.status === 'IN_TRANSIT' || d.status === 'DISPATCHED').length, status: 'IN_TRANSIT', color: 'border-blue-400' },
          { label: 'Delivered', count: deliveryList.filter((d) => d.status === 'DELIVERED').length, status: 'DELIVERED', color: 'border-emerald-400' }
        ].map((stat) => (
          <button
            key={stat.status}
            onClick={() => setStatusFilter(stat.status as any)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              statusFilter === stat.status
                ? 'bg-white shadow-sm ring-2 ring-teal-600 border-transparent'
                : 'bg-white/60 hover:bg-white border-stone-200'
            }`}
          >
            <span className="text-xs font-medium text-stone-500 block">{stat.label}</span>
            <span className="text-2xl font-bold text-stone-900 mt-1 block">{stat.count}</span>
          </button>
        ))}
      </div>

      {/* Search and filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Challan #, Client, Vehicle, or Carrier..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PREPARING">Preparing</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      {/* Delivery Cards List */}
      {filteredDeliveries.length === 0 ? (
        <div className="p-12 text-center bg-white/70 rounded-3xl border border-dashed border-stone-300">
          <Truck className="w-12 h-12 text-stone-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-stone-800">No Delivery Challans Found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            {search || statusFilter !== 'ALL'
              ? 'Try modifying your search criteria or status filter.'
              : 'Create your first Delivery Challan to dispatch medical gas equipment, pipes, and accessories.'}
          </p>
          <button
            onClick={handleOpenNew}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-teal-700 text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="w-4 h-4" /> Create Challan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDeliveries.map((challan) => {
            const statusMeta = STATUS_CONFIG[challan.status] || STATUS_CONFIG.PREPARING;
            const StatusIcon = statusMeta.icon;
            const totalItemsCount = (challan.items || []).reduce((acc, i) => acc + (Number(i.qtyDispatched) || 0), 0);

            return (
              <div
                key={challan.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-stone-900 font-mono">{challan.challanNumber}</span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusMeta.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-stone-800 mt-1">{challan.customerName}</h4>
                      {challan.customerPhone && (
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {challan.customerPhone}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPrintingChallan(challan)}
                        title="Print Rule 55 GST Delivery Challan"
                        className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingChallan(challan)}
                        title="Edit Delivery"
                        className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete delivery challan ${challan.challanNumber}?`)) {
                            onDeleteDelivery(challan.id);
                          }
                        }}
                        title="Delete Delivery"
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Logistics Detail Strip */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-100 mb-3">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Carrier / Vehicle</span>
                      <span className="font-semibold text-stone-800 truncate block">
                        {challan.carrierName || 'Direct'}
                      </span>
                      <span className="text-stone-600 font-mono text-[11px] block mt-0.5">
                        {challan.vehicleOrLrNumber ? `LR: ${challan.vehicleOrLrNumber}` : 'Local Delivery'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Dates</span>
                      <span className="text-stone-700 block">
                        Dispatched: <strong className="text-stone-900">{challan.dispatchDate}</strong>
                      </span>
                      <span className="text-stone-500 block">
                        Est. Arrival: <strong className="text-stone-800">{challan.expectedDeliveryDate}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Dispatched items list preview */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1.5">
                      <span>Dispatched Goods ({challan.items?.length || 0} line items)</span>
                      <span className="font-semibold text-stone-700">{totalItemsCount} units total</span>
                    </div>
                    <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                      {(challan.items || []).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-stone-100/70 px-2.5 py-1 rounded-xl">
                          <span className="text-stone-700 truncate font-medium">{item.name}</span>
                          <span className="text-stone-900 font-bold ml-2 shrink-0">
                            {item.qtyDispatched} {item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {challan.receivedBy && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 mb-3">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Received by: <strong>{challan.receivedBy}</strong></span>
                    </div>
                  )}
                </div>

                {/* Quick Status Advance Buttons */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-400 font-medium">Quick Advance:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {challan.status === 'PREPARING' && (
                      <button
                        onClick={() => handleQuickStatusChange(challan, 'DISPATCHED')}
                        className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-semibold"
                      >
                        Mark Dispatched
                      </button>
                    )}
                    {challan.status === 'DISPATCHED' && (
                      <button
                        onClick={() => handleQuickStatusChange(challan, 'IN_TRANSIT')}
                        className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 text-xs font-semibold"
                      >
                        Mark In-Transit
                      </button>
                    )}
                    {(challan.status === 'DISPATCHED' || challan.status === 'IN_TRANSIT') && (
                      <button
                        onClick={() => handleQuickStatusChange(challan, 'DELIVERED')}
                        className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold"
                      >
                        Mark Delivered ✓
                      </button>
                    )}
                    {challan.status === 'DELIVERED' && (
                      <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      {editingChallan && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-serif">
                    {editingChallan.id ? 'Edit Delivery Challan' : 'Create Delivery Challan'}
                  </h3>
                  <p className="text-xs text-stone-500">CGST Rule 55 compliant material dispatch document</p>
                </div>
              </div>
              <button
                onClick={() => setEditingChallan(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Challan Number *</label>
                  <input
                    type="text"
                    required
                    value={editingChallan.challanNumber || ''}
                    onChange={(e) => setEditingChallan({ ...editingChallan, challanNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Dispatch Date</label>
                  <input
                    type="date"
                    value={editingChallan.dispatchDate || ''}
                    onChange={(e) => setEditingChallan({ ...editingChallan, dispatchDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={editingChallan.expectedDeliveryDate || ''}
                    onChange={(e) => setEditingChallan({ ...editingChallan, expectedDeliveryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm"
                  />
                </div>
              </div>

              {/* Customer selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Select Registered Customer</label>
                  <select
                    value={editingChallan.customerId || ''}
                    onChange={(e) => handleCustomerSelect(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm"
                  >
                    <option value="">-- Choose Existing Customer --</option>
                    {Object.values(customers).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Customer / Consignee Name *</label>
                  <input
                    type="text"
                    required
                    value={editingChallan.customerName || ''}
                    onChange={(e) => setEditingChallan({ ...editingChallan, customerName: e.target.value })}
                    placeholder="Client / Organization Name"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Customer Phone (for discovery)</label>
                  <input
                    type="text"
                    value={editingChallan.customerPhone || ''}
                    onChange={(e) => setEditingChallan({ ...editingChallan, customerPhone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Delivery Destination Address</label>
                  <input
                    type="text"
                    value={editingChallan.customerAddress || ''}
                    onChange={(e) => setEditingChallan({ ...editingChallan, customerAddress: e.target.value })}
                    placeholder="Delivery site / destination address"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm"
                  />
                </div>
              </div>

              {/* Carrier info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Transporter / Carrier</label>
                  <input
                    type="text"
                    value={editingChallan.carrierName || ''}
                    onChange={(e) => setEditingChallan({ ...editingChallan, carrierName: e.target.value })}
                    placeholder="e.g. VRL Logistics / Direct Truck"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Vehicle No. / LR Waybill #</label>
                  <input
                    type="text"
                    value={editingChallan.vehicleOrLrNumber || ''}
                    onChange={(e) => setEditingChallan({ ...editingChallan, vehicleOrLrNumber: e.target.value })}
                    placeholder="TN 01 AB 1234 / LR# 88412"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Status</label>
                  <select
                    value={editingChallan.status || 'PREPARING'}
                    onChange={(e) => setEditingChallan({ ...editingChallan, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-semibold text-stone-800"
                  >
                    <option value="PREPARING">Preparing</option>
                    <option value="DISPATCHED">Dispatched</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Dispatched items section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Dispatched Items / Material Checklist
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {(editingChallan.items || []).map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <div className="col-span-6">
                        <input
                          type="text"
                          required
                          placeholder="Item / Material Description (e.g. Industrial Valves, Electronics, Hardware Units)"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Qty"
                          value={item.qtyDispatched}
                          onChange={(e) => handleItemChange(index, 'qtyDispatched', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-center font-bold"
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-stone-200 text-xs"
                        >
                          <option value="Nos">Nos</option>
                          <option value="Meters">Meters</option>
                          <option value="Sets">Sets</option>
                          <option value="Lots">Lots</option>
                          <option value="Cylinders">Cylinders</option>
                          <option value="Kits">Kits</option>
                        </select>
                      </div>
                      <div className="col-span-2 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingChallan(null)}
                  className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-2xl shadow-sm transition-all"
                >
                  Save Delivery Challan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Delivery Challan Modal (GST Rule 55 compliant) */}
      {printingChallan && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-8 shadow-2xl border border-stone-200 my-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6 print:hidden">
              <span className="text-sm font-semibold text-stone-500">Print Preview: GST Delivery Challan</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadHighQualityPdf('printableDeliveryDoc', `Delivery_Challan_${printingChallan.challanNumber}`)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 shadow-md transition"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
                >
                  <Printer className="w-4 h-4" /> Print Document
                </button>
                <button
                  onClick={() => setPrintingChallan(null)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official GST Rule 55 Delivery Challan Document */}
            <div id="printableDeliveryDoc" className="border border-stone-800 p-8 rounded-xl bg-white text-stone-900">
              <div className="text-center pb-4 border-b-2 border-stone-800">
                <h2 className="text-xl font-bold uppercase tracking-wider font-serif">DELIVERY CHALLAN</h2>
                <p className="text-xs text-stone-600 mt-0.5">(Issued under Rule 55 of Central Goods and Services Tax Rules, 2017)</p>
              </div>

              {/* Consignor and Consignee */}
              <div className="grid grid-cols-2 border-b border-stone-800 py-4 text-xs gap-4">
                <div className="border-r border-stone-800 pr-4">
                  <h4 className="font-bold text-stone-900 uppercase">Consignor (Supplier):</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {businessProfile.logoUrl ? (
                      <img src={businessProfile.logoUrl} alt="Logo" className="w-9 h-9 object-contain rounded-lg border border-stone-200 p-0.5 bg-white" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        {businessProfile.name?.charAt(0) || 'B'}
                      </div>
                    )}
                    <p className="font-bold text-stone-900 text-sm">{businessProfile.name}</p>
                  </div>
                  <p className="text-stone-700 whitespace-pre-line mt-1">{businessProfile.address}</p>
                  <p className="mt-1 font-semibold">GSTIN: <span className="font-mono">{businessProfile.gstin}</span></p>
                  <p>Phone: {businessProfile.phone} | Email: {businessProfile.email}</p>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 uppercase">Consignee (Recipient):</h4>
                  <p className="font-bold text-stone-900 text-sm mt-1">{printingChallan.customerName}</p>
                  <p className="text-stone-700 whitespace-pre-line mt-0.5">{printingChallan.customerAddress || 'Customer Destination Site'}</p>
                  <p className="mt-1 font-semibold">Contact: {printingChallan.customerPhone || 'N/A'}</p>
                </div>
              </div>

              {/* Challan Meta & Transporter */}
              <div className="grid grid-cols-4 border-b border-stone-800 py-3 text-xs bg-stone-50 gap-2">
                <div>
                  <span className="text-stone-500 block">Challan No.:</span>
                  <span className="font-bold font-mono text-stone-900">{printingChallan.challanNumber}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Dispatch Date:</span>
                  <span className="font-bold text-stone-900">{printingChallan.dispatchDate}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Carrier / Transporter:</span>
                  <span className="font-bold text-stone-900">{printingChallan.carrierName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Vehicle / LR No.:</span>
                  <span className="font-bold font-mono text-stone-900">{printingChallan.vehicleOrLrNumber || 'Local Dispatch'}</span>
                </div>
              </div>

              {/* Dispatched items table */}
              <table className="w-full text-xs mt-4 border-collapse">
                <thead>
                  <tr className="border-b-2 border-stone-800 bg-stone-100 text-stone-800 font-bold">
                    <th className="py-2 px-3 text-left w-12">#</th>
                    <th className="py-2 px-3 text-left">Description of Goods</th>
                    <th className="py-2 px-3 text-center w-24">Quantity</th>
                    <th className="py-2 px-3 text-center w-20">Unit</th>
                    <th className="py-2 px-3 text-left w-48">Remarks / Specs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {(printingChallan.items || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-3 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-stone-900">{item.name}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-stone-900">{item.qtyDispatched}</td>
                      <td className="py-2.5 px-3 text-center text-stone-700">{item.unit}</td>
                      <td className="py-2.5 px-3 text-stone-500">{item.notes || 'As per Purchase Order'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Rule 55 Declarations */}
              <div className="mt-8 border-t border-stone-800 pt-4 text-[11px] text-stone-600">
                <p className="font-semibold text-stone-800">Reason for Transportation: Supply of Goods / Materials as per Confirmed Purchase Order.</p>
                <p className="mt-0.5">We hereby certify that the goods mentioned above are being transported under Rule 55 of CGST Rules, 2017.</p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 pt-12 text-xs">
                <div>
                  <div className="border-t border-dashed border-stone-400 w-48 pt-2">
                    <p className="font-bold text-stone-800">Receiver's Signature & Seal</p>
                    <p className="text-[10px] text-stone-500">Received above goods in intact condition</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="border-t border-dashed border-stone-400 w-48 pt-2 text-right">
                    <p className="font-bold text-stone-800">For {businessProfile.name}</p>
                    <p className="text-stone-600 mt-1">{businessProfile.signatoryName}</p>
                    <p className="text-[10px] text-stone-500">{businessProfile.signatoryTitle || 'Authorized Signatory'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
