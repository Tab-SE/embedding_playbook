import { httpGet, httpPost } from "../utils/http"

const tableau_domain = process.env.PULSE_DOMAIN; // URL for Tableau environment
const tableau_domain2 = process.env.TABLEAU_DOMAIN; // URL for Tableau environment
const pulse_path = '/api/-/pulse'; // path to resource
const api = process.env.PULSE_API; // Tableau API version (classic resources)
const api2 = process.env.TABLEAU_API; // Tableau API version (classic resources)
const contentUrl = process.env.PULSE_SITE; // Tableau site name
const contentUrl2 = process.env.TABLEAU_SITE; // Tableau site name


// authenticate to Tableau with JSON Web Tokens
export const tabAuthJWT = async (jwt) => {
  const endpoint = `${tableau_domain2}/api/${api2}/auth/signin`;

  const body = {
    credentials: {
      jwt: jwt,
      site: {
        contentUrl: contentUrl2,
      }
    }
  };

  const config = {
    tableau_domain2,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const response = await httpPost(endpoint, body, config);

  const site_id = response.credentials.site.id;
  const site = response.credentials.site.contentUrl;
  const user_id = response.credentials.user.id;
  const key = response.credentials.token; // Embed and REST API authentication supported via JWT
  return { site_id, site, user_id, key };
}

// authenticate to Tableau with Personal Access Tokens
export const tabAuthPAT = async (pat_name, pat_secret) => {
  const endpoint = `${tableau_domain}/api/${api}/auth/signin`;

  const body = {
    credentials: {
      personalAccessTokenName: pat_name,
      personalAccessTokenSecret: pat_secret,
      site: {
        contentUrl: contentUrl,
      }
    }
  };

  const config = {
    tableau_domain,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const response = await httpPost(endpoint, body, config);

  const site_id = response.credentials.site.id;
  const site = response.credentials.site.contentUrl;
  const user_id = response.credentials.user.id;
  const rest_key = response.credentials.token; // only REST API authentication supported via PAT
  const expiration = response.credentials.estimatedTimeToExpiration;
  return { site_id, site, user_id, rest_key, expiration };
}


// get subscription IDs for the provided user
export const getSubscriptions = async (apiKey, userId, pageSize) => {
  const endpoint = tableau_domain + pulse_path + '/subscriptions';

  const config = {
    tableau_domain,
    headers: {
      'X-Tableau-Auth': apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: {
      user_id: userId,
      page_size: pageSize ? pageSize : 15,
    },
  };

  return await httpGet(endpoint, config);
}

// get specifications for the provided metric IDs
export const getSpecifications = async (apiKey, metric_ids) => {
  const endpoint = tableau_domain + pulse_path + '/metrics:batchGet';

  const config = {
    tableau_domain,
    headers: {
      'X-Tableau-Auth': apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: {
      metric_ids: metric_ids,
    },
  };

  return await httpGet(endpoint, config);
}

// get definitions for the provided metric IDs
export const getDefinitions = async (apiKey, definition_ids) => {
  const endpoint = tableau_domain + pulse_path + '/definitions:batchGet';

  const config = {
    tableau_domain,
    headers: {
      'X-Tableau-Auth': apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: {
      definition_ids: definition_ids,
    },
  };

  return await httpGet(endpoint, config);
}

// requests parsed metrics from private API
export const getMetrics = async () => {
  const endpoint = '/api/metrics';
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }

  return await httpGet(endpoint, config);
}

// requests parsed insights from private API
export const getInsights = async (metrics) => {
  const endpoint = '/api/insights';
  const body = {};

  if (Array.isArray(metrics)) {
    if (metrics.length === 0) {
      throw new Error('metrics must have at least one element');
    }
    body.metrics = metrics;
  } else {
    throw new Error('metrics must be an array!');
  }
  
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return await httpPost(endpoint, body, config);
}

// requests insight bundles for all supported types given a metric (params)
export const getInsightBundles = async (apiKey, params) => {
  const insights = [];
  // 3 types of insight bundles available
  const resources = ['/ban', '/detail', '/springboard'];
  // create a request body
  const body = makeInsightsBody(params);

  resources.forEach(async (resource) => {
    const endpoint = tableau_domain + path + resource;
    
    const config = {
      tableau_domain,
      headers: {
        'X-Tableau-Auth': apiKey,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    };

    const bundle = await httpPost(endpoint, body, config);
    insights.push(bundle);
  })

  return insights;
}

// generetes the complex request body required to generate an insights bundle
const makeInsightsBody = (params) => {
  // Get the current date and time in this format YYYY-MM-DD
  const currentTime = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  // Get the time zone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // spread members from params object
  const { 
    name,
    metric_id,
    definition_id,
    definition,
    metric_specification,
    extension_options,
    representation_options,
    insights_options,
   } = params;

  const body = {
    bundle_request: {
      version: "1",
      options: {
        output_format: "OUTPUT_FORMAT_TEXT",
        now: currentTime,
        time_zone: timeZone
      },
      input: {
        metadata: {
          name: name,
          metric_id: metric_id,
          definition_id: definition_id
        },
        metric: {
          definition: definition,
          metric_specification: metric_specification,
          extension_options: extension_options,
          representation_options: representation_options,
          insights_options: insights_options
        }
      }
    }
  }

  return body;
}
