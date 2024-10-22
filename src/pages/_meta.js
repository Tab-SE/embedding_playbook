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
  }
}
