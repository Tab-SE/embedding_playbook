import { httpPost } from 'utils';

export const query_vds = async (query) => {
  const domain = process.env.VDS_AGENT_DOMAIN;
  const endpoint = `${domain}/query_data/invoke`;

  const body = {
    input: {
      query: query.message
    }
  };

  const config = {
    domain,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const analysis = await httpPost(endpoint, body, config);

  return analysis
}
