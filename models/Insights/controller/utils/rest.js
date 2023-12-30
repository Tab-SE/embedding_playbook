import { get } from "../../../../utils/http"

const public_url = process.env.NEXT_PUBLIC_API_BASE_URL; // URL for Serverless functions
const tableau_domain = process.env.PULSE_DOMAIN; // URL for Tableau environment
const path = '/api/-/pulse'; // path to resource


export const getInsights = (apiKey, params) => {
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

    const bundle = get(endpoint, config);
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

// // requests a BAN insight bundle
// export const getBan = (apiKey, params) => {
//   const endpoint = tableau_domain + path + '/insights/ban';
//   const body = makeInsightsBody(params);

//   const config = {
//     tableau_domain,
//     headers: {
//       'X-Tableau-Auth': apiKey,
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body,
//   };

//   return get(endpoint, config);
// }


// // requests a Detail insight bundle
// export const getDetail = (apiKey, params) => {
//   const endpoint = tableau_domain + path + '/insights/detail';
//   const body = makeInsightsBody(params);

//   const config = {
//     tableau_domain,
//     headers: {
//       'X-Tableau-Auth': apiKey,
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body,
//   };

//   return get(endpoint, config);
// }


// // requests a Springboard insight bundle
// export const getSpringboard = (apiKey, params) => {
//   const endpoint = tableau_domain + path + '/insights/springboard';
//   const body = makeInsightsBody(params);

//   const config = {
//     tableau_domain,
//     headers: {
//       'X-Tableau-Auth': apiKey,
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body,
//   };

//   return get(endpoint, config);
// }
