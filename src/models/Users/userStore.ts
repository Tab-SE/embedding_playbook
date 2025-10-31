export interface Role {
  title: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  role?: number;
  vector_store: string;
  uaf: Record<string, string[] | undefined>;
}

export interface Demo {
  demo: string;
  roles?: {
    [key: number]: Role;
  };
  users: User[];
}

export type UsersType = Demo[];

export const Users = [
  {
    demo: 'documentation',
    users: [
      {
        id: 'a',
        name: "Julie Morris",
        email: "jmorris@superstore.com",
        picture: "/img/users/mackenzie_day.png",
        role: 0,
        vector_store: 'superstore_jmorris',
        uaf: {"Region": ["West", "East", "Central","South"]},
      }
    ]
  },
  {
    demo: 'superstore',
    roles: {
      0: { title: 'Hobby', description: 'Basic data & analytics'},
      1: { title: 'Professional', description: 'More analytics & exports'},
      2: { title: 'Premium', description: 'Full self-service analytics'},
    },
    users: [
      {
        id: 'a',
        name: "Sofia Lopez",
        email: "slopez@superstore.com",
        picture: "/img/users/sofia_lopez.png",
        role: 0,
        vector_store: 'superstore_slopez',
        uaf: {"Region": ["West"]}
      },
      {
        id: 'b',
        name: "Justin Chen",
        email: "jchen@superstore.com",
        picture: "/img/users/justin_chen.png",
        role: 1,
        vector_store: 'superstore_jchen',
        uaf: {"Region": ["Central","East"]}
      },
      {
        id: 'c',
        name: "Julie Morris",
        email: "jmorris@superstore.com",
        picture: "/img/users/mackenzie_day.png",
        role: 2,
        vector_store: 'superstore_jmorris',
        uaf: {"Region": ["South"]}
      },
    ]
  },
  {
    demo: 'makana',
    roles: {
      0: { title: 'Hobby', description: 'Basic data & analytics'},
      1: { title: 'Professional', description: 'More analytics & exports'},
      2: { title: 'Premium', description: 'Full self-service analytics'},
    },
    users: [
      {
        id: 'a',
        name: "Rachel Morris",
        email: "rmorris@makana.com",
        picture: "/img/users/rachel_morris.png",
        role: 0,
        vector_store: 'makana_rmorris',
        uaf: {"Region": ["Central","East"]}
      },
      {
        id: 'b',
        name: "Debi Patel",
        email: "dpatel@makana.com",
        picture: "/img/users/debi_patel.png",
        role: 1,
        vector_store: 'makana_dpatel',
        uaf: {"Region": ["South"]}
      },
      {
        id: 'c',
        name: "Matthew Wells",
        email: "mwells@makana.com",
        picture: "/img/users/matthew_wells.png",
        role: 2,
        vector_store: 'makana_mwells',
        uaf: {"Region": ["West"]}
      },
    ]
  },
  {
    demo: 'cumulus',
    roles: {
      0: { title: 'Hobby', description: 'Basic data & analytics'},
      1: { title: 'Professional', description: 'More analytics & exports'},
      2: { title: 'Premium', description: 'Full self-service analytics'},
    },
    users: [
      {
        id: 'a',
        name: "Vivian Yang",
        email: "vyang@cumulus.com",
        picture: "/img/users/vivian_yang.png",
        role: 0,
        vector_store: 'cumulus_vyang',
        uaf: {}
      },
      {
        id: 'b',
        name: "Tawnia Williams",
        email: "twilliams@cumulus.com",
        picture: "/img/users/tawnia_williams.png",
        role: 1,
        vector_store: 'cumulus_twilliams',
        uaf: {}
      },
      {
        id: 'c',
        name: "Nigel Morris",
        email: "nmorris@cumulus.com",
        picture: "/img/users/nigel_morris.png",
        role: 2,
        vector_store: 'cumulus_nmorris',
        uaf: {}
      },
    ]
  },
  {
    demo: 'servicedesk',
    roles: {
      0: { title: 'Support Specialist', description: 'Manages customer tickets, monitors response times, and ensures service quality'},
      1: { title: 'Service Manager', description: 'Oversees team performance, customer satisfaction, and service delivery'},
      2: { title: 'Director of Customer Success', description: 'Strategic oversight, renewals, and premium service offerings'},
    },
    users: [
      {
        id: 'a',
        name: "Sarah Johnson",
        email: "sjohnson@servicedesk.com",
        picture: "/img/users/sofia_lopez.png",
        role: 0,
        vector_store: 'superstore_sjohnson',
        uaf: {"Department": ["Support"], "Region": ["Central"]}
      },
      {
        id: 'b',
        name: "Mike Chen",
        email: "mchen@servicedesk.com",
        picture: "/img/users/justin_chen.png",
        role: 1,
        vector_store: 'superstore_mchen',
        uaf: {"Department": ["Service Management"], "Region": ["West"]}
      },
      {
        id: 'c',
        name: "Lisa Martinez",
        email: "lmartinez@servicedesk.com",
        picture: "/img/users/rachel_morris.png",
        role: 2,
        vector_store: 'superstore_lmartinez',
        uaf: {"Region": ["Central","East"]}
      },
    ]
  },
  {
    demo: 'telarus',
    roles: {
      0: { title: 'Advisor', description: 'Access to product catalogs and vendor selection'},
      1: { title: 'Senior Advisor', description: 'Advanced analytics and supplier insights'},
      2: { title: 'Partner Manager', description: 'Full access to cross-sell and upsell opportunities'},
    },
    users: [
      {
        id: 'a',
        name: "Alex Johnson",
        email: "ajohnson@telarus.com",
        picture: "/img/users/justin_chen.png",
        role: 0,
        vector_store: 'telarus_ajohnson',
        uaf: {}
      },
      {
        id: 'b',
        name: "Patricia Smith",
        email: "psmith@telarus.com",
        picture: "/img/users/debi_patel.png",
        role: 1,
        vector_store: 'telarus_psmith',
        uaf: {}
      },
      {
        id: 'c',
        name: "Robert Davis",
        email: "rdavis@telarus.com",
        picture: "/img/users/matthew_wells.png",
        role: 2,
        vector_store: 'telarus_rdavis',
        uaf: {}
      },
    ]
  }
]
