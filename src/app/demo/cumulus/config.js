import {
  Home,
  Package,
  ShoppingCart,
  Users2,
  BrainCircuit,
  ChartNoAxesCombined
} from "lucide-react";

export const settings = {
  app_id: 'cumulus',
  app_name: 'Cumulus Wealth',
  app_logo: '/img/themes/cumulus/cumulus-core-icon-wealth-blue.png',
  base_path: '/demo/cumulus',
  auth_hero: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ai_chat: true,
  ai_avatar: '/img/themes/cumulus/cumulus-core-mid-logo-wealth-blue.png',
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '',
      min_role: 1,
      description: 'your cumulus financial homepage'
    },
    {
      name: 'Performance',
      icon: <ChartNoAxesCombined className="h-5 w-5"/>,
      path: '/performance',
      min_role: 1,
      description: 'submit and update orders with data-driven insights'
    },
    {
      name: 'Agent',
      icon: <BrainCircuit className="h-5 w-5"/>,
      path: '/agent',
      min_role: 1,
      description: 'a fully tooled agent ready to assist you'
    },
  ],
}
