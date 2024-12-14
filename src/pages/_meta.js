import { ConfigureImagesPage } from "@/components";

export default {
  index: {
    title: "Embed Tableau",
    type: "page",
    display: "hidden",
    theme: {
      layout: "full"
    }
  },
  start: {
    title: "Getting Started",
    type: "page"
  },
  architecture: {
    title: "Architecture",
    type: "page"
  },
  demos: {
    title: "Demos",
    type: "page",
    theme: {
      layout: "full",
      breadcrumb: false,
      footer: true,
      sidebar: false,
      toc: false,
      pagination: false,
      navbar: true,
      timestamp: true
    }
  },
  pulseExtension: {
    title: "Pulse Dashboard Extension",
    type: "page",
    display: "hidden",
    theme: {
      layout: "raw",
      breadcrumb: false,
      footer: false,
      sidebar: false,
      toc: false,
      pagination: false,
      navbar: false,
      timestamp: false
    }
  },
  pulseExtensionDialog: {
    title: "Pulse Dashboard Extension Dialog",
    display: "hidden",
    theme: {
      layout: "raw",
      breadcrumb: false,
      footer: false,
      sidebar: false,
      toc: false,
      pagination: false,
      navbar: false,
      timestamp: false
    }
  },
  pulseExtensionInsightsPopup: {
    title: "Pulse Dashboard Extension Insights Popup",
    display: "hidden",
    theme: {
      layout: "raw",
      breadcrumb: false,
      footer: false,
      sidebar: false,
      toc: false,
      pagination: false,
      navbar: false,
      timestamp: false
    }
  },
  pulseExtensionInsightsLogin: {
    title: "Pulse Dashboard Extension Insights Popup",
    display: "hidden",
    theme: {
      layout: "raw",
      breadcrumb: false,
      footer: false,
      sidebar: false,
      toc: false,
      pagination: false,
      navbar: false,
      timestamp: false
    }
  },
  configureImagesPage: {
    title: "Chart Images Configuration",
    display: "hidden",
    theme: {
      layout: "raw",
      breadcrumb: false,
      footer: false,
      sidebar: false,
      toc: false,
      pagination: false,
      navbar: false,
      timestamp: false
    }
  }
}
