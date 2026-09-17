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
  app_logo: '/img/themes/pinnacle/icon.jpeg',
  auth_logo: '/img/themes/pinnacle/icon.jpeg',
  base_path: '/demo/pinnacle',
  hide_email: true,
  ai_chat: true,
  // No ai_avatar set — falls back to chatbot MessageSquare icon

  // Customer exec filter: program names shown in UI → State/Province values in the Superstore workbook.
  // Every state AND Canadian province is assigned to exactly one program so that
  // selecting all three equals the full dataset.
  program_state_map: {
    'Meridian Financial': [
      'Florida', 'Georgia', 'South Carolina', 'North Carolina', 'Virginia',
      'West Virginia', 'Maryland', 'Delaware', 'New Jersey', 'Connecticut',
      'Rhode Island', 'Massachusetts', 'Vermont', 'New Hampshire', 'Maine', 'New York',
      'Ontario', 'Quebec', 'New Brunswick', 'Nova Scotia', 'Prince Edward Island', 'Newfoundland',
    ],
    'Nexus Retail Group': [
      'Pennsylvania', 'Ohio', 'Michigan', 'Indiana', 'Illinois', 'Wisconsin',
      'Minnesota', 'Iowa', 'Missouri', 'Kentucky', 'Tennessee', 'Alabama',
      'Mississippi', 'Louisiana', 'Arkansas', 'Kansas',
      'Manitoba', 'Saskatchewan',
    ],
    'Summit Healthcare': [
      'Texas', 'Oklahoma', 'Nebraska', 'South Dakota', 'North Dakota',
      'Colorado', 'Wyoming', 'Montana', 'Idaho', 'Utah', 'New Mexico',
      'Arizona', 'Nevada', 'California', 'Oregon', 'Washington', 'Alaska', 'Hawaii',
      'Alberta', 'British Columbia', 'Northwest Territories',
    ],
  },

  // Program manager filter: supplier names shown in UI → State/Province values.
  // Every state + Canadian province is assigned to exactly one supplier.
  supplier_state_map: {
    'Atlas Workforce Solutions': [
      'Florida', 'Georgia', 'South Carolina', 'North Carolina', 'Virginia',
      'West Virginia', 'Maryland', 'Delaware',
    ],
    'Meridian Staffing Group': [
      'New Jersey', 'Connecticut', 'Rhode Island', 'Massachusetts', 'Vermont',
      'New Hampshire', 'Maine', 'New York', 'Pennsylvania', 'Ohio',
      'Ontario', 'Quebec', 'New Brunswick', 'Nova Scotia', 'Prince Edward Island', 'Newfoundland',
    ],
    'Apex Talent Partners': [
      'Michigan', 'Indiana', 'Illinois', 'Wisconsin',
      'Minnesota', 'Iowa', 'Missouri', 'Kentucky',
    ],
    'Vertex Workforce': [
      'Tennessee', 'Alabama', 'Mississippi', 'Louisiana',
      'Arkansas', 'Kansas', 'Texas', 'Oklahoma',
      'Manitoba', 'Saskatchewan',
    ],
    'Summit Staffing': [
      'Nebraska', 'South Dakota', 'North Dakota', 'Colorado', 'Wyoming',
      'Montana', 'Idaho', 'Utah', 'New Mexico', 'Arizona', 'Nevada',
      'California', 'Oregon', 'Washington', 'Alaska', 'Hawaii',
      'Alberta', 'British Columbia', 'Northwest Territories',
    ],
  },

  // Supplier filter: territory labels shown in UI → State/Province values scoped to Atlas's footprint.
  atlas_territory_map: {
    'Gulf Coast':    ['Florida', 'Georgia'],
    'Carolinas':     ['South Carolina', 'North Carolina'],
    'Mid-Atlantic':  ['Virginia', 'West Virginia', 'Maryland', 'Delaware'],
  },

  metric_name_overrides: {
    'Sales':         'Total Spend',
    'Profit':        'Program Savings',
    'Orders':        'Active Assignments',
    'Shipping Time': 'Avg Fill Time (days)',
    'Customers':     'Active Suppliers',
    'Inventory':     'Open Requisitions',
  },

  sample_questions: [
    { label: "Which suppliers are underperforming?",       query: "What are the total sales and profit by category, sorted by profit ascending?" },
    { label: "How is spend trending by customer program?", query: "What are the total sales by segment over time?" },
    { label: "What are fill rates by region?",             query: "What is the average shipping time and total orders by region?" },
    { label: "What data sources power this portal?",       query: "List the Datasources" },
  ],

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
