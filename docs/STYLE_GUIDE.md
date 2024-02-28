# Style Guide

## Writing Articles

Contributing to new or existing articles is done by editing `.mdx` files located in the `pages/` folder. The folder structure of `pages/` dictates the overall layout of the application which can be further customized via `_meta.json` files placed inside each folder. This architecture is designed and maintained by [Nextra which documents](https://nextra.site/docs/guide/organize-files) all available options for organizing content.

All articles in this project use [Markdown](https://www.markdownguide.org/getting-started/) as the lightweight markup language that underpins the "[docs-as-code](https://www.writethedocs.org/guide/docs-as-code/)" model. Refer to this guide for help with [Markdown Syntax](https://www.markdownguide.org/) such as tables, quotes and more. These provide the basics elements that make up the Markdown language. Nextra also provides a [Markdown guide](https://nextra.site/docs/guide/markdown) and some reusable [built-in components](https://nextra.site/docs/guide/built-ins). Under [Advanced](https://nextra.site/docs/guide/advanced) you can learn about [Latex](https://katex.org/) and [Mermaid](https://mermaid.js.org/). 

However, this application goes further than that as it allows writers to insert interactive components to their posts. Given that `.mdx` files are a superset of [Markdown](https://mdxjs.com/) (`.md` files) that supports `jsx`, this allows for complete customization via [React](https://react.dev/) components such as the Tableau visualization or a Pulse Metric. 

As a result this documentation project is incredibly flexible while content is written in a more pleasing format to write and maintain than HTML without the overhead of a dedicated [CMS](https://en.wikipedia.org/wiki/Content_management_system) or a [headless CMS](https://en.wikipedia.org/wiki/Headless_content_management_system).

## Layouts

Layouts in this application are mainly generated from the file system itself and a configuration file that can be placed inside each folder. The app's navigation has 3 sections: top navbar, left navbar and right navbar.

The behavior of files placed within the `pages` folder is described in the Nextra article called [Organize Files](https://nextra.site/docs/guide/organize-files).

Configuration files (`_meta.json`) designate how files and folders form separate sections of the app found on the top navbar or nested sets of articles displayed on the left navbar. The right navbar displays sections within each article generated automatically from markdown headings.

To control the layout of the application you can add links to the navbar to create separate sections of documentation. Each link must correspond to a folder in `pages` and the markdown files it contains will generate independent articles found on the left navigation.

For more information please refer to the Nextra article titled [Page Configuration](https://nextra.site/docs/docs-theme/page-configuration#pages).


## Embedding Tableau Visualizations

Embedding in this app relies on importing a reusable UI component into an article that ends with `.mdx` as it designates the file as using a [superset of markdown](https://mdxjs.com/) that supports React components. To accomplish this, do the following:

1. Make sure the article ends in `.mdx` rather than `.md` which does not support React.
2. Import the `<Tableau/>` component into the article and provide configuration options as shown here:

```md
import { TableauViz } from 'components';

# Embedding Tableau Visualizations

This is *generic* markdown content preceding the **Tableau** component of interest.
[Link Text](URL) 

Notice the following attributes provided for a visualization
hosted for free on Tableau Public:

<TableauViz
  src='https://public.tableau.com/views/{viz}'
  height='900'
  width='700'
  hideTabs='true'
  device='default'
  isPublic
/>

Another block of text and an *image* can go after the embed.
![Alt Text](Image URL)
```

## Images

For engaging documentation please consider adding tasteful images to your articles. All images are located in the `public/` folder and automatically made available on the Vercel host. 

In Markdown you would use syntax such as:

```md
![sample image](/public/img/opengraph/embed_tableau.png)
```

Nextjs performs image optimization for this project resulting in high quality experiences across all devices. Otherwise writers and developers would have to manually generate multiple copies of images of different sizes to meet the expecations of today's reader.

Image Optimiation results in writers being able to easily add images to applications with the resulting app having a fully responsive set of images that are never too small or too large for the device that displays them. A common issue for websites that we are gladly avoiding. 

>IMGIX highly recommends reading Eric Portis' [seminal article on srcset and sizes](https://ericportis.com/posts/2014/srcset-sizes/). This article explains the history of responsive images in responsive design, why they're necessary, and how all these technologies work together to save bandwidth and provide a better experience for users.
