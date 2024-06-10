import { users } from './users';
import { Superstore } from "components/Themes/Superstore";
import { Ebikes } from "components/Themes/Ebikes";
import { NTO } from "components/Themes/NTO";
import { Pacifica } from "components/Themes/Pacifica";
import { Zilliant } from "components/Themes/Zilliant";


export const settings = {
  ai_chat: true,
  custom_metrics: true,
  themes: [
    {
      label: "CPQ Analytics",
      name: "zilliant",
      component: Zilliant,
      type: "default",
      logo: "zilliant/zilliant_icon_dark.png",
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
