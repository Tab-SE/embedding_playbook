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
      label: "CPQ Analytics",
      name: "pacifica",
      component: Pacifica,
      type: "default",
      logo: "pacifica/pacifica_icon.png",
      styles: "",
      project: {
        name: "superstore_embedded",
        workbooks: [],
        data_sources: []
      }
    },
  ],
  demo_users: users
}
