import {
  Home,
  Package,
  ShoppingCart,
  Users2,
} from "lucide-react";

export const settings = {
  app_name: 'Superstore Analytics',
  app_logo: '/img/themes/superstore/superstore.png',
  base_path: '/demos/superstore',
  auth_hero: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ai_chat: true,
  ai_avatar: '/img/themes/superstore/superstore.png',
  sections: {
    'Home': {
      icon: Home,
      path: '',
      min_role: 1,
      description: 'your superstore homepage'
    },
    'Orders': {
      icon: ShoppingCart,
      path: '/orders',
      min_role: 1,
      description: 'submit and update orders with data-driven insights'
    },
    'Products': {
      icon: Package,
      path: '/products',
      min_role: 2,
      description: 'analyze product performance across segments and categories'
    },
    'Customers': {
      icon: Users2,
      path: '/customers',
      min_role: 3,
      description: 'improve customer retention rates and identify critical business partnerships'
    },
  },
  roles: {
    1: { title: 'hobby', description: 'Basic data & analytics'},
    2: { title: 'pro', description: 'More data, analytics & exports'},
    3: { title: 'premium', description: 'Full self-service analytics'},
  },
  users: {
    A: {
      name: "Julie Morris",
      email: "jmorris@superstore.com",
      picture: "/img/users/julie_morris.png",
      role: 3,
      vector_store: 'superstore_jmorris',
      uaf: {}
    },
    B: {
      name: "Justin Chen",
      email: "jchen@superstore.com",
      picture: "/img/users/justin_chen.png",
      role: 2,
      vector_store: 'superstore_jchen',
      uaf: {}
    },
    C: {
      name: "Sofia Lopez",
      email: "slopez@superstore.com",
      picture: "/img/users/sofia_lopez.png",
      role: 1,
      vector_store: 'superstore_slopez',
      uaf: {}
    }
  }
}
