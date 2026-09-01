export default {
  "AGENTS": [
    {
      "id": "erp",
      "name": "ERP Agent",
      "initials": "ER",
      "domain": "Cross-module Oracle ERP queries"
    },
    {
      "id": "o2c",
      "name": "Order-to-Cash Agent",
      "initials": "OC",
      "domain": "Orders, invoicing, collections"
    },
    {
      "id": "ap",
      "name": "Accounts Payable Agent",
      "initials": "AP",
      "domain": "Invoices, payments, holds"
    },
    {
      "id": "ar",
      "name": "Accounts Receivable Agent",
      "initials": "AR",
      "domain": "Receivables, aging, disputes"
    },
    {
      "id": "proc",
      "name": "Procurement Agent",
      "initials": "PR",
      "domain": "Procurement · Oracle ERP Cloud"
    },
    {
      "id": "fin",
      "name": "Finance Agent",
      "initials": "FI",
      "domain": "GL, close, financial reporting"
    },
    {
      "id": "scm",
      "name": "Supply Chain Agent",
      "initials": "SC",
      "domain": "Planning, inventory, logistics"
    },
    {
      "id": "hr",
      "name": "HR Agent",
      "initials": "HR",
      "domain": "Workforce, payroll, Fusion HCM"
    },
    {
      "id": "mfg",
      "name": "Manufacturing Agent",
      "initials": "MF",
      "domain": "Work orders, quality, shop floor"
    },
    {
      "id": "cs",
      "name": "Customer Service Agent",
      "initials": "CS",
      "domain": "Cases, SLAs, service history"
    },
    {
      "id": "comp",
      "name": "Compliance Agent",
      "initials": "CO",
      "domain": "Controls, audit, policy checks"
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
    },
    {
      "id": "sp",
      "name": "SharePoint · /Procurement",
      "type": "34 documents",
      "sync": "syncing…",
      "status": "syncing",
      "cat": "Apps",
      "icon": "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"
    },
    {
      "id": "api",
      "name": "Vendor Master API",
      "type": "REST API",
      "sync": "synced 2 min ago",
      "status": "connected",
      "cat": "Apps",
      "icon": "M8 3c-2 0-3 1-3 3v3c0 1.5-1 2.5-2 3 1 .5 2 1.5 2 3v3c0 2 1 3 3 3M16 3c2 0 3 1 3 3v3c0 1.5 1 2.5 2 3-1 .5-2 1.5-2 3v3c0 2-1 3-3 3"
    },
    {
      "id": "pdf",
      "name": "Supplier Contracts Q2.pdf",
      "type": "PDF",
      "sync": "uploaded today",
      "status": "ready",
      "cat": "Files",
      "icon": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6"
    },
    {
      "id": "xlsx",
      "name": "PO_Register_FY26.xlsx",
      "type": "Excel",
      "sync": "uploaded yesterday",
      "status": "ready",
      "cat": "Files",
      "icon": "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18"
    },
    {
      "id": "csv",
      "name": "AP_Aging_June.csv",
      "type": "CSV",
      "sync": "uploaded 3 days ago",
      "status": "ready",
      "cat": "Files",
      "icon": "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18"
    }
  ],
  "TOOLS": [
    {
      "id": "report",
      "name": "Report Generator",
      "desc": "Structured business reports from live data",
      "icon": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M9 13h6M9 17h6"
    },
    {
      "id": "sql",
      "name": "SQL Generator",
      "desc": "Natural language to Oracle SQL",
      "icon": "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 5v14c0 1.66-4.03 3-9 3s-9-1.34-9-3V5M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"
    },
    {
      "id": "insights",
      "name": "Business Insights",
      "desc": "Anomalies, trends and risks, surfaced automatically",
      "icon": "M3 17l6-6 4 4 8-8M15 7h6v6"
    },
    {
      "id": "audio",
      "name": "Audio Overview",
      "desc": "Narrated briefing of your selected sources",
      "icon": "M3 18v-6a9 9 0 0 1 18 0v6M3 18a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2zM21 18a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z"
    },
    {
      "id": "dashboard",
      "name": "Dashboard Generator",
      "desc": "Auto-build KPI dashboards from queries",
      "icon": "M3 3h8v10H3zM13 3h8v6h-8zM13 13h8v8h-8zM3 17h8v4H3z"
    },
    {
      "id": "exec",
      "name": "Executive Summary",
      "desc": "One-page summary for leadership",
      "icon": "M4 7h16v13H4zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    },
    {
      "id": "docsum",
      "name": "Document Summary",
      "desc": "Condense uploaded documents to key points",
      "icon": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M9 15h6M9 11h2"
    },
    {
      "id": "mindmap",
      "name": "Mind Map",
      "desc": "Visualize concepts across sources",
      "icon": "M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0zM12 9V4M12 15v5M9 12H4M15 12h5"
    },
    {
      "id": "flash",
      "name": "Flashcards",
      "desc": "Key facts as reviewable cards",
      "icon": "M4 6h13v11H4zM7 6V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-1"
    },
    {
      "id": "quiz",
      "name": "Quiz",
      "desc": "Test knowledge of your sources",
      "icon": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2.5 2-2.5 3.5M12 17h.01"
    },
    {
      "id": "timeline",
      "name": "Timeline",
      "desc": "Chronology of events and milestones",
      "icon": "M3 5h10M3 10h14M3 15h8M3 20h12"
    },
    {
      "id": "infographic",
      "name": "Infographic",
      "desc": "Visual one-pager of key findings",
      "icon": "M21 12A9 9 0 1 1 12 3v9zM21 8a9 9 0 0 0-5-4.5V8z"
    },
    {
      "id": "code",
      "name": "Code Interpreter",
      "desc": "Run analysis on tabular data",
      "icon": "M8 9l-4 3 4 3M16 9l4 3-4 3M13 5l-2 14"
    },
    {
      "id": "workflow",
      "name": "Workflow Generator",
      "desc": "Draft automation workflows for Oracle apps",
      "icon": "M4 3h5v5H4zM15 16h5v5h-5zM6.5 8v4a2 2 0 0 0 2 2h7a2 2 0 0 1 2 2v0"
    },
    {
      "id": "deck",
      "name": "Presentation Generator",
      "desc": "Slide decks from your insights",
      "icon": "M3 4h18M5 4v10h14V4M12 14v3M8 21l4-4 4 4"
    }
  ],
  "PO_ROWS": [
    {
      "po": "PO-20481",
      "supplier": "Acme Industrial",
      "amount": "$412,900",
      "due": "Jun 12",
      "days": "20",
      "impact": "Critical",
      "badgeColor": "#B42318",
      "badgeBg": "#FEE4E2"
    },
    {
      "po": "PO-20395",
      "supplier": "Meridian Steel",
      "amount": "$287,400",
      "due": "Jun 18",
      "days": "14",
      "impact": "Critical",
      "badgeColor": "#B42318",
      "badgeBg": "#FEE4E2"
    },
    {
      "po": "PO-20512",
      "supplier": "Nexa Components",
      "amount": "$198,750",
      "due": "Jun 21",
      "days": "11",
      "impact": "High",
      "badgeColor": "#B54708",
      "badgeBg": "#FEF0C7"
    },
    {
      "po": "PO-20437",
      "supplier": "TransGlobal Freight",
      "amount": "$154,200",
      "due": "Jun 24",
      "days": "8",
      "impact": "High",
      "badgeColor": "#B54708",
      "badgeBg": "#FEF0C7"
    },
    {
      "po": "PO-20488",
      "supplier": "Orion Packaging",
      "amount": "$96,300",
      "due": "Jun 27",
      "days": "5",
      "impact": "Medium",
      "badgeColor": "#42536B",
      "badgeBg": "#EBEFF5"
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
  "PROMPT_TEXTS": [
    "Explain the Accounts Payable process",
    "Show delayed purchase orders",
    "Compare monthly revenue by region",
    "Summarize uploaded contracts",
    "Generate Oracle SQL for open invoices",
    "Identify procurement risks this quarter"
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
  ]
};
