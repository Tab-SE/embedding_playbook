import { users } from './users';
import { Superstore } from "components/Themes/Superstore";
import { Ebikes } from "components/Themes/Ebikes";
import { NTO } from "components/Themes/NTO";
import { Payer } from "components/Themes/Payer";


export const settings = {
  ai_chat: true,
  custom_metrics: true,
  themes: [
    // {
    //   label: "Superstore Analytics",
    //   name: "superstore",
    //   component: Superstore,
    //   type: "superstore",
    //   logo: "superstore.png",
    //   styles: "",
    //   project: {
    //     name: "superstore_embedded",
    //     workbooks: [],
    //     data_sources: []
    //   }
    // },
    // {
    //   label: "E-bikes Analytics",
    //   name: "ebikes",
    //   component: Ebikes,
    //   type: "stock",
    //   logo: "superstore.png",
    //   styles: "",
    //   project: {
    //     name: "ebikes_embedded",
    //     workbooks: [],
    //     data_sources: []
    //   }

    // },
    // {
    //   label: "NTO",
    //   name: "NTO",
    //   component: NTO,
    //   type: "stock",
    //   logo: "nto.png",
    //   styles: "",
    //   project: {
    //     name: "nto",
    //     workbooks: [],
    //     data_sources: []
    //   }},
      {
        label: "Payer",
        name: "payer",
        component: Payer,
        type: "default",
        logo: "makanaHealth_SmallLogo.png",
        styles: "",
        project: {
          name: "payer",
          workbooks: [],
          data_sources: []
        }}
  ],
  demo_users: users
}