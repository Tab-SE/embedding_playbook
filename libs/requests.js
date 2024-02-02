import { httpGet, httpPost } from "../utils";

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
  const rest_key = response.credentials.token; // Embed and REST API authentication supported via JWT
  return { site_id, site, user_id, rest_key };
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

export const tabSignOut = async () => {
  const endpoint = tableau_domain + '/auth/signout';

  const config = {
    tableau_domain,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return await httpPost(endpoint, config);
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

  const res = await httpGet(endpoint, config);
  const timeout = isServerlessTimeout(res);
  return timeout ? null : res;
}

// requests parsed insights from private API
export const getBan = async (metric) => {
  const endpoint = '/api/ban';
  const body = { metric };
  
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const res = await httpPost(endpoint, body, config);
  const timeout = isServerlessTimeout(res);
  return timeout ? null : res;
}

// requests parsed insights from private API
export const getSpringboard = async (metric) => {
  const endpoint = '/api/springboard';
  const body = { metric };
  
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const res = await httpPost(endpoint, body, config);
  const timeout = isServerlessTimeout(res);
  return timeout ? null : res;
}

// requests parsed insights from private API
export const getDetail = async (metric) => {
  const endpoint = '/api/detail';
  const body = { metric };
  
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const res = await httpPost(endpoint, body, config);
  const timeout = isServerlessTimeout(res);
  return timeout ? null : res;
}

// requests parsed insights from private API
export const getInsights = async (metric) => {
  const endpoint = '/api/insights';
  const body = { metric };
  
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const res = await httpPost(endpoint, body, config);
  const timeout = isServerlessTimeout(res); // determine if response timed out
  if (timeout) {
    console.log('timeout', timeout);
    throw new Error('504: Serverless Timeout');
  }
  console.log('res', res);

  return res;
}

// requests insight bundles for all supported types given a metric (params)
export const getInsightBundle = async (apiKey, metric, resource) => {
  // create a request body (standard for all Pulse bundle requests)
  const body = makeBundleBody(metric);

  const endpoint = tableau_domain + pulse_path + '/insights' + resource;
    
  const config = {
    tableau_domain,
    headers: {
      'X-Tableau-Auth': apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return await httpPost(endpoint, body, config);
}

// generetes the complex request body required to generate an insights bundle
const makeBundleBody = (metric) => {
  // calculate time for "now" value in required format
  const currentTime = new Date();
  // Get the date components
  const year = currentTime.getFullYear();
  const month = (currentTime.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = currentTime.getDate().toString().padStart(2, '0');
  const hour = currentTime.getHours().toString().padStart(2, '0');
  const minute = currentTime.getMinutes().toString().padStart(2, '0');
  const second = currentTime.getSeconds().toString().padStart(2, '0');
  // Format the date as "YYYY-MM-DD HH:mm:ss"
  const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  // Get the time zone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // all other object members
  const { 
    name, id, specification_id, definition, specification, 
    extension_options, representation_options, insights_options,
   } = metric;


  const body = {
    bundle_request: {
      version: "1",
      options: {
        output_format: "OUTPUT_FORMAT_TEXT",
        now: formattedDate,
        time_zone: timeZone
      },
      input: {
        metadata: {
          name: name,
          metric_id: specification_id,
          definition_id: id
        },
        metric: {
          definition: definition,
          metric_specification: specification,
          extension_options: extension_options,
          representation_options: representation_options,
          insights_options: insights_options
        }
      }
    }
  }

  return body;
}

const isServerlessTimeout = (res) => {
  if (res instanceof Error) {
    if (res.code === 504) {
      // throw errors at the query function level to cause a retry on timeouts
      throw new Error('Serverless Timeout Error:', res);
    }
    return true;
  } else {
    return false;
  }
}
