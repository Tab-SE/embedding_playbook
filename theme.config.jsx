import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';
import { Logo, Head } from 'components';

const vercel = 'https://embedding-playbook.vercel.app';
const description = "This playbook teaches you how to compose Tableau's varied product capabilities into applications that thrill customers, coworkers and friends!";
const basePath = process.env.NEXT_PUBLIC_BASE_URL;

export default {
  darkMode: false,
  primaryHue: 201,
  primarySaturation: 100,
  logo:
  <Logo
    src={basePath + "/img/tableau/tableau_logo.png"}
    width='33'
    text='Embed Tableau'
  />,
  footer: {
    text:
    <Logo
      src="/img/tableau/logo_text.png"
      width='300'
    />
  },
  search: {
    placeholder: "Search Documentation"
  },
  toc: {
    backToTop: true
  },
  project: {
    link: 'https://github.com/Tab-SE/embedding_playbook',
  },
  docsRepositoryBase: 'https://github.com/Tab-SE/embedding_playbook/tree/main',
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
        {/* {process.env.NODE_ENV === 'development' && <script src="http://localhost:8097"></script>} */}
        <link rel="icon" href={imgHost + basePath + "/svg/logo_color.svg?h=32&w=32"} type="image/svg+xml" />
        <link rel="icon" href={imgHost + basePath + "/img/tableau/tableau.ico?h=32&w=32"} type="image/ico" />
        <link rel="icon" href={imgHost + basePath + "/img/tableau/tableau_logo.png?h=32&w=32"} type="image/png" />
        <link rel="icon" href={imgHost + basePath + "/svg/dark.svg?h=32&w=32"} type="image/svg+xml" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href={imgHost + basePath + "/img/tableau/tableau_logo_dark.png?h=32&w=32"} type="image/png" media="(prefers-color-scheme: dark)" />
      </>
    );
  }
}
