"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { AppWindow } from "lucide-react";
import { initializeAnalyticsSdk, AnalyticsDashboard } from '@salesforce/analytics-embedding-sdk';

export const TabNext = () => {
  const { status: sessionStatus, data: session } = useSession();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

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
  const initializeAndRender = useCallback(async (authCredential, instanceUrlFromAuth) => {
    try {
      setStatus("initializing");

      // Use instance_url from OAuth token exchange if available, otherwise fall back to configured orgUrl
      // Convert to Lightning format as required by SDK
      // Reference: https://developer.salesforce.com/docs/analytics/sdk/guide/sdk-access-token.html
      let sdkOrgUrl = orgUrl;
      if (instanceUrlFromAuth) {
        const cleanInstanceUrl = instanceUrlFromAuth.replace(/\/+$/, '');
        // Convert .my.salesforce.com to .lightning.force.com for SDK compatibility
        if (cleanInstanceUrl.includes('.my.salesforce.com')) {
          sdkOrgUrl = cleanInstanceUrl.replace(/\.my\.salesforce\.com/, '.lightning.force.com');
        } else if (cleanInstanceUrl.includes('.lightning.force.com')) {
          sdkOrgUrl = cleanInstanceUrl;
        } else {
          sdkOrgUrl = cleanInstanceUrl;
        }
      } else if (!orgUrl) {
        throw new Error('Missing NEXT_PUBLIC_SALESFORCE_ORG_URL and no instance_url from auth');
      }

      // Step 1: Initialize the SDK with auth credential and org URL
      const config = {
        authCredential: authCredential,
        orgUrl: sdkOrgUrl
      };
      console.log('[TabNext] SDK Config:', {
        orgUrl: config.orgUrl,
        authCredentialLength: config.authCredential?.length,
        authCredentialPreview: config.authCredential?.substring(0, 100) + '...'
      });
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
        console.log('[TabNext] Creating AnalyticsDashboard with:', {
          dashboardIdOrApiName: dashboardIdOrApiName,
          orgUrl: sdkOrgUrl
        });
        dashboard = new AnalyticsDashboard({
          parentIdOrElement: 'analytics-container',
          idOrApiName: dashboardIdOrApiName
        });
        console.log('[TabNext] AnalyticsDashboard created successfully');
      } catch (createError) {
        console.error('[TabNext] Error creating AnalyticsDashboard:', createError);
        throw createError;
      }

      // Step 4: Render the dashboard in the container

      try {
        console.log('[TabNext] Rendering dashboard...');
        const renderResult = dashboard.render();
        if (renderResult instanceof Promise) {
          await renderResult;
        }
        console.log('[TabNext] Dashboard rendered successfully');
        setStatus("ready");
      } catch (renderError) {
        console.error('[TabNext] Error rendering dashboard:', renderError);
        const errorMsg = String(renderError);

        // Check for different error types
        if (errorMsg.includes('pportalid') || errorMsg.includes('portal')) {
          console.error('[TabNext] ⚠️ Portal/Community access error detected!');
          console.error('[TabNext] This often indicates a Salesforce configuration issue:');
          console.error('[TabNext] 1. Partner Community user may not be assigned to a Community/Portal');
          console.error('[TabNext] 2. User may need different permission sets for Partner Community access');
          console.error('[TabNext] 3. Community/Portal may not be active or properly configured');
          console.error('[TabNext] 4. Check Network tab for PortalDoor errors (500 status)');
          setError(`Partner Community Configuration Issue: The user (${salesforceUsername}) is a Partner Community user but Salesforce cannot resolve the Community/Portal ID. Please check: 1) Community is active and published, 2) User's account is owned by an internal user with a role, 3) User has the Tableau Next permission set assigned. See console for details.`);
        } else if (errorMsg.includes('failed to load') || errorMsg.includes('UNEXPECTED_ERROR') || errorMsg.includes('getDashboardBundle')) {
          console.error('[TabNext] ⚠️ Dashboard loading error detected!');
          console.error('[TabNext] Authentication succeeded, but dashboard cannot be loaded.');
          console.error('[TabNext] This may indicate:');
          console.error('[TabNext] 1. Partner Community user may need additional permission sets');
          console.error('[TabNext] 2. Dashboard may need to be shared with Partner Community users differently');
          console.error('[TabNext] 3. Object-level or field-level security may be blocking access');
          console.error('[TabNext] 4. Dashboard API name might be different for Partner Community users');
          console.error('[TabNext] Current orgUrl:', sdkOrgUrl);
          console.error('[TabNext] Dashboard ID:', dashboardIdOrApiName);
          console.error('[TabNext] Username:', salesforceUsername);
          setError(`Dashboard Access Error: Authentication succeeded, but the dashboard (${dashboardIdOrApiName}) cannot be loaded for Partner Community user (${salesforceUsername}). Please verify: 1) User has Tableau Next permission set with dashboard access, 2) Dashboard is shared/accessible to Partner Community users, 3) No object-level security is blocking access. See console for details.`);
        }
        throw renderError;
      }
    } catch (e) {
        setError(String(e));
        setStatus("idle");
        throw e;
      }
  }, [orgUrl, dashboardIdOrApiName, salesforceUsername]);

  // JWT Bearer Flow - authenticates with Salesforce using username and certificate
  // Reference: https://developer.salesforce.com/docs/analytics/sdk/guide/sdk-access-token.html
  const handleJWTBearerAuth = useCallback(async () => {
    if (!salesforceUsername) {
      setError('Salesforce username is required. Please ensure your user profile includes a salesforceUsername.');
      setStatus("idle");
      return;
    }

    try {
      setError("");
      setStatus("authenticating");

      const resp = await fetch('/api/tabnext/jwt-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salesforce_username: salesforceUsername }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        setError(`Authentication failed: ${text}`);
        setStatus("idle");
        return;
      }

      const data = await resp.json();
      const authCredential = data.authCredential;
      if (!authCredential) {
        throw new Error('No authCredential in response');
      }

      const instanceUrl = data.instance_url;
      await initializeAndRender(authCredential, instanceUrl);
    } catch (e) {
      setError(`Authentication error: ${e.message || String(e)}`);
      setStatus("idle");
    }
  }, [salesforceUsername, initializeAndRender]);


  // Auto-authenticate with Salesforce when user logs in (JWT Bearer Flow)
  // This runs automatically when session becomes authenticated
  const hasAutoAuthAttempted = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStatus !== 'authenticated') return;
    if (hasAutoAuthAttempted.current) return;
    if (status !== 'idle') return;

    if (salesforceUsername) {
      hasAutoAuthAttempted.current = true;
      handleJWTBearerAuth();
    }
  }, [sessionStatus, salesforceUsername, handleJWTBearerAuth, status]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className='dark:bg-stone-900 shadow-xl'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AppWindow className="h-5 w-5 text-[hsl(199,99%,39%)]" />
              tabNext Embed
            </CardTitle>
            <CardDescription>Authenticates with Salesforce using JWT Bearer Flow and embeds the Tableau Next dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
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


