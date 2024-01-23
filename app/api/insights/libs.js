import { httpPost } from "../../../utils";

const tableau_domain = process.env.PULSE_DOMAIN; // URL for Tableau environment
const pulse_path = '/api/-/pulse'; // path to resource

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

  const res = await httpPost(endpoint, body, config);
  // handles errors found in response to determine if a serverless timeout occurred
  const timeout = isServerlessTimeout(res); 
  return timeout ? null : res;
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