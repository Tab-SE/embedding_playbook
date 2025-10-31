import {
  Home,
  Package,
  Building2,
  Truck,
  Route,
  BarChart3,
} from "lucide-react";

export const settings = {
  app_id: 'telarus',
  app_name: 'Telarus Advisor Portal',
  app_logo: '/img/themes/telarus/telarussmall.jpeg', // Small logo for sidebar nav
  auth_logo: '/img/themes/telarus/telarussmall.jpeg', // Logo for auth page
  header_logo: '/img/themes/telarus/telarusmedium.png', // Medium logo for breadcrumbs/header area
  base_path: '/demo/telarus',
  auth_hero: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=2948&auto=format&fit=crop',
  ai_chat: false,
  ai_avatar: '/img/themes/telarus/telarussmall.jpeg',
  sections: [
    {
      name: 'Products',
      icon: <Package className="h-5 w-5"/>,
      path: '',
      min_role: 0,
      description: 'select a product type'
    },
    {
      name: 'Vendors',
      icon: <Building2 className="h-5 w-5"/>,
      path: '/vendors',
      min_role: 0,
      description: 'select a supplier'
    },
    {
      name: 'Orders',
      icon: <Truck className="h-5 w-5"/>,
      path: '/tracking',
      min_role: 0,
      description: 'track orders'
    },
    {
      name: 'Advisor Journey',
      icon: <Route className="h-5 w-5"/>,
      path: '/journey',
      min_role: 0,
      description: 'complete advisor journey'
    },
    {
      name: 'Insights',
      icon: <BarChart3 className="h-5 w-5"/>,
      path: '/custom',
      min_role: 0,
      description: 'custom dashboard demo'
    },
  ],
}

