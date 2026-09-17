/**
 * Tableau SSO OAuth 2.1 token management for mcp.tableau.com
 *
 * Auth server: https://sso.online.tableau.com (advertises client_id_metadata_document_supported: true)
 * CIMD: client_id is the URL of our hosted metadata document — no pre-registration needed in production.
 */

const TOKEN_ENDPOINT = 'https://sso.online.tableau.com/oauth2/token';

interface TokenCache {
  access_token: string;
  expires_at: number;
  refresh_token: string;
  client_id?: string;
}

let _tokenCache: TokenCache | null = null;

export const MCP_OAUTH_SCOPES = [
  'tableau:mcp:datasource:read',
  'tableau:mcp:workbook:read',
  'tableau:mcp:view:read',
  'tableau:mcp:pulse:read',
  'tableau:mcp:insight:create',
  'tableau:mcp:content:read',
  'tableau:content:read',
  'tableau:mcp_site_settings:read',
  'tableau:viz_data_service:read',
  'tableau:insights:read',
  'tableau:insight_metrics:read',
  'tableau:metric_subscriptions:read',
  'tableau:insight_definitions_metrics:read',
  'tableau:insight_brief:create',
].join(' ');

export const seedFromEnv = () => {
  const refreshToken = process.env.TABLEAU_MCP_OAUTH_REFRESH_TOKEN;
  const clientId = process.env.TABLEAU_MCP_OAUTH_CLIENT_ID;
  if (refreshToken && !_tokenCache) {
    _tokenCache = { access_token: '', expires_at: 0, refresh_token: refreshToken, client_id: clientId };
  }
};

export const saveTokens = (tokens: {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  client_id?: string;
}) => {
  const expiresIn = tokens.expires_in ?? 3600;
  _tokenCache = {
    access_token: tokens.access_token,
    expires_at: Date.now() + (expiresIn - 60) * 1000,
    refresh_token: tokens.refresh_token ?? _tokenCache?.refresh_token ?? '',
    client_id: tokens.client_id ?? _tokenCache?.client_id,
  };
  return _tokenCache;
};

export const exchangeCode = async (
  code: string,
  codeVerifier: string,
  clientId: string,
  redirectUri: string,
): Promise<TokenCache> => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    code_verifier: codeVerifier,
    client_id: clientId,
    redirect_uri: redirectUri,
    resource: 'https://mcp.tableau.com',
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) throw new Error(`Token exchange failed (${res.status}): ${await res.text()}`);
  const tokens = await res.json();
  return saveTokens({ ...tokens, client_id: clientId });
};

export const getAccessToken = async (): Promise<string> => {
  seedFromEnv();

  if (!_tokenCache?.refresh_token) {
    throw new Error(
      'No Tableau MCP OAuth refresh token. Visit /api/tableau/oauth to set up OAuth, ' +
      'then set TABLEAU_MCP_OAUTH_REFRESH_TOKEN in your env.'
    );
  }

  if (_tokenCache.access_token && Date.now() < _tokenCache.expires_at) {
    return _tokenCache.access_token;
  }

  const clientId = _tokenCache.client_id ?? process.env.TABLEAU_MCP_OAUTH_CLIENT_ID ?? '';
  if (!clientId) throw new Error('Cannot refresh OAuth token — client_id unknown. Re-run the OAuth setup flow.');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: _tokenCache.refresh_token,
    client_id: clientId,
    resource: 'https://mcp.tableau.com',
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    _tokenCache = null;
    throw new Error(`OAuth token refresh failed (${res.status}): ${await res.text()}. Re-run OAuth setup at /api/tableau/oauth`);
  }

  const tokens = await res.json();
  return saveTokens(tokens).access_token;
};

export const getCurrentRefreshToken = (): string | undefined => _tokenCache?.refresh_token;
