import {
  Home,
  BrainCircuit,
  Activity,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export const settings = {
  app_id: 'trinity',
  app_name: 'Trinity Partners Analytics',
  app_logo: '/img/themes/trinity/trinity_logo.svg',
  base_path: '/demo/trinity',
  auth_hero: 'https://images.unsplash.com/photo-1666886573301-b5d526cfd518?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
      name: 'Field Reports',
      icon: <Activity className="h-5 w-5"/>,
      path: '/orders',
      min_role: 0,
      description: 'Field force activity, call reporting, and territory execution'
    },
    {
      name: 'Market Access',
      icon: <TrendingUp className="h-5 w-5"/>,
      path: '/products',
      min_role: 1,
      description: 'Payer coverage, formulary status, and access analytics by market'
    },
    {
      name: 'Prescriber Insights',
      icon: <UserCheck className="h-5 w-5"/>,
      path: '/customers',
      min_role: 2,
      description: 'HCP targeting, prescriber behavior, and patient journey analytics'
    },
  ],
}
