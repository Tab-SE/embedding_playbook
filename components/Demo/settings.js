import { Superstore, NTO } from "./Themes"

export const settings = {
  ai_chat: true,
  custom_metrics: true,
  themes: [
    {
      label: "Superstore Analytics",
      name: "superstore",
      component: Superstore,
      type: "default",
      logo: "superstore.png",
      styles: "",
      project: {
        name: "superstore_embedded",
        workbooks: [],
        data_sources: []
      }
<<<<<<< HEAD:components/Demo/settings.js
    },
    {
      label: "Northern Trail Outfitters",
      name: "nto",
      component: NTO,
      type: "retail",
      logo: "nto.png",
      styles: "",
      project: {
        name: "nto",
        workbooks: [],
        data_sources: []
      }
    },
  ]
=======
    }
  ],
  demo_users: users
>>>>>>> a0de14a2cf6d51a455e8594e55d1274641094c3a:settings/settings.js
}
