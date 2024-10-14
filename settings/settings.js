import { Superstore } from "components/Hero/Themes/Superstore";
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
      logo: "svg/simplifyvms/logo-4.svg",
      styles: "",
      project: {
        name: "superstore",
        workbooks: [],
        data_sources: []
      }
    },
  ]
}
