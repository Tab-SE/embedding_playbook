const tableau_domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN; // URL for Tableau environment
const pulse_path = '/api/-/pulse'; // path to resource

// returns stringified payload to form responses
export const makePayload = async (rest_key, metric, tableauUrl) => {
  if (rest_key && metric) {
    let bundle;
    try {
      // request insights
      bundle = await getInsightBundle(rest_key, metric, '/detail', tableauUrl);
      let ban = await getInsightBundle(rest_key, metric, '/ban', tableauUrl);
      let banInsight = ban.bundle_response.result.insight_groups[0].insights[0];
      // if the target time comparison is the same, then don't push
      if (bundle.bundle_response.result.insight_groups[0].insights[0].result.facts.comparison_time_period.range !== banInsight.result.facts.comparison_time_period.range){
        bundle.bundle_response.result.insight_groups[0].insights.push(banInsight);
      }
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
const getInsightBundle = async (apiKey, metric, resource, tableauUrl) => {
  let _domain = tableau_domain;
  if (typeof tableauUrl !== 'undefined') _domain = tableauUrl;

  // create a request body (standard for all Pulse bundle requests)
  const body = makeBundleBody(metric);

  // if we are requesting the BAN, it is because we want the 2nd PoPc type
  // eg if the /insights/detail request is for TIME_COMPARISON_YEAR_AGO_PERIOD, then we flip it to TIME_COMPARISON_PREVIOUS_PERIOD
if (resource === '/ban'){
    if (body.bundle_request.input.metric.metric_specification.comparison.comparison === 'TIME_COMPARISON_YEAR_AGO_PERIOD') {
      body.bundle_request.input.metric.metric_specification.comparison.comparison = 'TIME_COMPARISON_PREVIOUS_PERIOD';
    } else if (body.bundle_request.input.metric.metric_specification.comparison.comparison === 'TIME_COMPARISON_PREVIOUS_PERIOD') {
      body.bundle_request.input.metric.metric_specification.comparison.comparison = 'TIME_COMPARISON_YEAR_AGO_PERIOD';
    }
  }


  const endpoint = _domain + pulse_path + '/insights' + resource;

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

  isServerlessTimeout(res);

  const contentType = res.headers.get('content-type');

  if (contentType === 'text/html') {
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
        // output_format: "OUTPUT_FORMAT_TEXT",
        output_format: "OUTPUT_FORMAT_HTML",
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
