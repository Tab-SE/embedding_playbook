// used by <Link/> component and static CSS
let assetPrefix;
// used by <Image/> component
let basePath;

const pathFinder = () => {
  // sets paths for different export environments

  // exports via GitHub Actions  
  // https://www.viget.com/articles/host-build-and-deploy-next-js-projects-on-github-pages/
  const isGithubActions = process.env.GITHUB_ACTIONS || false;
  if (isGithubActions) {
    // trim off `<owner>/`
    const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
    assetPrefix = `/${repo}/`;
    basePath = `/${repo}`;
  } 
  // exporting to GitHub Pages without using Actions via package.json scripts
  else if (process.env.EXPORT_STRATEGY === 'manual') {
    const repo = process.env.GITHUB_REPOSITORY;
    assetPrefix = `/${repo}/`;
    basePath = `/${repo}`;
  }
};

// initializes the withNextra config object with theme settings
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
