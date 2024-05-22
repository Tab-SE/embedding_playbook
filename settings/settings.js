import { users } from './users';
import { Superstore } from "components/Themes/Superstore";
import { Ebikes } from "components/Themes/Ebikes";
import { NTO } from "components/Themes/NTO";
import { CumulusWealth } from "components/Themes/CumulusWealth";


export const settings = {
  ai_chat: true,
  custom_metrics: true,
  themes: [
    {
      label: "Cumulus Wealth",
      name: "Cumulus Wealth",
      component: CumulusWealth,
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
      label: "Superstore Analytics",
      name: "superstore",
      component: Superstore,
      type: "sample",
      logo: "superstore.png",
      styles: "",
      project: {
        name: "superstore_embedded",
        workbooks: [],
        data_sources: []
      }
    }
  ],
  demo_users: users
}
