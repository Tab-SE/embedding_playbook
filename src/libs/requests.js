import { httpGet, httpPost } from "utils";

const tableau_domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN; // URL for Tableau environment
const contentUrl = process.env.NEXT_PUBLIC_ANALYTICS_SITE; // Tableau site name
const pulse_path = '/api/-/pulse'; // path to resource
const api = process.env.TABLEAU_API; // Tableau API version (classic resources)

const basePath = process.env.NEXT_PUBLIC_BASE_URL;

// authenticate to Tableau with JSON Web Tokens
export const tabAuthJWT = async (jwt, tableauUrl, contentUrl) => {

  let _domain = tableau_domain;
  if (typeof tableauUrl !== 'undefined') _domain = tableauUrl;
  const endpoint = `${_domain}/api/${api}/auth/signin`;
  let _contentUrl = contentUrl;
  if (typeof contentUrl !== 'undefined') _contentUrl = contentUrl;
  const body = {
    credentials: {
      jwt: jwt,
      site: {
        contentUrl: _contentUrl,
      }
    }
  };

  const config = {
    tableau_domain: _domain,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const response = await httpPost(endpoint, body, config);
  if (!response.credentials) {
    console.log(`RESPONSE NOT OK!`);
    console.log(response);
    // if (response?.response?.status === 401) {
    //   throw new Error('Unauthorized: Invalid JWT token.');
    // } else if (response?.response?.status === 404) {
    //   throw new Error('Not Found: The specified endpoint does not exist.');
    // } else if (response?.response?.status >= 400 && response?.response?.status < 500) {
    //   throw new Error(`Client Error: ${response?.response?.statusText}`);
    // } else if (response?.response?.status >= 500) {
    //   throw new Error(`Server Error: ${response?.response?.statusText}`);
    // }
    // else {
      throw new Error(`${JSON.stringify(response)}`);
    // }
  }

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

export const tabSignOut = async (tableauUrl) => {
  let _domain = tableau_domain;
  if (typeof tableauUrl !== 'undefined') _domain = tableauUrl;
  const endpoint = _domain + '/auth/signout';

  const config = {
    tableau_domain: _domain,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return await httpPost(endpoint, config);
}

// get subscription IDs for the provided user
export const getSubscriptions = async (apiKey, userId, pageSize, tableauUrl) => {
  let _domain = tableau_domain;
  if (typeof tableauUrl !== 'undefined') _domain = tableauUrl;
  const endpoint = `${_domain}${pulse_path}/subscriptions`;

  const config = {
    tableau_domain: _domain,
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
export const getSpecifications = async (apiKey, metric_ids, tableauUrl) => {
  let _domain = tableau_domain;
  if (typeof tableauUrl !== 'undefined') _domain = tableauUrl;
  const endpoint = _domain + pulse_path + '/metrics:batchGet';

  const config = {
    tableau_domain: _domain,
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
export const getDefinitions = async (apiKey, definition_ids, tableauUrl) => {
  let _domain = tableau_domain;
  if (typeof tableauUrl !== 'undefined') _domain = tableauUrl;
  const endpoint = _domain + pulse_path + '/definitions:batchGet';

  const config = {
    _domain,
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
  const endpoint = `${basePath}/api/metrics`;
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
  // RSG 2025.01.22 - Not really an error if the user doesn't have any subscribed metrics
  // if (res.length <= 0) {
  //   throw new Error('Empty array');
  // }

  return res;
}
// requests parsed metrics from private API
export const getMetricPrivate = async (specification_id) => {

  if (!specification_id) {
    throw new Error('getMetricPrivate: No specification_id');
  };
  const endpoint = `${basePath}/api/metric`;
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: {
      specification_id: specification_id,
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

// https://10az.online.tableau.com/api/-/pulse/metrics:getOrCreate
export const getFilter = async (apiKey, defSpec, tableauUrl) => {
  let _domain = tableau_domain;
  if (typeof tableauUrl !== 'undefined') _domain = tableauUrl;
  const endpoint = _domain + pulse_path + '/metrics:getOrCreate';

  const config = {
    tableau_domain: _domain,
    headers: {
      'X-Tableau-Auth': apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  };

  const res = await httpPost(endpoint, defSpec, config);
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


// requests parsed metrics from private API
export const getMetricFiltersPrivate = async (metrics, filters) => {
  const endpoint = `${basePath}/api/filterMetrics`;
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },

  }
  const body = { metrics, filters };
  const res = await httpPost(endpoint, body, config);
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



// requests a datasource from private API
export const getDatasourceFieldsPrivate = async (datasourceId, fieldName) => {
  const endpoint = `${basePath}/api/pulse/datasources/fields`;
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: {
      datasourceId: datasourceId,
      fieldName: fieldName
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
  return res;
}
// requests a datasource from private API
export const getDatasourcePrivate = async (datasourceId, extension_options) => {
  const endpoint = `${basePath}/api/pulse/datasources`;
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: {
      datasourceId: datasourceId,
    }
  }

  const body = {
    extension_options: extension_options,
  }

  const res = await httpPost(endpoint, body, config);
  const timeout = isServerlessTimeout(res);

  // when used with tanstack queries, errors trigger retries
  if (timeout) {
    throw new Error('Serverless timeout');
  }
  if (!res) {
    throw new Error('Unexpected response');
  }
  return res;
}

// obtains a public token for the frontend
export const getUser = async (userId) => {
  const endpoint = `${basePath}/api/user`;
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
  const endpoint = `${basePath}/api/insights`;
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
  const endpoint = `${basePath}/api/metadata`;

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


export const fetchFont = async (fontName, weight) => {
  try {
    const response = await fetch(`${basePath}/api/font`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fontName, weight }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.statusText}`);
    }

    const fontCss = await response.text();
    return fontCss;
  } catch (error) {
    console.error(error);
  }
};
