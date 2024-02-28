import { gql } from 'graphql-tag';

// comprehensive GraphQL query obtains user specific assets on a Tableau environment
export const getMetadata = gql`
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
      }
    }
    tags {
      id
      name
    }
    createdAt
    updatedAt
  }
}
`;
