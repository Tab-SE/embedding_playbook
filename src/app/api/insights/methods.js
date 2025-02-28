const tableau_domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN; // URL for Tableau environment
const pulse_path = '/api/-/pulse'; // path to resource

// returns stringified payload to form responses
export const makePayload = async (rest_key, metric) => {
  if (rest_key && metric) {
    let bundle;
    try {
      // request insights
      bundle = await getInsightBundle(rest_key, metric, '/detail');
    } catch (err) {
      console.debug(err);
      return null;
    }
    return bundle;
  } else {
    // errors resolve to false
    const err = new Error('Cannot perform operation without required params');
    console.debug(err);
    return err;
  }
}

// requests insight bundles for all supported types given a metric (params)
const getInsightBundle = async (apiKey, metric, resource) => {
  // create a request body (standard for all Pulse bundle requests)
  const bundles = makeBundleBody(metric);
  const body = JSON.stringify(bundles);

  const endpoint = tableau_domain + pulse_path + '/insights' + resource;

  const request = new Request(endpoint, {
    method: 'POST',
    headers: {
      'X-Tableau-Auth': apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: body,
  });

  const res = await fetch(request);

  isServerlessTimeout(res);

  const contentType = res.headers.get('content-type');


  if (contentType === 'text/html; charset=UTF-8') {
    const txt = await res.text();
    throw new Error(txt);
  } else if (contentType === 'application/json') {
    const jsonData = await res.json();
    return jsonData;
  }
}

// generetes the complex request body required to generate an insights bundle
const makeBundleBody = (metric) => {
  // calculate time for "now" value in required format
  const currentTime = new Date();

  // Format the date and time to 'YYYY-MM-DD HH:MM:SS'
  const formattedDate = currentTime.getFullYear() +
    "-" + ("0" + (currentTime.getMonth() + 1)).slice(-2) +
    "-" + ("0" + currentTime.getDate()).slice(-2) +
    " " + ("0" + currentTime.getHours()).slice(-2) +
    ":" + ("0" + currentTime.getMinutes()).slice(-2) +
    ":" + ("0" + currentTime.getSeconds()).slice(-2);

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
