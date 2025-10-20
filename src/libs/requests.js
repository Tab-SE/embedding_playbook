import { httpGet, httpPost } from "utils";

const tableau_domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN; // URL for Tableau environment
const pulse_path = '/api/-/pulse'; // path to resource
const api = process.env.TABLEAU_API; // Tableau API version (classic resources)
const contentUrl = process.env.NEXT_PUBLIC_ANALYTICS_SITE; // Tableau site name

// authenticate to Tableau with JSON Web Tokens
export const tabAuthJWT = async (jwt) => {
  console.log('🔐 JWT Authentication Debug:');
  console.log('JWT Token:', jwt);
  console.log('Tableau Domain:', tableau_domain);
  console.log('API Version:', api);
  console.log('Content URL:', contentUrl);

  const endpoint = `${tableau_domain}/api/${api}/auth/signin`;
  console.log('Auth Endpoint:', endpoint);

  const body = {
    credentials: {
      jwt: jwt,
      site: {
        contentUrl: contentUrl,
      }
    }
  };
  console.log('Auth Body:', JSON.stringify(body, null, 2));

  const config = {
    tableau_domain,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await httpPost(endpoint, body, config);
    console.log('✅ Auth Response:', response);

    const site_id = response.credentials.site.id;
    const site = response.credentials.site.contentUrl;
    const user_id = response.credentials.user.id;
    const rest_key = response.credentials.token; // Embed and REST API authentication supported via JWT
    return { site_id, site, user_id, rest_key };
  } catch (error) {
    console.error('❌ JWT Auth Error:', error);
    throw error;
  }
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

  // when used with tanstack queries, errors trigger retries
  if (timeout) {
    throw new Error('Serverless timeout');
  }
  if (!res) {
    throw new Error('Unexpected response');
  }
  if (res.length <= 0) {
    throw new Error('Empty array');
  }

  return res;
}

// obtains a public token for the frontend
export const getUser = async (userId) => {
  const endpoint = '/api/user';
  const body = { userId };

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

  // when used with tanstack queries, errors trigger retries
  if (timeout) {
    throw new Error('504: Serverless Timeout');
  }
  if (!res) {
    throw new Error('500: Unexpected response');
  }
  if (res.length <= 0) {
    throw new Error('500: Empty array');
  }
  if (!res.bundle_response && !res.errors) {
    throw new Error('500: No bundle response or errors')
  }

  return res;
}

// obtains metadata from private API for dynamic content
export const getMetadata = async () => {
  const endpoint = '/api/metadata';

  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }

  const res = await httpGet(endpoint, config);
  const timeout = isServerlessTimeout(res);

  // when used with tanstack queries, errors trigger retries
  if (timeout) {
    throw new Error('Serverless timeout');
  }
  if (!res) {
    throw new Error('Unexpected response');
  }
  if (res.length <= 0) {
    throw new Error('Empty array');
  }

  return res;
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
