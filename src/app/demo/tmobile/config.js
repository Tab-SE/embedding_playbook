import {
  Home,
  Signal,
  Receipt,
  Building2,
  BrainCircuit,
  MessageSquare
} from "lucide-react";

export const settings = {
  app_id: 'tmobile',
  app_name: 'T-Mobile for Business',
  app_logo: '/img/themes/tmobile/tmosmall.svg',
  base_path: '/demo/tmobile',
  auth_hero: '/img/themes/tmobile/tmobile_background.svg',
  ai_chat: true,
  ai_avatar: '/img/themes/tmobile/tmosmall.svg',
  sample_questions: [
    "Show me customer segment analysis",
    "How is sales performance by region?",
    "What are our top-selling products this quarter?",
  ],
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '',
      min_role: 1,
      description: 'your T-Mobile for Business homepage'
    },
    {
      name: 'Agent',
      icon: <BrainCircuit className="h-5 w-5"/>,
      path: '/agent',
      min_role: 1,
      description: 'a fully tooled agent ready to assist you'
    },
    {
      name: 'Billing',
      icon: <Receipt className="h-5 w-5"/>,
      path: '/billing',
      min_role: 1,
      description: 'analyze billing data and resolve customer inquiries'
    },
    {
      name: 'Connectivity',
      icon: <Signal className="h-5 w-5"/>,
      path: '/connectivity',
      min_role: 2,
      description: 'monitor network performance and service quality'
    },
    {
      name: 'Customers',
      icon: <Building2 className="h-5 w-5"/>,
      path: '/customers',
      min_role: 3,
      description: 'manage business accounts and analyze customer segments'
    },
    {
      name: 'Support',
      icon: <MessageSquare className="h-5 w-5"/>,
      path: '/support',
      min_role: 1,
      description: 'manage customer support tickets and inquiries'
    },
  ],
}
