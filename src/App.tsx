/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type {
  PortalMode,
  BusinessTab,
  BusinessProfile,
  CatalogueItem,
  StockAdjustment,
  CustomerRecord,
  Quotation,
  Invoice,
  DeliveryChallan,
  Deal,
  Project,
  ChatMessage,
} from './types';
import { calculateSha256 } from './utils/crypto';
import {
  auth,
  db,
  signOut,
  onAuthStateChanged,
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  requestFcmToken,
  subscribeToFcmMessages,
  type User,
} from './firebase';

import { LiquidGlassBackground } from './components/LiquidGlassBackground';
import { Header } from './components/Header';
import { MobileTouchBar } from './components/MobileTouchBar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { QuotationEditor } from './components/QuotationEditor';
import { InvoiceManager } from './components/InvoiceManager';
import { DeliveryManager } from './components/DeliveryManager';
import { DealsPipeline } from './components/DealsPipeline';
import { ProjectsManager } from './components/ProjectsManager';
import { CustomerCrm } from './components/CustomerCrm';
import { ChatHub } from './components/ChatHub';
import { CustomerPortal } from './components/CustomerPortal';
import { FirebaseRulesViewer } from './components/FirebaseRulesViewer';
import { BusinessProfileEditor } from './components/BusinessProfileEditor';
import { AuthGate } from './components/AuthGate';
import { BusinessOnboardingModal } from './components/BusinessOnboardingModal';
import { ShieldCheck, Building2 } from 'lucide-react';

export default function App() {
  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved !== 'light';
  });

  // Navigation State (Defaults to Executive Dashboard)
  const [portalMode, setPortalMode] = useState<PortalMode>('business');
  const [activeBizTab, setActiveBizTab] = useState<BusinessTab>('dashboard');

  // Real Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isCreatingNewBusiness, setIsCreatingNewBusiness] = useState(false);

  // Multi-Business Profile State (Strictly zero pre-filled demo data)
  const [businesses, setBusinesses] = useState<Record<string, BusinessProfile>>({});
  const [activeBizId, setActiveBizId] = useState<string>(() => localStorage.getItem('mourish_active_biz_id') || '');

  // Real Data Stores
  const [catalogue, setCatalogue] = useState<Record<string, CatalogueItem>>({});
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([]);
  const [customers, setCustomers] = useState<Record<string, CustomerRecord>>({});
  const [quotations, setQuotations] = useState<Record<string, Quotation>>({});
  const [invoices, setInvoices] = useState<Record<string, Invoice>>({});
  const [deliveries, setDeliveries] = useState<Record<string, DeliveryChallan>>({});
  const [deals, setDeals] = useState<Record<string, Deal>>({});
  const [projects, setProjects] = useState<Record<string, Project>>({});
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);

  // FCM Push Notifications State
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [fcmAlert, setFcmAlert] = useState<{ title: string; body: string } | null>(null);

  // Chat State
  const [currentThreadId, setCurrentThreadId] = useState('team_internal');
  const [messages, setMessages] = useState<Record<string, ChatMessage>>({});

  // Active Business Helper with clean empty fallback
  const defaultEmptyProfile: BusinessProfile = {
    bizId: activeBizId || 'biz_main',
    name: '',
    constitution: 'Proprietorship',
    businessTypes: [],
    gstin: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    bankName: '',
    bankAccountNo: '',
    bankIfsc: '',
    bankBranch: '',
    signatoryName: '',
    signatoryTitle: 'Authorized Signatory',
  };

  const activeBusiness: BusinessProfile =
    (activeBizId && businesses[activeBizId])
      ? businesses[activeBizId]
      : Object.values(businesses)[0] || defaultEmptyProfile;

  // Sync Dark Mode class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Auth State Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
    });
    return () => unsub();
  }, []);

  // Check if business profile needs initial onboarding on login
  useEffect(() => {
    if (currentUser) {
      const isConfigured = localStorage.getItem(`mourish_biz_configured_${currentUser.uid}`);
      if (!isConfigured && Object.keys(businesses).length === 0) {
        setIsCreatingNewBusiness(false);
        setIsOnboardingModalOpen(true);
      }
    }
  }, [currentUser, businesses]);

  // Firebase Realtime DB Listeners (Real Live Data)
  useEffect(() => {
    try {
      // 1. Multi-Business Profiles
      const bizRef = ref(db, 'businesses');
      onValue(bizRef, (snap) => {
        if (snap.exists()) {
          const val = snap.val() as Record<string, BusinessProfile>;
          setBusinesses(val);
          setActiveBizId((prev) => {
            if (prev && val[prev]) return prev;
            const firstId = Object.keys(val)[0] || '';
            if (firstId) localStorage.setItem('mourish_active_biz_id', firstId);
            return firstId;
          });
        } else {
          setBusinesses({});
        }
      });

      // 2. Catalogue & Inventory
      const catRef = ref(db, 'catalogues');
      onValue(catRef, (snap) => {
        if (snap.exists()) {
          const val = snap.val();
          setCatalogue(val);
        } else {
          setCatalogue({});
        }
      });

      // 3. Stock Adjustments
      const adjRef = ref(db, 'stock_adjustments');
      onValue(adjRef, (snap) => {
        if (snap.exists()) {
          const val = snap.val();
          setStockAdjustments(Object.values(val));
        } else {
          setStockAdjustments([]);
        }
      });

      // 4. Customers
      const custRef = ref(db, 'customers');
      onValue(custRef, (snap) => {
        if (snap.exists()) {
          setCustomers(snap.val());
        } else {
          setCustomers({});
        }
      });

      // 5. Quotations
      const quotesRef = ref(db, 'quotations');
      onValue(quotesRef, (snap) => {
        if (snap.exists()) {
          setQuotations(snap.val());
        } else {
          setQuotations({});
        }
      });

      // 6. Invoices
      const invRef = ref(db, 'invoices');
      onValue(invRef, (snap) => {
        if (snap.exists()) {
          setInvoices(snap.val());
        } else {
          setInvoices({});
        }
      });

      // 7. Deals Pipeline
      const dealsRef = ref(db, 'deals');
      onValue(dealsRef, (snap) => {
        if (snap.exists()) {
          setDeals(snap.val());
        } else {
          setDeals({});
        }
      });

      // 8. Projects
      const projRef = ref(db, 'projects');
      onValue(projRef, (snap) => {
        if (snap.exists()) {
          setProjects(snap.val());
        } else {
          setProjects({});
        }
      });

      // 9. Deliveries & Dispatches
      const delRef = ref(db, 'deliveries');
      onValue(delRef, (snap) => {
        if (snap.exists()) {
          setDeliveries(snap.val());
        } else {
          setDeliveries({});
        }
      });
    } catch (e) {
      console.error('Firebase DB listener error:', e);
    }
  }, []);

  // Listen to FCM push notifications in foreground
  useEffect(() => {
    let unsubFcm: (() => void) | null = null;
    subscribeToFcmMessages((payload) => {
      setFcmAlert({
        title: payload.title || 'Mourish GenBus ERP Alert',
        body: payload.body || 'New operational update received.',
      });
      setTimeout(() => setFcmAlert(null), 6000);
    }).then((unsub) => {
      unsubFcm = unsub;
    });

    return () => {
      if (unsubFcm) unsubFcm();
    };
  }, []);

  // Handle Enable FCM Token Request
  const handleEnableFcm = async () => {
    try {
      const token = await requestFcmToken();
      if (token) {
        setFcmToken(token);
        if (currentUser) {
          update(ref(db, `users/${currentUser.uid}`), { fcmToken: token });
        }
      }
    } catch (e) {
      console.error('FCM Request error:', e);
    }
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
  };

  // Multi-Business Handlers
  const handleSelectBusiness = (bizId: string) => {
    setActiveBizId(bizId);
    localStorage.setItem('mourish_active_biz_id', bizId);
  };

  const handleSaveBusinessProfile = (profile: BusinessProfile) => {
    const targetBizId = profile.bizId || `biz_${Date.now()}`;
    const toSave: BusinessProfile = {
      ...profile,
      bizId: targetBizId,
      lastEditedBy: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Business Admin',
      createdAt: profile.createdAt || Date.now(),
    };
    setBusinesses((prev) => ({ ...prev, [targetBizId]: toSave }));
    setActiveBizId(targetBizId);
    localStorage.setItem('mourish_active_biz_id', targetBizId);
    if (currentUser) {
      localStorage.setItem(`mourish_biz_configured_${currentUser.uid}`, 'true');
    }
    try {
      set(ref(db, `businesses/${targetBizId}`), toSave);
    } catch (e) {
      console.error('Error saving business profile:', e);
    }
  };

  // Quotation Handlers
  const handleCreateNewQuote = () => {
    const newId = `qt_${Date.now()}`;
    const firstCustId = Object.keys(customers)[0] || '';
    const firstCustName = customers[firstCustId]?.name || '';

    const newQuote: Quotation = {
      id: newId,
      bizId: activeBusiness.bizId,
      quoteNumber: `QT-${new Date().getFullYear()}-${String(Object.keys(quotations).length + 1).padStart(3, '0')}`,
      title: firstCustName ? `${firstCustName} Commercial Proposal` : 'Commercial Supply & Service Proposal',
      customerId: firstCustId,
      customerName: firstCustName,
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'DRAFT',
      discount: 0,
      notes: 'Payment terms: 50% advance along with confirmed Purchase Order, 40% upon material dispatch, balance 10% after commissioning and handover.',
      terms: 'Standard commercial warranty against manufacturing defects.',
      items: [], // Strictly zero pre-filled demo data
      createdAt: Date.now(),
      lastEditedBy: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Business Admin',
      lastEditedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = { ...quotations, [newId]: newQuote };
    setQuotations(updated);
    setActiveQuoteId(newId);

    try {
      set(ref(db, `quotations/${newId}`), newQuote);
    } catch (e) {}
  };

  const handleSaveQuoteField = (quoteId: string, field: keyof Quotation, val: any) => {
    const q = quotations[quoteId];
    if (!q) return;
    const updated = {
      ...q,
      [field]: val,
      lastEditedBy: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Business Admin',
      lastEditedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setQuotations((prev) => ({ ...prev, [quoteId]: updated }));
    try {
      update(ref(db, `quotations/${quoteId}`), updated);
    } catch (e) {}
  };

  const handleUpdateLineItem = (
    quoteId: string,
    idx: number,
    key: string,
    val: any
  ) => {
    const q = quotations[quoteId];
    if (!q || !q.items) return;
    const items = [...q.items];
    items[idx] = { ...items[idx], [key]: val };
    const updated = {
      ...q,
      items,
      lastEditedBy: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Business Admin',
      lastEditedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setQuotations((prev) => ({ ...prev, [quoteId]: updated }));
    try {
      update(ref(db, `quotations/${quoteId}`), { items });
    } catch (e) {}
  };

  const handleAddLineItem = (quoteId: string, customItem?: Partial<CatalogueItem>) => {
    const q = quotations[quoteId];
    if (!q) return;
    const items = q.items ? [...q.items] : [];
    items.push({
      name: customItem?.name || '',
      hsn: customItem?.hsn || '',
      qty: 1,
      rate: customItem?.rate || 0,
      gst: customItem?.gst || 18,
      unit: customItem?.unit || 'Nos',
    });
    const updated = { ...q, items };
    setQuotations((prev) => ({ ...prev, [quoteId]: updated }));
    try {
      update(ref(db, `quotations/${quoteId}`), { items });
    } catch (e) {}
  };

  const handleRemoveLineItem = (quoteId: string, idx: number) => {
    const q = quotations[quoteId];
    if (!q || !q.items) return;
    const items = q.items.filter((_, i) => i !== idx);
    const updated = { ...q, items };
    setQuotations((prev) => ({ ...prev, [quoteId]: updated }));
    try {
      update(ref(db, `quotations/${quoteId}`), { items });
    } catch (e) {}
  };

  const handleDeleteQuote = (quoteId: string) => {
    const copy = { ...quotations };
    delete copy[quoteId];
    setQuotations(copy);
    if (activeQuoteId === quoteId) {
      setActiveQuoteId(Object.keys(copy)[0] || null);
    }
    try {
      remove(ref(db, `quotations/${quoteId}`));
    } catch (e) {}
  };

  // 1-Click Convert Quotation to Invoice
  const handleConvertToInvoice = (quoteId: string) => {
    const q = quotations[quoteId];
    if (!q) return;

    const newInvId = `inv_${Date.now()}`;
    const cust = customers[q.customerId];
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];

    const newInvoice: Invoice = {
      id: newInvId,
      bizId: q.bizId || activeBusiness.bizId,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Object.keys(invoices).length + 1).padStart(3, '0')}`,
      fromQuotationId: q.id,
      quoteNumber: q.quoteNumber,
      customerId: q.customerId,
      customerName: q.customerName,
      customerGstin: cust?.gstin || '',
      customerAddress: cust?.address || '',
      issueDate: today,
      dueDate: due,
      status: 'SENT',
      items: q.items || [],
      discount: q.discount || 0,
      notes: q.notes || 'Thank you for your business. Please remit payment via NEFT/RTGS to the official bank account detailed below.',
      terms: q.terms || 'Payment due within 15 days of invoice date via Bank NEFT / RTGS transfer.',
      paidAmount: 0,
      createdAt: Date.now(),
    };

    setInvoices((prev) => ({ ...prev, [newInvId]: newInvoice }));
    try {
      set(ref(db, `invoices/${newInvId}`), newInvoice);
      update(ref(db, `quotations/${quoteId}`), {
        status: 'CONVERTED',
        convertedToInvoiceId: newInvId,
      });
    } catch (e) {}

    setActiveBizTab('invoices');
  };

  // Invoice Handlers
  const handleSaveInvoice = (invoice: Invoice) => {
    try {
      set(ref(db, `invoices/${invoice.id}`), invoice);
    } catch (e) {}
  };

  const handleDeleteInvoice = (id: string) => {
    try {
      remove(ref(db, `invoices/${id}`));
    } catch (e) {}
  };

  // Delivery & Dispatch Handlers
  const handleSaveDelivery = (challan: Partial<DeliveryChallan>) => {
    const id = challan.id || `del_${Date.now()}`;
    const fullChallan: DeliveryChallan = {
      id,
      bizId: activeBusiness.bizId,
      challanNumber: challan.challanNumber || `DC-${Date.now().toString().slice(-4)}`,
      customerId: challan.customerId || '',
      customerName: challan.customerName || 'Client Consignee',
      customerPhone: challan.customerPhone || '',
      customerAddress: challan.customerAddress || '',
      fromQuotationId: challan.fromQuotationId,
      fromInvoiceId: challan.fromInvoiceId,
      dispatchDate: challan.dispatchDate || new Date().toISOString().split('T')[0],
      expectedDeliveryDate: challan.expectedDeliveryDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      carrierName: challan.carrierName || 'Dedicated Vehicle',
      vehicleOrLrNumber: challan.vehicleOrLrNumber || '',
      driverContact: challan.driverContact || '',
      status: challan.status || 'PREPARING',
      items: challan.items || [],
      receivedBy: challan.receivedBy,
      deliveredAt: challan.deliveredAt,
      proofNotes: challan.proofNotes,
      createdAt: challan.createdAt || Date.now(),
      ...challan,
    };
    try {
      set(ref(db, `deliveries/${id}`), fullChallan);
    } catch (e) {
      console.error('Error saving delivery challan:', e);
    }
  };

  const handleDeleteDelivery = (id: string) => {
    try {
      remove(ref(db, `deliveries/${id}`));
    } catch (e) {
      console.error('Error deleting delivery challan:', e);
    }
  };

  // Deal Handlers
  const handleSaveDeal = (deal: Deal) => {
    try {
      set(ref(db, `deals/${deal.id}`), { ...deal, bizId: deal.bizId || activeBusiness.bizId });
    } catch (e) {}
  };

  const handleDeleteDeal = (id: string) => {
    try {
      remove(ref(db, `deals/${id}`));
    } catch (e) {}
  };

  // Project Handlers
  const handleSaveProject = (project: Project) => {
    try {
      set(ref(db, `projects/${project.id}`), { ...project, bizId: project.bizId || activeBusiness.bizId });
    } catch (e) {}
  };

  const handleDeleteProject = (id: string) => {
    try {
      remove(ref(db, `projects/${id}`));
    } catch (e) {}
  };

  // Customer Handlers
  const handleSaveCustomer = (cust: Partial<CustomerRecord>) => {
    const id = cust.id || `cust_${Date.now()}`;
    const fullCust: CustomerRecord = {
      id,
      bizId: activeBusiness.bizId,
      name: cust.name || 'New Client',
      contactPerson: cust.contactPerson || '',
      phone: cust.phone || '',
      email: cust.email || '',
      company: cust.company || '',
      address: cust.address || '',
      gstin: cust.gstin || '',
      department: cust.department || 'Procurement',
      updatedBy: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Business Admin',
      createdAt: cust.createdAt || Date.now(),
      ...cust,
    };
    try {
      set(ref(db, `customers/${id}`), fullCust);
    } catch (e) {}
  };

  const handleDeleteCustomer = (id: string) => {
    try {
      remove(ref(db, `customers/${id}`));
    } catch (e) {}
  };

  const handleUpdateCustomerSelf = (
    custId: string,
    name: string,
    phone: string,
    email: string
  ) => {
    try {
      update(ref(db, `customers/${custId}`), { name, phone, email });
    } catch (e) {}
  };

  // Customer Digital Approval
  const handleApproveQuote = (quoteId: string, signatoryName: string) => {
    try {
      update(ref(db, `quotations/${quoteId}`), {
        customerApproved: true,
        customerApprovedAt: new Date().toISOString(),
        customerSignatory: signatoryName,
        status: 'FINALIZED',
      });
    } catch (e) {}
  };

  // Chat Handlers (Cryptographic SHA-256)
  const handleSendMessage = async (
    text: string,
    filePayload?: { fileName: string; fileType: string; fileData: string }
  ) => {
    if (!text.trim() && !filePayload) return;
    const msgId = `msg_${Date.now()}`;
    const hash = await calculateSha256(text + (filePayload?.fileData || '') + Date.now().toString());

    const newMsg: ChatMessage = {
      id: msgId,
      senderId: currentUser?.uid || 'client_anonymous',
      senderName:
        portalMode === 'business'
          ? currentUser?.displayName || currentUser?.email?.split('@')[0] || activeBusiness.name || 'Business Admin'
          : 'Client Contact',
      senderRole: portalMode === 'business' ? 'BUSINESS' : 'CUSTOMER',
      text: text.trim(),
      sha256Hash: hash,
      fileName: filePayload?.fileName || null,
      fileType: filePayload?.fileType || null,
      fileData: filePayload?.fileData || null,
      seenByReceiver: false,
      edited: false,
      editedBeforeSeen: false,
      timestamp: Date.now(),
      timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      set(ref(db, `chats/${currentThreadId}/messages/${msgId}`), newMsg);
    } catch (e) {
      console.error('Error sending message:', e);
    }
  };

  const handleEditMessage = async (msgId: string, newText: string) => {
    const existing = messages[msgId];
    if (!existing) return;
    const newHash = await calculateSha256(newText + Date.now().toString());
    const editedBeforeSeen = !existing.seenByReceiver;

    try {
      update(ref(db, `chats/${currentThreadId}/messages/${msgId}`), {
        text: newText,
        sha256Hash: newHash,
        edited: true,
        editedBeforeSeen,
      });
    } catch (e) {}
  };

  const handleDeleteMessage = (msgId: string) => {
    try {
      remove(ref(db, `chats/${currentThreadId}/messages/${msgId}`));
    } catch (e) {}
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400">Connecting to Firebase Realtime Cloud...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans relative selection:bg-indigo-500 selection:text-white">
      {/* Liquid Glass Background */}
      <LiquidGlassBackground isDark={isDark} />

      {/* Global Header with Multi-Business Switcher */}
      <Header
        portalMode={portalMode}
        onSwitchPortal={(mode) => setPortalMode(mode)}
        activeBizTab={activeBizTab}
        onSelectBizTab={(tab) => setActiveBizTab(tab)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        userEmail={currentUser?.email || null}
        onSignOut={handleSignOut}
        businesses={businesses}
        activeBizId={activeBizId}
        onSelectBusiness={handleSelectBusiness}
        onOpenNewBusinessModal={() => {
          setIsCreatingNewBusiness(true);
          setIsOnboardingModalOpen(true);
        }}
      />

      {/* Real-Time FCM Notification Toast Alert */}
      {fcmAlert && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-indigo-500/40 backdrop-blur-xl animate-in slide-in-from-top-3 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-indigo-300" />
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-bold text-white font-mono">{fcmAlert.title}</h5>
            <p className="text-xs text-slate-300 mt-0.5 leading-snug">{fcmAlert.body}</p>
          </div>
          <button
            onClick={() => setFcmAlert(null)}
            className="text-slate-400 hover:text-white text-xs font-mono"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto px-4 lg:px-8 py-6 space-y-6 pb-24 lg:pb-8">
        
        {/* ========================================================================= */}
        {/* 1. CUSTOMER PORTAL (FREE SELF-SERVICE, NO LOGIN NEEDED)                   */}
        {/* ========================================================================= */}
        {portalMode === 'customer' ? (
          <CustomerPortal
            customers={customers}
            quotations={quotations}
            invoices={invoices}
            deliveries={deliveries}
            businesses={businesses}
            messages={messages}
            fcmToken={fcmToken}
            onEnableFcm={handleEnableFcm}
            onSendMessage={handleSendMessage}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
            onUpdateCustomerSelf={handleUpdateCustomerSelf}
            onApproveQuote={handleApproveQuote}
          />
        ) : (
          /* ========================================================================= */
          /* 2. BUSINESS WORKSPACE: REQUIRES LOGIN FIRST                               */
          /* ========================================================================= */
          !currentUser ? (
            <AuthGate
              onSuccess={() => {}}
              onSwitchToCustomerPortal={() => setPortalMode('customer')}
            />
          ) : (
            <div className="space-y-6">
              
              {/* Workspace Status Bar */}
              <div className="p-3.5 rounded-2xl liquid-card border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-700 dark:text-slate-200">
                    Logged in:
                  </span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    {currentUser.email}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Production Suite
                  </span>
                  {activeBusiness.name && (
                    <>
                      <span className="text-slate-400">·</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {activeBusiness.name}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-500 dark:text-slate-400">
                  <button
                    onClick={() => {
                      setIsCreatingNewBusiness(false);
                      setIsOnboardingModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition flex items-center gap-1.5 shadow-sm"
                    title="Configure Legal Entity, GSTIN & Bank Details"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Company & Bank Setup</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="text-rose-500 hover:underline font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {/* TAB PANELS: Zoho Production Suite Workflows */}
              {activeBizTab === 'dashboard' && (
                <ExecutiveDashboard
                  quotations={quotations}
                  invoices={invoices}
                  deliveries={deliveries}
                  deals={deals}
                  projects={projects}
                  customers={customers}
                  onNavigateTab={(tab) => setActiveBizTab(tab)}
                  onCreateQuote={handleCreateNewQuote}
                  onCreateInvoice={() => {
                    const newInvId = `inv_${Date.now()}`;
                    const firstCustId = Object.keys(customers)[0] || '';
                    const cust = customers[firstCustId];
                    const today = new Date().toISOString().split('T')[0];
                    const due = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];

                    const newInv: Invoice = {
                      id: newInvId,
                      bizId: activeBusiness.bizId,
                      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Object.keys(invoices).length + 1).padStart(3, '0')}`,
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
                      terms: 'Payment due within 15 days of invoice date via Bank NEFT / RTGS transfer.',
                      createdAt: Date.now(),
                    };
                    handleSaveInvoice(newInv);
                    setActiveBizTab('invoices');
                  }}
                />
              )}

              {activeBizTab === 'quotations' && (
                <QuotationEditor
                  quotations={quotations}
                  activeQuoteId={activeQuoteId}
                  onSelectQuote={(id) => setActiveQuoteId(id)}
                  onSaveQuoteField={handleSaveQuoteField}
                  onUpdateLineItem={handleUpdateLineItem}
                  onAddLineItem={handleAddLineItem}
                  onRemoveLineItem={handleRemoveLineItem}
                  onCreateNewQuote={handleCreateNewQuote}
                  onDeleteQuote={handleDeleteQuote}
                  onConvertToInvoice={handleConvertToInvoice}
                  customers={customers}
                  catalogue={catalogue}
                  editorName={currentUser.displayName || currentUser.email?.split('@')[0] || 'Business Admin'}
                  businessProfile={activeBusiness}
                />
              )}

              {activeBizTab === 'invoices' && (
                <InvoiceManager
                  invoices={invoices}
                  customers={customers}
                  catalogue={catalogue}
                  businessProfile={activeBusiness}
                  onSaveInvoice={handleSaveInvoice}
                  onDeleteInvoice={handleDeleteInvoice}
                  editorName={currentUser.displayName || currentUser.email?.split('@')[0] || 'Business Admin'}
                />
              )}

              {activeBizTab === 'deliveries' && (
                <DeliveryManager
                  deliveries={deliveries}
                  customers={customers}
                  quotations={quotations}
                  invoices={invoices}
                  businessProfile={activeBusiness}
                  currentUserEmail={currentUser.email || undefined}
                  onSaveDelivery={handleSaveDelivery}
                  onDeleteDelivery={handleDeleteDelivery}
                />
              )}

              {activeBizTab === 'deals' && (
                <DealsPipeline
                  deals={deals}
                  customers={customers}
                  onSaveDeal={handleSaveDeal}
                  onDeleteDeal={handleDeleteDeal}
                  editorName={currentUser.displayName || currentUser.email?.split('@')[0] || 'Business Admin'}
                />
              )}

              {activeBizTab === 'projects' && (
                <ProjectsManager
                  projects={projects}
                  customers={customers}
                  onSaveProject={handleSaveProject}
                  onDeleteProject={handleDeleteProject}
                  editorName={currentUser.displayName || currentUser.email?.split('@')[0] || 'Business Admin'}
                />
              )}

              {activeBizTab === 'customers' && (
                <CustomerCrm
                  customers={customers}
                  onSaveCustomer={handleSaveCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                  onOpenCustomerChat={(custId) => {
                    setCurrentThreadId(`cust_${custId}`);
                    setActiveBizTab('chat');
                  }}
                  editorName={currentUser.displayName || currentUser.email?.split('@')[0] || 'Business Admin'}
                />
              )}

              {activeBizTab === 'chat' && (
                <ChatHub
                  messages={messages}
                  currentThreadId={currentThreadId}
                  onSelectThread={(tId) => setCurrentThreadId(tId)}
                  customers={customers}
                  onSendMessage={handleSendMessage}
                  onEditMessage={handleEditMessage}
                  onDeleteMessage={handleDeleteMessage}
                  currentUserRole="BUSINESS"
                  currentUserName={currentUser.displayName || currentUser.email?.split('@')[0] || 'Business Admin'}
                />
              )}

              {activeBizTab === 'profile' && (
                <BusinessProfileEditor
                  profile={activeBusiness}
                  onSaveProfile={(updated) => handleSaveBusinessProfile({ ...activeBusiness, ...updated })}
                  editorName={currentUser.displayName || currentUser.email?.split('@')[0] || 'Business Admin'}
                />
              )}

              {activeBizTab === 'firebase_rules' && <FirebaseRulesViewer />}
            </div>
          )
        )}
      </main>

      {/* Company & Bank Onboarding Modal / Register New Business Modal */}
      <BusinessOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => {
          setIsOnboardingModalOpen(false);
          setIsCreatingNewBusiness(false);
          if (currentUser) {
            localStorage.setItem(`mourish_biz_configured_${currentUser.uid}`, 'true');
          }
        }}
        currentProfile={isCreatingNewBusiness ? null : activeBusiness}
        isCreatingNew={isCreatingNewBusiness}
        onSaveProfile={(updated) => {
          handleSaveBusinessProfile(updated);
          setIsOnboardingModalOpen(false);
          setIsCreatingNewBusiness(false);
        }}
        editorName={currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Business Admin'}
      />

      {/* Mobile & Tablet Touch Navigation Bar */}
      {currentUser && (
        <MobileTouchBar
          portalMode={portalMode}
          activeBizTab={activeBizTab}
          onSelectBizTab={(tab) => setActiveBizTab(tab)}
        />
      )}
    </div>
  );
}
