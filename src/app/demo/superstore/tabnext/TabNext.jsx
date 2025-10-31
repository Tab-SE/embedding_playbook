"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@/components/ui";
import { AppWindow } from "lucide-react";

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
  const orgUrl = useMemo(() => process.env.NEXT_PUBLIC_SALESFORCE_ORG_URL || "", []);
  const sdkSrc = useMemo(() => process.env.NEXT_PUBLIC_TABNEXT_SDK_SRC || "", []);

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
  }, [clientId, redirectUri, salesforceLoginUrl]);

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
      try {
        setStatus("initializing");
        if (!sdkSrc) throw new Error('Missing NEXT_PUBLIC_TABNEXT_SDK_SRC');
        const mod = await import(/* @vite-ignore */ sdkSrc);
        if (!mod.initializeAnalyticsSdk || !mod.AnalyticsDashboard) throw new Error('SDK missing expected exports');

        await mod.initializeAnalyticsSdk({ authCredential, orgUrl });
        const dashboard = new mod.AnalyticsDashboard({ parentIdOrElement: 'analytics-container', idOrApiName: 'MFG_Production_Scraps1' });
        await dashboard.render();
        setStatus("ready");
      } catch (e) {
        setError(String(e));
        setStatus("idle");
      }
    };
    run();
  }, [clientId, redirectUri, orgUrl, sdkSrc]);

  // Attempt seamless SSO: if user is logged into the site and we have no code or cached credential,
  // automatically kick off PKCE authorize (IdP/SSO should make this seamless).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const hasCode = !!url.searchParams.get('code');
    const cached = sessionStorage.getItem('tabnext_auth_credential');
    if (sessionStatus === 'authenticated' && !hasCode && !cached && status === 'idle') {
      // fire-and-forget; button remains as fallback
      void handleStartLogin();
    }
  }, [sessionStatus, status, handleStartLogin]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className='dark:bg-stone-900 shadow-xl'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AppWindow className="h-5 w-5 text-[hsl(199,99%,39%)]" />
              tabNext Embed
            </CardTitle>
            <CardDescription>Separate PKCE OAuth flow and Tableau Next embed. Existing auth untouched.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Button onClick={handleStartLogin} disabled={status !== 'idle'}>
                {status === 'starting' ? 'Redirecting…' : 'Login with Salesforce (PKCE)'}
              </Button>
              {status !== 'idle' && <span className="text-xs text-slate-500 dark:text-slate-300">{status}</span>}
            </div>
            {error ? <div className="text-sm text-red-500">{error}</div> : null}
            <div id="analytics-container" className="w-full min-h-[400px] sm:min-h-[600px] md:min-h-[800px] rounded border border-stone-200 dark:border-stone-800" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};


