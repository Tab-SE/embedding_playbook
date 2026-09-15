import {
  BriefcaseBusiness,
  ShoppingCart,
  HandCoins,
  HeartPulse,
  Headphones,
  Users2,
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
    id: 'ubl-superstore',
    link: "/demo/ubl-superstore",
    src: "/img/demos/superstore.png",
    alt: "Superstore — UBL Site",
    vertical: "Consumer Goods · UBL",
    description: "Same Superstore experience, served from the UBL Tableau site via a separate Connected App. Demonstrates per-user UAF row-level security on a different site than the default Superstore demo.",
    icon: <ShoppingCart size={12} strokeWidth={2} />,
    badge: "UBL"
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
  },
  {
    id: 'pinnacle',
    link: "/demo/pinnacle",
    src: null,
    customThumbnail: (
      <div style={{
        width: '100%', height: '100%',
        backgroundColor: '#000e24',
        backgroundImage: [
          'radial-gradient(ellipse 38% 45% at 22% 50%, rgba(130,230,255,0.55) 0%, rgba(0,167,255,0.45) 20%, rgba(0,100,210,0.25) 50%, transparent 70%)',
          'radial-gradient(ellipse 65% 65% at 22% 50%, rgba(0,130,220,0.30) 0%, transparent 60%)',
          'conic-gradient(from 165deg at 22% 50%, transparent 0deg, rgba(0,167,255,0.06) 8deg, transparent 16deg, rgba(0,167,255,0.04) 26deg, transparent 34deg, rgba(0,167,255,0.05) 44deg, transparent 52deg, transparent 360deg)',
          'linear-gradient(165deg, #001040 0%, #001d50 40%, #001535 70%, #000e24 100%)',
        ].join(', '),
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '12px',
      }}>
        <img src="/img/themes/pinnacle/icon.jpeg" alt="Pinnacle Group" style={{ width: 56, height: 56, borderRadius: '50%' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.02em' }}>Pinnacle Group</div>
          <div style={{ color: 'rgba(142,209,252,0.85)', fontSize: 11, marginTop: 2 }}>Workforce Intelligence Portal</div>
        </div>
      </div>
    ),
    alt: "Pinnacle Group | Workforce Intelligence Portal",
    vertical: "Staffing & Workforce Management",
    description: "A contingent workforce management portal for customer executives, program managers, and staffing suppliers — featuring supplier scorecards, requisition tracking, and compliance monitoring",
    icon: <Users2 size={12} strokeWidth={2} />
  }
]
