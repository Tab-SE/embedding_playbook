# Tableau Embedded Analytics Playbook 

[Tableau](https://www.tableau.com) is the world's leading end-to-end data and analytics platform. 

![tableau logo](public/img/tableau/logo_text.png)

## Contributing

Contributions to this project are more than welcome and may come in the form of enhancements to the codebase, writing articles, correcting or identifying bugs or even suggesting improvements.

This project has two separate contribution models, one designed for writing articles and the other intended for maintaining the codebase. The [About the Playbook](/README.md#about-the-playbook) section of the README explains how the architecture chosen for this app enables a twin contribution model.

Most contributions will come in the form of articles. Writing high-quality guidance for embedding Tableau is the main purpose of this project.

![area chart](public/img/stock/area_chart.png)

## Writing Content

All articles in this project use [Markdown](https://www.markdownguide.org/getting-started/) as the lightweight markup language that underpins the "[docs-as-code](https://www.writethedocs.org/guide/docs-as-code/)" model. Articles (markdown files) can be found in the `pages` folder. 

## Layouts

Layouts in this Playbook are mainly generated from the file system itself and a configuration file that can be placed inside each folder. The app's navigation has 3 sections: top navbar, left navbar and right navbar.

The behavior of files placed within the `pages` folder is described in the Nextra article called [Organize Files](https://nextra.site/docs/guide/organize-files).

Configuration files (`_meta.json`) designate how files and folders form separate sections of the app found on the top navbar or nested sets of articles displayed on the left navbar. The right navbar displays sections within each article generated automatically from markdown headings.

To control the layout of the application you can add links to the navbar to create separate sections of documentation. Each link must correspond to a folder in `pages` and the markdown files it contains will generate independent articles found on the left navigation.

For more information please refer to the Nextra article titled [Page Configuration](https://nextra.site/docs/docs-theme/page-configuration#pages).

## Embedding Tableau and .MDX

To showcase the product, please add high-quality Tableau embeds with device specific layouts. Tableau Public is the right hosting environment for assets used for public documentation. It is not yet intended for this application to support SSO and display visualizations secured by authentication. Embeds are abstracted into a reusable React component that requires a few configuration options.

For more detailed instructions refer to the section [Embedding Tableau](./README.md#embedding-tableau) in the README.

## Images

For engaging documentation please consider adding images in good measure. Images receive considerable optimization by Nextjs however static exports to GitHub cannot use this feature and must rely on less sophisticated methods.

This project was configured to circumvent that limitation by hosting images on [IMGIX](https://imgix.com/) which automatically creates multiple copies of optimized images and hosts them on a cloud service. 

To upload image files, add images to the `public` folder and push updates to the `prod` branch as IMGIX is configured to use a [Web Folder](https://docs.imgix.com/setup/creating-sources/web-folder) as a source, meaning that it will mirror img files served at this domain.

This results in writers being able to easily add images to markdown with the resulting app having a fully responsive set of images that are never too small or too large for the device that displays them. A common issue for websites that we are gladly avoiding. 

>IMGIX highly recommends reading Eric Portis' [seminal article on srcset and sizes](https://ericportis.com/posts/2014/srcset-sizes/). This article explains the history of responsive images in responsive design, why they're necessary, and how all these technologies work together to save bandwidth and provide a better experience for users.

# shadcn

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "global.css",
    "baseColor": "stone",
    "cssVariables": false,
    "prefix": ""
  },
  "aliases": {
    "components": "components/",
    "utils": "utils/"
  }
}
```
