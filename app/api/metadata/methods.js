import { queryMetadata } from 'libs';

// obtains metadata from Tableau's GraphQL endpoint
export const getMetadata = async (rest_key) => {
  if (rest_key) {
    const payload = await queryMetadata(rest_key);
    return payload;
  } else {
    // errors resolve to false when checked
    return new Error('Unauthorized to perform operation');
  }
}
