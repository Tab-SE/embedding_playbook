const tableau_domain = process.env.PULSE_DOMAIN; // URL for Tableau environment
const pulse_path = '/api/-/pulse'; // path to resource

// returns stringified payload to form responses
export const makePayload = async (rest_key, metric) => {
  if (rest_key && metric) {
    let bundle;
    try {
      // request insights
      bundle = await getInsightBundle(rest_key, metric, '/detail');
    } catch (err) {
      return err;
    }
    return bundle;
  } else {
    // errors resolve to false
    return new Error('Cannot perform operation without required params');
  }
}

// requests insight bundles for all supported types given a metric (params)
const getInsightBundle = async (apiKey, metric, resource) => {
  // create a request body (standard for all Pulse bundle requests)
  const body = makeBundleBody(metric);

  const endpoint = tableau_domain + pulse_path + '/insights' + resource;

  const request = new Request(endpoint, {
    method: 'POST',
    headers: {
      'X-Tableau-Auth': apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const res = await fetch(request);
  // handles errors found in response to determine if a serverless timeout occurred
  const timeout = isServerlessTimeout(res);
  return timeout ? null : res.json();
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

// determines if a Serverless timeout occurred
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
