const path = process.env.PROJECT_NAME;
// used by <Link/> component and static CSS
let assetPrefix;
// used by <Image/> component
let basePath;

const isGithubActions = process.env.GITHUB_ACTIONS || false;
// exports via GitHub Pages via automated Actions
// https://www.viget.com/articles/host-build-and-deploy-next-js-projects-on-github-pages/
if (isGithubActions) {
  // trim off `<owner>/`, testing dynamically obtaining values from GitHub env
  // const path = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  assetPrefix = `/${path}/`;
  basePath = `/${path}`;
} else if (process.env.HOSTING === 'gh_pages') {
  // exporting to GitHub Pages via package.json scripts
  assetPrefix = `/${path}/`;
  basePath = `/${path}`;
}

// initializes the withNextra config object with theme settings
// set staticImage: false to avoid usage of IMGIX at a loss of image optimization
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  staticImage: true,
});

// exports the config with some additional nextjs settings
// current config requires usage of <Img/> component for optimization
// markdown syntax ![]() uses unoptimized images
// if basePath must be defined add it here: basePath: basePath, excluded due to imgix hosting
module.exports = withNextra({
  assetPrefix: assetPrefix,
  basePath: basePath,
  images: {
    loader: 'imgix',
    domains: ['tableauembeddingplaybook.imgix.net'],
    path: 'tableauembeddingplaybook.imgix.net',
  },
});
