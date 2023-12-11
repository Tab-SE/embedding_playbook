// exports a config object containing environment variables and other app settings
// avoids running process.env function calls on server functions due to minor performance impact
const config = {
  node_env: process.env.NODE_ENV,
  github_id: process.env.GITHUB_ID, 
  github_secret: process.env.GITHUB_SECRET, 
  tableau : {
    viz: {
      domain: process.env.TABLEAU_DOMAIN,
      api: process.env.TABLEAU_API,
      site: process.env.TABLEAU_SITE,
      pat_name: process.env.TABLEAU_PAT_NAME,
      pat_secret: process.env.TABLEAU_PAT_SECRET,
    },
    pulse: {
      domain: process.env.PULSE_DOMAIN,
      api: process.env.PULSE_API,
      site: process.env.PULSE_SITE,
      pat_name: process.env.PULSE_PAT_NAME,
      pat_secret: process.env.PULSE_PAT_SECRET,
    } 
  }
};

export default config;