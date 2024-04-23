import { users } from './users';
import { Superstore } from "components/Themes/Superstore";
import { NTO } from "components/Themes/NTO";


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
  ],
  demo_users: users
}
