// this handles basePath for <Link/> and assetPrefix for <Image/> components exported statically to GH Pages: 
// https://www.viget.com/articles/host-build-and-deploy-next-js-projects-on-github-pages/
const isGithubActions = process.env.GITHUB_ACTIONS || false;
let assetPrefix;
let basePath;


if (isGithubActions) {
  // trim off `<owner>/`
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

// initializes the withNextra config object with theme settings
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  staticImage: true,
});

// exports the config with some additional nextjs settings
// current config requires usage of <Img/> component for optimization
// markdown syntax ![]() uses unoptimized images
module.exports = withNextra({
  assetPrefix: assetPrefix,
  basePath: basePath,
  images: {
    loader: 'imgix',
    domains: ['embeddingplaybook.imgix.net'],
    path: 'embeddingplaybook.imgix.net',
  },
});
