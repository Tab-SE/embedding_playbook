import {
  Home,
  Shield,
  ShoppingCart,
  Users2,
  BrainCircuit,
  AlertTriangle,
  FileText,
  Settings,
  BarChart3,
  TrendingUp
} from "lucide-react";

export const settings = {
  app_id: 'veriforce',
  app_name: 'Veriforce Contractor Risk Management',
  app_logo: '/img/demos/Veriforce_contractor_2.svg',
  auth_logo: '/img/themes/veriforce/veriforce-logo.jpeg',
  base_path: '/demo/veriforce',
  auth_hero: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ai_chat: true,
  ai_avatar: '/img/themes/veriforce/veriforce-logo.jpeg',
  sample_questions: [
    "Show me contractors with safety compliance issues",
    "What's our overall risk score across all contractors?",
    "Which contractors need certification renewals?",
    "List all procurement metrics for this quarter",
    "Show me the compliance dashboard for safety team"
  ],
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '',
      min_role: 0,
      description: 'Contractor risk management overview'
    },
    // {
    //   name: 'Agent',
    //   icon: <BrainCircuit className="h-5 w-5"/>,
    //   path: '/agent',
    //   min_role: 0,
    //   description: 'AI assistant for contractor risk insights'
    // },
    {
      name: 'Safety Team',
      icon: <Shield className="h-5 w-5"/>,
      path: '/safety',
      min_role: 0,
      description: 'Safety compliance tracking and incident monitoring'
    },
    {
      name: 'Procurement',
      icon: <ShoppingCart className="h-5 w-5"/>,
      path: '/procurement',
      min_role: 1,
      description: 'Contractor performance and vendor compliance assessment'
    },
    {
      name: 'Management',
      icon: <Users2 className="h-5 w-5"/>,
      path: '/management',
      min_role: 2,
      description: 'Executive dashboard with consolidated contractor insights'
    },
    {
      name: 'Alerts',
      icon: <AlertTriangle className="h-5 w-5"/>,
      path: '/alerts',
      min_role: 0,
      description: 'Compliance alerts and issue tracking'
    },
    {
      name: 'Reports',
      icon: <FileText className="h-5 w-5"/>,
      path: '/reports',
      min_role: 0,
      description: 'Self-service reports and templates'
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
    primary_color: '#1E40AF', // Veriforce blue
    secondary_color: '#3B82F6',
    accent_color: '#F59E0B',
    success_color: '#10B981',
    warning_color: '#F59E0B',
    danger_color: '#EF4444',
    background_color: '#F8FAFC',
    text_color: '#1F2937'
  }
}
