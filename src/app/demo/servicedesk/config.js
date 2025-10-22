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
  Clock
} from "lucide-react";

export const settings = {
  app_id: 'servicedesk',
  app_name: 'Service Excellence Platform',
  app_logo: '/img/themes/servicedesk/dataicon.png',
  auth_logo: '/img/themes/servicedesk/dataicon.png',
  base_path: '/demo/servicedesk',
  auth_hero: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop',
  ai_chat: true,
  ai_avatar: '/img/themes/servicedesk/dataicon.png',
  sample_questions: [
    "What's our average response time this month?",
    "Show me open cases by priority",
    "What's our customer training completion rate?",
  ],
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '',
      min_role: 0,
      description: 'Service analytics overview and key metrics'
    },
    {
      name: 'Cases',
      icon: <FileText className="h-5 w-5"/>,
      path: '/cases',
      min_role: 0,
      description: 'Open cases and case creation analytics'
    },
    {
      name: 'Customer Success',
      icon: <Users2 className="h-5 w-5"/>,
      path: '/success',
      min_role: 2,
      description: 'Strategic insights, renewals, and customer health'
    },
    {
      name: 'Training',
      icon: <FileText className="h-5 w-5"/>,
      path: '/training',
      min_role: 1,
      description: 'Customer training completion and effectiveness'
    },
    {
      name: 'Settings',
      icon: <Settings className="h-5 w-5"/>,
      path: '/settings',
      min_role: 2,
      description: 'System configuration and user management'
    }
  ],
  branding: {
    primary_color: '#2563EB', // Professional blue
    secondary_color: '#3B82F6',
    accent_color: '#10B981',
    success_color: '#10B981',
    warning_color: '#F59E0B',
    danger_color: '#EF4444',
    background_color: '#F8FAFC',
    text_color: '#1F2937'
  }
}

