import {
  Home,
  BarChart3,
  ClipboardList,
  ShieldCheck,
  Settings,
} from "lucide-react";

export const settings = {
  app_id: 'pinnacle',
  app_name: 'Workforce Intelligence Portal',
  app_logo: '/img/themes/pinnacle/icon.png',
  auth_logo: '/img/themes/pinnacle/icon.png',
  base_path: '/demo/pinnacle',
  hide_email: true,
  ai_chat: true,
  // No ai_avatar set — falls back to chatbot MessageSquare icon

  // VP Operations filter: Pinnacle's enterprise client programs shown in UI → State/Province values in the Superstore workbook.
  // Every state AND Canadian province is assigned to exactly one program so that
  // selecting all three equals the full dataset — no clear needed.
  program_state_map: {
    'Meridian Financial': [
      // US East
      'Florida', 'Georgia', 'South Carolina', 'North Carolina', 'Virginia',
      'West Virginia', 'Maryland', 'Delaware', 'New Jersey', 'Connecticut',
      'Rhode Island', 'Massachusetts', 'Vermont', 'New Hampshire', 'Maine', 'New York',
      // Canada East
      'Ontario', 'Quebec', 'New Brunswick', 'Nova Scotia', 'Prince Edward Island', 'Newfoundland',
    ],
    'Nexus Retail Group': [
      // US Midwest + South
      'Pennsylvania', 'Ohio', 'Michigan', 'Indiana', 'Illinois', 'Wisconsin',
      'Minnesota', 'Iowa', 'Missouri', 'Kentucky', 'Tennessee', 'Alabama',
      'Mississippi', 'Louisiana', 'Arkansas', 'Kansas',
      // Canada Central
      'Manitoba', 'Saskatchewan',
    ],
    'Summit Healthcare': [
      // US West + Plains
      'Texas', 'Oklahoma', 'Nebraska', 'South Dakota', 'North Dakota',
      'Colorado', 'Wyoming', 'Montana', 'Idaho', 'Utah', 'New Mexico',
      'Arizona', 'Nevada', 'California', 'Oregon', 'Washington', 'Alaska', 'Hawaii',
      // Canada West
      'Alberta', 'British Columbia', 'Northwest Territories',
    ],
  },

  // Supplier → client programs they serve. Used to populate "Filter by Client" for role 0.
  // States come from program_state_map, intersected with the supplier's authorized regions via RLS.
  supplier_client_map: {
    'Atlas Workforce Solutions': ['Meridian Financial', 'Nexus Retail Group'],
    'Apex Talent Partners':      ['Nexus Retail Group', 'Summit Healthcare'],
    'Meridian Staffing Group':   ['Meridian Financial'],
    'Vertex Workforce':          ['Nexus Retail Group'],
    'Summit Staffing':           ['Summit Healthcare'],
  },

  // Region → State/Province lookup (Superstore standard regions + Canadian provinces).
  region_state_map: {
    'East': [
      'Connecticut', 'Delaware', 'Maine', 'Maryland', 'Massachusetts', 'New Hampshire',
      'New Jersey', 'New York', 'Pennsylvania', 'Rhode Island', 'Vermont',
      'Virginia', 'West Virginia',
      'Ontario', 'Quebec', 'New Brunswick', 'Nova Scotia', 'Prince Edward Island', 'Newfoundland',
    ],
    'South': [
      'Alabama', 'Arkansas', 'Florida', 'Georgia', 'Kentucky', 'Louisiana',
      'Mississippi', 'North Carolina', 'South Carolina', 'Tennessee',
    ],
    'Central': [
      'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Michigan', 'Minnesota',
      'Missouri', 'Nebraska', 'North Dakota', 'Ohio', 'Oklahoma',
      'South Dakota', 'Texas', 'Wisconsin',
      'Manitoba', 'Saskatchewan',
    ],
    'West': [
      'Alaska', 'Arizona', 'California', 'Colorado', 'Hawaii', 'Idaho',
      'Montana', 'Nevada', 'New Mexico', 'Oregon', 'Utah', 'Washington', 'Wyoming',
      'Alberta', 'British Columbia', 'Northwest Territories',
    ],
  },

  // Program manager filter: supplier names shown in UI → Superstore regions.
  // Marcus filters by supplier; the app resolves regions → states via region_state_map.
  supplier_region_map: {
    'Atlas Workforce Solutions':  ['East', 'South'],
    'Meridian Staffing Group':    ['East'],
    'Apex Talent Partners':       ['West', 'Central'],
    'Vertex Workforce':           ['South', 'Central'],
    'Summit Staffing':            ['West'],
  },

  // Supplier names list — used to populate Marcus's filter UI.
  supplier_state_map: {
    'Atlas Workforce Solutions':  [],
    'Meridian Staffing Group':    [],
    'Apex Talent Partners':       [],
    'Vertex Workforce':           [],
    'Summit Staffing':            [],
  },

  metric_name_overrides: {
    1: {
      'Sales':         'Total Spend',
      'Profit':        'Program Savings',
      'Orders':        'Active Assignments',
      'Shipping Time': 'Avg Fill Time (days)',
      'Customers':     'Active Suppliers',
      'Inventory':     'Open Requisitions',
    },
    0: {
      'Sales':         'Total Program Spend',
      'Profit':        'Cost Savings',
      'Orders':        'Active Work Orders',
      'Shipping Time': 'Avg Fill Time (days)',
      'Customers':     'Active Placements',
      'Inventory':     'Open Requisitions',
    },
  },
  sample_questions: {
    1: [
      { label: "What is driving the decline in Atlas's score?", query: "What are the total sales and profit by category, sorted by profit ascending?" },
      { label: "How is spend trending by supplier?",            query: "What are the total sales by segment over time?" },
      { label: "Which requisitions are aging past SLA?",        query: "What is the average shipping time and total orders by region?" },
      { label: "What data sources power this portal?",          query: "List the Datasources" },
    ],
    0: [
      { label: "Why did my score drop this quarter?",           query: "What are the total sales and profit by category, sorted by profit ascending?" },
      { label: "Which client program is driving the decline?",  query: "What are the total sales by segment over time?" },
      { label: "How does my offer acceptance rate compare?",    query: "What is the average shipping time and total orders by region?" },
      { label: "What is my ready-to-start rate by program?",   query: "What are the total orders and profit by region?" },
    ],
  },
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '',
      min_role: 1,
      description: 'Program overview — spend, savings, and supplier health'
    },
    {
      name: 'Supplier Scorecard',
      icon: <BarChart3 className="h-5 w-5"/>,
      path: '/scorecard',
      min_role: 1,
      description: 'Efficiency, quality, and risk scores with quartile rankings'
    },
    {
      name: 'Requisitions',
      icon: <ClipboardList className="h-5 w-5"/>,
      path: '/requisitions',
      min_role: 1,
      description: 'Open work orders, candidate pipeline, and SLA tracking'
    },
    {
      name: 'Compliance',
      icon: <ShieldCheck className="h-5 w-5"/>,
      path: '/compliance',
      min_role: 1,
      description: 'Background checks, credentials, and expiry tracking'
    },
    {
      name: 'Settings',
      icon: <Settings className="h-5 w-5"/>,
      path: '/settings',
      min_role: 1,
      description: 'Portal preferences and account settings'
    },
  ],
}
