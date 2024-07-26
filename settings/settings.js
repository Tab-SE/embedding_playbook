import { users } from './users';
import { Superstore } from "components/Themes/Superstore";
import { Ebikes } from "components/Themes/Ebikes";
import { NTO } from "components/Themes/NTO";
import { Pacifica } from "components/Themes/Pacifica";
import { HVS } from 'components/Themes/HVS';
import { HVS_Pacifica } from 'components/Themes/HVS_Pacifica';


export const settings = {
  ai_chat: true,
  custom_metrics: true,
  themes: [
    {
      label: "HVS Demo",
      name: "HVS",
      component: HVS_Pacifica,
      type: "default",
      logo: "/img/tableau/tableau_logo.png",
      styles: "",
      project: {
        name: "Sales",
        workbooks: [],
        data_sources: []
      }
    },
  ],
  demo_users: users
}
