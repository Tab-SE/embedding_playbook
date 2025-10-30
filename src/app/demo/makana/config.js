import {
  Home,
  HeartPulse,
  BriefcaseMedical,
  BrainCircuit,
  PillBottle,
  Languages
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
    "What are the top three reasons for claim denials, and how do they vary by provider?",
    "How does the average processing time for claims correlate with the type of plan and denial rates?",
    "How do sales trends for specific products vary over time, and what factors contribute to these trends?",
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
    {
      name: 'Translation',
      icon: <Languages className="h-5 w-5"/>,
      path: '/translation',
      min_role: 1,
      description: 'view dashboard in different languages using parameter controls'
    },
  ],
}
