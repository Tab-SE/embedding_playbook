import {
  Home,
  BrainCircuit
} from "lucide-react";

import users from './users';

export const settings = {
  app_id: 'grants',
  app_name: 'Grants',
  app_logo: '/img/themes/superstore/superstore.png',
  base_path: '/demo/grants',
  auth_hero: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ai_chat: true,
  ai_avatar: '/img/themes/superstore/superstore.png',
  users: users,
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '',
      min_role: 1,
      description: 'your grants homepage'
    },
    {
      name: 'Agent',
      icon: <BrainCircuit className="h-5 w-5"/>,
      path: '/agent',
      min_role: 1,
      description: 'a fully tooled agent ready to assist you'
    }
  ],
}
