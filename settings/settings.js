import { users } from './users';
import { Superstore } from "components/Themes/Superstore";
import { Ebikes } from "components/Themes/Ebikes";
import { NTO } from "components/Themes/NTO";
import { Pacifica } from "components/Themes/Pacifica";
import { Commonwealth } from "components/Themes/Commonwealth";
import { BranchManager } from "components/Themes/BranchManager";


export const settings = {
  ai_chat: true,
  custom_metrics: true,
  themes: [
    {
      label: "Matthew - Financial Advisor",
      name: "superstore",
      component: Commonwealth,
      type: "default",
      logo: "/img/users/matthew_wells.png",
      styles: "",
      project: {
        name: "Matthew - Financial Advisor",
        workbooks: [],
        data_sources: []
      }
    },
    {
      label: "Mackenzie - Branch Manager",
      name: "superstore",
      component: BranchManager,
      type: "internal",
      logo: "/img/users/mackenzie_day.png",
      styles: "",
      project: {
        name: "Mackenzie - Branch Manager",
        workbooks: [],
        data_sources: []
      }
    },
  ],
  demo_users: users
}
