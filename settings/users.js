export const UserStore = {
  simplify: {
    roles: {
      1: { title: 'hobby', description: 'Basic data & analytics'},
      2: { title: 'pro', description: 'More data, analytics & exports'},
      3: { title: 'premium', description: 'Full self-service analytics'},
    },
    users: {
      Ewa: {
        name: "Ewa Przywara",
        email: "ewa.przywara@mail.com",
        picture: "/img/users/mackenzie_day.png",
        role: 3,
        vector_store: 'simplify_jmorris',
        uaf: {"Hiring Manager": ["Ewa Przywara"]}
      },
      Justin: {
        name: "Justin Chen",
        email: "jchen@mail.com",
        picture: "/img/users/justin_chen.png",
        role: 1,
        vector_store: 'simplify_jchen',
        uaf: {"Hiring Manager": ["Amelia Cox","Ashley Yates","Blake Shah","Eve Sanford","Ewa Przywara","Jade Higgins","Lucas Blum","Major Tyler"]}
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
