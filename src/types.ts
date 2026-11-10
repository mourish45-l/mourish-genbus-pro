/**
 * Mourish GenBus Enterprise Production Suite Types
 * Zoho-style ERP, CRM, Books (Invoicing & Estimates), Inventory & Projects Architecture
 */

export type BusinessConstitution =
  | 'Proprietorship'
  | 'Partnership'
  | 'LLP'
  | 'Private Limited'
  | 'Public Limited'
  | 'One Person Company'
  | 'Trust / Society'
  | 'Enterprise';

export interface BusinessProfile {
  bizId: string;
  name: string;
  constitution?: BusinessConstitution | string; // e.g. 'Proprietorship', 'Private Limited'
  businessTypes?: string[]; // Multiple business sectors/types allowed (e.g. ['Retail', 'Manufacturing', 'Services'])
  gstin: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  // Official Bank Details for NEFT / RTGS Invoicing
  bankName: string;
  bankAccountNo: string;
  bankIfsc: string;
  bankBranch: string;
  signatoryName: string;
  signatoryTitle: string;
  lastEditedBy?: string;
  logoUrl?: string; // Uploaded custom company logo (Base64 data URL)
  division?: string;
  createdAt?: number;
  createdBy?: string;
}

export interface CatalogueItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  hsn: string;
  unit: string; // 'Nos' | 'Meters' | 'Sets' | 'Lots' | 'Kits' | 'Units'
  rate: number; // Selling Price (excl. GST)
  purchaseCost: number; // Cost Price
  gst: number; // GST Rate (e.g. 18, 12, 5, 0)
  stockQuantity: number;
  reorderLevel: number;
  updatedBy?: string;
}

export interface StockAdjustment {
  id: string;
  itemId: string;
  itemName: string;
  type: 'INWARD' | 'DISPATCH' | 'DAMAGE' | 'CORRECTION';
  quantity: number;
  reason: string;
  timestamp: number;
  dateString: string;
  by: string;
}

export interface CustomerRecord {
  id: string;
  bizId: string;
  name: string; // Client / Organization / Entity name
  contactPerson: string;
  phone: string;
  email: string;
  company: string;
  gstin?: string;
  address?: string;
  department?: string; // e.g. 'Procurement', 'Operations', 'Finance', 'Billing'
  updatedBy?: string;
  createdAt?: number;
}

export interface QuotationLineItem {
  name: string;
  hsn?: string;
  unit?: string;
  qty: number;
  rate: number;
  gst: number;
}

export interface Quotation {
  id: string;
  bizId: string;
  quoteNumber: string;
  title: string;
  customerId: string;
  customerName: string;
  validUntil: string;
  status: 'DRAFT' | 'SENT' | 'FINALIZED' | 'APPROVED' | 'CONVERTED' | 'REJECTED';
  discount: number;
  notes: string;
  terms: string;
  items: QuotationLineItem[];
  convertedToInvoiceId?: string;
  customerApproved?: boolean;
  customerApprovedAt?: string;
  customerSignatory?: string;
  lastEditedBy?: string;
  lastEditedAt?: string;
  createdAt?: number;
}

export interface Invoice {
  id: string;
  bizId: string;
  invoiceNumber: string; // e.g. 'INV-2026-001'
  fromQuotationId?: string;
  quoteNumber?: string;
  customerId: string;
  customerName: string;
  customerGstin?: string;
  customerAddress?: string;
  issueDate: string;
  dueDate: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'PARTIAL' | 'OVERDUE';
  items: QuotationLineItem[];
  discount: number;
  notes: string;
  terms: string;
  paidAmount: number;
  paymentMethod?: 'BANK_NEFT_RTGS' | 'CHEQUE' | 'ONLINE_TRANSFER' | 'CASH';
  paymentReference?: string;
  paidAt?: string;
  createdAt?: number;
}

export interface Deal {
  id: string;
  bizId: string;
  title: string; // e.g. "Commercial Supply Contract 2026"
  customerId: string;
  customerName: string;
  value: number; // Deal value in INR
  stage: 'QUALIFICATION' | 'SITE_SURVEY' | 'PROPOSAL_SENT' | 'TECHNICAL_EVAL' | 'NEGOTIATION' | 'WON' | 'LOST';
  probability: number; // 0 - 100
  expectedCloseDate: string;
  notes?: string;
  assignedTo?: string;
  createdAt: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface Project {
  id: string;
  bizId: string;
  name: string; // e.g. "Enterprise ERP Deployment & Systems Integration"
  customerId: string;
  customerName: string;
  scope: string; // e.g. "Requirements Gathering, Hardware Delivery & Rollout"
  startDate: string;
  targetDate: string;
  status: 'PLANNING' | 'EXECUTION' | 'PRESSURE_TESTING' | 'COMMISSIONED';
  progress: number; // 0 - 100
  leadEngineer: string;
  milestones: ProjectMilestone[];
  createdAt: number;
}

export interface DeliveryItem {
  name: string;
  qtyDispatched: number;
  unit: string;
  notes?: string;
}

export interface DeliveryChallan {
  id: string;
  bizId: string;
  challanNumber: string; // e.g. 'DC-2026-001'
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  fromQuotationId?: string;
  fromInvoiceId?: string;
  dispatchDate: string;
  expectedDeliveryDate: string;
  carrierName: string; // e.g. 'VRL Logistics' or 'Direct Dedicated Vehicle'
  vehicleOrLrNumber: string; // Vehicle / LR Waybill #
  driverContact?: string;
  status: 'PREPARING' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED';
  items: DeliveryItem[];
  receivedBy?: string;
  deliveredAt?: string;
  proofNotes?: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'BUSINESS' | 'CUSTOMER';
  text: string;
  sha256Hash: string; // 64-character SHA-256 integrity hash
  fileName?: string | null;
  fileType?: string | null;
  fileData?: string | null;
  seenByReceiver: boolean;
  edited: boolean;
  editedBeforeSeen: boolean;
  timestamp: number;
  timeString: string;
}

export type PortalMode = 'business' | 'customer';

export type BusinessTab =
  | 'dashboard'
  | 'quotations'
  | 'invoices'
  | 'deliveries'
  | 'deals'
  | 'projects'
  | 'customers'
  | 'chat'
  | 'profile'
  | 'firebase_rules';

