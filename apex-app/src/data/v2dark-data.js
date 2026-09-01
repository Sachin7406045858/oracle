export default {
  "THEMES": {
    "dark": {
      "bg0": "#0C0D0F",
      "bg1": "#161719",
      "bg2": "#1E2024",
      "bg3": "#24262A",
      "bg4": "#2C2E34",
      "bubble": "#26282D",
      "border1": "#26282C",
      "border2": "#2E3035",
      "border3": "#232529",
      "border4": "#34363B",
      "border5": "#4A4D52",
      "text0": "#E9EAEC",
      "text0b": "#F2F3F5",
      "text1": "#A8ABB0",
      "text2": "#8B8E93",
      "text3": "#6E7176"
    },
    "light": {
      "bg0": "#F4F5F6",
      "bg1": "#FFFFFF",
      "bg2": "#F0F1F3",
      "bg3": "#E8E9EC",
      "bg4": "#DEE0E4",
      "bubble": "#EDEFF2",
      "border1": "#E1E3E7",
      "border2": "#D8DADE",
      "border3": "#E7E8EB",
      "border4": "#CBCDD3",
      "border5": "#B7BAC1",
      "text0": "#1B1D21",
      "text0b": "#0C0D0F",
      "text1": "#54575E",
      "text2": "#71747B",
      "text3": "#8A8D94"
    }
  },
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
      "id": "o2o",
      "name": "oracle.apex_o2o",
      "initials": "OO",
      "domain": "Order-to-orchestration · Oracle ERP Cloud"
    }
  ],
  "SOURCES": [
    {
      "id": "erp",
      "name": "Oracle ERP Cloud",
      "type": "Oracle App",
      "sync": "synced 5 min ago",
      "status": "connected",
      "cat": "Oracle",
      "icon": "M17.5 19a4.5 4.5 0 0 0 .42-8.98 7 7 0 0 0-13.42 1.9A4 4 0 0 0 6 19z",
      "oracle": true
    },
    {
      "id": "db",
      "name": "Oracle Database · FIN_PROD",
      "type": "Database",
      "sync": "synced 12 min ago",
      "status": "connected",
      "cat": "Oracle",
      "icon": "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 5v14c0 1.66-4.03 3-9 3s-9-1.34-9-3V5M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3",
      "oracle": true
    },
    {
      "id": "scm",
      "name": "Oracle Fusion SCM",
      "type": "Oracle App",
      "sync": "synced 1 hr ago",
      "status": "connected",
      "cat": "Oracle",
      "icon": "M17.5 19a4.5 4.5 0 0 0 .42-8.98 7 7 0 0 0-13.42 1.9A4 4 0 0 0 6 19z",
      "oracle": true
    }
  ],
  "TOOLS": [
    {
      "id": "report",
      "name": "Report Generator",
      "desc": "Structured business reports from live data",
      "tint": "green",
      "icon": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M9 13h6M9 17h6"
    },
    {
      "id": "sql",
      "name": "SQL Generator",
      "desc": "Natural language to Oracle SQL",
      "tint": "blue",
      "icon": "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 5v14c0 1.66-4.03 3-9 3s-9-1.34-9-3V5M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"
    },
    {
      "id": "insights",
      "name": "Business Insights",
      "desc": "Anomalies, trends and risks, surfaced automatically",
      "tint": "amber",
      "icon": "M3 17l6-6 4 4 8-8M15 7h6v6"
    },
    {
      "id": "audio",
      "name": "Audio Overview",
      "desc": "Narrated briefing of your selected sources",
      "tint": "green",
      "icon": "M3 18v-6a9 9 0 0 1 18 0v6M3 18a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2zM21 18a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z"
    },
    {
      "id": "dashboard",
      "name": "Dashboard Generator",
      "desc": "Auto-build KPI dashboards from queries",
      "tint": "blue",
      "icon": "M3 3h8v10H3zM13 3h8v6h-8zM13 13h8v8h-8zM3 17h8v4H3z"
    },
    {
      "id": "exec",
      "name": "Executive Summary",
      "desc": "One-page summary for leadership",
      "tint": "purple",
      "icon": "M4 7h16v13H4zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    },
    {
      "id": "docsum",
      "name": "Document Summary",
      "desc": "Condense uploaded documents to key points",
      "tint": "teal",
      "icon": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M9 15h6M9 11h2"
    }
  ],
  "TINTS": {
    "green": {
      "bgDark": "#1A231D",
      "bgLight": "#E9F5EC",
      "icon": "#85D3A2",
      "iconLight": "#3C9A5C"
    },
    "blue": {
      "bgDark": "#1A2028",
      "bgLight": "#E9F1FB",
      "icon": "#8FB8E8",
      "iconLight": "#3E7BC4"
    },
    "purple": {
      "bgDark": "#201D29",
      "bgLight": "#F1EBFB",
      "icon": "#B9A8F0",
      "iconLight": "#7C5CD6"
    },
    "pink": {
      "bgDark": "#251C22",
      "bgLight": "#FBEAF1",
      "icon": "#E39BBB",
      "iconLight": "#C05585"
    },
    "amber": {
      "bgDark": "#252017",
      "bgLight": "#FBF2E3",
      "icon": "#E5C078",
      "iconLight": "#B5852A"
    },
    "teal": {
      "bgDark": "#182323",
      "bgLight": "#E7F5F4",
      "icon": "#7BCFC9",
      "iconLight": "#2E9992"
    }
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
  "UPLOAD_OPTIONS": [
    {
      "name": "PDF",
      "icon": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6"
    },
    {
      "name": "Word",
      "icon": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M9 13h6M9 17h6"
    },
    {
      "name": "PowerPoint",
      "icon": "M3 4h18M5 4v10h14V4M12 14v3M8 21l4-4 4 4"
    },
    {
      "name": "Excel",
      "icon": "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18"
    },
    {
      "name": "CSV",
      "icon": "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18"
    }
  ],
  "CONNECT_OPTIONS": [
    {
      "name": "Oracle ERP Cloud",
      "oracle": true,
      "icon": "M17.5 19a4.5 4.5 0 0 0 .42-8.98 7 7 0 0 0-13.42 1.9A4 4 0 0 0 6 19z"
    },
    {
      "name": "Oracle Database",
      "oracle": true,
      "icon": "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 5v14c0 1.66-4.03 3-9 3s-9-1.34-9-3V5M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"
    },
    {
      "name": "Oracle Fusion Applications",
      "oracle": true,
      "icon": "M17.5 19a4.5 4.5 0 0 0 .42-8.98 7 7 0 0 0-13.42 1.9A4 4 0 0 0 6 19z"
    },
    {
      "name": "SharePoint",
      "icon": "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"
    },
    {
      "name": "SAP",
      "icon": "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 5v14c0 1.66-4.03 3-9 3s-9-1.34-9-3V5M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"
    },
    {
      "name": "Salesforce",
      "icon": "M17.5 19a4.5 4.5 0 0 0 .42-8.98 7 7 0 0 0-13.42 1.9A4 4 0 0 0 6 19z"
    },
    {
      "name": "REST API",
      "icon": "M8 3c-2 0-3 1-3 3v3c0 1.5-1 2.5-2 3 1 .5 2 1.5 2 3v3c0 2 1 3 3 3M16 3c2 0 3 1 3 3v3c0 1.5 1 2.5 2 3-1 .5-2 1.5-2 3v3c0 2-1 3-3 3"
    },
    {
      "name": "Cloud Storage",
      "icon": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
    }
  ],
  "AGENT_PROMPTS": {
    "r2r": [
      "Ledger/Journal",
      "Ledger Balance",
      "Ledger Summary"
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
  "ACCENT_TEXT": {
    "#E31837": "#FF5C74",
    "#C74634": "#F0937A",
    "#7A1C2B": "#D96A7C"
  }
};
