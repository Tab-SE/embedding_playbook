import { users } from './users';
import { Superstore } from "components/Themes/Superstore";
import { NTO } from "components/Themes/NTO";
import { Ebikes } from "components/Themes/NTO";



export const settings = {
  ai_chat: true,
  custom_metrics: true,
  themes: [
    {
      label: "Superstore Analytics",
      name: "superstore",
      component: Superstore,
      type: "retail",
      logo: "superstore.png",
      styles: "",
      project: {
        name: "superstore_embedded",
        workbooks: [],
        data_sources: []
      }
    },
    {
      label: "E-Bikes",
      name: "ebikes",
      component: Ebikes,
      type: "default",
      logo: "ebikes.png",
      styles: "",
      project: {
        name: "ebikes",
        workbooks: [],
        data_sources: []
      }
    },
  ],
  demo_users: users
}
