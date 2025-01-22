export const UserStore = {
  superstore: {
    roles: {
      1: { title: 'hobby', description: 'Basic data & analytics'},
      2: { title: 'pro', description: 'More data, analytics & exports'},
      3: { title: 'premium', description: 'Full self-service analytics'},
    },
    users: {
      James: {
        name: "James Morris",
        email: "jmorris@mail.com",
        picture: "/img/users/mackenzie_day.png",
        role: 3,
        vector_store: 'superstore_slopez',
        uaf: {"Region": ["South"]}
      },
      Allison: {
        name: "Allison Bierschenk",
        email: "abierschenk@salesforce.com",
        picture: "/img/users/sofia_lopez.png",
        role: 1,
        vector_store: 'superstore_slopez',
        uaf: {"Region": ["East","West"]}
      }
    }
  }
}
