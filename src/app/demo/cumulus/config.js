import {
  Home,
  Package,
  ShoppingCart,
  Users2,
  BrainCircuit,
  ChartNoAxesCombined,
  Languages
} from "lucide-react";

export const settings = {
  app_id: 'cumulus',
  app_name: 'Cumulus Wealth',
  app_logo: '/img/themes/cumulus/cumulus-core-icon-wealth-blue.png',
  base_path: '/demo/cumulus',
  auth_hero: '/img/themes/cumulus/cumulus_hero.png',
  ai_chat: true,
  ai_avatar: '/img/themes/cumulus/cumulus-core-mid-logo-wealth-blue.png',
  sample_questions: [
    "What's the AUM by client segment?",
    "Which advisors have the highest client retention rates?",
    "What are the NPS scores by market segment?"
  ],
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '',
      min_role: 1,
      description: 'your cumulus financial homepage'
    },
    {
      name: 'Client Portfolio',
      icon: <ChartNoAxesCombined className="h-5 w-5"/>,
      path: '/clientportfolio',
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
    {
      name: 'Translation',
      icon: <Languages className="h-5 w-5"/>,
      path: '/translation',
      min_role: 1,
      description: 'view dashboard in different languages using parameter controls'
    },
  ],
}
