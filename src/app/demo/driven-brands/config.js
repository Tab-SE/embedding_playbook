import {
  Home,
  BarChart3,
  Settings,
} from "lucide-react";

export const settings = {
  app_id: 'driven-brands',
  app_name: 'Franchise Performance Portal',
  app_logo: '/img/themes/driven-brands/icon.jpeg',
  auth_logo: '/img/themes/driven-brands/icon.jpeg',
  base_path: '/demo/driven-brands',
  auth_hero: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2940&auto=format&fit=crop',
  hide_email: true,
  ai_chat: true,
  // Maps which Region UAF values belong to each brand.
  // Used to swap the nav logo when a user only has access to a single brand.
  // Maps Region UAF values to brand names — used on the auth page and in the nav logo swap.
  brand_region_map: {
    East:    'Take 5 Oil Change',
    South:   'Take 5 Oil Change',
    Central: 'Meineke',
    West:    'Maaco',
  },
  // Maps brand display labels to the State/Province values in the Tableau workbook.
  // Update these state names to match exactly what appears in your Driven Brands workbook.
  // All 50 states split evenly across 3 brands (~16-17 each).
  // 1 brand selected = ~⅓ of the map, 2 = ~⅔, all 3 / clear = full map.
  brand_state_map: {
    'Take 5 Oil Change': [
      'Florida', 'Georgia', 'South Carolina', 'North Carolina', 'Virginia',
      'West Virginia', 'Maryland', 'Delaware', 'New Jersey', 'Connecticut',
      'Rhode Island', 'Massachusetts', 'Vermont', 'New Hampshire', 'Maine', 'New York',
    ],
    'Meineke': [
      'Pennsylvania', 'Ohio', 'Michigan', 'Indiana', 'Illinois', 'Wisconsin',
      'Minnesota', 'Iowa', 'Missouri', 'Kentucky', 'Tennessee', 'Alabama',
      'Mississippi', 'Louisiana', 'Arkansas', 'Kansas',
    ],
    'Maaco': [
      'Texas', 'Oklahoma', 'Nebraska', 'South Dakota', 'North Dakota',
      'Colorado', 'Wyoming', 'Montana', 'Idaho', 'Utah', 'New Mexico',
      'Arizona', 'Nevada', 'California', 'Oregon', 'Washington', 'Alaska', 'Hawaii',
    ],
  },
  brand_logos: {
    'Take 5 Oil Change': '/img/themes/driven-brands/take5-icon.jpeg',
    'Meineke':           '/img/themes/driven-brands/meineke-icon.jpeg',
    'Maaco':             '/img/themes/driven-brands/maaco-icon.jpeg',
  },
  metric_name_overrides: {
    'Sales':         'Franchise Revenue',
    'Profit':        'Net Profit',
    'Orders':        'Vehicles Serviced',
    'Shipping Time': 'Avg Service Time',
    'Customers':     'Customer Count',
  },
  sample_questions: [
    { label: "What are my top performing locations?",   query: "What are the total sales across each region?" },
    { label: "How is profitability trending by brand?", query: "What's our profit margin by category?" },
    { label: "What data sources power this portal?",    query: "List the Datasources" },
  ],
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '',
      min_role: 1,
      description: 'Franchise performance overview'
    },
    {
      name: 'Performance',
      icon: <BarChart3 className="h-5 w-5"/>,
      path: '/performance',
      min_role: 1,
      description: 'Detailed location and brand performance analytics'
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
