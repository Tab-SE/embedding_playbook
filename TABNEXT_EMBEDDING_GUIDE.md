# Tableau Next Embedding Guide

Complete guide for embedding Tableau Next dashboards in a Next.js application with Salesforce authentication.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Salesforce Setup](#salesforce-setup)
4. [Authentication Flows](#authentication-flows)
5. [Environment Variables](#environment-variables)
6. [Code Implementation](#code-implementation)
7. [Troubleshooting](#troubleshooting)

## Overview

Tableau Next is Salesforce's embedded analytics solution that allows you to embed Tableau dashboards directly in your web application. This guide covers the complete setup process, including multiple authentication methods.

**Authentication Flow Priority:**
1. **Client Credentials Flow** (simplest, no user-specific auth)
2. **JWT Bearer Flow** (dynamic, no redirects, requires certificate)
3. **PKCE OAuth Flow** (most secure, requires user redirect)

## Prerequisites

- Next.js application (this guide uses Next.js 14+)
- Salesforce org with Tableau Next enabled
- Salesforce Admin access
- Node.js 18+ and npm/yarn

## Salesforce Setup

### Step 1: Create External Client App (ECA)

1. Go to **Salesforce Setup**
2. Quick Find: **"External Client App Manager"**
3. Click **"New Connected App"** or **"New External Client App"**
4. Fill in the required fields:
   - **Connected App Name**: e.g., "Tableau Next Embedding App"
   - **API Name**: Auto-generated
   - **Contact Email**: Your email
5. Enable **OAuth Settings**:
   - **Callback URL**: `http://localhost:3000/getAccessToken` (for local dev)
   - **Callback URL**: `https://yourdomain.com/getAccessToken` (for production)
   - **OAuth Scopes**: Select `web`, `lightning`, `api`
6. Enable **JWT Bearer Flow** (for JWT authentication):
   - Check the box to enable JWT Bearer Flow
7. Save the app
8. **Copy and save**:
   - **Consumer Key** (Client ID)
   - **Consumer Secret** (Client Secret)

### Step 2: Generate JWT Certificate (for JWT Bearer Flow)

1. Generate RSA key pair:
   ```bash
   openssl genrsa -out salesforce_private_key.pem 2048
   openssl rsa -in salesforce_private_key.pem -pubout -out salesforce_public_cert.pem
   ```

2. Upload public certificate to Salesforce:
   - Go to your External Client App
   - Find **"Digital Certificate"** or **"JWT Certificate"** section
   - Click **"Upload Certificate"**
   - Upload `salesforce_public_cert.pem`

3. **Store private key securely**:
   - **Local development**: Keep `salesforce_private_key.pem` in your project (add to `.gitignore`)
   - **Production**: Store private key as environment variable (see Environment Variables section)

### Step 3: Configure Permission Sets (for JWT Bearer Flow)

JWT Bearer Flow requires users to have a custom permission set:

1. Go to **Setup → Permission Sets**
2. Find **"Tableau Next Consumer"** permission set
3. Click **Clone**
4. Name it (e.g., **"Tableau Next Consumer JWT"**)
5. Save
6. Go to **External Client App Manager → Edit your ECA**
7. **OAuth Policies**:
   - Set **"Permitted Users"** to **"Admin approved users are pre authorized"**
8. **App Policies**:
   - Add your custom permission set to **"Selected Permission Sets"**
9. **Assign the permission set** to users who need access:
   - Setup → Users → Select user → Permission Set Assignments → Add your custom permission set

### Step 4: Configure CORS

1. Go to **Setup → CORS**
2. Add your application origin:
   - `http://localhost:3000` (for local dev)
   - `https://yourdomain.com` (for production)

### Step 5: Configure Trusted Domains

1. Go to **Setup → Session Settings**
2. Scroll to **"Trusted Domains for Inline Frames"**
3. Click **"Add Domain"**
4. Enter your domain:
   - `localhost:3000` (for local dev)
   - `yourdomain.com` (for production)
5. Select **"Lightning Out"** as the IFrame type
6. Save

### Step 6: Disable Clickjack Protection (Required for Embedding)

**⚠️ This requires blacktab access (Salesforce internal tool)**

1. Open **blacktab** for your org
2. Navigate to: **Session Settings → Clickjack Protection**
3. Find field: **"Enable clickjack protection for non-Setup Salesforce pages"**
4. Set value to: **FALSE** or **DISABLED**
5. Save and wait 2-3 minutes for changes to propagate

**Note:** If you don't have blacktab access, contact your Salesforce admin. This setting is required for iframe embedding to work.

### Step 7: Get Dashboard ID/API Name

1. Navigate to your Tableau Next dashboard in Salesforce
2. Check the URL:
   ```
   https://your-org.my.salesforce.com/tableau/dashboard/YourDashboardAPIName/view
   ```
3. The **Dashboard API Name** is the part after `/dashboard/` and before `/view`
4. Save this value (you'll need it for `NEXT_PUBLIC_TABNEXT_DASHBOARD_ID`)

## Authentication Flows

### Client Credentials Flow

**Use case:** Simplest flow, no user-specific authentication needed.

**How it works:**
- Uses `client_id` and `client_secret` to get an access token
- No user interaction required
- Good for service accounts or public dashboards

**Requirements:**
- `SALESFORCE_CLIENT_ID`
- `SALESFORCE_CLIENT_SECRET`
- `SALESFORCE_ORG_URL`

### JWT Bearer Flow

**Use case:** Dynamic authentication without user redirects.

**How it works:**
- Server generates a JWT token signed with private key
- JWT contains user's Salesforce username
- Salesforce validates JWT and returns access token
- No user interaction required

**Requirements:**
- `SALESFORCE_CLIENT_ID`
- `SALESFORCE_PRIVATE_KEY` (or `SALESFORCE_PRIVATE_KEY_PATH`)
- `SALESFORCE_ORG_URL`
- User must have custom permission set assigned
- Public certificate must be uploaded to ECA

**Advantages:**
- No redirects
- Works seamlessly in background
- User-specific authentication

### PKCE OAuth Flow

**Use case:** Most secure flow, requires user authorization.

**How it works:**
- User is redirected to Salesforce login
- User authorizes the application
- Authorization code is exchanged for access token
- Uses PKCE (Proof Key for Code Exchange) for security

**Requirements:**
- `SALESFORCE_CLIENT_ID`
- `SALESFORCE_CLIENT_SECRET`
- `SALESFORCE_REDIRECT_URI` (must match ECA callback URL exactly)
- User must interact with Salesforce login page

## Environment Variables

### Required Environment Variables

Add these to your `.env.development.local` (or `.env.local` for production):

```bash
# Server-side (required for all flows)
SALESFORCE_ORG_URL=https://your-org.my.salesforce.com/
SALESFORCE_CLIENT_ID=your_consumer_key_here
SALESFORCE_CLIENT_SECRET=your_consumer_secret_here

# For JWT Bearer Flow (choose one):
# Option 1: File path (local development)
SALESFORCE_PRIVATE_KEY_PATH=./salesforce_private_key.pem

# Option 2: Environment variable (production - recommended)
# SALESFORCE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
# ...your private key content...
# -----END PRIVATE KEY-----"

# Client-side (NEXT_PUBLIC_* variables are exposed to browser)
NEXT_PUBLIC_SALESFORCE_ORG_URL=https://your-org.my.salesforce.com/
NEXT_PUBLIC_SALESFORCE_CLIENT_ID=your_consumer_key_here
NEXT_PUBLIC_SALESFORCE_REDIRECT_URI=http://localhost:3000/getAccessToken
NEXT_PUBLIC_TABNEXT_DASHBOARD_ID=YourDashboardAPIName
```

### Optional Environment Variables

These have defaults and are not required:

```bash
# Optional (defaults to https://login.salesforce.com)
# SALESFORCE_LOGIN_URL=https://login.salesforce.com
# NEXT_PUBLIC_SALESFORCE_LOGIN_URL=https://login.salesforce.com
```

### Where to Get Values

- **SALESFORCE_ORG_URL**: Your Salesforce org URL (e.g., `https://your-org.my.salesforce.com/`)
- **SALESFORCE_CLIENT_ID**: Consumer Key from your External Client App
- **SALESFORCE_CLIENT_SECRET**: Consumer Secret from your External Client App
- **SALESFORCE_PRIVATE_KEY**: Generated private key (see Step 2 above)
- **NEXT_PUBLIC_SALESFORCE_REDIRECT_URI**: Must match exactly the Callback URL in your ECA
- **NEXT_PUBLIC_TABNEXT_DASHBOARD_ID**: Dashboard API name from the dashboard URL

## Code Implementation

### Step 1: Install Dependencies

```bash
npm install @salesforce/analytics-embedding-sdk
```

### Step 2: Create API Routes

#### JWT Auth Route (`src/app/api/tabnext/jwt-auth/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const { salesforce_username } = await req.json();

    if (!salesforce_username) {
      return NextResponse.json({ error: 'Missing salesforce_username' }, { status: 400 });
    }

    const salesforceOrgUrl = process.env.SALESFORCE_ORG_URL || process.env.NEXT_PUBLIC_SALESFORCE_ORG_URL;
    const sfClientId = process.env.SALESFORCE_CLIENT_ID;
    const sfPrivateKeyPath = process.env.SALESFORCE_PRIVATE_KEY_PATH;
    const sfPrivateKey = process.env.SALESFORCE_PRIVATE_KEY;

    // Get private key
    let privateKey: string;
    if (sfPrivateKey) {
      privateKey = sfPrivateKey.replace(/\\n/g, '\n');
    } else if (sfPrivateKeyPath) {
      const keyPath = join(process.cwd(), sfPrivateKeyPath);
      privateKey = readFileSync(keyPath, 'utf8');
    } else {
      return NextResponse.json({ error: 'Missing private key' }, { status: 500 });
    }

    // Generate JWT
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      iss: sfClientId,
      sub: salesforce_username,
      aud: salesforceOrgUrl?.replace(/\/+$/, '') || 'https://login.salesforce.com',
      exp: now + 300,
      iat: now,
    };

    const assertion = jwt.sign(jwtPayload, privateKey, { algorithm: 'RS256' });

    // Exchange JWT for access token
    const tokenUrl = `${salesforceOrgUrl?.replace(/\/+$/, '')}/services/oauth2/token`;
    const params = new URLSearchParams();
    params.set('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
    params.set('assertion', assertion);

    const tokenResp = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!tokenResp.ok) {
      const text = await tokenResp.text();
      return NextResponse.json({ error: 'Token exchange failed', detail: text }, { status: 502 });
    }

    const tokenData = await tokenResp.json();
    const access_token = tokenData.access_token;
    const instance_url = tokenData.instance_url;

    // Generate frontdoor URL (preferred for SDK)
    const cleanInstanceUrl = instance_url.replace(/\/+$/, '');
    let frontdoor_url: string | null = null;

    try {
      const fdResp = await fetch(`${cleanInstanceUrl}/services/oauth2/singleaccess`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
      });

      if (fdResp.ok) {
        const fdData = await fdResp.json();
        frontdoor_url = fdData.frontdoor_uri || fdData.url || null;
      }
    } catch (e) {
      // Continue without frontdoor URL
    }

    // Construct frontdoor URL manually if needed
    if (!frontdoor_url) {
      const lightningUrl = cleanInstanceUrl.replace(/\.my\.salesforce\.com/, '.lightning.force.com');
      frontdoor_url = `${lightningUrl}/secur/frontdoor.jsp?sid=${access_token}`;
    }

    return NextResponse.json({
      authCredential: frontdoor_url || access_token,
      access_token: access_token,
      instance_url: instance_url,
      frontdoor_url: frontdoor_url,
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', detail: e?.message || String(e) }, { status: 500 });
  }
}
```

#### Client Credentials Auth Route (`src/app/api/tabnext/client-credentials-auth/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const salesforceOrgUrl = process.env.SALESFORCE_ORG_URL || process.env.NEXT_PUBLIC_SALESFORCE_ORG_URL;
    const sfClientId = process.env.SALESFORCE_CLIENT_ID;
    const sfClientSecret = process.env.SALESFORCE_CLIENT_SECRET;

    if (!sfClientId || !sfClientSecret || !salesforceOrgUrl) {
      return NextResponse.json({ error: 'Missing required configuration' }, { status: 500 });
    }

    // Get access token
    const tokenUrl = `${salesforceOrgUrl}/services/oauth2/token`;
    const params = new URLSearchParams();
    params.set('grant_type', 'client_credentials');
    params.set('client_id', sfClientId);
    params.set('client_secret', sfClientSecret);

    const tokenResp = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!tokenResp.ok) {
      const text = await tokenResp.text();
      return NextResponse.json({ error: 'Token request failed', detail: text }, { status: 502 });
    }

    const tokenData = await tokenResp.json();
    const access_token = tokenData.access_token;
    const instance_url = tokenData.instance_url || salesforceOrgUrl;

    // Generate frontdoor URL
    let frontdoor_url: string | null = null;
    try {
      const fdResp = await fetch(`${instance_url}/services/oauth2/singleaccess`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
      });

      if (fdResp.ok) {
        const fdData = await fdResp.json();
        frontdoor_url = fdData.frontdoor_uri || fdData.url || null;
      }
    } catch (e) {
      // Continue without frontdoor URL
    }

    return NextResponse.json({
      authCredential: frontdoor_url || access_token,
      access_token: access_token,
      instance_url: instance_url,
      frontdoor_url: frontdoor_url,
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', detail: e?.message || String(e) }, { status: 500 });
  }
}
```

### Step 3: Create TabNext Component

Create `src/app/demo/superstore/tabnext/TabNext.jsx`:

```typescript
"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@/components/ui";
import { AppWindow } from "lucide-react";
import { initializeAnalyticsSdk, AnalyticsDashboard } from '@salesforce/analytics-embedding-sdk';

export const TabNext = () => {
  const { status: sessionStatus, data: session } = useSession();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const orgUrl = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SALESFORCE_ORG_URL || "";
    if (!url) return "";
    // Convert .my.salesforce.com to .lightning.force.com for SDK compatibility
    const converted = url.replace(/\.my\.salesforce\.com/, '.lightning.force.com').replace(/\/+$/, '');
    return converted;
  }, []);

  const dashboardIdOrApiName = useMemo(() => {
    return process.env.NEXT_PUBLIC_TABNEXT_DASHBOARD_ID || 'YourDashboardAPIName';
  }, []);

  // Get Salesforce username from session
  const salesforceUsername = useMemo(() =>
    session?.user?.salesforceUsername ||
    session?.user?.email?.split('@')[0] ||
    "",
  [session]);

  // Initialize SDK and render dashboard
  const initializeAndRender = useCallback(async (authCredential) => {
    try {
      setStatus("initializing");

      if (!orgUrl) {
        throw new Error('Missing NEXT_PUBLIC_SALESFORCE_ORG_URL');
      }

      // Step 1: Initialize SDK
      const config = {
        authCredential: authCredential,
        orgUrl: orgUrl
      };
      await initializeAnalyticsSdk(config);

      // Step 2: Setup container
      const container = document.getElementById('analytics-container');
      if (!container) {
        throw new Error('Container element not found!');
      }

      container.style.height = '800px';
      container.style.width = `${Math.max(container.parentElement?.clientWidth || 600, 600)}px`;
      container.style.minHeight = '800px';
      container.style.minWidth = '600px';
      container.style.display = 'block';

      await new Promise(resolve => setTimeout(resolve, 0));

      // Step 3: Create dashboard
      const dashboard = new AnalyticsDashboard({
        parentIdOrElement: 'analytics-container',
        idOrApiName: dashboardIdOrApiName
      });

      // Step 4: Render
      const renderResult = dashboard.render();
      if (renderResult instanceof Promise) {
        await renderResult;
      }
      setStatus("ready");
    } catch (e) {
      setError(String(e));
      setStatus("idle");
      throw e;
    }
  }, [orgUrl, dashboardIdOrApiName]);

  // JWT Bearer Flow
  const handleJWTBearerAuth = useCallback(async () => {
    if (!salesforceUsername) {
      setError('No Salesforce username available');
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
        setError(`JWT Authentication failed: ${text}`);
        setStatus("idle");
        return;
      }

      const data = await resp.json();
      const authCredential = data.authCredential;
      if (!authCredential) {
        throw new Error('No authCredential in response');
      }

      sessionStorage.setItem('tabnext_auth_credential', authCredential);
      await initializeAndRender(authCredential);
    } catch (e) {
      setError(`JWT Authentication error: ${e.message || String(e)}`);
      setStatus("idle");
    }
  }, [salesforceUsername, initializeAndRender]);

  // Client Credentials Flow
  const handleClientCredentialsAuth = useCallback(async () => {
    try {
      setError("");
      setStatus("authenticating");

      const resp = await fetch('/api/tabnext/client-credentials-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!resp.ok) {
        // Fall back to JWT if Client Credentials fails
        return handleJWTBearerAuth();
      }

      const data = await resp.json();
      const authCredential = data.authCredential;
      sessionStorage.setItem('tabnext_auth_credential', authCredential);
      await initializeAndRender(authCredential);
    } catch (e) {
      // Fall back to JWT on error
      return handleJWTBearerAuth();
    }
  }, [handleJWTBearerAuth, initializeAndRender]);

  // Auto-authenticate on mount
  const hasAutoAuthenticated = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const hasCode = !!url.searchParams.get('code');
    const cached = sessionStorage.getItem('tabnext_auth_credential');

    if (hasAutoAuthenticated.current) return;

    if (sessionStatus === 'authenticated' && !hasCode && !cached && status === 'idle') {
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
              Tableau Next Embed
            </CardTitle>
            <CardDescription>
              Dynamic authentication: Client Credentials → JWT Bearer → PKCE fallback
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Button onClick={handleClientCredentialsAuth} disabled={status !== 'idle'}>
                {status === 'authenticating' ? 'Authenticating…' :
                 status === 'initializing' ? 'Initializing…' :
                 'Authenticate with Salesforce'}
              </Button>
              {status !== 'idle' && <span className="text-xs text-slate-500">{status}</span>}
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
```

### Step 4: Create Page Component

Create `src/app/demo/superstore/tabnext/page.jsx`:

```typescript
import dynamic from 'next/dynamic';
import { Demo } from '@/components';

// Dynamically import TabNext with SSR disabled (uses browser-only APIs)
const TabNext = dynamic(
  () => import('./TabNext').then((mod) => ({ default: mod.TabNext })),
  {
    ssr: false,
    loading: () => <div className="p-4">Loading Tableau Next dashboard...</div>
  }
);

const Page = () => {
  return (
    <Demo settings={settings} pageName="Tableau Next Embed">
      <TabNext />
    </Demo>
  );
}

export default Page;
```

## Troubleshooting

### Common Issues

#### 1. "frame-ancestors 'none'" CSP Error

**Error:** `Framing 'https://your-org.my.salesforce.com/' violates the following Content Security Policy directive: "frame-ancestors 'none'"`

**Solution:**
- Disable Clickjack Protection in blacktab (see Step 6 in Salesforce Setup)
- This requires Salesforce internal tool access
- Contact your Salesforce admin if you don't have access

#### 2. "app_not_found" Error (JWT)

**Error:** `{"error":"app_not_found","error_description":"External client app is not installed in this org"}`

**Solution:**
- Verify `SALESFORCE_ORG_URL` matches the org where your ECA is installed
- Don't use `login.salesforce.com` - use your specific org URL
- Ensure JWT Bearer Flow is enabled in your ECA

#### 3. "invalid_grant" Error (JWT)

**Error:** `{"error":"invalid_grant","error_description":"expired authorization code"}`

**Solution:**
- Verify the user has the custom permission set assigned
- Check that the permission set is added to the ECA's "Selected Permission Sets"
- Ensure OAuth Policies → "Permitted Users" is set to "Admin approved users are pre authorized"

#### 4. "redirect_uri_mismatch" Error (PKCE)

**Error:** `error=redirect_uri_mismatch&error_description=redirect_uri must match configuration`

**Solution:**
- Verify `NEXT_PUBLIC_SALESFORCE_REDIRECT_URI` matches **exactly** the Callback URL in your ECA
- Check for:
  - Protocol (`http://` vs `https://`)
  - Port number (`:3000`)
  - Trailing slashes
  - Case sensitivity

#### 5. Dashboard Not Rendering

**Possible causes:**
- Dashboard ID is incorrect (check the dashboard URL in Salesforce)
- User doesn't have access to the dashboard
- Container dimensions not set (SDK requires explicit pixel values)
- CSP/Clickjack Protection blocking the iframe

**Debug steps:**
- Check browser console for errors
- Verify dashboard exists: `https://your-org.my.salesforce.com/tableau/dashboard/YourDashboardAPIName/view`
- Check Network tab for failed requests
- Verify container has explicit height/width in pixels

#### 6. "Missing salesforce_username" (JWT)

**Solution:**
- Ensure user session includes `salesforceUsername` field
- Or ensure `session.user.email` is available (used as fallback)
- Add `salesforceUsername` to your user store/session

### Environment Variable Checklist

- [ ] `SALESFORCE_ORG_URL` - Your org URL (not `login.salesforce.com`)
- [ ] `SALESFORCE_CLIENT_ID` - Consumer Key from ECA
- [ ] `SALESFORCE_CLIENT_SECRET` - Consumer Secret from ECA
- [ ] `SALESFORCE_PRIVATE_KEY` or `SALESFORCE_PRIVATE_KEY_PATH` - For JWT
- [ ] `NEXT_PUBLIC_SALESFORCE_ORG_URL` - Same as above (client-side)
- [ ] `NEXT_PUBLIC_SALESFORCE_CLIENT_ID` - Same as above (client-side)
- [ ] `NEXT_PUBLIC_SALESFORCE_REDIRECT_URI` - Must match ECA callback URL exactly
- [ ] `NEXT_PUBLIC_TABNEXT_DASHBOARD_ID` - Dashboard API name

### Permission Set Checklist (JWT)

- [ ] Created custom permission set (cloned from "Tableau Next Consumer")
- [ ] Added custom permission set to ECA's "Selected Permission Sets"
- [ ] Set ECA "Permitted Users" to "Admin approved users are pre authorized"
- [ ] Assigned permission set to the user
- [ ] Public certificate uploaded to ECA
- [ ] JWT Bearer Flow enabled in ECA

## Additional Resources

- [Salesforce External Client Apps Documentation](https://help.salesforce.com/s/articleView?id=sf.connected_app_overview.htm)
- [Tableau Next SDK Documentation](https://developer.salesforce.com/docs/atlas.en-us.tableau_next.meta/tableau_next/)
- [JWT Bearer Flow Documentation](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm)

## Security Best Practices

1. **Never commit private keys to git** - Add `*.pem` and private key files to `.gitignore`
2. **Use environment variables in production** - Store `SALESFORCE_PRIVATE_KEY` as env var, not file
3. **Rotate credentials regularly** - Update Consumer Secret and certificates periodically
4. **Use HTTPS in production** - Always use `https://` for production URLs
5. **Limit OAuth scopes** - Only request the scopes you actually need
6. **Monitor access** - Review Connected App usage in Salesforce Setup

## Support

For issues specific to:
- **Salesforce configuration**: Contact your Salesforce admin
- **Tableau Next SDK**: Check Salesforce documentation or support
- **Code implementation**: Review this guide and check console logs for detailed error messages

---

**Last Updated:** Based on implementation completed November 2025
**Tested with:** Next.js 14+, Salesforce Tableau Next, @salesforce/analytics-embedding-sdk

