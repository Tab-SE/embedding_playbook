# Style Guide

## Writing Articles

Contributing to new or existing articles is done by editing `.mdx` files located in the `pages/` folder. The folder structure of `pages/` dictates the overall layout of the application which can be further customized via `_meta.json` files placed inside each folder. This architecture is designed and maintained by [Nextra which documents](https://nextra.site/docs/docs-theme/page-configuration) all available options for organizing content.

Refer to this guide for help with [Markdown Syntax](https://www.markdownguide.org/) such as tables, quotes and more. These provide the basics elements that make up the Markdown language. However, this application goes further than that and allows writers to insert interactive components to their posts. Given that `.mdx` files are a superset of [Markdown](https://mdxjs.com/) (`.md` files) that supports `jsx`, this allows for complete customization via [React](https://react.dev/) components such as the Tableau visualization or a Pulse Metric. 

As a result this documentation project is incredibly flexible while content is written in a more pleasing format to write and maintain than HTML without the overhead of a dedicated [CMS](https://en.wikipedia.org/wiki/Content_management_system) or a [headless CMS](https://en.wikipedia.org/wiki/Headless_content_management_system).


## Embedding Tableau

Embedding in this app relies on importing a reusable UI component into an article that ends with `.mdx` as it designates the file as using a [superset of markdown](https://mdxjs.com/) that supports React components. To accomplish this, do the following:

1. Make sure the article ends in `.mdx` rather than `.md` which does not support React.
2. Import the `<Tableau/>` component into the article and provide configuration options as shown here:

```md
import { TableauViz } from '../../components';

# Embedding Tableau Views

This is generic markdown content preceding the Tableau component of interest

<Tableau
  src='https://public.tableau.com/views/{viz}'
  height='900'
  width='700'
  hideTabs='true'
  device='default'
/>
```
