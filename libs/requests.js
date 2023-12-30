import { get, post } from "../utils/http"

const public_url = process.env.NEXT_PUBLIC_API_BASE_URL; // URL for Serverless functions
const tableau_domain = process.env.PULSE_DOMAIN; // URL for Tableau environment
const pulse_path = '/api/-/pulse'; // path to resource

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

  return get(endpoint, config);
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

  return get(endpoint, config);
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

  return get(endpoint, config);
}

// requests parsed metrics from private API
export const getMetrics = async () => {
  const endpoint = public_url + '/metrics';
  const config = {
    public_url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }

  return get(endpoint, config);
}

// requests parsed insights from private API
export const getInsights = async (metrics) => {
  const endpoint = public_url + '/insights';
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
    public_url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  };

  return post(endpoint, config);
}

// requests insight bundles for all supported types given a metric (params)
export const getInsightBundles = (apiKey, params) => {
  // 3 types of insight bundles available
  const resources = ['/ban', '/detail', '/springboard'];
  const insights = [];

  resources.forEach((resource) => {
    const endpoint = tableau_domain + path + resource;
    // create a request body
    const body = makeInsightsBody(params);
    const config = {
      tableau_domain,
      headers: {
        'X-Tableau-Auth': apiKey,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    };

    const bundle = post(endpoint, config);
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
