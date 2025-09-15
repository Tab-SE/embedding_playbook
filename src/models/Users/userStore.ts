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
  uaf: Record<string, string[]>;
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
        vector_store: 'superstore_rmorris',
        uaf: {}
      },
      {
        id: 'b',
        name: "Debi Patel",
        email: "dpatel@makana.com",
        picture: "/img/users/debi_patel.png",
        role: 1,
        vector_store: 'superstore_dpatel',
        uaf: {}
      },
      {
        id: 'c',
        name: "Matthew Wells",
        email: "mwells@makana.com",
        picture: "/img/users/matthew_wells.png",
        role: 2,
        vector_store: 'superstore_mwells',
        uaf: {}
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
    demo: 'southwest',
    roles: {
      0: { title: 'Flight Operations', description: 'Basic flight data & analytics'},
      1: { title: 'Operations Manager', description: 'Advanced analytics & reporting'},
      2: { title: 'Senior Leadership', description: 'Full strategic analytics & insights'},
    },
    users: [
      {
        id: 'a',
        name: "Sarah Johnson",
        email: "sjohnson@southwest.com",
        picture: "/img/users/kim_johnson.png",
        role: 0,
        vector_store: 'southwest_sjohnson',
        uaf: {"Region": ["West", "Central"]}
      },
      {
        id: 'b',
        name: "Michael Rodriguez",
        email: "mrodriguez@southwest.com",
        picture: "/img/users/richard_bennet.png",
        role: 1,
        vector_store: 'southwest_mrodriguez',
        uaf: {"Region": ["East", "South"]}
      },
      {
        id: 'c',
        name: "Jennifer Martinez",
        email: "jmartinez@southwest.com",
        picture: "/img/users/rachel_morris.png",
        role: 2,
        vector_store: 'southwest_jmartinez',
        uaf: {"Region": ["West", "East", "Central", "South"]}
      },
    ]
  }
]
