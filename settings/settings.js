import { Superstore } from "components/Hero/Themes/Superstore";
import { Simplify } from "components/Hero/Themes/Simplify";
import { Ebikes } from "components/Hero/Themes/Ebikes";
import { NTO } from "components/Hero/Themes/NTO";
import { Pacifica } from "components/Hero/Themes/Pacifica";


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
  ]
}
