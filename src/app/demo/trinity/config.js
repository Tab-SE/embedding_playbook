import {
  Home,
  BrainCircuit,
  AppWindow,
  ShoppingCart,
} from "lucide-react";

export const settings = {
  app_id: 'trinity',
  app_name: 'Trinity Life Sciences',
  app_logo: '/img/themes/trinity/trinity_ls_hero.jpeg',
  base_path: '/demo/trinity',
  auth_hero: null,
  ai_chat: true,
  ai_avatar: '/img/themes/trinity/chat_icon.svg',
  sample_questions: [
    "What is the current quota attainment and how does it compare to the prior 8 weeks?",
    "Which rep tenure band has the highest incentive comp payout?",
    "How do calls completed and Rx per call trend over the past several months?",
  ],
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '',
      min_role: 0,
      description: 'Commercial analytics overview'
    },
    {
      name: 'Agent',
      icon: <BrainCircuit className="h-5 w-5"/>,
      path: '/agent',
      min_role: 0,
      description: 'AI-powered market intelligence assistant'
    },
    {
      name: 'Superstore Analytics',
      icon: <ShoppingCart className="h-5 w-5"/>,
      path: '/superstore',
      min_role: 0,
      description: 'Superstore Analytics embedded dashboard with concierge agent'
    },
    {
      name: 'tabNext Embed',
      icon: <AppWindow className="h-5 w-5"/>,
      path: '/tabnext',
      min_role: 0,
      description: 'Tableau Next embedded analytics experience'
    },
  ],
}
