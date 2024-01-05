import { useRouter } from 'next/router'
import { useConfig, DocsThemeConfig } from 'nextra-theme-docs';
import Logo from './components/Logo';
import Head from './components/Head'

const vercel = process.env.NEXT_PUBLIC_BASE_URL;
// const public_url = process.env.NEXT_PUBLIC_API_BASE_URL; // URL for Serverless functions
const description = "This playbook teaches you how to compose Tableau's varied product capabilities into applications that thrill customers, coworkers and friends!";

const config: DocsThemeConfig = {
  logo: <Logo/>,
  project: {
    link: 'https://github.com/Tab-SE/embedding_playbook',
  },
  docsRepositoryBase: 'https://github.com/Tab-SE/embedding_playbook/tree/main/',
  footer: {
    text: 'Tableau Embedding Playbook',
  },
  toc: {
    backToTop: true
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s'
    }
  },
  head: function useHead() {
    const { title } = useConfig();
    const { route } = useRouter();
    const imgix = 'https://tableauembeddingplaybook.imgix.net';
    const imgHost = vercel;
    const socialCard =
      route === '/' || !title
        ? imgHost + '/img/tableau/logo_text.png?w=350'
        : `https://tab-se.github.io/api/og?title=${title}`;

    return (
      <>
        <Head
          title={title}
          description={description}
          imgix={imgix}
          imgHost={imgHost}
          socialCard={socialCard}
        />
        <link rel="icon" href={imgHost + "/svg/logo_color.svg?h=32&w=32"} type="image/svg+xml" />
        <link rel="icon" href={imgHost + "/img/tableau/tableau.ico?h=32&w=32"} type="image/ico" />
        <link rel="icon" href={imgHost + "/img/tableau/tableau_logo.png?h=32&w=32"} type="image/png" />
        <link rel="icon" href={imgHost + "/svg/dark.svg?h=32&w=32"} type="image/svg+xml" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href={imgHost + "/img/tableau/tableau_logo_dark.png?h=32&w=32"} type="image/png" media="(prefers-color-scheme: dark)" />
      </>
    )
  }
}

export default config
