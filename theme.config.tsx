import { DocsThemeConfig } from 'nextra-theme-docs'
import Logo from './components/logo/logo'

const config: DocsThemeConfig = {
  logo: Logo,
  project: {
    link: 'https://tab-se.github.io/embedding_playbook',
  },
  docsRepositoryBase: 'https://github.com/Tab-SE/embedding_playbook/tree/main/',
  footer: {
    text: 'Tableau Embedding Playbook',
  },
}

export default config
