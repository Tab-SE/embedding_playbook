import { queryMetadata } from 'libs';
import { parseMetadata } from 'utils';

// obtains metadata from Tableau's GraphQL endpoint
export const getMetadata = async (rest_key) => {
  if (rest_key) {
    const res = await queryMetadata(rest_key);
    return res;
  } else {
    // errors resolve to false when checked
    return new Error('Unauthorized to perform operation');
  }
}

// returns a content map used to display content dynamically
export const makeContentMap = (rawMetaData) => {
  const contentMap = parseMetadata(rawMetaData);
  return contentMap;
}
