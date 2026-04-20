import {
  Home,
  Package,
  ShoppingCart,
  Users2,
  BrainCircuit,
  Languages,
  AppWindow,
  Activity
} from "lucide-react";

export const settings = {
  app_id: 'morgan',
  app_name: 'Morgan & Morgan | Expert Navigator',
  /** Primary lockup — sidebar, assistant, auth, payment modal */
  app_logo: '/img/themes/morgan/morgan2.png',
  /** Header breadcrumb: replaces long app title with horizontal wordmark */
  header_brand_logo: '/img/themes/morgan/morgan1.png',
  /** Horizontal wordmark SVG — optional surfaces (e.g. long footer). */
  brand_wordmark: '/img/themes/morgan/morgan-wordmark.svg',
  /** Wide logo on login card instead of circular avatar crop */
  auth_logo_variant: 'wide',
  /** Sidebar / mobile drawer: show full mark with `object-contain` */
  nav_logo_style: 'contain',
  base_path: '/demo/morgan',
  auth_hero: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2940&auto=format&fit=crop',
  ai_chat: true,
  ai_avatar: '/img/themes/morgan/morgan2.png',
  sample_questions: [
    "Which expert witnesses are available for medical malpractice cases?",
    "Summarize expert availability by specialty.",
    "List connected data sources for this workspace.",
  ],
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '',
      min_role: 1,
      description: 'overview and expert witness navigator'
    },
    {
      name: 'Agent',
      icon: <BrainCircuit className="h-5 w-5"/>,
      path: '/agent',
      min_role: 1,
      description: 'a fully tooled agent ready to assist you'
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
    {
      name: 'Translation',
      icon: <Languages className="h-5 w-5"/>,
      path: '/translation',
      min_role: 1,
      description: 'view dashboard in different languages using parameter controls'
    },
    {
      name: 'tabNext Embed',
      icon: <AppWindow className="h-5 w-5"/> ,
      path: '/tabnext',
      min_role: 1,
      description: 'experimental Tableau Next embedding'
    },
    {
      name: 'Pulse Discover',
      icon: <Activity className="h-5 w-5"/> ,
      path: '/pulse-discover',
      min_role: 1,
      description: 'Pulse Discover dashboard from eacanada server'
    },
  ],
}
