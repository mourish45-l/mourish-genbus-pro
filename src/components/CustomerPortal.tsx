import React, { useState, useMemo } from 'react';
import type {
  CustomerRecord,
  Quotation,
  Invoice,
  DeliveryChallan,
  BusinessProfile,
  ChatMessage
} from '../types';
import { formatINR } from '../utils/crypto';
import {
  Search,
  Printer,
  CheckCircle2,
  Phone,
  Mail,
  Building2,
  FileText,
  Receipt,
  Truck,
  MessageSquare,
  Bell,
  ArrowRight,
  ShieldCheck,
  Clock,
  Navigation,
  UserCheck,
  RotateCcw,
  Package,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ChatHub } from './ChatHub';

interface Props {
  customers: Record<string, CustomerRecord>;
  quotations: Record<string, Quotation>;
  invoices: Record<string, Invoice>;
  deliveries: Record<string, DeliveryChallan>;
  businessProfile: BusinessProfile;
  messages: Record<string, ChatMessage>;
  fcmToken?: string | null;
  onEnableFcm?: () => void;
  onSendMessage: (text: string, filePayload?: { fileName: string; fileType: string; fileData: string }) => void;
  onEditMessage: (msgId: string, newText: string) => void;
  onDeleteMessage: (msgId: string) => void;
  onUpdateCustomerSelf: (custId: string, name: string, phone: string, email: string) => void;
  onApproveQuote?: (quoteId: string, signatoryName: string) => void;
}

export interface BusinessEntityOption {
  bizId: string;
  name: string;
  division: string;
  gstin: string;
  phone: string;
  address: string;
  bankName: string;
  bankAccountNo: string;
  bankIfsc: string;
  bankBranch: string;
  signatoryName: string;
  signatoryTitle: string;
  logoIcon: string;
}

export const CustomerPortal: React.FC<Props> = ({
  customers,
  quotations,
  invoices,
  deliveries,
  businessProfile,
  messages,
  fcmToken,
  onEnableFcm,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onUpdateCustomerSelf,
  onApproveQuote
}) => {
  // Phone input & discovery state
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [searchedPhone, setSearchedPhone] = useState<string | null>(null);
  const [selectedBiz, setSelectedBiz] = useState<BusinessEntityOption | null>(null);

  // Portal view state
  const [activePortalTab, setActivePortalTab] = useState<'quotes' | 'invoices' | 'deliveries' | 'chat'>('quotes');
  const [approvingQuoteId, setApprovingQuoteId] = useState<string | null>(null);
  const [signatoryInput, setSignatoryInput] = useState('');
  const [printingDelivery, setPrintingDelivery] = useState<DeliveryChallan | null>(null);

  // Available business entities in Mourish GenBus ecosystem
  const availableBusinesses: BusinessEntityOption[] = useMemo(() => [
    {
      bizId: businessProfile.bizId || 'mourish_developers_hq',
      name: businessProfile.name || 'Mourish Developers & Life Gas System',
      division: 'Hospital MGPS, Modular OT & Turnkey Healthcare Engineering',
      gstin: businessProfile.gstin || '33CQLPT6813M1Z7',
      phone: businessProfile.phone || '9659233313 / 9487410078',
      address: businessProfile.address || 'Medical Gas Pipeline (MGPS), Modular OT, Hospital Fire Safety & Digital Solutions, Tamil Nadu, India',
      bankName: businessProfile.bankName || 'HDFC Bank',
      bankAccountNo: businessProfile.bankAccountNo || '50200084920193',
      bankIfsc: businessProfile.bankIfsc || 'HDFC0001824',
      bankBranch: businessProfile.bankBranch || 'Commercial Branch, Tamil Nadu',
      signatoryName: businessProfile.signatoryName || 'Mourish Nithin',
      signatoryTitle: businessProfile.signatoryTitle || 'Managing Director',
      logoIcon: 'bx-plus-medical'
    },
    {
      bizId: 'lifegas_healthcare_services',
      name: 'Life Gas Healthcare Infrastructure',
      division: 'Cryogenic Liquid Oxygen, Gas Manifolds & PSA Plants',
      gstin: '33AABCL9921D1ZY',
      phone: '9659233313',
      address: 'Industrial Gas & Healthcare Infrastructure Division, Tamil Nadu',
      bankName: 'HDFC Bank',
      bankAccountNo: '50200084920193',
      bankIfsc: 'HDFC0001824',
      bankBranch: 'Commercial Branch, Tamil Nadu',
      signatoryName: 'Mourish Nithin',
      signatoryTitle: 'Lead Engineer',
      logoIcon: 'bx-shield-plus'
    },
    {
      bizId: 'mourish_digital_labs',
      name: 'Mourish Digital & Tech Labs',
      division: 'Hospital Telemetry, Gas Alarm Monitoring & Cloud ERP',
      gstin: '33CQLPT6813M1Z7',
      phone: '9487410078',
      address: 'Cloud Healthcare Automation & Sensor Telemetry Labs, Tamil Nadu',
      bankName: 'HDFC Bank',
      bankAccountNo: '50200084920193',
      bankIfsc: 'HDFC0001824',
      bankBranch: 'Commercial Branch, Tamil Nadu',
      signatoryName: 'Mourish Nithin',
      signatoryTitle: 'Chief Technology Officer',
      logoIcon: 'bx-code-alt'
    }
  ], [businessProfile]);

  // Clean phone helper
  const cleanPhone = (p?: string) => (p || '').replace(/[^0-9]/g, '');

  // Find customer match for searched phone
  const matchedCustomer = useMemo(() => {
    if (!searchedPhone) return null;
    const cleanSearch = cleanPhone(searchedPhone);
    if (!cleanSearch) return null;

    return Object.values(customers).find((c) => {
      const cClean = cleanPhone(c.phone);
      return cClean.includes(cleanSearch) || cleanSearch.includes(cClean);
    }) || null;
  }, [customers, searchedPhone]);

  // Find counts per business for this phone
  const getBusinessStats = (bizId: string) => {
    const custId = matchedCustomer?.id;
    const cleanSearch = searchedPhone ? cleanPhone(searchedPhone) : '';

    const quotesCount = Object.values(quotations).filter((q) => {
      const matchCust = custId && q.customerId === custId;
      return matchCust && (q.status === 'FINALIZED' || q.status === 'APPROVED');
    }).length;

    const invoicesCount = Object.values(invoices).filter((inv) => {
      return custId && inv.customerId === custId;
    }).length;

    const deliveriesCount = Object.values(deliveries).filter((d) => {
      const phoneMatch = d.customerPhone && cleanPhone(d.customerPhone).includes(cleanSearch);
      const custMatch = custId && d.customerId === custId;
      return phoneMatch || custMatch;
    }).length;

    return { quotesCount, invoicesCount, deliveriesCount };
  };

  const handleSearchPhone = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = cleanPhone(phoneNumberInput);
    if (!clean || clean.length < 4) {
      alert('Please enter a valid phone number (at least 4 digits, e.g. 9659233313)');
      return;
    }
    setSearchedPhone(phoneNumberInput.trim());
    // Auto-select primary business
    setSelectedBiz(availableBusinesses[0]);
  };

  // Filtered records for the selected business & customer
  const customerQuotes = useMemo(() => {
    if (!matchedCustomer) return [];
    return Object.values(quotations).filter(
      (q) => q.customerId === matchedCustomer.id && (q.status === 'FINALIZED' || q.status === 'APPROVED' || q.customerApproved)
    );
  }, [quotations, matchedCustomer]);

  const customerInvoices = useMemo(() => {
    if (!matchedCustomer) return [];
    return Object.values(invoices).filter((inv) => inv.customerId === matchedCustomer.id);
  }, [invoices, matchedCustomer]);

  const customerDeliveries = useMemo(() => {
    const cleanSearch = searchedPhone ? cleanPhone(searchedPhone) : '';
    const custId = matchedCustomer?.id;
    return Object.values(deliveries).filter((d) => {
      const phoneMatch = cleanSearch && d.customerPhone && cleanPhone(d.customerPhone).includes(cleanSearch);
      const custMatch = custId && d.customerId === custId;
      return phoneMatch || custMatch;
    });
  }, [deliveries, matchedCustomer, searchedPhone]);

  const handleConfirmApproval = (quoteId: string) => {
    if (!onApproveQuote) return;
    onApproveQuote(quoteId, signatoryInput.trim() || matchedCustomer?.name || 'Authorized Hospital Officer');
    setApprovingQuoteId(null);
    setSignatoryInput('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* FCM Status Notification Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-indigo-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Bell className="w-5 h-5 text-teal-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-teal-300">
                Firebase Cloud Messaging
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-teal-400/20 text-teal-200 border border-teal-400/30">
                Project: Mourish GenBus
              </span>
            </div>
            <p className="text-xs text-teal-100 mt-0.5">
              Receive live push alerts on Quotation Approvals, GST Invoices, and Delivery Transit Milestones.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {fcmToken ? (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Live Push Notifications Active</span>
            </div>
          ) : (
            <button
              onClick={onEnableFcm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-teal-900 font-bold text-xs hover:bg-teal-50 transition-all shadow-md"
            >
              <Bell className="w-4 h-4 text-teal-700" />
              <span>Enable Push Notifications</span>
            </button>
          )}
        </div>
      </div>

      {/* Step 1: Customer Phone Number Entry */}
      <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] border border-stone-200/90 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-700 border border-teal-500/20">
              Hospital & Healthcare Client Self-Service Portal
            </span>
            <h2 className="text-2xl font-bold text-stone-900 font-serif mt-2">
              Enter Your Phone Number to Access Your Business Orders
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl">
              Enter your registered contact number to discover all active business entities within Mourish GenBus that have finalized quotations, tax invoices, and live dispatches for your facility.
            </p>
          </div>

          <form onSubmit={handleSearchPhone} className="flex w-full md:w-auto items-center gap-2">
            <div className="relative flex-1 md:w-80">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="tel"
                value={phoneNumberInput}
                onChange={(e) => setPhoneNumberInput(e.target.value)}
                placeholder="e.g. 9659233313"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-300 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow-md shadow-teal-700/20 transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Discover</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Step 2: Available Businesses List for this Phone Number */}
      {searchedPhone && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif">
                Available Businesses Using Phone Number: <span className="font-mono text-teal-700">{searchedPhone}</span>
              </h3>
              <p className="text-xs text-stone-500">
                {matchedCustomer
                  ? `Identified Customer: ${matchedCustomer.name} (${matchedCustomer.company || 'Healthcare Client'})`
                  : 'Select a business division to review documents, dispatches, and open chat'}
              </p>
            </div>

            <button
              onClick={() => {
                setSearchedPhone(null);
                setPhoneNumberInput('');
              }}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-stone-100"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Search
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableBusinesses.map((biz) => {
              const isSelected = selectedBiz?.bizId === biz.bizId;
              const stats = getBusinessStats(biz.bizId);

              return (
                <div
                  key={biz.bizId}
                  onClick={() => setSelectedBiz(biz)}
                  className={`p-5 rounded-3xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white ring-2 ring-teal-600 border-transparent shadow-md'
                      : 'bg-white/70 hover:bg-white border-stone-200 hover:border-teal-300 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg border border-teal-100">
                        <Building2 className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-600 text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-stone-900 text-sm leading-tight">{biz.name}</h4>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{biz.division}</p>

                    <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-600 space-y-0.5">
                      <div>GSTIN: <span className="font-mono font-semibold">{biz.gstin}</span></div>
                      <div>Contact: <span className="font-mono">{biz.phone}</span></div>
                    </div>
                  </div>

                  {/* Badges for records */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-semibold border border-teal-200">
                      {stats.quotesCount} Finalized Quotes
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 text-[11px] font-semibold border border-indigo-200">
                      {stats.invoicesCount} Invoices
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200">
                      {stats.deliveriesCount} Deliveries
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Selected Business Customer Dashboard */}
      {selectedBiz && searchedPhone && (
        <div className="space-y-6">

          {/* Navigation Tabs for Selected Business */}
          <div className="bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-600/20">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 font-serif">{selectedBiz.name}</h3>
                <p className="text-xs text-stone-500">
                  {matchedCustomer ? `Viewing records for ${matchedCustomer.name}` : `Linked to phone ${searchedPhone}`}
                </p>
              </div>
            </div>

            {/* 4 Tabs: Quotes, Invoices, Deliveries, Chat */}
            <div className="flex items-center gap-1 bg-stone-100 p-1.5 rounded-2xl text-xs font-bold overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setActivePortalTab('quotes')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activePortalTab === 'quotes'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Finalized Quotes ({customerQuotes.length})</span>
              </button>

              <button
                onClick={() => setActivePortalTab('invoices')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activePortalTab === 'invoices'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Tax Invoices ({customerInvoices.length})</span>
              </button>

              <button
                onClick={() => setActivePortalTab('deliveries')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activePortalTab === 'deliveries'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Deliveries ({customerDeliveries.length})</span>
              </button>

              <button
                onClick={() => setActivePortalTab('chat')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activePortalTab === 'chat'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>SHA-256 Chat</span>
              </button>
            </div>
          </div>

          {/* TAB 1: FINALIZED QUOTATIONS */}
          {activePortalTab === 'quotes' && (
            <div className="space-y-4">
              {customerQuotes.length === 0 ? (
                <div className="p-12 text-center bg-white/70 rounded-3xl border border-dashed border-stone-300">
                  <FileText className="w-12 h-12 text-stone-400 mx-auto mb-3 opacity-60" />
                  <h4 className="text-sm font-semibold text-stone-800">No Finalized Quotations Found</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                    There are no finalized proposals currently published for this customer record. Please reach out to our engineering desk via the Chat tab for a tailored hospital quote.
                  </p>
                </div>
              ) : (
                customerQuotes.map((q) => {
                  let sub = 0;
                  let tax = 0;
                  (q.items || []).forEach((it) => {
                    const line = (Number(it.qty) || 0) * (Number(it.rate) || 0);
                    sub += line;
                    tax += line * ((Number(it.gst) || 0) / 100);
                  });
                  const grand = Math.max(0, sub + tax - Number(q.discount || 0));

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-base text-stone-900">{q.quoteNumber}</span>
                            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                              FINALIZED PROPOSAL
                            </span>
                            {q.customerApproved && (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-700 text-white flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Approved by {q.customerSignatory || 'Hospital'}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-stone-800 mt-1">{q.title}</h4>
                          <p className="text-xs text-stone-400">Valid Until: {q.validUntil || '30 Days'}</p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-stone-500 block">Total Payable (incl. GST)</span>
                          <span className="text-2xl font-black text-teal-700 font-mono block">
                            {formatINR(grand)}
                          </span>
                        </div>
                      </div>

                      {/* Items table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-stone-100 text-[10px] uppercase text-stone-500 bg-stone-50">
                              <th className="py-2 px-3">Item Description</th>
                              <th className="py-2 px-3 text-center">HSN</th>
                              <th className="py-2 px-3 text-center">Qty</th>
                              <th className="py-2 px-3 text-right">Unit Rate</th>
                              <th className="py-2 px-3 text-right">GST</th>
                              <th className="py-2 px-3 text-right">Line Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {(q.items || []).map((item, idx) => {
                              const lineRaw = (Number(item.qty) || 0) * (Number(item.rate) || 0);
                              const lineTax = lineRaw * ((Number(item.gst) || 0) / 100);
                              return (
                                <tr key={idx} className="hover:bg-stone-50/50">
                                  <td className="py-2.5 px-3 font-semibold text-stone-900">{item.name}</td>
                                  <td className="py-2.5 px-3 text-center font-mono text-stone-500">{item.hsn || '9019'}</td>
                                  <td className="py-2.5 px-3 text-center font-bold text-stone-800">{item.qty} {item.unit || 'Nos'}</td>
                                  <td className="py-2.5 px-3 text-right font-mono">{formatINR(item.rate)}</td>
                                  <td className="py-2.5 px-3 text-right font-mono text-stone-600">{item.gst}%</td>
                                  <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                                    {formatINR(lineRaw + lineTax)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {q.notes && (
                        <div className="p-3 rounded-2xl bg-stone-50 text-xs text-stone-600 border border-stone-100">
                          <strong>Terms & Milestones:</strong> {q.notes}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 flex items-center gap-1.5"
                        >
                          <Printer className="w-4 h-4" /> Print / Save PDF
                        </button>

                        {!q.customerApproved && onApproveQuote && (
                          <div className="flex items-center gap-2">
                            {approvingQuoteId === q.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={signatoryInput}
                                  onChange={(e) => setSignatoryInput(e.target.value)}
                                  placeholder="Signatory Name (e.g. Dr. Rajesh / Biomed Head)"
                                  className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                                />
                                <button
                                  onClick={() => handleConfirmApproval(q.id)}
                                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                                >
                                  <CheckCircle2 className="w-4 h-4" /> Confirm Sign-Off
                                </button>
                                <button
                                  onClick={() => setApprovingQuoteId(null)}
                                  className="text-xs text-stone-400 hover:text-stone-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setApprovingQuoteId(q.id);
                                  setSignatoryInput(matchedCustomer?.name || 'Hospital Authority');
                                }}
                                className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20"
                              >
                                <CheckCircle2 className="w-4 h-4" /> Approve Proposal Online
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: TAX INVOICES & OFFICIAL BANK NEFT */}
          {activePortalTab === 'invoices' && (
            <div className="space-y-4">
              {/* Official Bank Remittance Details (Zero UPI) */}
              <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold uppercase tracking-wider text-[11px]">
                  <Building2 className="w-4 h-4 text-indigo-700" />
                  <span>Official Enterprise Bank NEFT / RTGS Remittance Account</span>
                </div>
                <p className="text-stone-600 text-xs">
                  Remit invoice payments directly through institutional RTGS/NEFT to our verified corporate bank account:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-2xl border border-indigo-100 font-medium">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Bank Name</span>
                    <strong className="text-stone-900 text-xs">{selectedBiz.bankName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Account Number</span>
                    <strong className="text-stone-900 font-mono text-xs">{selectedBiz.bankAccountNo}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">IFSC Code</span>
                    <strong className="text-stone-900 font-mono text-xs">{selectedBiz.bankIfsc}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Branch</span>
                    <strong className="text-stone-900 text-xs">{selectedBiz.bankBranch}</strong>
                  </div>
                </div>
              </div>

              {customerInvoices.length === 0 ? (
                <div className="p-12 text-center bg-white/70 rounded-3xl border border-dashed border-stone-300">
                  <Receipt className="w-12 h-12 text-stone-400 mx-auto mb-3 opacity-60" />
                  <h4 className="text-sm font-semibold text-stone-800">No Invoices Issued</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                    No tax invoices have been generated for your hospital account under this business division.
                  </p>
                </div>
              ) : (
                customerInvoices.map((inv) => {
                  let sub = 0;
                  let tax = 0;
                  (inv.items || []).forEach((it) => {
                    const line = (Number(it.qty) || 0) * (Number(it.rate) || 0);
                    sub += line;
                    tax += line * ((Number(it.gst) || 0) / 100);
                  });
                  const grand = Math.max(0, sub + tax - Number(inv.discount || 0));
                  const paid = Number(inv.paidAmount || 0);
                  const bal = Math.max(0, grand - paid);

                  return (
                    <div
                      key={inv.id}
                      className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-base text-stone-900">{inv.invoiceNumber}</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                                inv.status === 'PAID'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : inv.status === 'PARTIAL'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Issue Date: {inv.issueDate} · Due Date: {inv.dueDate}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-stone-500 block">Balance Due</span>
                          <span className="text-2xl font-black text-rose-600 font-mono block">
                            {formatINR(bal)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {(inv.items || []).map((it, idx) => (
                          <div key={idx} className="flex justify-between py-1 border-b border-stone-50">
                            <span className="text-stone-700 font-medium">
                              {it.qty}x {it.name}
                            </span>
                            <span className="font-mono font-bold text-stone-900">
                              {formatINR((Number(it.qty) || 0) * (Number(it.rate) || 0))}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 flex items-center gap-1.5"
                        >
                          <Printer className="w-4 h-4" /> Print Tax Invoice
                        </button>
                        <div className="text-xs text-stone-500">
                          Invoice Total: <strong className="text-stone-900">{formatINR(grand)}</strong> (Paid: {formatINR(paid)})
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: DELIVERIES & DISPATCH TRACKING */}
          {activePortalTab === 'deliveries' && (
            <div className="space-y-4">
              {customerDeliveries.length === 0 ? (
                <div className="p-12 text-center bg-white/70 rounded-3xl border border-dashed border-stone-300">
                  <Truck className="w-12 h-12 text-stone-400 mx-auto mb-3 opacity-60" />
                  <h4 className="text-sm font-semibold text-stone-800">No Dispatches Scheduled</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                    There are no material dispatches currently registered under your phone number. Once items are packed, you will be able to track live logistics here.
                  </p>
                </div>
              ) : (
                customerDeliveries.map((d) => {
                  const stages = ['PREPARING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED'];
                  const currentIdx = stages.indexOf(d.status);

                  return (
                    <div
                      key={d.id}
                      className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-base text-stone-900">{d.challanNumber}</span>
                            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                              GST Delivery Challan (Rule 55)
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            Transporter: <strong className="text-stone-800">{d.carrierName || 'Direct dedicated vehicle'}</strong> · LR/Waybill: <span className="font-mono font-bold text-stone-900">{d.vehicleOrLrNumber || 'Local Delivery'}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-stone-400 block">Est. Delivery</span>
                          <span className="text-sm font-bold text-stone-900 block">{d.expectedDeliveryDate || 'Prompt'}</span>
                        </div>
                      </div>

                      {/* Visual Timeline Stepper */}
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                        <div className="grid grid-cols-4 gap-2 text-center relative">
                          {stages.map((stage, idx) => {
                            const isPassed = idx <= currentIdx;
                            const isCurrent = idx === currentIdx;

                            return (
                              <div key={stage} className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                                    isCurrent
                                      ? 'bg-teal-700 text-white ring-4 ring-teal-100'
                                      : isPassed
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-stone-200 text-stone-500'
                                  }`}
                                >
                                  {isPassed && !isCurrent ? '✓' : idx + 1}
                                </div>
                                <span
                                  className={`text-[11px] font-bold tracking-tight capitalize ${
                                    isCurrent
                                      ? 'text-teal-900 font-extrabold'
                                      : isPassed
                                      ? 'text-stone-800'
                                      : 'text-stone-400'
                                  }`}
                                >
                                  {stage.replace('_', ' ').toLowerCase()}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Dispatched Items */}
                      <div>
                        <h5 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                          Material Dispatch Manifest
                        </h5>
                        <div className="divide-y divide-stone-100 border border-stone-100 rounded-2xl overflow-hidden bg-stone-50/50">
                          {(d.items || []).map((it, idx) => (
                            <div key={idx} className="p-3 flex items-center justify-between text-xs">
                              <span className="font-semibold text-stone-900">{it.name}</span>
                              <span className="font-bold text-stone-800 font-mono">
                                {it.qtyDispatched} {it.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {d.receivedBy && (
                        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            Delivered successfully and acknowledged by: <strong>{d.receivedBy}</strong>
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => setPrintingDelivery(d)}
                          className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 flex items-center gap-1.5"
                        >
                          <Printer className="w-4 h-4" /> View & Print Delivery Challan
                        </button>
                        <span className="text-xs text-stone-400 font-mono">Dispatch Date: {d.dispatchDate}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 4: CRYPTOGRAPHIC SHA-256 SECURE CHAT */}
          {activePortalTab === 'chat' && (
            <div className="max-w-3xl mx-auto">
              <ChatHub
                messages={messages}
                currentThreadId={matchedCustomer ? `cust_${matchedCustomer.id}` : `phone_${cleanPhone(searchedPhone)}`}
                onSelectThread={() => {}}
                customers={matchedCustomer ? { [matchedCustomer.id]: matchedCustomer } : {}}
                onSendMessage={onSendMessage}
                onEditMessage={onEditMessage}
                onDeleteMessage={onDeleteMessage}
                currentUserRole="CUSTOMER"
                currentUserName={matchedCustomer?.name || `Customer (${searchedPhone})`}
              />
            </div>
          )}

        </div>
      )}

      {/* Printable Delivery Challan Modal for Customer */}
      {printingDelivery && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-8 shadow-2xl border border-stone-200 my-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6 print:hidden">
              <span className="text-sm font-semibold text-stone-500">Official GST Rule 55 Delivery Challan</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  onClick={() => setPrintingDelivery(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="border border-stone-800 p-8 rounded-xl bg-white text-stone-900 text-xs">
              <div className="text-center pb-4 border-b-2 border-stone-800">
                <h2 className="text-xl font-bold uppercase tracking-wider font-serif">DELIVERY CHALLAN</h2>
                <p className="text-xs text-stone-600 mt-0.5">(Issued under Rule 55 of Central Goods and Services Tax Rules, 2017)</p>
              </div>

              <div className="grid grid-cols-2 border-b border-stone-800 py-4 gap-4">
                <div className="border-r border-stone-800 pr-4">
                  <h4 className="font-bold text-stone-900 uppercase">Supplier:</h4>
                  <p className="font-bold text-stone-900 text-sm mt-1">{selectedBiz?.name}</p>
                  <p className="text-stone-700 whitespace-pre-line mt-0.5">{selectedBiz?.address}</p>
                  <p className="mt-1 font-semibold">GSTIN: <span className="font-mono">{selectedBiz?.gstin}</span></p>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 uppercase">Customer / Consignee:</h4>
                  <p className="font-bold text-stone-900 text-sm mt-1">{printingDelivery.customerName}</p>
                  <p className="text-stone-700 whitespace-pre-line mt-0.5">{printingDelivery.customerAddress || 'Client Site'}</p>
                  <p className="mt-1 font-semibold">Phone: {printingDelivery.customerPhone || searchedPhone}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 border-b border-stone-800 py-3 bg-stone-50 gap-2">
                <div>
                  <span className="text-stone-500 block">Challan No.:</span>
                  <span className="font-bold font-mono text-stone-900">{printingDelivery.challanNumber}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Dispatch Date:</span>
                  <span className="font-bold text-stone-900">{printingDelivery.dispatchDate}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Carrier:</span>
                  <span className="font-bold text-stone-900">{printingDelivery.carrierName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Vehicle / LR:</span>
                  <span className="font-bold font-mono text-stone-900">{printingDelivery.vehicleOrLrNumber || 'Local'}</span>
                </div>
              </div>

              <table className="w-full text-xs mt-4 border-collapse">
                <thead>
                  <tr className="border-b-2 border-stone-800 bg-stone-100 text-stone-800 font-bold">
                    <th className="py-2 px-3 text-left w-12">#</th>
                    <th className="py-2 px-3 text-left">Description of Goods</th>
                    <th className="py-2 px-3 text-center w-24">Quantity</th>
                    <th className="py-2 px-3 text-center w-20">Unit</th>
                    <th className="py-2 px-3 text-left w-48">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {(printingDelivery.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-stone-900">{item.name}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-stone-900">{item.qtyDispatched}</td>
                      <td className="py-2.5 px-3 text-center text-stone-700">{item.unit}</td>
                      <td className="py-2.5 px-3 text-stone-500">{item.notes || 'Hospital MGPS Spec'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-2 pt-12 text-xs">
                <div>
                  <div className="border-t border-dashed border-stone-400 w-48 pt-2">
                    <p className="font-bold text-stone-800">Receiver's Signature</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="border-t border-dashed border-stone-400 w-48 pt-2 text-right">
                    <p className="font-bold text-stone-800">For {selectedBiz?.name}</p>
                    <p className="text-stone-600 mt-1">{selectedBiz?.signatoryName}</p>
                    <p className="text-[10px] text-stone-500">{selectedBiz?.signatoryTitle}</p>
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
