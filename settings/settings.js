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
      label: "Simplify VMS",
      name: "simplify",
      component: Simplify,
      type: "default",
      logo: "svg/simplifyvms/logo-4.svg",
      styles: "",
      project: {
        name: "Simplify VMS",
        workbooks: [],
        data_sources: []
      }
    },
  ]
}
