export default {
  "AGENTS": [
    {
      "id": "r2r",
      "name": "oracle.apex_r2r",
      "initials": "RR",
      "domain": "Ledger, journals, GL close · Oracle Fusion"
    },
    {
      "id": "p2p",
      "name": "oracle.apex_p2p",
      "initials": "PP",
      "domain": "Procure-to-pay · Oracle ERP Cloud"
    },
    {
      "id": "o2c",
      "name": "oracle.apex_o2c",
      "initials": "OC",
      "domain": "Order-to-cash · Oracle ERP Cloud"
    }
  ],
  "FUSION_AGENTS": [
    {
      "id": "supplier-invoice",
      "name": "Supplier Invoice Details",
      "cat": "Finance",
      "desc": "Retrieve supplier invoice status and details",
      "icon": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 15h6M9 11h2"
    },
    {
      "id": "customer-billing",
      "name": "Customer Billing Invoice",
      "cat": "Finance",
      "desc": "Customer billing and AR invoice inquiries",
      "icon": "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
    },
    {
      "id": "gl-balance",
      "name": "GL Balance Agent",
      "cat": "Finance",
      "desc": "General ledger balance queries by period",
      "icon": "M3 3v18h18M8 17V9M13 17V5M18 17v-6"
    },
    {
      "id": "savings-leakage",
      "name": "Procurement Savings Leakage",
      "cat": "Procurement",
      "desc": "Detect negotiated-savings leakage in spend",
      "icon": "M22 12h-4l-3 9L9 3l-3 9H2"
    },
    {
      "id": "supplier-risk",
      "name": "Supplier Risk Analyzer",
      "cat": "Procurement",
      "desc": "Assess supplier risk and compliance exposure",
      "icon": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4"
    },
    {
      "id": "po-creation",
      "name": "PO Creation Agent",
      "cat": "Procurement",
      "desc": "Create purchase orders from requests",
      "icon": "M6 6h15l-1.5 9h-12zM6 6L5 2H2M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
    },
    {
      "id": "stock-check",
      "name": "Inventory Stock Check",
      "cat": "Supply Chain",
      "desc": "Check on-hand stock across warehouses",
      "icon": "M20 7h-9M14 17H5M17 21a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM7 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
    },
    {
      "id": "goods-receipt",
      "name": "Goods Receipt Posting",
      "cat": "Supply Chain",
      "desc": "Post goods receipts against open POs",
      "icon": "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7l8.7 5 8.7-5M12 22V12"
    },
    {
      "id": "margin-discount",
      "name": "Margin & Discount",
      "cat": "Sales",
      "desc": "Analyze order margins and discount impact",
      "icon": "M4 4h16v16H4zM9 9l6 6M15 9l-6 6"
    },
    {
      "id": "order-issue",
      "name": "Order Issue Resolution",
      "cat": "Sales",
      "desc": "Resolve sales order holds and issues",
      "icon": "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"
    }
  ],
  "EXTERNAL_AGENTS": [
    {
      "id": "docuintel",
      "name": "DocuIntel",
      "icon": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M9 13h6M9 17h6"
    },
    {
      "id": "neuralhire",
      "name": "NeuralHire",
      "icon": "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
    },
    {
      "id": "inteaisense",
      "name": "InteAISense",
      "icon": "M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9zM19 15l.8 1.9 1.9.8-1.9.8L19 20.4l-.8-1.9-1.9-.8 1.9-.8z"
    },
    {
      "id": "errorassist",
      "name": "Error Assist",
      "icon": "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"
    },
    {
      "id": "knowledgebase",
      "name": "Knowledge Base",
      "icon": "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"
    }
  ],
  "AGENT_PROMPTS": {
    "r2r": [
      "Display Ledger, Period and financial information"
    ],
    "ap": [
      "Explain the Accounts Payable process",
      "Show invoices on payment hold",
      "AP aging by supplier",
      "Summarize duplicate invoice risks",
      "Generate SQL for open invoices",
      "Forecast this week's payment run"
    ],
    "fin": [
      "Compare monthly revenue by region",
      "Summarize Q2 close status",
      "Show budget vs. actuals by department",
      "Explain variance in operating expenses",
      "Generate SQL for trial balance",
      "Identify accounts with unusual activity"
    ],
    "p2p": [
      "Requisitions",
      "Purchase Orders",
      "Invoices",
      "Payments",
      "Requisition Summary",
      "Purchase Order Summary",
      "Invoice Summary"
    ]
  },
  "PO_ROWS": [
    {
      "po": "PO-20481",
      "supplier": "Acme Industrial",
      "amount": "$412,900",
      "due": "Jun 12",
      "days": "20",
      "impact": "Critical",
      "badgeColor": "#FF8589",
      "badgeBg": "#3A1A1B"
    },
    {
      "po": "PO-20395",
      "supplier": "Meridian Steel",
      "amount": "$287,400",
      "due": "Jun 18",
      "days": "14",
      "impact": "Critical",
      "badgeColor": "#FF8589",
      "badgeBg": "#3A1A1B"
    },
    {
      "po": "PO-20512",
      "supplier": "Nexa Components",
      "amount": "$198,750",
      "due": "Jun 21",
      "days": "11",
      "impact": "High",
      "badgeColor": "#F0BE5C",
      "badgeBg": "#332A15"
    },
    {
      "po": "PO-20437",
      "supplier": "TransGlobal Freight",
      "amount": "$154,200",
      "due": "Jun 24",
      "days": "8",
      "impact": "High",
      "badgeColor": "#F0BE5C",
      "badgeBg": "#332A15"
    },
    {
      "po": "PO-20488",
      "supplier": "Orion Packaging",
      "amount": "$96,300",
      "due": "Jun 27",
      "days": "5",
      "impact": "Medium",
      "badgeColor": "#A9BDD6",
      "badgeBg": "#212831"
    }
  ],
  "CHART": [
    {
      "label": "Raw materials",
      "value": "$980K",
      "pct": 100
    },
    {
      "label": "Components",
      "value": "$610K",
      "pct": 62
    },
    {
      "label": "Logistics",
      "value": "$420K",
      "pct": 43
    },
    {
      "label": "Packaging",
      "value": "$250K",
      "pct": 26
    },
    {
      "label": "MRO",
      "value": "$140K",
      "pct": 14
    }
  ],
  "SALES_ORDERS": [
    {
      "orderNumber": "SO_300620251",
      "lineCreationDate": "6/30/2025",
      "buyerName": "—",
      "actionType": "—",
      "transactionOn": "6/30/2025",
      "headerCreationDate": "6/30/2025",
      "status": "Closed",
      "comments": "—",
      "flagged": false,
      "paymentTerms": "TechM Immediate",
      "supplierName": "—",
      "freightTerms": "—",
      "shippingMode": "Truckload",
      "transactionType": "—",
      "customerPo": "—",
      "businessUnit": "National Water Company"
    },
    {
      "orderNumber": "SO_300620252",
      "lineCreationDate": "7/2/2025",
      "buyerName": "—",
      "actionType": "—",
      "transactionOn": "7/2/2025",
      "headerCreationDate": "7/2/2025",
      "status": "Closed",
      "comments": "—",
      "flagged": false,
      "paymentTerms": "TechM Immediate",
      "supplierName": "—",
      "freightTerms": "—",
      "shippingMode": "Truckload",
      "transactionType": "—",
      "customerPo": "—",
      "businessUnit": "National Water Company"
    },
    {
      "orderNumber": "SO_300620253",
      "lineCreationDate": "7/4/2025",
      "buyerName": "—",
      "actionType": "—",
      "transactionOn": "7/4/2025",
      "headerCreationDate": "7/4/2025",
      "status": "Closed",
      "comments": "—",
      "flagged": true,
      "paymentTerms": "TechM Immediate",
      "supplierName": "—",
      "freightTerms": "—",
      "shippingMode": "Truckload",
      "transactionType": "—",
      "customerPo": "—",
      "businessUnit": "National Water Company"
    },
    {
      "orderNumber": "SO_300620254",
      "lineCreationDate": "7/4/2025",
      "buyerName": "—",
      "actionType": "—",
      "transactionOn": "7/4/2025",
      "headerCreationDate": "7/4/2025",
      "status": "Closed",
      "comments": "—",
      "flagged": false,
      "paymentTerms": "TechM Immediate",
      "supplierName": "—",
      "freightTerms": "—",
      "shippingMode": "Truckload",
      "transactionType": "—",
      "customerPo": "—",
      "businessUnit": "National Water Company"
    },
    {
      "orderNumber": "SO_300620255",
      "lineCreationDate": "7/4/2025",
      "buyerName": "—",
      "actionType": "—",
      "transactionOn": "7/4/2025",
      "headerCreationDate": "7/4/2025",
      "status": "Processing",
      "comments": "—",
      "flagged": false,
      "paymentTerms": "TechM Immediate",
      "supplierName": "—",
      "freightTerms": "—",
      "shippingMode": "Truckload",
      "transactionType": "—",
      "customerPo": "—",
      "businessUnit": "National Water Company"
    },
    {
      "orderNumber": "SO_300620256",
      "lineCreationDate": "7/5/2025",
      "buyerName": "—",
      "actionType": "—",
      "transactionOn": "7/5/2025",
      "headerCreationDate": "7/5/2025",
      "status": "Processing",
      "comments": "—",
      "flagged": false,
      "paymentTerms": "TechM Immediate",
      "supplierName": "—",
      "freightTerms": "—",
      "shippingMode": "Truckload",
      "transactionType": "—",
      "customerPo": "—",
      "businessUnit": "National Water Company"
    }
  ],
  "GL_BALANCE_ROWS": [
    {
      "account": "1000 · Cash & Equivalents",
      "ledger": "US PRIMARY",
      "debit": "$4,210,300.00",
      "credit": "$0.00",
      "net": "$4,210,300.00",
      "status": "Posted",
      "badgeColor": "#3FB56C",
      "badgeBg": "rgba(63,181,108,.14)"
    },
    {
      "account": "1210 · Accounts Receivable",
      "ledger": "US PRIMARY",
      "debit": "$2,847,600.00",
      "credit": "$412,900.00",
      "net": "$2,434,700.00",
      "status": "Posted",
      "badgeColor": "#3FB56C",
      "badgeBg": "rgba(63,181,108,.14)"
    },
    {
      "account": "2100 · Accounts Payable",
      "ledger": "US PRIMARY",
      "debit": "$198,750.00",
      "credit": "$1,963,200.00",
      "net": "-$1,764,450.00",
      "status": "Posted",
      "badgeColor": "#3FB56C",
      "badgeBg": "rgba(63,181,108,.14)"
    },
    {
      "account": "3000 · Retained Earnings",
      "ledger": "US PRIMARY",
      "debit": "$0.00",
      "credit": "$7,120,000.00",
      "net": "-$7,120,000.00",
      "status": "Pending close",
      "badgeColor": "#B7791F",
      "badgeBg": "rgba(212,167,44,.14)"
    },
    {
      "account": "5100 · COGS",
      "ledger": "EMEA LEDGER",
      "debit": "$3,082,450.00",
      "credit": "$0.00",
      "net": "$3,082,450.00",
      "status": "Unposted",
      "badgeColor": "#E5484D",
      "badgeBg": "rgba(229,72,77,.14)"
    }
  ],
  "LEDGER_ROWS": [
    {
      "name": "ABC_AIRLINES AE",
      "periodSet": "ABC_AIRLINES",
      "ledgerId": "300000002616418",
      "typeCode": "L",
      "currency": "AED",
      "seqMode": "N",
      "desc": "ABC Airlines",
      "coaId": "3001",
      "periodType": "MONTH0037926240"
    },
    {
      "name": "Dell Primary USD Ledger",
      "periodSet": "NextGen USD Led",
      "ledgerId": "300000016590957",
      "typeCode": "L",
      "currency": "USD",
      "seqMode": "N",
      "desc": "Dell Primary USD Ledger",
      "coaId": "15001",
      "periodType": "MONTH1314600627"
    },
    {
      "name": "Ledger set - NextGen US-FAN",
      "periodSet": "NextGen USD Led",
      "ledgerId": "300000017533554",
      "typeCode": "S",
      "currency": "X",
      "seqMode": "",
      "desc": "Ledger set - NextGen US-FAN",
      "coaId": "15001",
      "periodType": "MONTH1314600627"
    },
    {
      "name": "NextGen USD Ledger IN",
      "periodSet": "NextGen USD Led",
      "ledgerId": "300000016522087",
      "typeCode": "L",
      "currency": "INR",
      "seqMode": "N",
      "desc": "",
      "coaId": "15001",
      "periodType": "MONTH1314600627"
    },
    {
      "name": "NextGen USD Ledger US",
      "periodSet": "NextGen USD Led",
      "ledgerId": "300000016522086",
      "typeCode": "L",
      "currency": "USD",
      "seqMode": "L",
      "desc": "",
      "coaId": "15001",
      "periodType": "MONTH1314600627"
    },
    {
      "name": "QR COA QA",
      "periodSet": "QR COA",
      "ledgerId": "300000003992707",
      "typeCode": "L",
      "currency": "QAR",
      "seqMode": "N",
      "desc": "",
      "coaId": "7001",
      "periodType": "MONTH0140605436"
    },
    {
      "name": "Qatar Air",
      "periodSet": "QR COA",
      "ledgerId": "300000003914408",
      "typeCode": "L",
      "currency": "QAR",
      "seqMode": "N",
      "desc": "",
      "coaId": "7001",
      "periodType": "MONTH0140605436"
    },
    {
      "name": "Qatar Air2",
      "periodSet": "QR COA",
      "ledgerId": "300000003914545",
      "typeCode": "L",
      "currency": "USD",
      "seqMode": "N",
      "desc": "",
      "coaId": "7001",
      "periodType": "MONTH0140605436"
    }
  ],
  "SUPPLIER_INVOICE_ROWS": [
    {
      "inv": "INV-104213",
      "supplier": "Acme Components",
      "po": "PO-88231",
      "amount": "$148,200.00",
      "due": "Jul 21, 2026",
      "status": "Pending approval",
      "badgeColor": "#B7791F",
      "badgeBg": "rgba(212,167,44,.14)"
    },
    {
      "inv": "INV-104188",
      "supplier": "Zenith Metals",
      "po": "PO-88104",
      "amount": "$86,450.00",
      "due": "Jul 14, 2026",
      "status": "Validated",
      "badgeColor": "#2F9E68",
      "badgeBg": "rgba(63,185,80,.13)"
    },
    {
      "inv": "INV-104102",
      "supplier": "Nordwind Logistics",
      "po": "PO-87990",
      "amount": "$42,780.00",
      "due": "Jul 09, 2026",
      "status": "On hold",
      "badgeColor": "#C42B1C",
      "badgeBg": "rgba(227,24,55,.1)"
    },
    {
      "inv": "INV-103977",
      "supplier": "Helios Packaging",
      "po": "PO-87821",
      "amount": "$19,320.00",
      "due": "Jun 30, 2026",
      "status": "Paid",
      "badgeColor": "#2F9E68",
      "badgeBg": "rgba(63,185,80,.13)"
    },
    {
      "inv": "INV-103865",
      "supplier": "Vertex Chemicals",
      "po": "PO-87710",
      "amount": "$233,900.00",
      "due": "Jun 27, 2026",
      "status": "Paid",
      "badgeColor": "#2F9E68",
      "badgeBg": "rgba(63,185,80,.13)"
    }
  ],
  "CITATIONS": [
    {
      "n": "1",
      "name": "Oracle ERP Cloud · PO_HEADERS_ALL"
    },
    {
      "n": "2",
      "name": "PO_Register_FY26.xlsx"
    },
    {
      "n": "3",
      "name": "Oracle Database · FIN_PROD"
    }
  ],
  "ACCENT_TEXT": {
    "#E31837": "#FF5C74",
    "#C74634": "#F0937A",
    "#7A1C2B": "#D96A7C"
  }
};
