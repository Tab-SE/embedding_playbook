import {
  Home,
  Package,
  ShoppingCart,
  Users2,
  BrainCircuit
} from "lucide-react";

import users from './users';

export const settings = {
  app_id: 'superstore',
  app_name: 'Superstore Analytics',
  app_logo: '/img/themes/superstore/superstore.png',
  base_path: '/demo/superstore',
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
      description: 'your superstore homepage'
    },
    {
      name: 'Agent',
      icon: <BrainCircuit className="h-5 w-5"/>,
      path: '/agent',
      min_role: 1,
      description: 'a fully tooled superstore agent ready to assist you'
    },
    {
      name: 'Orders',
      icon: <ShoppingCart className="h-5 w-5"/>,
      path: '/orders',
      min_role: 1,
      description: 'submit and update orders with data-driven insights'
    },
    {
      name: 'Products',
      icon: <Package className="h-5 w-5"/>,
      path: '/products',
      min_role: 2,
      description: 'analyze product performance across segments and categories'
    },
    {
      name: 'Customers',
      icon: <Users2 className="h-5 w-5"/>,
      path: '/customers',
      min_role: 3,
      description: 'improve customer retention rates and identify critical business partnerships'
    },
  ],
}
