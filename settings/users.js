export const UserStore = {
  simplify: {
    roles: {
      1: { title: 'hobby', description: 'Basic data & analytics'},
      2: { title: 'pro', description: 'More data, analytics & exports'},
      3: { title: 'premium', description: 'Full self-service analytics'},
    },
    users: {
      Ewa: {
        name: "Julie Morris",
        email: "daniel.castro+simplify@salesforce.com",
        picture: "/img/users/mackenzie_day.png",
        role: 3,
        vector_store: 'simplify_jmorris',
        uaf: {}
      },
      Daniel: {
        name: "Justin Chen",
        email: "jchen@mail.com",
        picture: "/img/users/justin_chen.png",
        role: 2,
        vector_store: 'superstore_jchen',
        uaf: {}
      },
      Allison: {
        name: "Sofia Lopez",
        email: "slopez@mail.com",
        picture: "/img/users/sofia_lopez.png",
        role: 1,
        vector_store: 'superstore_slopez',
        uaf: {}
      }
    }
  }
}
