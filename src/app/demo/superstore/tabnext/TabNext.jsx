"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@/components/ui";
import { AppWindow } from "lucide-react";
import { initializeAnalyticsSdk, AnalyticsDashboard } from '@salesforce/analytics-embedding-sdk';

// PKCE helpers (frontend-only; verifier is never sent to the server except for token exchange)
const base64UrlEncode = (arrayBuffer) => {
  const bytes = new Uint8Array(arrayBuffer);
  let str = "";
  for (let i = 0; i < bytes.byteLength; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const generateCodeVerifier = () => {
  const array = new Uint32Array(56);
  crypto.getRandomValues(array);
  return Array.from(array, (dec) => (dec % 36).toString(36)).join("");
};

const generateCodeChallenge = async (codeVerifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
};

export const TabNext = () => {
  const { status: sessionStatus, data: session } = useSession();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const salesforceLoginUrl = useMemo(() => process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL || "https://login.salesforce.com", []);
  const clientId = useMemo(() => process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_ID || "", []);
  const redirectUri = useMemo(() => process.env.NEXT_PUBLIC_SALESFORCE_REDIRECT_URI || (typeof window !== 'undefined' ? `${window.location.origin}/demo/superstore/tabnext` : ""), []);
  // Convert .my.salesforce.com to .lightning.force.com for SDK compatibility
  // The SDK requires the Lightning domain, not the My Domain
  const orgUrl = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SALESFORCE_ORG_URL || "";
    if (!url) return "";
    // Convert .my.salesforce.com to .lightning.force.com
    // Example: https://storm-31c05a56906a6d.my.salesforce.com -> https://storm-31c05a56906a6d.lightning.force.com
    const converted = url.replace(/\.my\.salesforce\.com/, '.lightning.force.com').replace(/\/+$/, '');
    // Converted orgUrl from .my.salesforce.com to .lightning.force.com
    return converted;
  }, []);
  // Dashboard ID/API Name - find this from the Tableau Next dashboard URL:
  // Example: https://<salesforce.org>.force.com/tableau/dashboard/<asset-api-name>/view
  // The asset-api-name is what you use here
  // Dashboard ID/API Name - MUST match the dashboard API name from Salesforce
  // To find it: Go to your dashboard in Salesforce and check the URL
  // Example URL: https://storm-31c05a56906a6d.my.salesforce.com/tableau/dashboard/YourDashboardAPIName/view
  // Use "YourDashboardAPIName" as the dashboard ID
  const dashboardIdOrApiName = useMemo(() => {
    const envId = process.env.NEXT_PUBLIC_TABNEXT_DASHBOARD_ID;
    if (envId) {
      return envId;
    }
    return 'MFG_Production_Scraps1';
  }, []);
  // Salesforce username for JWT Bearer Flow (comes from user store via session)
  const salesforceUsername = useMemo(() =>
    session?.user?.salesforceUsername ||
    session?.user?.email?.split('@')[0] ||
    "",
  [session]);

  // Initialize SDK and render dashboard
  // This follows the Tableau Next embedding pattern:
  // 1. Container: <div id='analytics-container'></div> (already in JSX)
  // 2. SDK config: { authCredential, orgUrl }
  // 3. Import SDK: from '@salesforce/analytics-embedding-sdk'
  // 4. Initialize SDK: initializeAnalyticsSdk(config)
  // 5. Create component: new AnalyticsDashboard({ parentIdOrElement, idOrApiName })
  // 6. Render: dashboard.render()
  const initializeAndRender = useCallback(async (authCredential) => {
    try {
      setStatus("initializing");

      if (!orgUrl) {
        throw new Error('Missing NEXT_PUBLIC_SALESFORCE_ORG_URL');
      }

      // Step 1: Initialize the SDK with auth credential and org URL
      const config = {
        authCredential: authCredential,
        orgUrl: orgUrl
      };
      await initializeAnalyticsSdk(config);

      // Step 2: Ensure container has dimensions before creating dashboard
      const container = document.getElementById('analytics-container');
      if (!container) {
        throw new Error('Container element not found!');
      }

      // Ensure container has explicit pixel dimensions (SDK needs numeric values)
      const parentWidth = container.parentElement?.clientWidth || window.innerWidth;

      // Set explicit pixel dimensions - SDK validates these
      container.style.height = '800px';
      container.style.width = `${Math.max(parentWidth, 600)}px`;
      container.style.minHeight = '800px';
      container.style.minWidth = '600px';
      container.style.display = 'block'; // Ensure it's a block element

      // Wait a tick for DOM to update
      await new Promise(resolve => setTimeout(resolve, 0));

      // Step 3: Create the AnalyticsDashboard component
      let dashboard;
      try {
        dashboard = new AnalyticsDashboard({
          parentIdOrElement: 'analytics-container',
          idOrApiName: dashboardIdOrApiName
        });
      } catch (createError) {
        throw createError;
      }

      // Step 4: Render the dashboard in the container

      try {
        const renderResult = dashboard.render();
        if (renderResult instanceof Promise) {
          await renderResult;
        }
        setStatus("ready");
      } catch (renderError) {

        throw renderError;
      }
    } catch (e) {
        setError(String(e));
        setStatus("idle");
        throw e;
      }
  }, [orgUrl, dashboardIdOrApiName]);

  // PKCE OAuth flow (requires redirect)
  const handleStartLogin = useCallback(async () => {
    try {
      setError("");
      setStatus("starting");
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      sessionStorage.setItem('tabnext_code_verifier', codeVerifier);

      const loginHint = session?.user?.email ? `&login_hint=${encodeURIComponent(session.user.email)}` : "";
      const authUrl = `${salesforceLoginUrl}/services/oauth2/authorize?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=web+lightning+api&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256${loginHint}`;
      window.location.href = authUrl;
    } catch (e) {
      setError(String(e));
      setStatus("idle");
    }
  }, [clientId, redirectUri, salesforceLoginUrl, session]);

        // Try JWT Bearer Flow (requires username and certificate)
        const handleJWTBearerAuth = useCallback(async () => {
          console.log('[TabNext] ========================================');
          console.log('[TabNext] 🔐 JWT Bearer Flow started');
          console.log('[TabNext] Salesforce username:', salesforceUsername);
          console.log('[TabNext] ========================================');

    if (!salesforceUsername) {
      console.warn('[TabNext] No salesforce username, falling back to PKCE');
      // Fall back to PKCE if no username
      return handleStartLogin();
    }

    try {
      setError("");
      setStatus("authenticating");

      console.log('[TabNext] Calling /api/tabnext/jwt-auth with username:', salesforceUsername);
      const resp = await fetch('/api/tabnext/jwt-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salesforce_username: salesforceUsername }),
      });

      console.log('[TabNext] JWT auth response status:', resp.status, resp.statusText);

      if (!resp.ok) {
        const text = await resp.text();
        console.error('[TabNext] JWT Bearer Flow failed:', text);
        setError(`JWT Authentication failed: ${text}`);
        setStatus("idle");
        return;
      }

            const data = await resp.json();
            console.log('[TabNext] ========================================');
            console.log('[TabNext] ✅ JWT Auth Response:');
            console.log('[TabNext]   - Has authCredential:', !!data.authCredential);
            console.log('[TabNext]   - authCredential length:', data.authCredential?.length);
            console.log('[TabNext]   - authCredential type:', data.authCredential?.startsWith('https://') ? 'frontdoor_url' : 'access_token');
            console.log('[TabNext]   - Has access_token:', !!data.access_token);
            console.log('[TabNext]   - Instance URL:', data.instance_url);
            console.log('[TabNext]   - Has frontdoor_url:', !!data.frontdoor_url);
            console.log('[TabNext]   - authCredential preview:', data.authCredential?.substring(0, 100) + '...');
            console.log('[TabNext] ========================================');

            const authCredential = data.authCredential;
            if (!authCredential) {
              console.error('[TabNext] ❌ No authCredential in response');
              throw new Error('No authCredential in response');
            }

            sessionStorage.setItem('tabnext_auth_credential', authCredential);

            // Load SDK and render
            await initializeAndRender(authCredential);
    } catch (e) {
      console.error('[TabNext] JWT Bearer Flow error:', e);
      setError(`JWT Authentication error: ${e.message || String(e)}`);
      setStatus("idle");
      return;
    }
  }, [salesforceUsername, handleStartLogin, initializeAndRender]);

  // Try Client Credentials Flow first (simplest, no user-specific auth needed)
  const handleClientCredentialsAuth = useCallback(async () => {
    try {
      setError("");
      setStatus("authenticating");

      const resp = await fetch('/api/tabnext/client-credentials-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!resp.ok) {
        const text = await resp.text();
        // If Client Credentials fails, try JWT Bearer Flow
        return handleJWTBearerAuth();
      }

      const data = await resp.json();
      const authCredential = data.authCredential; // This is the frontdoor URL or access token
      sessionStorage.setItem('tabnext_auth_credential', authCredential);

      // Load SDK and render
      await initializeAndRender(authCredential);
    } catch (e) {
      return handleJWTBearerAuth();
    }
  }, [handleJWTBearerAuth, initializeAndRender]);

  useEffect(() => {
    const run = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      if (!code) return;

      setStatus("exchanging");
      const codeVerifier = sessionStorage.getItem('tabnext_code_verifier');
      if (!codeVerifier) { setError('Missing code_verifier'); setStatus("idle"); return; }

      const resp = await fetch('/api/tabnext/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, code_verifier: codeVerifier, client_id: clientId, redirect_uri: redirectUri }),
      });
      if (!resp.ok) {
        const text = await resp.text();
        setError(`Auth exchange failed: ${text}`);
        setStatus("idle");
        return;
      }
      const data = await resp.json();
      const authCredential = data.authCredential;
      // cache for current tab session to avoid repeated redirects
      sessionStorage.setItem('tabnext_auth_credential', authCredential);

      // Load SDK and render
      await initializeAndRender(authCredential);
    };
    run();
  }, [clientId, redirectUri, orgUrl, initializeAndRender]);

  // Attempt seamless authentication: try Client Credentials first, then JWT Bearer (no PKCE fallback)
  const hasAutoAuthenticated = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const hasCode = !!url.searchParams.get('code');
    const cached = sessionStorage.getItem('tabnext_auth_credential');

    // Prevent duplicate calls (React Strict Mode runs effects twice)
    if (hasAutoAuthenticated.current) return;

    if (sessionStatus === 'authenticated' && !hasCode && !cached && status === 'idle') {
      // Try Client Credentials Flow first (simplest), then JWT Bearer (JWT only, no PKCE)
      hasAutoAuthenticated.current = true;
      void handleClientCredentialsAuth();
    }
  }, [sessionStatus, status, handleClientCredentialsAuth]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className='dark:bg-stone-900 shadow-xl'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AppWindow className="h-5 w-5 text-[hsl(199,99%,39%)]" />
              tabNext Embed
            </CardTitle>
            <CardDescription>Dynamic authentication: Client Credentials → JWT Bearer → PKCE fallback. Existing auth untouched.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Button onClick={handleClientCredentialsAuth} disabled={status !== 'idle'}>
                {status === 'starting' || status === 'authenticating' ? 'Authenticating…' :
                 status === 'exchanging' ? 'Exchanging…' :
                 status === 'initializing' ? 'Initializing…' :
                 'Authenticate with Salesforce'}
              </Button>
              {status !== 'idle' && <span className="text-xs text-slate-500 dark:text-slate-300">{status}</span>}
            </div>
            {error ? <div className="text-sm text-red-500">{error}</div> : null}
            <div
              id="analytics-container"
              className="w-full rounded border border-stone-200 dark:border-stone-800"
              style={{ height: '800px', width: '100%' }}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};


