import {
  Home,
  BrainCircuit,
  HandCoins,
  FileChartColumn
} from "lucide-react";

import users from './users';

export const settings = {
  app_id: 'superstore',
  app_name: 'Pacifica CPQ',
  app_logo: '/img/themes/pacifica/pacifica_icon.png',
  base_path: '',
  auth_hero: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ai_chat: true,
  ai_avatar: '/img/themes/pacifica/pacifica_icon.png',
  users: users,
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '/',
      min_role: 1,
      description: 'Your superstore homepage'
    },
    {
      name: 'Agent',
      icon: <BrainCircuit className="h-5 w-5"/>,
      path: '/agent',
      min_role: 1,
      description: 'A fully tooled superstore agent ready to assist you'
    },
    {
      name: 'Pay',
      icon: <HandCoins className="h-5 w-5"/>,
      path: '/pay',
      min_role: 1,
      description: 'Pay Forecaster'
    },
    {
      name: 'Reports',
      icon: <FileChartColumn className="h-5 w-5"/>,
      path: '/reports',
      min_role: 3,
      description: 'Reports analyzing the CPQ market'
    },
  ],
}
