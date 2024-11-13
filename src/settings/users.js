export const UserStore = {
  superstore: {
    roles: {
      1: { title: 'hobby', description: 'Basic data & analytics'},
      2: { title: 'pro', description: 'More data, analytics & exports'},
      3: { title: 'premium', description: 'Full self-service analytics'},
    },
    users: {
      A: {
        name: "Julie Morris",
        email: "pacifica@demo.com",
        picture: "/img/users/mackenzie_day.png",
        role: 3,
        vector_store: 'superstore_jmorris',
        uaf: {}
      },
      B: {
        name: "Justin Chen",
        email: "jchen@mail.com",
        picture: "/img/users/justin_chen.png",
        role: 2,
        vector_store: 'superstore_jchen',
        uaf: {}
      },
      C: {
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
