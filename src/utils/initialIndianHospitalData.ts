/**
 * Initial Production Data for Common Indian Hospitals
 * Apollo Hospitals, Kauvery Hospital, Kovai Medical Center (KMCH), etc.
 */
import type { Quotation, Invoice, DeliveryChallan, Deal, Project } from '../types';

export const INITIAL_INDIAN_QUOTATIONS: Record<string, Quotation> = {
  qt_apollo_01: {
    id: 'qt_apollo_01',
    bizId: 'mourish_developers_hq',
    quoteNumber: 'QT-2026-101',
    title: 'Apollo Speciality Hospitals 150-Bed MGPS & 4 Modular OT Pipeline',
    customerId: 'hosp_apollo_chennai',
    customerName: 'Apollo Speciality Hospitals',
    validUntil: '2026-12-15',
    status: 'FINALIZED',
    customerApproved: true,
    customerApprovedAt: '2026-11-05T10:30:00Z',
    customerSignatory: 'Dr. K. Venkataraman (Medical Director)',
    discount: 25000,
    notes: 'Turnkey Supply, Installation, Testing & Commissioning (SITC) of Medical Gas Pipeline according to HTM-02-01 & ISO 7396-1 standards.',
    terms: 'Payment: 50% advance with confirmed PO, 40% on material dispatch, 10% after pressure leak test & commissioning certificate.',
    items: [
      {
        name: 'BS Standard Medical Gas Terminal Unit Outlets (Oxygen / Nitrous / Vacuum / Medical Air)',
        hsn: '9019',
        qty: 60,
        rate: 1450,
        gst: 18,
        unit: 'Nos'
      },
      {
        name: 'Medical Oxygen Flowmeter Unit with Polycarbonate Humidifier Bottle (0-15 LPM)',
        hsn: '9019',
        qty: 40,
        rate: 1850,
        gst: 18,
        unit: 'Nos'
      },
      {
        name: 'EN 13348 Certified Medical Grade Degreased Copper Pipe (28mm OD x 1.2mm)',
        hsn: '7411',
        qty: 120,
        rate: 1200,
        gst: 18,
        unit: 'Meters'
      },
      {
        name: 'Ceiling Mounted Double Arm Surgeon OT Pendant with Gas & Power Consolidation',
        hsn: '9018',
        qty: 4,
        rate: 165000,
        gst: 18,
        unit: 'Sets'
      }
    ],
    createdAt: 1731100000000,
    lastEditedBy: 'Mourish Nithin',
    lastEditedAt: '10:30 AM'
  },
  qt_kauvery_02: {
    id: 'qt_kauvery_02',
    bizId: 'mourish_developers_hq',
    quoteNumber: 'QT-2026-102',
    title: 'Kauvery Hospital & Heart City ICU & Cryogenic Liquid Oxygen System',
    customerId: 'hosp_kauvery_trichy',
    customerName: 'Kauvery Hospital & Heart City',
    validUntil: '2026-12-20',
    status: 'FINALIZED',
    customerApproved: false,
    discount: 15000,
    notes: 'Includes Emergency Oxygen Manifold with auto-changeover control panel, vacuum suction units & alarm annunciators.',
    terms: 'Warranty: 18 months standard replacement warranty on all manifold regulators and alarms.',
    items: [
      {
        name: 'Fully Automatic Oxygen Changeover Manifold (2x10 Cylinder Bank Capacity)',
        hsn: '9019',
        qty: 1,
        rate: 285000,
        gst: 18,
        unit: 'Sets'
      },
      {
        name: 'High Vacuum Ward Suction Unit with 2000ml Shatterproof Polycarbonate Jar',
        hsn: '9019',
        qty: 30,
        rate: 2200,
        gst: 18,
        unit: 'Nos'
      },
      {
        name: 'Digital Area Gas Alarm Panel with Audio-Visual Low Pressure Transducers (4 Gas)',
        hsn: '9031',
        qty: 3,
        rate: 34500,
        gst: 18,
        unit: 'Sets'
      }
    ],
    createdAt: 1731102000000,
    lastEditedBy: 'Mourish Nithin',
    lastEditedAt: '11:15 AM'
  }
};

export const INITIAL_INDIAN_INVOICES: Record<string, Invoice> = {
  inv_apollo_01: {
    id: 'inv_apollo_01',
    bizId: 'mourish_developers_hq',
    invoiceNumber: 'INV-2026-081',
    fromQuotationId: 'qt_apollo_01',
    quoteNumber: 'QT-2026-101',
    customerId: 'hosp_apollo_chennai',
    customerName: 'Apollo Speciality Hospitals',
    customerGstin: '33AABCA0123A1Z8',
    customerAddress: 'No. 21, Greams Lane, Thousand Lights, Chennai, Tamil Nadu 600006',
    issueDate: '2026-11-01',
    dueDate: '2026-11-20',
    status: 'PARTIAL',
    discount: 25000,
    paidAmount: 500000,
    paymentMethod: 'BANK_NEFT_RTGS',
    paymentReference: 'HDFCR52026110299841',
    paidAt: '2026-11-02',
    notes: 'Advance mobilization payment received via RTGS. Balance due upon delivery and pressure testing.',
    terms: 'Remit balance payment via NEFT/RTGS to HDFC Bank Acc: 50200084920193, IFSC: HDFC0001824.',
    items: [
      {
        name: 'BS Standard Medical Gas Terminal Unit Outlets (Oxygen / Nitrous / Vacuum / Medical Air)',
        hsn: '9019',
        qty: 60,
        rate: 1450,
        gst: 18
      },
      {
        name: 'Medical Oxygen Flowmeter Unit with Polycarbonate Humidifier Bottle (0-15 LPM)',
        hsn: '9019',
        qty: 40,
        rate: 1850,
        gst: 18
      },
      {
        name: 'EN 13348 Certified Medical Grade Degreased Copper Pipe (28mm OD x 1.2mm)',
        hsn: '7411',
        qty: 120,
        rate: 1200,
        gst: 18
      },
      {
        name: 'Ceiling Mounted Double Arm Surgeon OT Pendant with Gas & Power Consolidation',
        hsn: '9018',
        qty: 4,
        rate: 165000,
        gst: 18
      }
    ],
    createdAt: 1731100500000
  }
};

export const INITIAL_INDIAN_DELIVERIES: Record<string, DeliveryChallan> = {
  del_apollo_01: {
    id: 'del_apollo_01',
    bizId: 'mourish_developers_hq',
    challanNumber: 'DC-2026-042',
    customerId: 'hosp_apollo_chennai',
    customerName: 'Apollo Speciality Hospitals',
    customerPhone: '9659233313',
    customerAddress: 'Apollo Speciality Hospitals, Greams Lane, Thousand Lights, Chennai, Tamil Nadu',
    fromQuotationId: 'qt_apollo_01',
    fromInvoiceId: 'inv_apollo_01',
    dispatchDate: '2026-11-07',
    expectedDeliveryDate: '2026-11-10',
    carrierName: 'VRL Logistics (Dedicated MGPS Transit)',
    vehicleOrLrNumber: 'TN 01 AB 8844 / LR# 994021',
    driverContact: '9840112233',
    status: 'IN_TRANSIT',
    items: [
      {
        name: 'Medical Grade EN 13348 Degreased Copper Pipe (28mm & 22mm)',
        qtyDispatched: 120,
        unit: 'Meters',
        notes: 'Batch #CP-8841 certified degreased'
      },
      {
        name: 'BS Standard Medical Gas Terminal Unit Outlets (O2/N2O/Air/Vac)',
        qtyDispatched: 60,
        unit: 'Nos',
        notes: 'Gas-specific colour coded collar pins'
      },
      {
        name: 'High-Pressure Oxygen Gas Manifold Control Panel',
        qtyDispatched: 1,
        unit: 'Sets',
        notes: 'Pre-tested at 150 bar nitrogen test'
      }
    ],
    createdAt: 1731102500000
  },
  del_kauvery_02: {
    id: 'del_kauvery_02',
    bizId: 'mourish_developers_hq',
    challanNumber: 'DC-2026-043',
    customerId: 'hosp_kauvery_trichy',
    customerName: 'Kauvery Hospital & Heart City',
    customerPhone: '9487410078',
    customerAddress: 'Kauvery Hospital, Cantonment, Tiruchirappalli, Tamil Nadu',
    dispatchDate: '2026-11-05',
    expectedDeliveryDate: '2026-11-06',
    carrierName: 'Direct Express Transit',
    vehicleOrLrNumber: 'TN 45 BK 3312 / LR# 88120',
    driverContact: '9443155667',
    status: 'DELIVERED',
    receivedBy: 'Thiru. R. Senthil Kumar (Biomedical Head)',
    deliveredAt: '2026-11-06T14:20:00Z',
    items: [
      {
        name: 'Fully Automatic Oxygen Changeover Manifold (2x10 Bank)',
        qtyDispatched: 1,
        unit: 'Sets',
        notes: 'Installed and acknowledged in central plant room'
      },
      {
        name: 'High Vacuum Ward Suction Units with Polycarbonate Jars',
        qtyDispatched: 30,
        unit: 'Nos',
        notes: 'Inspected and verified'
      }
    ],
    createdAt: 1731101500000
  }
};

export const INITIAL_INDIAN_DEALS: Record<string, Deal> = {
  deal_apollo_01: {
    id: 'deal_apollo_01',
    bizId: 'mourish_developers_hq',
    title: 'Apollo Speciality Hospitals 150-Bed MGPS & 4 Modular OT Turnkey',
    customerId: 'hosp_apollo_chennai',
    customerName: 'Apollo Speciality Hospitals',
    value: 1250000,
    stage: 'WON',
    probability: 100,
    expectedCloseDate: '2026-11-15',
    assignedTo: 'Mourish Nithin',
    notes: 'Purchase order received. Installation phase commenced.',
    createdAt: 1731100000000
  },
  deal_kauvery_02: {
    id: 'deal_kauvery_02',
    bizId: 'mourish_developers_hq',
    title: 'Kauvery Hospital ICU Expansion & Medical Gas Pipeline',
    customerId: 'hosp_kauvery_trichy',
    customerName: 'Kauvery Hospital & Heart City',
    value: 780000,
    stage: 'NEGOTIATION',
    probability: 80,
    expectedCloseDate: '2026-11-28',
    assignedTo: 'Mourish Nithin',
    notes: 'Technical evaluation cleared by chief biomedical engineer.',
    createdAt: 1731101000000
  },
  deal_kmch_03: {
    id: 'deal_kmch_03',
    bizId: 'mourish_developers_hq',
    title: 'KMCH Coimbatore Emergency Trauma Gas Terminal Network',
    customerId: 'hosp_kmch_cbe',
    customerName: 'Kovai Medical Center and Hospital (KMCH)',
    value: 950000,
    stage: 'SITE_SURVEY',
    probability: 60,
    expectedCloseDate: '2026-12-05',
    assignedTo: 'Lead Engineer',
    notes: 'Site survey conducted for pipeline riser routing and zone valve boxes.',
    createdAt: 1731102000000
  }
};

export const INITIAL_INDIAN_PROJECTS: Record<string, Project> = {
  proj_apollo_01: {
    id: 'proj_apollo_01',
    bizId: 'mourish_developers_hq',
    name: 'Apollo Speciality Hospitals 150-Bed MGPS & Modular OT Complex',
    customerId: 'hosp_apollo_chennai',
    customerName: 'Apollo Speciality Hospitals',
    scope: 'Manifold Room, 4 Surgeon Pendants, 60 Gas Outlets, 28mm Copper Piping & Area Alarms',
    startDate: '2026-11-01',
    targetDate: '2026-12-15',
    status: 'EXECUTION',
    progress: 65,
    leadEngineer: 'Er. Mourish Nithin',
    createdAt: 1731100000000,
    milestones: [
      { id: 'm1', title: 'Architectural Riser & Hospital Site Survey', completed: true, completedAt: '2026-11-02' },
      { id: 'm2', title: 'Copper Pipe Brazing with Nitrogen Purge', completed: true, completedAt: '2026-11-05' },
      { id: 'm3', title: 'Modular OT Ceiling Surgeon Pendant Rigging', completed: true, completedAt: '2026-11-08' },
      { id: 'm4', title: 'Pressure Leak Hold Test at 1.5x Working Pressure', completed: false },
      { id: 'm5', title: 'Gas Terminal Outlets Flow & Cross-Connection Test', completed: false },
      { id: 'm6', title: 'Alarm Panel Sensor Calibration & Handover Certificate', completed: false }
    ]
  }
};
