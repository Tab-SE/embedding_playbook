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

import { MORGAN_DEMO_CANNED_QUESTION } from './morganDemoCannedResponse';

export const settings = {
  app_id: 'morgan',
  app_name: 'Morgan & Morgan | Expert Navigator',
  /** Compact M&M — sidebar, assistant, floating UI */
  app_logo: '/img/themes/morgan/morgan2.png',
  /** Full lockup (wordmark + tagline) — login card; same asset as header for consistency */
  auth_logo: '/img/themes/morgan/morgan-brand-lockup.png',
  /** Header breadcrumb: same lockup as login (replaces old morgan1 crop that showed edge artifacts) */
  header_brand_logo: '/img/themes/morgan/morgan-brand-lockup.png',
  /** Horizontal wordmark SVG — optional surfaces (e.g. long footer). */
  brand_wordmark: '/img/themes/morgan/morgan-wordmark.svg',
  /** Wide lockup image on login; hide redundant text title below the graphic */
  auth_logo_variant: 'wide',
  auth_show_title: false,
  /** Sidebar / mobile drawer: show full mark with `object-contain` */
  nav_logo_style: 'contain',
  base_path: '/demo/morgan',
  /** Login page: solid Blue Zodiac–style navy (theme `navBackground`) instead of a stock photo */
  auth_solid_background: true,
  ai_chat: true,
  ai_avatar: '/img/themes/morgan/morgan2.png',
  sample_questions: [
    MORGAN_DEMO_CANNED_QUESTION,
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
