# Embed Tableau 

[Tableau](https://www.tableau.com) is the world's leading end-to-end data and analytics platform. 

![tableau logo](public/img/tableau/logo_text.png)

Leverage the analytical powerhouse of Tableau to analyze and visualize data. This guide teaches you how to compose Tableau's varied [product capabilities](https://www.tableau.com/products/our-platform) into applications that thrill customers, coworkers and friends!

Beyond creating visual representations of data, Tableau provides the greatest benefits as it helps people discover what information is valuable to others. It enables users to analyze data and build the interfaces that represent 
them with unmatched speed and flexibility resulting in a springboarding of ideas into value.

![tableau running on a laptop](public/img/opengraph/embed_tableau.png)

To get started, go to [Embed Tableau](https://embedding-playbook.vercel.app/).

<br/>

## Local Development

Follow this guide to run the project locally and have it preview live changes that you make to the codebase. This setup is also useful when performing demos:

1. First, clone this GitHub repository using your [method of choice](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

2. Then, navigate to the directory where you cloned the repository using your shell.
```sh
cd embedding_playbook
```

3. Install dependencies (look for a file called `package.json` for more details).
```sh
npm i
```

4. Create local environment files by copying the provided templates.
```sh
# copy the development template
cp ./.env.development ./.env.development.local
# copy the production template
cp ./.env.production ./.env.production.local
```

5. Provide values for all environment variables listed in `.env.development.local` (for local development) and `.env.production.local` (for creating local production builds).

6. Finally, start the development server (`package.json` for more shell scripts).
```sh
npm run dev
```

7. From this point forward, any changes made to files in the codebase will be previewed live in development mode, noticeable in particular will be changes to React components (`.jsx` files) or Markdown articles (`.mdx` or `.md` files). 

Visit `localhost:3000` to see the app. Enjoy!

>NOTE: Development on GitHub codespaces may differ from this process. Please refer to their documentation for further guidance.

![up and down area chart](public/img/stock/up_down_area.png)

## Deployment

If you wish to deploy your own copy of [Embed Tableau](https://embedding-playbook.vercel.app/) these are your options:

1. Host a fork on [Vercel](https://vercel.com/home)
2. Host a fork [yourself](https://nextjs.org/docs/pages/building-your-application/deploying) (static export, Nodejs or Docker)

> NOTE: Learn more about [forking repositories here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo).

Of these options, hosting on Vercel is the most straightforward and the recommended path for beginners. It mostly consists of forking the repository, creating a free account on Vercel, connecting your profile to Github and importing project.

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
</br>

## Contributing

Contributions to this project are more than welcome and may come in the form of enhancements to the codebase, writing articles, correcting or identifying bugs or even suggesting improvements.

For more information please refer to the [Contribution Guide](./CONTRIBUTING.md).


## License

This project is licensed under the [MIT License](LICENSE).

![narrow area chart](public/img/stock/area_chart_banner.png)
