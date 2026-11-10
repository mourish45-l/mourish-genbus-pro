import type { DocumentTheme, AccentColor } from '../types';

export interface DocumentStyleOption {
  id: DocumentTheme;
  name: string;
  description: string;
  badge: string;
  icon: string;
}

export const DOCUMENT_STYLES: DocumentStyleOption[] = [
  {
    id: 'bold',
    name: 'Bold High-Impact',
    description: 'Vibrant full-bleed header banner with large typography & high-contrast summary',
    badge: 'Trending',
    icon: 'bx-bolt-circle',
  },
  {
    id: 'modern',
    name: 'Modern Executive',
    description: 'Smooth rounded aesthetic with soft accent cards and elegant typography',
    badge: 'Popular',
    icon: 'bx-layer',
  },
  {
    id: 'classic',
    name: 'Classic GST Boxed',
    description: 'Traditional Indian GST ruled format with explicit boxed columns and tax grid',
    badge: 'Standard GST',
    icon: 'bx-grid-alt',
  },
  {
    id: 'corporate',
    name: 'Corporate Navy',
    description: 'Deep contrast executive header, verified company seal and dual-column ledger',
    badge: 'Enterprise',
    icon: 'bx-building',
  },
  {
    id: 'minimal',
    name: 'Minimalist Clean',
    description: 'Understated monochrome typography with fine hairline rules & max whitespace',
    badge: 'Clean',
    icon: 'bx-minus',
  },
];

export interface AccentColorOption {
  id: AccentColor;
  name: string;
  hex: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeClass: string;
  lightBgClass: string;
  gradientHeader: string;
}

export const ACCENT_COLORS: AccentColorOption[] = [
  {
    id: 'indigo',
    name: 'Royal Indigo',
    hex: '#4f46e5',
    bgClass: 'bg-indigo-600',
    textClass: 'text-indigo-600 dark:text-indigo-400',
    borderClass: 'border-indigo-600',
    badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    lightBgClass: 'bg-indigo-50/70 dark:bg-indigo-950/40',
    gradientHeader: 'from-indigo-600 via-indigo-700 to-indigo-900',
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    hex: '#059669',
    bgClass: 'bg-emerald-600',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    borderClass: 'border-emerald-600',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    lightBgClass: 'bg-emerald-50/70 dark:bg-emerald-950/40',
    gradientHeader: 'from-emerald-600 via-emerald-700 to-emerald-900',
  },
  {
    id: 'crimson',
    name: 'Crimson Red',
    hex: '#e11d48',
    bgClass: 'bg-rose-600',
    textClass: 'text-rose-600 dark:text-rose-400',
    borderClass: 'border-rose-600',
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    lightBgClass: 'bg-rose-50/70 dark:bg-rose-950/40',
    gradientHeader: 'from-rose-600 via-rose-700 to-rose-900',
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    hex: '#d97706',
    bgClass: 'bg-amber-600',
    textClass: 'text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-600',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    lightBgClass: 'bg-amber-50/70 dark:bg-amber-950/40',
    gradientHeader: 'from-amber-600 via-amber-700 to-amber-900',
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    hex: '#2563eb',
    bgClass: 'bg-blue-600',
    textClass: 'text-blue-600 dark:text-blue-400',
    borderClass: 'border-blue-600',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    lightBgClass: 'bg-blue-50/70 dark:bg-blue-950/40',
    gradientHeader: 'from-blue-600 via-blue-700 to-blue-900',
  },
  {
    id: 'purple',
    name: 'Deep Purple',
    hex: '#9333ea',
    bgClass: 'bg-purple-600',
    textClass: 'text-purple-600 dark:text-purple-400',
    borderClass: 'border-purple-600',
    badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    lightBgClass: 'bg-purple-50/70 dark:bg-purple-950/40',
    gradientHeader: 'from-purple-600 via-purple-700 to-purple-900',
  },
  {
    id: 'slate',
    name: 'Executive Slate',
    hex: '#334155',
    bgClass: 'bg-slate-800',
    textClass: 'text-slate-800 dark:text-slate-200',
    borderClass: 'border-slate-800',
    badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
    lightBgClass: 'bg-slate-100/70 dark:bg-slate-800/40',
    gradientHeader: 'from-slate-800 via-slate-900 to-slate-950',
  },
];

export function getAccentConfig(colorId?: AccentColor): AccentColorOption {
  return ACCENT_COLORS.find((c) => c.id === colorId) || ACCENT_COLORS[0];
}

export interface IndustryTemplate {
  id: string;
  name: string;
  sector: string;
  icon: string;
  items: {
    name: string;
    hsn: string;
    qty: number;
    unit: string;
    rate: number;
    gst: number;
  }[];
  terms: string;
  notes: string;
}

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'trading_supply',
    name: 'General Trading & Wholesale',
    sector: 'Trading / Supply',
    icon: 'bx-package',
    items: [
      { name: 'Commercial Grade Materials (Batch A-101)', hsn: '8481', qty: 10, unit: 'Nos', rate: 4500, gst: 18 },
      { name: 'Standard Fasteners & Assembly Fittings', hsn: '7318', qty: 25, unit: 'Sets', rate: 1200, gst: 18 },
      { name: 'Surface Protective Packaging & Freight Handling', hsn: '9965', qty: 1, unit: 'Lot', rate: 3500, gst: 18 },
    ],
    terms: 'Goods once sold cannot be returned without prior written authorization.',
    notes: 'Payment: 50% advance along with Purchase Order, balance 50% against delivery challan.',
  },
  {
    id: 'it_services',
    name: 'IT, Cloud & Software Services',
    sector: 'Technology / Software',
    icon: 'bx-code-alt',
    items: [
      { name: 'Custom Software Architecture & Systems Setup', hsn: '998313', qty: 1, unit: 'Project', rate: 65000, gst: 18 },
      { name: 'Cloud Infrastructure Deployment & API Integration', hsn: '998314', qty: 1, unit: 'Sprint', rate: 35000, gst: 18 },
      { name: 'Comprehensive Annual Maintenance & Tech Support', hsn: '998316', qty: 12, unit: 'Months', rate: 5000, gst: 18 },
    ],
    terms: 'Intellectual Property transfers to client upon final milestone payment settlement.',
    notes: 'Invoices payable within 15 days via NEFT / RTGS transfer.',
  },
  {
    id: 'contracting_epc',
    name: 'Engineering & Turnkey Contracts',
    sector: 'Engineering / Contracting',
    icon: 'bx-wrench',
    items: [
      { name: 'Site Technical Survey, Design & Engineering Layout', hsn: '998332', qty: 1, unit: 'Job', rate: 25000, gst: 18 },
      { name: 'On-site Turnkey Installation & Mechanical Erection', hsn: '995469', qty: 1, unit: 'Job', rate: 75000, gst: 18 },
      { name: 'Pre-commissioning Quality Inspection & Testing Report', hsn: '998346', qty: 1, unit: 'Certificate', rate: 15000, gst: 18 },
    ],
    terms: 'One year comprehensive warranty on workmanship and commissioning integrity.',
    notes: 'Mobilization advance: 30%, Material supply: 50%, Commissioning: 20%.',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Fabrication',
    sector: 'Manufacturing',
    icon: 'bx-cog',
    items: [
      { name: 'Precision CNC Machined Aluminum Components', hsn: '7616', qty: 50, unit: 'Pieces', rate: 1850, gst: 18 },
      { name: 'Heavy Duty Structural Steel Base Assembly', hsn: '7308', qty: 4, unit: 'Units', rate: 14000, gst: 18 },
      { name: 'Powder Coating & Anti-Corrosion Treatment', hsn: '9988', qty: 1, unit: 'Lot', rate: 8500, gst: 18 },
    ],
    terms: 'Delivery ex-works factory. Inspection welcome prior to dispatch.',
    notes: 'Lead time: 2 to 3 weeks from receipt of approved drawings and advance.',
  },
  {
    id: 'consulting',
    name: 'Consulting & Professional Services',
    sector: 'Consulting / Advisory',
    icon: 'bx-briefcase-alt-2',
    items: [
      { name: 'Strategic Business Feasibility & Process Audit', hsn: '998311', qty: 1, unit: 'Engagement', rate: 45000, gst: 18 },
      { name: 'Executive Deliverables Documentation & Roadmap', hsn: '998312', qty: 1, unit: 'Report', rate: 20000, gst: 18 },
    ],
    terms: 'Confidentiality Agreement in effect. Reports provided under non-disclosure terms.',
    notes: 'Billed upon submission of draft deliverables.',
  },
];
