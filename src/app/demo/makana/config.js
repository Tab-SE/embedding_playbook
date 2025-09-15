import {
  Home,
  HeartPulse,
  BriefcaseMedical,
  BrainCircuit,
  PillBottle
} from "lucide-react";

export const settings = {
  app_id: 'makana',
  app_name: 'Makana Health',
  app_logo: '/img/themes/makana/makanaHealth_SmallLogo.png',
  base_path: '/demo/makana',
  auth_hero: 'https://images.unsplash.com/photo-1666886573301-b5d526cfd518?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ai_chat: true,
  ai_avatar: '/img/themes/makana/makanaHealth_SmallLogo.png',
  sample_questions: [
    "What's our member satisfaction score this month?",
    "How are claim processing times trending?",
    "Show me member demographics by region",
    "What's our average claim value by department?",
    "Which procedures have the highest costs?",
    "How is our mother-baby program performing?"
  ],
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '',
      min_role: 1,
      description: 'your superstore homepage'
    },
    {
      name: 'Agent',
      icon: <BrainCircuit className="h-5 w-5"/>,
      path: '/agent',
      min_role: 1,
      description: 'a fully tooled agent ready to assist you'
    },
    {
      name: 'Claims',
      icon: <BriefcaseMedical className="h-5 w-5"/>,
      path: '/claims',
      min_role: 1,
      description: 'submit and update orders with data-driven insights'
    },
    {
      name: 'Members',
      icon: <PillBottle className="h-5 w-5"/>,
      path: '/members',
      min_role: 2,
      description: 'analyze product performance across segments and categories'
    },
    {
      name: 'Mother Baby',
      icon: <HeartPulse className="h-5 w-5"/>,
      path: '/mother',
      min_role: 3,
      description: 'improve customer retention rates and identify critical business partnerships'
    },
  ],
}
