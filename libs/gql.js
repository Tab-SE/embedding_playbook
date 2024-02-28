import { gql } from 'graphql-tag';

import { httpPost } from "utils";

const tableau_domain = process.env.TABLEAU_DOMAIN; // URL for Tableau environment

// makes request to Metadata API
export const queryMetadata = async (apiKey) => {
  const endpoint = `${tableau_domain}/api/metadata/graphql`;
  const body = queryMetadataBody;

  const config = {
    headers: {
      'X-Tableau-Auth': apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const res = await httpPost(endpoint, body, config);
  return res;
}

// comprehensive GraphQL query obtains user specific assets on a Tableau environment
export const queryMetadataBody = gql`
query GetMetadata {
  workbooks {
    id
    luid
    name
    description
    createdAt
    projectName
    projectVizportalUrlId
    projectLuid
    uri
    tags {
      id
      name
    }
    dashboards {
      id
      luid
    }
    sheets {
      id
      luid
    }
  }

  dashboards {
    id
    luid
    name
    path
    createdAt
    updatedAt
    index
    tags {
      id
      name
    }
    sheets {
      id
      luid
    }
  }

  sheets {
    id
    luid
    documentViewId
    name
    path
    createdAt
    updatedAt
    index
    tags {
      id
      name
    }
    containedInDashboards {
      id
      luid
    }
    upstreamDatasources {
      id
      name
    }
  }

  publishedDatasources {
    id
    luid
    name
    description
    hasUserReference
    hasExtracts
    extractLastRefreshTime
    extractLastIncrementalUpdateTime
    extractLastUpdateTime
    projectName
    projectVizportalUrlId
    isCertified
    certificationNote
    certifierDisplayName
    containsUnsupportedCustomSql
    datasourceFilters {
      id
      field {
        id
      }
    }
    parameters {
      id
      name
    }
    hasActiveWarning
    dataQualityWarnings {
      id
      luid
      isActive
      isElevated
      value
      category
      message
      createdAt
      updatedAt
      asset {
        id
        luid
        name
      }
    }
    dataQualityCertifications {
      id
      luid
      isActive
      isElevated
      value
      category
      message
      createdAt
      updatedAt
      asset {
        id
        luid
        name
      }
    }
    labels {
      id
      luid
      isActive
      isElevated
      value
      category
      message
      createdAt
      updatedAt
      asset {
        id
        luid
        name
      }
    }
    tags {
      id
      name
    }
    createdAt
    updatedAt
    downstreamWorkbooks {
      id
      luid
    }
  }
}
`;
