import React, { useState, useMemo } from 'react';
import type {
  Quotation,
  Invoice,
  DeliveryChallan,
  CustomerRecord,
  BusinessProfile,
  ChatMessage,
  DocumentTheme,
  AccentColor
} from '../types';
import { formatINR } from '../utils/crypto';
import { downloadHighQualityPdf } from '../utils/pdfGenerator';
import { getAccentConfig } from '../utils/documentTemplates';
import { TemplateAccentBar } from './TemplateAccentBar';
import {
  Search,
  Printer,
  Download,
  CheckCircle2,
  Phone,
  Building2,
  FileText,
  Receipt,
  Truck,
  MessageSquare,
  Bell,
  ArrowRight,
  RotateCcw,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { ChatHub } from './ChatHub';

interface Props {
  customers: Record<string, CustomerRecord>;
  quotations: Record<string, Quotation>;
  invoices: Record<string, Invoice>;
  deliveries: Record<string, DeliveryChallan>;
  businessProfile?: BusinessProfile;
  businesses?: Record<string, BusinessProfile>;
  messages: Record<string, ChatMessage>;
  fcmToken?: string | null;
  onEnableFcm?: () => void;
  onSendMessage: (text: string, filePayload?: { fileName: string; fileType: string; fileData: string }) => void;
  onEditMessage: (msgId: string, newText: string) => void;
  onDeleteMessage: (msgId: string) => void;
  onUpdateCustomerSelf: (custId: string, name: string, phone: string, email: string) => void;
  onApproveQuote?: (quoteId: string, signatoryName: string) => void;
  onSwitchToBusiness?: () => void;
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
  logoUrl?: string;
  logoIcon: string;
}

export const CustomerPortal: React.FC<Props> = ({
  customers,
  quotations,
  invoices,
  deliveries,
  businessProfile,
  businesses,
  messages,
  fcmToken,
  onEnableFcm,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onUpdateCustomerSelf,
  onApproveQuote,
  onSwitchToBusiness
}) => {
  // Safe business profile fallback
  const safeProfile: BusinessProfile = useMemo(() => {
    return (
      businessProfile ||
      (businesses ? Object.values(businesses)[0] : null) || {
        bizId: 'mourish_developers_hq',
        name: 'Mourish GenBus',
        division: 'Business Services & Project Delivery',
        constitution: 'Proprietorship',
        businessTypes: ['Enterprise Services', 'Project Delivery'],
        gstin: '33CQLPT6813M1Z7',
        phone: '9659233313 / 9487410078',
        email: 'contact@mourishgenbus.in',
        website: 'https://mourishgenbus.in',
        address: 'Tamil Nadu, India',
        bankName: 'HDFC Bank',
        bankAccountNo: '50200084920193',
        bankIfsc: 'HDFC0001824',
        bankBranch: 'Commercial Branch, Tamil Nadu',
        signatoryName: 'Mourish Nithin',
        signatoryTitle: 'Managing Director',
        logoUrl: '',
        themeTemplate: 'bold' as DocumentTheme,
        accentColor: 'indigo' as AccentColor,
      }
    );
  }, [businessProfile, businesses]);

  // Available business entities in ecosystem
  const availableBusinesses: BusinessEntityOption[] = useMemo(() => {
    if (businesses && Object.keys(businesses).length > 0) {
      return Object.values(businesses).map((b) => ({
        bizId: b.bizId,
        name: b.name || 'Business Entity',
        division: (b.businessTypes && b.businessTypes.join(', ')) || b.constitution || 'Commercial Enterprise',
        gstin: b.gstin || '',
        phone: b.phone || '',
        address: b.address || '',
        bankName: b.bankName || '',
        bankAccountNo: b.bankAccountNo || '',
        bankIfsc: b.bankIfsc || '',
        bankBranch: b.bankBranch || '',
        signatoryName: b.signatoryName || '',
        signatoryTitle: b.signatoryTitle || '',
        logoUrl: b.logoUrl,
        logoIcon: 'bx-buildings'
      }));
    }

    return [
      {
        bizId: safeProfile.bizId || 'mourish_developers_hq',
        name: safeProfile.name || 'Mourish GenBus',
        division: 'Business Services & Project Delivery',
        gstin: safeProfile.gstin || '33CQLPT6813M1Z7',
        phone: safeProfile.phone || '9659233313 / 9487410078',
        address: safeProfile.address || 'Tamil Nadu, India',
        bankName: safeProfile.bankName || 'HDFC Bank',
        bankAccountNo: safeProfile.bankAccountNo || '50200084920193',
        bankIfsc: safeProfile.bankIfsc || 'HDFC0001824',
        bankBranch: safeProfile.bankBranch || 'Commercial Branch, Tamil Nadu',
        signatoryName: safeProfile.signatoryName || 'Mourish Nithin',
        signatoryTitle: safeProfile.signatoryTitle || 'Managing Director',
        logoUrl: safeProfile.logoUrl,
        logoIcon: 'bx-buildings'
      }
    ];
  }, [businesses, safeProfile]);

  // Phone input & discovery state
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [searchedPhone, setSearchedPhone] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState('');
  const [selectedBiz, setSelectedBiz] = useState<BusinessEntityOption | null>(null);

  const activeBiz: BusinessEntityOption = useMemo(() => {
    return selectedBiz || availableBusinesses[0] || {
      bizId: safeProfile.bizId || 'mourish_developers_hq',
      name: safeProfile.name || 'Mourish GenBus',
      division: 'Business Services & Project Delivery',
      gstin: safeProfile.gstin || '33CQLPT6813M1Z7',
      phone: safeProfile.phone || '9659233313 / 9487410078',
      address: safeProfile.address || 'Tamil Nadu, India',
      bankName: safeProfile.bankName || 'HDFC Bank',
      bankAccountNo: safeProfile.bankAccountNo || '50200084920193',
      bankIfsc: safeProfile.bankIfsc || 'HDFC0001824',
      bankBranch: safeProfile.bankBranch || 'Commercial Branch, Tamil Nadu',
      signatoryName: safeProfile.signatoryName || 'Mourish Nithin',
      signatoryTitle: safeProfile.signatoryTitle || 'Managing Director',
      logoUrl: safeProfile.logoUrl,
      logoIcon: 'bx-buildings'
    };
  }, [selectedBiz, availableBusinesses, safeProfile]);

  // Theme & Accent selection
  const [activeTemplate, setActiveTemplate] = useState<DocumentTheme>(safeProfile.themeTemplate || 'bold');
  const [activeAccent, setActiveAccent] = useState<AccentColor>(safeProfile.accentColor || 'indigo');
  const accentConfig = getAccentConfig(activeAccent);

  // Portal view state
  const [activePortalTab, setActivePortalTab] = useState<'quotes' | 'invoices' | 'deliveries' | 'chat'>('quotes');
  const [approvingQuoteId, setApprovingQuoteId] = useState<string | null>(null);
  const [signatoryInput, setSignatoryInput] = useState('');
  const [printingDelivery, setPrintingDelivery] = useState<DeliveryChallan | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Clean phone helper
  const cleanPhone = (p?: string) => (p || '').replace(/[^0-9]/g, '');

  const customerList = Object.values(customers);

  // Find customer match for searched phone
  const matchedCustomer = useMemo(() => {
    if (!searchedPhone) return null;
    const cleanSearch = cleanPhone(searchedPhone);
    if (!cleanSearch) return null;

    return customerList.find((c) => {
      const cClean = cleanPhone(c.phone);
      return cClean.includes(cleanSearch) || cleanSearch.includes(cClean);
    }) || null;
  }, [customerList, searchedPhone]);

  // Find counts per business for this phone
  const getBusinessStats = (bizId: string) => {
    const custId = matchedCustomer?.id;
    const cleanSearch = searchedPhone ? cleanPhone(searchedPhone) : '';

    const quotesCount = Object.values(quotations).filter((q) => {
      const matchCust = custId ? q.customerId === custId : true;
      return matchCust && (q.status === 'FINALIZED' || q.status === 'APPROVED');
    }).length;

    const invoicesCount = Object.values(invoices).filter((inv) => {
      return custId ? inv.customerId === custId : true;
    }).length;

    const deliveriesCount = Object.values(deliveries).filter((d) => {
      const phoneMatch = cleanSearch && d.customerPhone && cleanPhone(d.customerPhone).includes(cleanSearch);
      const custMatch = custId && d.customerId === custId;
      return custId ? (phoneMatch || custMatch) : true;
    }).length;

    return { quotesCount, invoicesCount, deliveriesCount };
  };

  const handleSearchPhone = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPhoneError('');
    const clean = cleanPhone(phoneNumberInput);
    if (!clean || clean.length < 3) {
      setPhoneError('Please enter at least 3 digits to search orders by phone.');
      return;
    }
    setSearchedPhone(phoneNumberInput.trim());
    setSelectedBiz(availableBusinesses[0]);
  };

  const handleQuickSelectCustomer = (c: CustomerRecord) => {
    setPhoneNumberInput(c.phone);
    setSearchedPhone(c.phone);
    setPhoneError('');
    setSelectedBiz(availableBusinesses[0]);
  };

  // Filtered records
  const customerQuotes = useMemo(() => {
    if (matchedCustomer) {
      return Object.values(quotations).filter(
        (q) => q.customerId === matchedCustomer.id && (q.status === 'FINALIZED' || q.status === 'APPROVED' || q.customerApproved)
      );
    }
    // If no specific phone is searched yet, show all finalized quotes available
    return Object.values(quotations).filter(
      (q) => q.status === 'FINALIZED' || q.status === 'APPROVED' || q.customerApproved
    );
  }, [quotations, matchedCustomer]);

  const customerInvoices = useMemo(() => {
    if (matchedCustomer) {
      return Object.values(invoices).filter((inv) => inv.customerId === matchedCustomer.id);
    }
    return Object.values(invoices);
  }, [invoices, matchedCustomer]);

  const customerDeliveries = useMemo(() => {
    if (matchedCustomer) {
      const cleanSearch = searchedPhone ? cleanPhone(searchedPhone) : '';
      const custId = matchedCustomer.id;
      return Object.values(deliveries).filter((d) => {
        const phoneMatch = cleanSearch && d.customerPhone && cleanPhone(d.customerPhone).includes(cleanSearch);
        const custMatch = custId && d.customerId === custId;
        return phoneMatch || custMatch;
      });
    }
    return Object.values(deliveries);
  }, [deliveries, matchedCustomer, searchedPhone]);

  const handleConfirmApproval = (quoteId: string) => {
    if (!onApproveQuote) return;
    onApproveQuote(quoteId, signatoryInput.trim() || matchedCustomer?.name || 'Authorized Representative');
    setApprovingQuoteId(null);
    setSignatoryInput('');
  };

  const handleDownloadPdf = async (elementId: string, fileName: string) => {
    setIsExportingPdf(true);
    await downloadHighQualityPdf(elementId, fileName);
    setIsExportingPdf(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Top Navigation Bar: Portal Mode & Return to ERP */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          {activeBiz.logoUrl ? (
            <img src={activeBiz.logoUrl} alt="Logo" className="w-10 h-10 rounded-2xl object-contain bg-white border border-slate-200 p-0.5" />
          ) : (
            <div className={`w-10 h-10 rounded-2xl ${accentConfig.bgClass} text-white flex items-center justify-center font-bold text-lg shadow-md`}>
              {activeBiz.name?.charAt(0) || 'B'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Client Self-Service Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">Realtime Live</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {activeBiz.name}
            </h2>
          </div>
        </div>

        {onSwitchToBusiness && (
          <button
            type="button"
            onClick={onSwitchToBusiness}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <i className="bx bx-arrow-back text-sm"></i>
            <span>Back to Business ERP</span>
          </button>
        )}
      </div>

      {/* FCM Live Push Notification Status */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-3xl shadow-md border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <span className="font-bold text-indigo-200">Push Notifications & Updates: </span>
            <span className="text-slate-300">Live alerts for quote approvals, tax invoices, and delivery tracking.</span>
          </div>
        </div>
        <div>
          {fcmToken ? (
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1.5 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> Notifications Active
            </span>
          ) : (
            <button
              type="button"
              onClick={onEnableFcm}
              className="px-4 py-1.5 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition shadow-sm"
            >
              Enable Notifications
            </button>
          )}
        </div>
      </div>

      {/* Client Phone Lookup & Quick-Select Bar */}
      <div className="p-5 sm:p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-500" />
              <span>Search Orders by Registered Contact Number</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter phone to filter quotes, tax invoices, and material delivery notes specific to your account.
            </p>
          </div>

          <form onSubmit={handleSearchPhone} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={phoneNumberInput}
                onChange={(e) => setPhoneNumberInput(e.target.value)}
                placeholder="Enter 10-digit phone..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition shrink-0"
            >
              <span>Find</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {searchedPhone && (
              <button
                type="button"
                onClick={() => {
                  setSearchedPhone(null);
                  setPhoneNumberInput('');
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 text-xs transition"
                title="Clear filter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {phoneError && (
          <p className="text-xs text-rose-500 font-bold" role="alert">{phoneError}</p>
        )}

        {/* Quick Click Client Pills */}
        {customerList.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">
              Registered Accounts:
            </span>
            {customerList.map((c) => {
              const isSelected = matchedCustomer?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleQuickSelectCustomer(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <UserCheck className="w-3 h-3" />
                  <span>{c.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({c.phone})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Document Template & Accent Picker Bar */}
      <TemplateAccentBar
        activeTemplate={activeTemplate}
        activeAccent={activeAccent}
        onSelectTemplate={(t) => setActiveTemplate(t)}
        onSelectAccent={(a) => setActiveAccent(a)}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActivePortalTab('quotes')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activePortalTab === 'quotes'
              ? `${accentConfig.bgClass} text-white shadow-sm`
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Finalized Quotations ({customerQuotes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePortalTab('invoices')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activePortalTab === 'invoices'
              ? `${accentConfig.bgClass} text-white shadow-sm`
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Tax Invoices ({customerInvoices.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePortalTab('deliveries')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activePortalTab === 'deliveries'
              ? `${accentConfig.bgClass} text-white shadow-sm`
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Delivery Challans ({customerDeliveries.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePortalTab('chat')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activePortalTab === 'chat'
              ? `${accentConfig.bgClass} text-white shadow-sm`
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Live Support Messages</span>
        </button>
      </div>

      {/* TAB 1: FINALIZED QUOTATIONS */}
      {activePortalTab === 'quotes' && (
        <div className="space-y-5">
          {customerQuotes.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[28px] border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
              <FileText className="w-10 h-10 text-slate-400 mx-auto opacity-60" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Finalized Quotations Available</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No finalized proposals found under this filter. In Business ERP, set a quotation status to FINALIZED to display it here.
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
              const docId = `quote-portal-doc-${q.id}`;

              return (
                <div key={q.id} className="rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
                  <div id={docId} className="bg-white p-6 rounded-2xl text-slate-900 space-y-5">
                    
                    {/* Header with Template Style */}
                    <div className={`p-4 rounded-2xl ${
                      activeTemplate === 'bold'
                        ? `${accentConfig.bgClass} text-white`
                        : activeTemplate === 'corporate'
                        ? 'bg-slate-900 text-white'
                        : activeTemplate === 'classic'
                        ? 'border-2 border-slate-900 bg-slate-50 text-slate-900'
                        : 'bg-slate-50 text-slate-900 border border-slate-200'
                    } flex flex-wrap items-start justify-between gap-4`}>
                      <div className="flex items-start gap-3">
                        {activeBiz.logoUrl ? (
                          <img src={activeBiz.logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded-xl bg-white border border-slate-200 p-0.5" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold text-base shadow">
                            {activeBiz.name?.charAt(0) || 'B'}
                          </div>
                        )}
                        <div>
                          <h3 className="font-black text-lg">{activeBiz.name}</h3>
                          <p className="text-xs opacity-90 font-mono">GSTIN: {activeBiz.gstin || 'Registered'} · {activeBiz.phone}</p>
                          <p className="text-xs opacity-75">{activeBiz.address}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-inherit border border-white/30 inline-block mb-1">
                          COMMERCIAL ESTIMATE
                        </span>
                        <div className="font-mono font-bold text-base">{q.quoteNumber}</div>
                        <div className="text-xs opacity-80">Valid: {q.validUntil || '30 Days'}</div>
                      </div>
                    </div>

                    {/* Customer & Scope Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Client Account:</span>
                        <div className="font-bold text-sm text-slate-900 mt-0.5">{q.customerName || matchedCustomer?.name}</div>
                        <div className="text-slate-500 font-mono">Contact: {matchedCustomer?.phone || q.customerId}</div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Proposal Title:</span>
                        <div className="font-bold text-sm text-slate-900 mt-0.5">{q.title}</div>
                        {q.customerApproved && (
                          <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Approved by {q.customerSignatory || 'Client'}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="overflow-x-auto">
                      <table className={`w-full text-xs text-left ${activeTemplate === 'classic' ? 'border-collapse border border-slate-900' : ''}`}>
                        <thead>
                          <tr className={`border-b text-[10px] uppercase ${
                            activeTemplate === 'classic'
                              ? 'bg-slate-200 border-slate-900 font-bold'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            <th className="py-2 px-3">Item Description</th>
                            <th className="py-2 px-3 text-center">HSN</th>
                            <th className="py-2 px-3 text-center">Qty</th>
                            <th className="py-2 px-3 text-right">Unit Rate (₹)</th>
                            <th className="py-2 px-3 text-right">GST %</th>
                            <th className="py-2 px-3 text-right">Total (₹)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(q.items || []).map((it, idx) => {
                            const lineRaw = (Number(it.qty) || 0) * (Number(it.rate) || 0);
                            const lineTax = lineRaw * ((Number(it.gst) || 0) / 100);
                            return (
                              <tr key={idx} className={activeTemplate === 'classic' ? 'border-b border-slate-900' : ''}>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">{it.name}</td>
                                <td className="py-2.5 px-3 text-center font-mono text-slate-500">{it.hsn || '—'}</td>
                                <td className="py-2.5 px-3 text-center font-bold text-slate-800">{it.qty} {it.unit || 'Nos'}</td>
                                <td className="py-2.5 px-3 text-right font-mono">{formatINR(it.rate)}</td>
                                <td className="py-2.5 px-3 text-right font-mono">{it.gst}%</td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatINR(lineRaw + lineTax)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary & Totals */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-xs">
                      <div>
                        {q.notes && (
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                            <strong>Terms & Notes:</strong> {q.notes}
                          </div>
                        )}
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-right font-medium">
                        <div className="flex justify-between text-slate-600">
                          <span>Subtotal:</span>
                          <span className="font-mono text-slate-900">{formatINR(sub)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Total GST:</span>
                          <span className="font-mono text-slate-900">{formatINR(tax)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-black">
                          <span>Grand Total:</span>
                          <span className={`text-xl font-mono ${accentConfig.textClass}`}>{formatINR(grand)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(docId, `Quotation_${q.quoteNumber}`)}
                        disabled={isExportingPdf}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download High-Quality PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                      >
                        <Printer className="w-4 h-4" /> Print
                      </button>
                    </div>

                    {!q.customerApproved && onApproveQuote && (
                      <div className="flex items-center gap-2">
                        {approvingQuoteId === q.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={signatoryInput}
                              onChange={(e) => setSignatoryInput(e.target.value)}
                              placeholder="Your full name..."
                              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleConfirmApproval(q.id)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setApprovingQuoteId(null)}
                              className="text-xs text-slate-400"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setApprovingQuoteId(q.id);
                              setSignatoryInput(matchedCustomer?.name || '');
                            }}
                            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
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

      {/* TAB 2: TAX INVOICES */}
      {activePortalTab === 'invoices' && (
        <div className="space-y-5">
          {/* Bank Payment Remittance Box */}
          <div className="p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] text-indigo-900 dark:text-indigo-200">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Official Enterprise Bank Remittance Account (Zero Payment Gateway Deductions)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Remit invoice payments via direct RTGS / NEFT / IMPS Netbanking:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-indigo-100 dark:border-indigo-900 font-medium text-slate-900 dark:text-white">
              <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Bank Name</span><strong>{activeBiz.bankName || 'HDFC Bank'}</strong></div>
              <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Account Number</span><strong className="font-mono">{activeBiz.bankAccountNo || '50200084920193'}</strong></div>
              <div><span className="text-slate-400 block text-[10px] uppercase font-bold">IFSC Code</span><strong className="font-mono">{activeBiz.bankIfsc || 'HDFC0001824'}</strong></div>
              <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Branch</span><strong>{activeBiz.bankBranch || 'Commercial Branch'}</strong></div>
            </div>
          </div>

          {customerInvoices.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[28px] border border-dashed border-slate-300 dark:border-slate-800">
              <Receipt className="w-10 h-10 text-slate-400 mx-auto opacity-60 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Invoices Issued</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">No invoices generated yet for this account.</p>
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
              const invDocId = `invoice-portal-doc-${inv.id}`;

              return (
                <div key={inv.id} className="rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
                  <div id={invDocId} className="bg-white p-6 rounded-2xl text-slate-900 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-3">
                        {activeBiz.logoUrl ? (
                          <img src={activeBiz.logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded-xl bg-white border border-slate-200 p-0.5" />
                        ) : (
                          <div className={`w-10 h-10 rounded-xl ${accentConfig.bgClass} text-white flex items-center justify-center font-bold text-lg`}>
                            {activeBiz.name?.charAt(0) || 'B'}
                          </div>
                        )}
                        <div>
                          <h4 className="font-black text-lg text-slate-900">{activeBiz.name}</h4>
                          <p className="text-xs text-slate-500 font-mono">GSTIN: {activeBiz.gstin || 'Registered'}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-1">
                          TAX INVOICE
                        </span>
                        <div className="font-mono font-bold text-base text-slate-900">{inv.invoiceNumber}</div>
                        <div className="text-xs text-slate-500">Date: {inv.issueDate} · Due: {inv.dueDate}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Billed To:</span>
                        <div className="font-bold text-sm text-slate-900">{inv.customerName}</div>
                        <div className="text-slate-500">{inv.customerAddress || matchedCustomer?.address}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Balance Due:</span>
                        <div className="text-xl font-black text-rose-600 font-mono">{formatINR(bal)}</div>
                        <span className="text-xs text-slate-500">Paid: {formatINR(paid)} / Total: {formatINR(grand)}</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-500 bg-slate-50">
                            <th className="py-2 px-3">Item</th>
                            <th className="py-2 px-3 text-center">HSN</th>
                            <th className="py-2 px-3 text-center">Qty</th>
                            <th className="py-2 px-3 text-right">Rate</th>
                            <th className="py-2 px-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(inv.items || []).map((it, idx) => (
                            <tr key={idx}>
                              <td className="py-2.5 px-3 font-semibold text-slate-900">{it.name}</td>
                              <td className="py-2.5 px-3 text-center font-mono text-slate-500">{it.hsn || '—'}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-slate-800">{it.qty} {it.unit}</td>
                              <td className="py-2.5 px-3 text-right font-mono">{formatINR(it.rate)}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatINR((Number(it.qty) || 0) * (Number(it.rate) || 0))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(invDocId, `Tax_Invoice_${inv.invoiceNumber}`)}
                      disabled={isExportingPdf}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                    <div className="text-xs text-slate-500 font-medium">Invoice Total: <strong className="text-slate-900 dark:text-white">{formatINR(grand)}</strong></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: DELIVERIES */}
      {activePortalTab === 'deliveries' && (
        <div className="space-y-5">
          {customerDeliveries.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[28px] border border-dashed border-slate-300 dark:border-slate-800">
              <Truck className="w-10 h-10 text-slate-400 mx-auto opacity-60 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Deliveries Scheduled</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">Material dispatches and transport waybills will appear here once scheduled.</p>
            </div>
          ) : (
            customerDeliveries.map((d) => (
              <div key={d.id} className="p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-slate-900 dark:text-white">{d.challanNumber}</span>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200">
                        Delivery Challan (Rule 55)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Carrier: <strong>{d.carrierName}</strong> · Waybill / Vehicle: <strong className="font-mono">{d.vehicleOrLrNumber || 'Local'}</strong></p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Est. Delivery Date:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{d.expectedDeliveryDate || 'Prompt'}</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40">
                  {(d.items || []).map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white">{it.name}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{it.qtyDispatched} {it.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: LIVE SUPPORT CHAT */}
      {activePortalTab === 'chat' && (
        <div className="max-w-3xl mx-auto">
          <ChatHub
            messages={messages}
            currentThreadId={matchedCustomer ? `cust_${matchedCustomer.id}` : 'cust_general'}
            onSelectThread={() => {}}
            customers={customers}
            onSendMessage={onSendMessage}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            currentUserRole="CUSTOMER"
            currentUserName={matchedCustomer?.name || 'Client Contact'}
          />
        </div>
      )}
    </div>
  );
};
