import { useRouter } from 'next/router';
import { useConfig, DocsThemeConfig } from 'nextra-theme-docs';
import { Logo } from './components/Logo';
import { Head } from './components/Head';

const vercel = 'https://embedding-playbook.vercel.app';
const description = "This playbook teaches you how to compose Tableau's varied product capabilities into applications that thrill customers, coworkers and friends!";

const config: DocsThemeConfig = {
  logo: <Logo/>,
  project: {
    link: 'https://github.com/Tab-SE/embedding_playbook',
  },
  docsRepositoryBase: 'https://github.com/Tab-SE/embedding_playbook/tree/main/',
  footer: {
    text: '✨ Embed Tableau',
  },
  toc: {
    backToTop: true
  },
  useNextSeoProps() {
    const { route } = useRouter();
    // changes title on home '/' route
    if (route !== '/') {
      return {
        titleTemplate: '%s ✨ Embed Tableau'
      };
    } else {
      return {
        titleTemplate: 'Embed Tableau ✨ Home'
      };
    }
  },
  head: function useHead() {
    const { title } = useConfig();
    const imgHost = vercel;

    return (
      <>
        <Head
          title={title}
          description={description}
          imgHost={imgHost}
        />
        <link rel="icon" href={imgHost + "/svg/logo_color.svg?h=32&w=32"} type="image/svg+xml" />
        <link rel="icon" href={imgHost + "/img/tableau/tableau.ico?h=32&w=32"} type="image/ico" />
        <link rel="icon" href={imgHost + "/img/tableau/tableau_logo.png?h=32&w=32"} type="image/png" />
        <link rel="icon" href={imgHost + "/svg/dark.svg?h=32&w=32"} type="image/svg+xml" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href={imgHost + "/img/tableau/tableau_logo_dark.png?h=32&w=32"} type="image/png" media="(prefers-color-scheme: dark)" />
      </>
    );
  }
}

export default config
