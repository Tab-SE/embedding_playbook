import { Superstore } from "components/Hero/Themes/Superstore";
import { Ebikes } from "components/Hero/Themes/Ebikes";
import { NTO } from "components/Hero/Themes/NTO";
import { Pacifica } from "components/Hero/Themes/Pacifica";
import { Southwest } from "components/Hero/Themes/Southwest";


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
    {
      label: "Southwest Airlines Analytics",
      name: "southwest",
      component: Southwest,
      type: "airline",
      logo: "/img/themes/southwest/southwest_logo.svg",
      styles: "",
      project: {
        name: "southwest",
        workbooks: [],
        data_sources: []
      }
    },
  ]
}
