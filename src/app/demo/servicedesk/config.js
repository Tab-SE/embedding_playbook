import {
  Home,
  Headphones,
  TrendingUp,
  Users2,
  BrainCircuit,
  AlertTriangle,
  FileText,
  Settings,
  BarChart3,
  Clock,
  Languages,
  Truck,
  Leaf
} from "lucide-react";

export const settings = {
  app_id: 'servicedesk',
  app_name: 'E-Space Support Hub',
  app_logo: '/img/themes/servicedesk/e-space_small.png',
  auth_logo: 'https://cdn.brandfetch.io/idypK-MB6o/w/200/h/200/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1762890670211',
  base_path: '/demo/servicedesk',
  auth_hero: 'https://player.vimeo.com/video/753626640?h=23d74e3691&&autoplay=1&loop=1&autopause=0&api=1&background=1',
  ai_chat: true,
  ai_avatar: 'https://cdn.brandfetch.io/idypK-MB6o/w/200/h/200/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1762890670211',
  sample_questions: [
    "What's our satellite network uptime this month?",
    "Show me open support tickets by priority",
    "What's our customer onboarding completion rate?",
  ],
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '',
      min_role: 0,
      description: 'E-Space support analytics overview and key metrics'
    },
    {
      name: 'Shipping Tracker',
      icon: <Truck className="h-5 w-5"/>,
      path: '/cases',
      min_role: 0,
      description: 'Track shipments and delivery status'
    },
    {
      name: 'ESG Impact',
      icon: <Leaf className="h-5 w-5"/>,
      path: '/success',
      min_role: 2,
      description: 'Track environmental, social, and governance impact metrics'
    },
    {
      name: 'Onboarding',
      icon: <FileText className="h-5 w-5"/>,
      path: '/training',
      min_role: 1,
      description: 'Customer onboarding completion and effectiveness'
    },
    {
      name: 'Settings',
      icon: <Settings className="h-5 w-5"/>,
      path: '/settings',
      min_role: 2,
      description: 'System configuration and user management'
    },
    {
      name: 'Translation',
      icon: <Languages className="h-5 w-5"/>,
      path: '/translation',
      min_role: 1,
      description: 'view dashboard in different languages using parameter controls'
    },
  ],
  branding: {
    primary_color: '#046C93', // E-Space primary blue
    secondary_color: '#1E3A8A', // Rich blue
    accent_color: '#046C93', // Primary blue
    success_color: '#10B981',
    warning_color: '#F59E0B',
    danger_color: '#EF4444',
    background_color: '#0F172A', // Dark space background
    text_color: '#F1F5F9'
  }
}

