import {
  BriefcaseBusiness,
  ShoppingCart,
  HandCoins,
  HeartPulse, Headphones
} from 'lucide-react';

// NOTE: the 'id' key is used to map to 'app_id' in each demo config.js file
export const galleryItems = [
  {
    id: 'superstore',
    link: "/demo/superstore",
    src: "/img/demos/superstore.png",
    alt: "Superstore Analytics",
    vertical: "Consumer Goods",
    description: "The default demo showcasing embedded AI and analytics via dashboards, metrics, charts and natural language assistants",
    icon: <ShoppingCart size={12} strokeWidth={2} />
  },
  {
    id: 'makana',
    link: "/demo/makana",
    src: "/img/demos/makana_payer.png",
    alt: "Makana | Health Payer Portal",
    vertical: "Healthcare & Life Sciences",
    description: "A healthcare payer portal app that helps users make data-driven decisions related to claims, costs, utilization, and quality measures to improve patient outcomes",
    icon: <HeartPulse size={12} strokeWidth={2} />
  },
  // {
  //   id: 'pacifica',
  //   link: "https://embedding-playbook-git-pacifica-tab-se.vercel.app",
  //   src: "/img/demos/pacifica_cpq.png",
  //   alt: "Pacifica | Configure, Price, Quote (CPQ)",
  //   vertical: "Consulting & Business Services",
  //   description: "A software solution that helps businesses streamline the quoting process for customizable products and services",
  //   icon: <BriefcaseBusiness size={12} strokeWidth={2} />
  // },
  {
    id: 'cumulus',
    link: "https://embedding-playbook-git-cumulus-tab-se.vercel.app",
    src: "/img/demos/cumulus_wealth.png",
    alt: "Cumulus | Wealth Management",
    vertical: "Financial Services",
    description: "A wealth management app that empowers users to make informed financial decisions, allowing them to track net worth and analyze portfolio performance",
    icon: <HandCoins size={12} strokeWidth={2} />
  },
  {
    id: 'servicedesk',
    link: "/demo/servicedesk",
    src: "/img/demos/servicedesk.png",
    alt: "Service Desk | Customer Support Portal",
    vertical: "Service & Support",
    description: "A customer service portal that helps teams manage tickets, track response times, monitor KPIs, and deliver exceptional customer support",
    icon: <Headphones size={12} strokeWidth={2} />
  }
]
