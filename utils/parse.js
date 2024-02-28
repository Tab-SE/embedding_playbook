import { JSONPath } from 'jsonpath-plus';

/* 
defines utilities for parsing JSON objects used throughout the project
parsing functions are designed for reuse
*/

// return an minimal representation of subscriptions
export const parseSubscriptions = (subscriptionsResponse) => {
  const subscriptions = {};

  // Retrieve properties using JSONPath
  const subscription_ids = JSONPath({ path: '$.subscriptions[*].id', json: subscriptionsResponse }); // indexing array
  const metric_ids = JSONPath({ path: '$.subscriptions[*].metric_id', json: subscriptionsResponse });
  const create_times = JSONPath({ path: '$.subscriptions[*].create_time', json: subscriptionsResponse });
  const update_times = JSONPath({ path: '$.subscriptions[*].update_time', json: subscriptionsResponse });


  // Iterate through indexing array and create leaves in the return object
  subscription_ids.forEach((subscription, index) => {
    subscriptions[index] = {
      subscription_id: subscription, 
      metric_id: metric_ids[index], // Add the corresponding properties by index
      create_time: create_times[index],
      update_time: update_times[index], 
    };
  });
  return subscriptions;
}

// return an minimal representation of specifications
export const parseSpecifications = (specificationsResponse) => {
  const specifications = {};

  // Retrieve properties using JSONPath
  const ids = JSONPath({ path: '$.[*].id', json: specificationsResponse }); // indexing array
  const specification = JSONPath({ path: '$.[*].specification', json: specificationsResponse });
  const definition_id = JSONPath({ path: '$.[*].definition_id', json: specificationsResponse });
  const is_default = JSONPath({ path: '$.[*].is_default', json: specificationsResponse });

  // Iterate through indexing array and create leaves in the return object
  ids.forEach((id, index) => {
    specifications[index] = {
      specification_id: id,
      specification: specification[index], // Add the corresponding properties by index
      definition_id: definition_id[index],
      is_default: is_default[index],
    }
  });
  return specifications;
}

// return an minimal representation of core metrics
export const parseDefinitions = (definitionsResponse) => {
  const definitions = {};

  // Retrieve properties using JSONPath
  const names = JSONPath({ path: '$.[*].metadata.name', json: definitionsResponse }); // indexing array
  const descriptions = JSONPath({ path: '$.[*].metadata.description', json: definitionsResponse });
  const id = JSONPath({ path: '$.[*].metadata.id', json: definitionsResponse });
  const definition = JSONPath({ path: '$.[*].specification', json: definitionsResponse });
  const extension_options = JSONPath({ path: '$.[*].extension_options', json: definitionsResponse });
  const representation_options = JSONPath({ path: '$.[*].representation_options', json: definitionsResponse });
  const insights_options = JSONPath({ path: '$.[*].insights_options', json: definitionsResponse });


  // Iterate through indexing array and create leaves in the return object
  names.forEach((name, index) => {
    definitions[index] = {
      name: name,
      description: descriptions[index], // Add the corresponding properties by index
      id: id[index],
      definition: definition[index], 
      extension_options: extension_options[index],
      representation_options: representation_options[index],
      insights_options: insights_options[index],
    };
  });
  return definitions;
}

// finds the matching specification from the array
export const matchSpecification = (specificationsObj, definitionObj) => {
  for (const [key, specificationObj] of Object.entries(specificationsObj)) {
    if (specificationObj.definition_id === definitionObj.id) {
      return { 
        specification_id: specificationObj.specification_id,
        specification: specificationObj.specification,
      };
    }
  }
}

// finds the matching subscription from the array
export const matchSubscription = (subscriptionsObj, specification_id) => {
  for (const [key, subscriptionObj] of Object.entries(subscriptionsObj)) {
    if (subscriptionObj.metric_id === specification_id) {
      return {
        subscription_id: subscriptionObj.subscription_id,
        created: subscriptionObj.create_time,
        updated: subscriptionObj.update_time,
      }
    }
  }
} 

// return an minimal representation of Detail insight bundles
export const parseDetail = (bundle) => {
  const details = [];

  // Retrieve properties using JSONPath
  const ids = JSONPath({ path: '$.bundle_response.result.insight_groups[*].insights[*].result.id', json: bundle }); // indexing array
  const types = JSONPath({ path: '$.bundle_response.result.insight_groups[*].type', json: bundle });
  const markups = JSONPath({ path: '$.bundle_response.result.insight_groups[*].insights[*].result.markup', json: bundle });
  const vizzes = JSONPath({ path: '$.bundle_response.result.insight_groups[*].insights[*].result.viz', json: bundle });
  const facts = JSONPath({ path: '$.bundle_response.result.insight_groups[*].insights[*].result.facts', json: bundle });
  const characterizations = JSONPath({ path: '$.bundle_response.result.insight_groups[*].insights[*].result.characterization', json: bundle });
  const questions = JSONPath({ path: '$.bundle_response.result.insight_groups[*].insights[*].result.question', json: bundle });
  const scores = JSONPath({ path: '$.bundle_response.result.insight_groups[*].insights[*].result.score', json: bundle });


  if (Array.isArray(ids)) {
    // Iterate through indexing array and create leaves in the return object
    ids.forEach((id, index) => {
      // Using splice to insert the element at the specified index
      details.splice(index, 0, {
        id: id, 
        type: types[index], // Add the corresponding properties by index
        markup: markups[index],
        viz: vizzes[index], 
        fact: facts[index],
        characterization: characterizations[index],
        question: questions[index], 
        score: scores[index], 
      });
    });

    // sorts the array based on the "score" property
    const sortedDetails = details.sort((a, b) => b.score - a.score);

    // remove elements with type === 'ban'
    const filteredDetails = sortedDetails.filter(item => item.type !== 'ban');

    return filteredDetails;
  } else {
    throw new Error(`Error parsing detail bundle, could not form an array: ${bundle}`);
  }
}

// return an minimal representation for insights
export const parseInsights = (bundle) => {
  const insights = [];
  // get all insight groups using JSONPath
  const insightGroups = JSONPath({ path: '$.bundle_response.result.insight_groups[*]', json: bundle });

  if (Array.isArray(insightGroups)) {
    // iterate through insight groups
    insightGroups.forEach(group => {
      const groupName = group.type; // ban, anchor, breakdown, followup, etc
      // iterate through each insight in group
      group.insights.forEach(insight => {
        if (insight?.result) {
          // get insight properties
          const { result: { id, type, markup, viz, facts, characterization, question, score } } = insight;
          // push insights into array
          insights.push({
            id,
            group: groupName,
            type,
            markup,
            viz,
            fact: facts,
            characterization,
            question,
            score,
          });
        }
      });
    });

    // Sort the array based on the "score" property
    const sortedInsights = insights.sort((a, b) => b.score - a.score);

    return sortedInsights;
  } else {
    throw new Error(`Error parsing insights bundle, could not form an array: ${bundle}`);
  } 
}

// returns a content map used for dynamic display
export const parseMetadata = (rawMetadata) => {
  const contentMap = {};
  const workbookProjects = parseWorkbooks(rawMetadata);
  const dashboardWorkbooks = parseDashboards(rawMetadata);
  const sheetDashboards = parseSheets(rawMetadata);
  const dataSourceProjects = parseDataSources(rawMetadata);



  return rawMetadata;
}

// creates a tree of workbooks using projects as their root
const parseWorkbooks = (rawMetadata) => {
  const workbookProjects = [];

  // Retrieve properties using JSONPath
  const projects = JSONPath({ path: '$.data.workbooks.*.projectName', json: rawMetadata }); // indexing array

  if (Array.isArray(projects)) {
    projects.forEach(project => {

    });
  }

  return workbookProjects;
}

// creates a tree of dashboards using workbooks as their root
const parseDashboards = (rawMetadata) => {
  const dashboardsWorkbooks = [];

  // Retrieve properties using JSONPath
  const workbooks = JSONPath({ path: '$.data.workbooks.*.projectName', json: rawMetadata }); // indexing array

  if (Array.isArray(workbooks)) {
    workbooks.forEach(workbook => {

    });
  }

  return dashboardsWorkbooks;
}

// creates a tree of sheets using dashboards as their root
const parseSheets = (rawMetadata) => {
  const sheetDashboards = [];

  // Retrieve properties using JSONPath
  const dashboards = JSONPath({ path: '$.data.workbooks.*.projectName', json: rawMetadata }); // indexing array

  if (Array.isArray(dashboards)) {
    dashboards.forEach(dashboard => {

    });
  }

  return sheetDashboards;
}

// creates a tree of data sources using projects as their root
const parseDataSources = (rawMetadata) => {
  const dataSourceProjects = [];

  // Retrieve properties using JSONPath
  const projects = JSONPath({ path: '$.data.workbooks.*.projectName', json: rawMetadata }); // indexing array

  if (Array.isArray(projects)) {
    projects.forEach(project => {

    });
  }

  return dataSourceProjects;
}
