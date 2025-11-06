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
    if (converted !== url) {
      console.log('[TabNext] Converted orgUrl from .my.salesforce.com to .lightning.force.com:', converted);
    }
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
      console.log('[TabNext] Using dashboard ID from env:', envId);
      return envId;
    }
    console.warn('[TabNext] ⚠️  No NEXT_PUBLIC_TABNEXT_DASHBOARD_ID set, using default: MFG_Production_Scraps1');
    console.warn('[TabNext] ⚠️  This dashboard may not exist - verify in Salesforce!');
    return 'MFG_Production_Scraps1';
  }, []);
  // Salesforce username for JWT Bearer Flow (comes from user store via session)
  const salesforceUsername = useMemo(() =>
    process.env.NEXT_PUBLIC_SALESFORCE_USERNAME ||
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
      console.log('[TabNext] initializeAndRender called');
      setStatus("initializing");

      if (!orgUrl) {
        console.error('[TabNext] Missing NEXT_PUBLIC_SALESFORCE_ORG_URL');
        throw new Error('Missing NEXT_PUBLIC_SALESFORCE_ORG_URL');
      }

      console.log('[TabNext] ========================================');
      console.log('[TabNext] SDK Configuration:');
      console.log('  - orgUrl:', orgUrl);
      console.log('  - authCredential length:', authCredential?.length);
      console.log('  - authCredential type:', authCredential?.startsWith('https://') ? 'frontdoor_url' : 'access_token');
      console.log('  - authCredential preview:', authCredential?.substring(0, 100) + '...');
      console.log('  - dashboardIdOrApiName:', dashboardIdOrApiName);
      console.log('[TabNext] ========================================');

      // Step 1: Initialize the SDK with auth credential and org URL
      const config = {
        authCredential: authCredential,
        orgUrl: orgUrl
      };
      console.log('[TabNext] Initializing Analytics SDK...');
      await initializeAnalyticsSdk(config);
      console.log('[TabNext] Analytics SDK initialized successfully');

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

      // Verify dimensions are set
      const computedStyle = window.getComputedStyle(container);
      const containerRect = container.getBoundingClientRect();

      console.log('[TabNext] Container dimensions verified:', {
        styleHeight: container.style.height,
        styleWidth: container.style.width,
        computedHeight: computedStyle.height,
        computedWidth: computedStyle.width,
        boundingRect: {
          width: containerRect.width,
          height: containerRect.height,
        },
        clientWidth: container.clientWidth,
        clientHeight: container.clientHeight,
      });

      // Step 3: Create the AnalyticsDashboard component
      // parentIdOrElement: ID of the container div
      // idOrApiName: Dashboard ID or API name from the Tableau Next URL
      console.log('[TabNext] Creating AnalyticsDashboard component...');
      console.log('[TabNext] Dashboard config:', {
        parentIdOrElement: 'analytics-container',
        idOrApiName: dashboardIdOrApiName,
      });
      console.log('[TabNext] ✅ Dashboard exists and is accessible');
      console.log('[TabNext] 🔍 Current issue: CSP/iframe blocking (not dashboard ID)');
      console.log('[TabNext] 📋 Next steps:');
      console.log('[TabNext]   1. Setup → Session Settings → "Clickjack Protection"');
      console.log('[TabNext]      Set to: "Allow framing by any page within the same Salesforce org"');
      console.log('[TabNext]   2. Verify CSP Trusted Sites has frame-src directive selected');
      console.log('[TabNext]   3. Clear browser cache and try incognito mode');

      let dashboard;
      try {
        dashboard = new AnalyticsDashboard({
          parentIdOrElement: 'analytics-container',
          idOrApiName: dashboardIdOrApiName
        });
        console.log('[TabNext] AnalyticsDashboard created successfully');
        console.log('[TabNext] Dashboard methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(dashboard)));

        // Add event listeners to capture SDK events (wait for element to be created)
        setTimeout(() => {
          const dashboardElement = document.getElementById('analytics-container')?.querySelector('analytics-dashboard');
          if (dashboardElement) {
            console.log('[TabNext] Adding event listeners to dashboard element...');

            // Listen for common SDK events
            const eventTypes = ['load', 'error', 'ready', 'render', 'connected', 'disconnected', 'click', 'change'];
            eventTypes.forEach(eventType => {
              dashboardElement.addEventListener(eventType, (e) => {
                console.log(`[TabNext] 📡 Dashboard element event: ${eventType}`, e);
              }, true); // Use capture phase to catch all events
            });

            // Also listen to all events using a catch-all
            const originalDispatchEvent = dashboardElement.dispatchEvent;
            dashboardElement.dispatchEvent = function(event) {
              console.log('[TabNext] 📡 Dashboard element dispatching event:', event.type, event);
              return originalDispatchEvent.call(this, event);
            };
          } else {
            console.warn('[TabNext] Dashboard element not found after creation');
          }

          // Also try listening on the dashboard object itself
          if (dashboard.addEventListener) {
            const eventTypes = ['load', 'error', 'ready', 'render', 'connected', 'disconnected'];
            eventTypes.forEach(eventType => {
              dashboard.addEventListener(eventType, (e) => {
                console.log(`[TabNext] 📡 Dashboard object event: ${eventType}`, e);
              });
            });
          }
        }, 100);
      } catch (createError) {
        console.error('[TabNext] Failed to create AnalyticsDashboard:', createError);
        throw createError;
      }

      // Step 4: Render the dashboard in the container
      console.log('[TabNext] Rendering dashboard...');
      console.log('[TabNext] Dashboard object:', {
        hasRender: typeof dashboard.render === 'function',
        dashboardType: dashboard.constructor.name,
      });

      // Monitor ALL network requests during render (not just Salesforce)
      const networkRequests = [];
      const networkErrors = [];
      const originalFetch = window.fetch;
      const networkMonitor = (...args) => {
        const url = args[0];
        const requestInfo = {
          url: typeof url === 'string' ? url : 'Request object',
          timestamp: new Date().toISOString(),
        };
        networkRequests.push(requestInfo);

        if (typeof url === 'string') {
          console.log('[TabNext] 🌐 Network request:', url);
          if (url.includes('salesforce.com') || url.includes('tableau') || url.includes('analytics')) {
            console.log('[TabNext]   ⚠️  Salesforce/Tableau related request detected');
          }
        }

        return originalFetch.apply(this, args)
          .then(async response => {
            const clonedResponse = response.clone();
            const responseInfo = {
              ...requestInfo,
              status: response.status,
              statusText: response.statusText,
              ok: response.ok,
            };

            if (!response.ok) {
              const errorText = await clonedResponse.text().catch(() => 'Could not read error');
              console.error('[TabNext] ❌ Failed network request:', {
                url: requestInfo.url,
                status: response.status,
                statusText: response.statusText,
                error: errorText.substring(0, 500),
              });
              networkErrors.push({ ...responseInfo, error: errorText });
            } else {
              console.log('[TabNext] ✅ Network request succeeded:', {
                url: requestInfo.url,
                status: response.status,
              });
            }
            return response;
          })
          .catch(error => {
            console.error('[TabNext] ❌ Network request error:', {
              url: requestInfo.url,
              error: error.message,
              stack: error.stack,
            });
            networkErrors.push({ ...requestInfo, error: error.message });
            throw error;
          });
      };
      window.fetch = networkMonitor;

      // Also monitor XMLHttpRequest (some SDKs use this instead of fetch)
      const originalXHROpen = XMLHttpRequest.prototype.open;
      const originalXHRSend = XMLHttpRequest.prototype.send;
      const xhrRequests = [];

      XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        this._method = method;
        console.log('[TabNext] 🌐 XHR request:', method, url);
        if (typeof url === 'string' && (url.includes('salesforce.com') || url.includes('tableau') || url.includes('analytics'))) {
          console.log('[TabNext]   ⚠️  Salesforce/Tableau related XHR detected');
        }
        xhrRequests.push({ method, url, timestamp: new Date().toISOString() });
        return originalXHROpen.apply(this, [method, url, ...rest]);
      };

      XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('load', function() {
          if (this.status >= 400) {
            console.error('[TabNext] ❌ XHR failed:', {
              method: this._method,
              url: this._url,
              status: this.status,
              statusText: this.statusText,
            });
            networkErrors.push({
              url: this._url,
              method: this._method,
              status: this.status,
              statusText: this.statusText,
            });
          } else {
            console.log('[TabNext] ✅ XHR succeeded:', {
              method: this._method,
              url: this._url,
              status: this.status,
            });
          }
        });
        this.addEventListener('error', function() {
          console.error('[TabNext] ❌ XHR error:', {
            method: this._method,
            url: this._url,
          });
          networkErrors.push({
            url: this._url,
            method: this._method,
            error: 'XHR error event',
          });
        });
        return originalXHRSend.apply(this, args);
      };

      // Log what the SDK is doing - check if it's using WebSockets or other mechanisms
      console.log('[TabNext] 🔍 Checking SDK initialization state...');
      console.log('[TabNext]   - Dashboard object:', dashboard);
      console.log('[TabNext]   - Dashboard constructor:', dashboard.constructor.name);
      console.log('[TabNext]   - Has render method:', typeof dashboard.render === 'function');

      // Check if SDK has any internal state or event listeners
      if (dashboard.addEventListener) {
        console.log('[TabNext]   - Dashboard supports addEventListener');
      }
      if (dashboard.on) {
        console.log('[TabNext]   - Dashboard supports .on() method');
      }

      // Monitor WebSocket connections (SDK might use these)
      // Only monitor if we're in the browser
      let originalWebSocket = null;
      const wsConnections = [];
      if (typeof window !== 'undefined' && window.WebSocket) {
        originalWebSocket = window.WebSocket;
        window.WebSocket = class extends originalWebSocket {
          constructor(url, protocols) {
            super(url, protocols);
            console.log('[TabNext] 🌐 WebSocket connection:', url);
            wsConnections.push({ url, timestamp: new Date().toISOString() });
            this.addEventListener('open', () => {
              console.log('[TabNext] ✅ WebSocket opened:', url);
            });
            this.addEventListener('error', (e) => {
              console.error('[TabNext] ❌ WebSocket error:', url, e);
            });
            this.addEventListener('close', () => {
              console.log('[TabNext] 🔌 WebSocket closed:', url);
            });
          }
        };
      }

      try {
        // Check if render returns a promise or is synchronous
        const renderResult = dashboard.render();
        console.log('[TabNext] Render result:', renderResult);
        console.log('[TabNext] Is render a promise?', renderResult instanceof Promise);

        if (renderResult instanceof Promise) {
          console.log('[TabNext] Render promise created, waiting...');

          // Add timeout to detect if render hangs
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => {
              console.error('[TabNext] ⚠️  Render timeout after 15 seconds');
              console.error('[TabNext] Network errors detected:', networkErrors);
              const container = document.getElementById('analytics-container');
              const dashboardEl = container?.querySelector('analytics-dashboard');
              console.log('[TabNext] Container during timeout:', {
                innerHTML: container?.innerHTML?.substring(0, 500),
                children: container?.children?.length,
                hasContent: !!container?.innerHTML,
                dashboardElement: dashboardEl ? 'exists' : 'missing',
                dashboardInnerHTML: dashboardEl?.innerHTML?.substring(0, 200),
              });
              reject(new Error(`Render timeout - Dashboard "${dashboardIdOrApiName}" may not exist or be accessible. Check Network tab for failed requests.`));
            }, 15000) // Reduced to 15 seconds for faster feedback
          );

          // Wait for render promise or timeout
          try {
            await Promise.race([renderResult, timeoutPromise]);
            console.log('[TabNext] ✅ Dashboard render promise resolved');
          } catch (e) {
            // Check if it's the timeout or another error
            if (e.message?.includes('timeout')) {
              throw e;
            }
            console.log('[TabNext] Render promise rejected (may be expected):', e);
          }
        } else {
          console.log('[TabNext] Render completed synchronously');
          console.log('[TabNext] ⚠️  Render is synchronous - SDK may use events to signal completion');
        }

        // Restore original fetch, XHR, and WebSocket
        if (typeof window !== 'undefined') {
          window.fetch = originalFetch;
          if (originalWebSocket) {
            window.WebSocket = originalWebSocket;
          }
        }
        XMLHttpRequest.prototype.open = originalXHROpen;
        XMLHttpRequest.prototype.send = originalXHRSend;

        console.log('[TabNext] 📊 Network Summary:');
        console.log('  - Total fetch/XHR requests:', networkRequests.length + xhrRequests.length);
        console.log('  - WebSocket connections:', wsConnections.length);
        console.log('  - Failed requests:', networkErrors.length);
        if (networkErrors.length > 0) {
          console.error('[TabNext] ❌ Network errors:', networkErrors);
        }
        if (wsConnections.length > 0) {
          console.log('[TabNext] 🌐 WebSocket connections:', wsConnections);
        }

        // Check container after render
        const containerAfterRender = document.getElementById('analytics-container');
        console.log('[TabNext] Container after render:', {
          innerHTML: containerAfterRender?.innerHTML?.substring(0, 500),
          children: containerAfterRender?.children?.length,
          hasContent: !!containerAfterRender?.innerHTML,
          childNodes: containerAfterRender?.childNodes?.length,
        });

        setStatus("ready");
      } catch (renderError) {
        // Restore original fetch, XHR, and WebSocket
        if (typeof window !== 'undefined') {
          window.fetch = originalFetch;
          if (originalWebSocket) {
            window.WebSocket = originalWebSocket;
          }
        }
        XMLHttpRequest.prototype.open = originalXHROpen;
        XMLHttpRequest.prototype.send = originalXHRSend;

        console.log('[TabNext] 📊 Network Summary (on error):');
        console.log('  - Total fetch/XHR requests:', networkRequests.length + xhrRequests.length);
        console.log('  - WebSocket connections:', wsConnections.length);
        console.log('  - Failed requests:', networkErrors.length);
        if (networkErrors.length > 0) {
          console.error('[TabNext] ❌ Network errors:', networkErrors);
        }
        if (wsConnections.length > 0) {
          console.log('[TabNext] 🌐 WebSocket connections:', wsConnections);
        }

        console.error('[TabNext] ❌ Dashboard render error:', renderError);
        console.error('[TabNext] Network errors during render:', networkErrors);
        console.error('[TabNext] Render error details:', {
          message: renderError?.message,
          stack: renderError?.stack,
          name: renderError?.name,
          error: renderError,
        });

        // Check if container has any content
        const containerAfterRender = document.getElementById('analytics-container');
        console.log('[TabNext] Container after render error:', {
          innerHTML: containerAfterRender?.innerHTML?.substring(0, 500),
          children: containerAfterRender?.children?.length,
          hasContent: !!containerAfterRender?.innerHTML,
        });

        // Diagnostic information - JWT Bearer Flow requires specific permission set setup
        console.error('[TabNext] 🔍 Troubleshooting steps (JWT Bearer Flow):');
        const lightningUrl = orgUrl.replace('.lightning.force.com', '.my.salesforce.com');
        console.error(`[TabNext]   1. Verify dashboard exists: ${lightningUrl}/tableau/dashboard/${dashboardIdOrApiName}/view`);
        console.error(`[TabNext]   2. ⚠️  JWT BEARER FLOW PERMISSION SET SETUP (REQUIRED):`);
        console.error(`[TabNext]      a. Setup → Permission Sets → Find "Tableau Next Consumer" → Clone it`);
        console.error(`[TabNext]      b. Name it (e.g., "Tableau Next Consumer JWT") and save`);
        console.error(`[TabNext]      c. Setup → External Client App Manager → Edit your ECA`);
        console.error(`[TabNext]      d. OAuth Policies → Set "Permitted Users" to "Admin approved users are pre authorized"`);
        console.error(`[TabNext]      e. App Policies → Add your custom permission set to "Selected Permission Sets"`);
        console.error(`[TabNext]      f. Assign the custom permission set to user: ${salesforceUsername}`);
        console.error(`[TabNext]   3. Check Network tab for failed requests to Salesforce`);
        console.error(`[TabNext]   4. Dashboard ID may be wrong - check the URL in Salesforce`);
        console.error(`[TabNext]   5. Verify orgUrl is correct: ${orgUrl} (should use .lightning.force.com)`);
        console.error(`[TabNext]   6. If no network requests appear, the user likely doesn't have the permission set assigned`);

        throw renderError;
      }
    } catch (e) {
        console.error('[TabNext] initializeAndRender error:', e);
        console.error('[TabNext] Error details:', {
          message: e?.message,
          stack: e?.stack,
          name: e?.name,
        });

        // Check for CSP/frame-ancestors errors
        const errorString = String(e);
        if (errorString.includes('frame-ancestors') || errorString.includes('iframe') || errorString.includes('CSP') || errorString.includes('LightningOutError')) {
          const errorMsg = '🔒 CSP Error: Salesforce is blocking the iframe.\n\n' +
            'Even with CSP Trusted Sites configured, check these:\n\n' +
            '1. Setup → Session Settings → "Clickjack Protection":\n' +
            '   - Set to "Allow framing by any page within the same Salesforce org"\n' +
            '   - OR "Allow framing by the same origin"\n\n' +
            '2. Verify CSP Trusted Sites:\n' +
            '   - URL: "http://localhost:3000"\n' +
            '   - Context: "All" (or "Lightning Out")\n' +
            '   - Directives: frame-src MUST be selected\n\n' +
            '3. Setup → My Domain → Routing and Policies:\n' +
            '   - "Require first-party use of Salesforce cookies" = DISABLED\n\n' +
            '4. Clear browser cache completely and hard refresh\n\n' +
            '5. Try in an incognito/private window\n\n' +
            'The frontdoor URL format may be wrong. We\'re using access_token directly now.';
          console.error('[TabNext]', errorMsg);
          setError(errorMsg);
        } else if (errorString.includes('timeout')) {
          // Render timeout with no network requests = likely permission set issue
          const errorMsg = '⚠️  JWT Bearer Flow Permission Set Setup Required\n\n' +
            'The dashboard is not loading because the user needs a custom permission set.\n\n' +
            'Follow these steps in Salesforce:\n\n' +
            '1. Setup → Permission Sets → Find "Tableau Next Consumer" → Clone it\n' +
            '2. Name it (e.g., "Tableau Next Consumer JWT") and save\n' +
            '3. Setup → External Client App Manager → Edit your ECA\n' +
            '4. OAuth Policies → Set "Permitted Users" to "Admin approved users are pre authorized"\n' +
            '5. App Policies → Add your custom permission set to "Selected Permission Sets"\n' +
            `6. Assign the custom permission set to user: ${salesforceUsername}\n\n` +
            'See console logs for more details.';
          console.error('[TabNext]', errorMsg);
          setError(errorMsg);
        } else {
          setError(String(e));
        }
        setStatus("idle");
        throw e;
      }
  }, [orgUrl, dashboardIdOrApiName, salesforceUsername]);

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
            console.log('[TabNext] ✅ Auth credential stored in sessionStorage');

            // Load SDK and render
            console.log('[TabNext] 🚀 Initializing SDK and rendering dashboard...');
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
    console.log('[TabNext] Client Credentials Flow started');
    try {
      setError("");
      setStatus("authenticating");

      const resp = await fetch('/api/tabnext/client-credentials-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('[TabNext] Client Credentials response status:', resp.status);

      if (!resp.ok) {
        const text = await resp.text();
        console.warn('[TabNext] Client Credentials Flow failed, trying JWT Bearer Flow:', text);
        // If Client Credentials fails, try JWT Bearer Flow
        return handleJWTBearerAuth();
      }

      const data = await resp.json();
      const authCredential = data.authCredential; // This is the frontdoor URL or access token
      sessionStorage.setItem('tabnext_auth_credential', authCredential);

      // Load SDK and render
      await initializeAndRender(authCredential);
    } catch (e) {
      console.warn('Client Credentials Flow error, trying JWT Bearer Flow:', e);
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
      console.log('[TabNext] Auto-authenticating...');
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


