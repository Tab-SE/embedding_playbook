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
  auth_hero: '/img/themes/makana/makana_xray.png',
  ai_chat: true,
  ai_avatar: '/img/themes/makana/makanaHealth_SmallLogo.png',
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
      name: 'Group Reporting',
      icon: <BriefcaseMedical className="h-5 w-5"/>,
      path: '/groups',
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
