import { users } from './users';
import { Superstore } from "components/Themes/Superstore";
import { Ebikes } from "components/Themes/Ebikes";
import { NTO } from "components/Themes/NTO";
import { Pacifica } from "components/Themes/Pacifica";


export const settings = {
  ai_chat: true,
  custom_metrics: true,
  themes: [
    {
      label: "Superstore Analytics",
      name: "superstore",
      component: Superstore,
      type: "default",
      logo: "/img/tableau/tableau_logo.png",
      styles: "",
      project: {
        name: "superstore",
        workbooks: [],
        data_sources: []
      }
    },
  ],
  demo_users: users
}
