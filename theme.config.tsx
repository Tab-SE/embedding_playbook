import { useRouter } from 'next/router'
import { useConfig, DocsThemeConfig } from 'nextra-theme-docs';
import Logo from './components/logo/logo';

const description = "This playbook teaches you how to compose Tableau's varied product capabilities into applications that thrill customers, coworkers and friends!";

const config: DocsThemeConfig = {
  logo: Logo,
  project: {
    link: 'https://tab-se.github.io/embedding_playbook',
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
    const imgix = 'https://tableauembeddingplaybook.imgix.net/'
    const socialCard =
      route === '/' || !title
        ? imgix + 'tableau/logo_text.png'
        : `https://tab-se.github.io/api/og?title=${title}`;

    return (
      <>
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="theme-color" content="#fff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="description"
          content={description}
        />
        <meta
          name="og:description"
          content={description}
        />
        <meta name="twitter:card" content={imgix + "tableau/logo_text.png"} />
        <meta name="twitter:image" content={socialCard} />
        <meta name="twitter:site:domain" content="https://tab-se.github.io" />
        <meta name="twitter:url" content="https://tab-se.github.io/embedding_playbook" />
        <meta name="og:title" content={title}/>
        <meta name="og:image" content={socialCard} />
        <meta name="apple-mobile-web-app-title" content={title} />
        <link rel="icon" href={imgix + "svg/logo_color.svg"} type="image/svg+xml" />
        <link rel="icon" href={imgix + "tableau/tableau.ico"} type="image/ico" />
        <link rel="icon" href={imgix + "tableau/tableau_logo.png"} type="image/png" />
        <link
          rel="icon"
          href={imgix + "svg/dark.svg"}
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          href={imgix + "tableau/tableau_logo_dark.png"}
          type="image/png"
          media="(prefers-color-scheme: dark)"
        />
      </>
    )
  }
}

export default config
