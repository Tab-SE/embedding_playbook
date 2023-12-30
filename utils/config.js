// exports a config object containing environment variables and other app settings
// avoids running process.env function calls on server functions due to minor performance impact

const config = {
  pulse: {
    domain: process.env.PULSE_DOMAIN,
    api: process.env.PULSE_API,
    site: process.env.PULSE_SITE,
    pat_name: process.env.PULSE_PAT_NAME,
    pat_secret: process.env.PULSE_PAT_SECRET,
  } 
};

export default config;
