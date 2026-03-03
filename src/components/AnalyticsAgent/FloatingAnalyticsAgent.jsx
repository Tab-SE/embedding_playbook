"use client";
import { useState, forwardRef, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui";

export const FloatingAnalyticsAgent = (props) => {
  const { agentId } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const { status: sessionStatus, data: session } = useSession();

  const salesforceUsername = session?.user?.salesforceUsername || session?.user?.email?.split('@')[0] || "";

  const initializeAgent = useCallback(async (authCredential, instanceUrl) => {
    try {
      setStatus("initializing");

      // Dynamically import the SDK
      const { initializeAnalyticsSdk, AnalyticsAgent } = await import('@salesforce/analytics-embedding-sdk');

      const orgUrl = instanceUrl?.replace(/\/+$/, '') || process.env.NEXT_PUBLIC_SALESFORCE_ORG_URL?.replace(/\/+$/, '');

      if (!orgUrl) {
        throw new Error('Missing org URL');
      }

      const config = {
        authCredential: authCredential,
        orgUrl: orgUrl
      };

      console.log('[FloatingAnalyticsAgent] Initializing SDK with config:', {
        orgUrl: config.orgUrl,
        agentId: agentId
      });

      await initializeAnalyticsSdk(config);

      const agentContainer = document.getElementById('floating-agent-container');
      if (!agentContainer) {
        throw new Error('Agent container not found');
      }

      const agent = new AnalyticsAgent({
        parentIdOrElement: 'floating-agent-container',
        idOrApiName: agentId,
        showHeader: true,
        showHeaderActions: true
      });

      console.log('[FloatingAnalyticsAgent] Rendering agent...');
      const renderResult = agent.render();
      if (renderResult instanceof Promise) {
        await renderResult;
      }

      console.log('[FloatingAnalyticsAgent] Agent rendered successfully');
      setStatus("ready");
    } catch (e) {
      console.error('[FloatingAnalyticsAgent] Error:', e);
      setError(String(e));
      setStatus("idle");
    }
  }, [agentId]);

  const handleAuth = useCallback(async () => {
    if (!salesforceUsername) {
      setError('Salesforce username required');
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
        setError(`Auth failed: ${text}`);
        setStatus("idle");
        return;
      }

      const data = await resp.json();
      const authCredential = data.authCredential;
      if (!authCredential) {
        throw new Error('No authCredential in response');
      }

      const instanceUrl = data.instance_url;
      await initializeAgent(authCredential, instanceUrl);
    } catch (e) {
      setError(`Auth error: ${e.message || String(e)}`);
      setStatus("idle");
    }
  }, [salesforceUsername, initializeAgent]);

  const hasAutoAuthAttempted = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isOpen) return;
    if (sessionStatus !== 'authenticated') return;
    if (hasAutoAuthAttempted.current) return;
    if (status !== 'idle') return;

    if (salesforceUsername) {
      hasAutoAuthAttempted.current = true;
      handleAuth();
    }
  }, [isOpen, sessionStatus, salesforceUsername, handleAuth, status]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="fixed bottom-4 right-[5.5rem] z-[100]" style={{ position: 'fixed', bottom: '1rem', right: '5.5rem', zIndex: 100 }}>
        <FloatingAgentButton
          isOpen={isOpen}
          onClick={handleToggle}
        />
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-[100] w-[90vw] sm:w-[600px] xl:w-[750px] 2xl:w-[840px] h-[500px] 2xl:h-[570px] bg-white dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden" style={{ position: 'fixed', bottom: '5rem', right: '1rem', zIndex: 100 }}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-stone-900 dark:text-stone-50">Analytics Agent</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>

            <div className="flex-1 overflow-hidden">
              {error && (
                <div className="p-4 text-sm text-red-500">{error}</div>
              )}
              {status === "authenticating" && (
                <div className="p-4 text-sm">Authenticating...</div>
              )}
              {status === "initializing" && (
                <div className="p-4 text-sm">Loading agent...</div>
              )}
              <div
                id="floating-agent-container"
                className="w-full h-full"
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const FloatingAgentButton = forwardRef(({ isOpen, onClick, ...rest }, ref) => {
  const tooltip = isOpen ? "Close Analytics Agent" : "Open Analytics Agent";

  return (
    <button
      onClick={onClick}
      ref={ref}
      title={tooltip}
      className="w-11 h-11 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-90 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer"
      style={{ width: '44px', height: '44px' }}
      {...rest}
    >
      <Bot className="w-6 h-6" />
      <span className="sr-only">{tooltip}</span>
    </button>
  );
});

FloatingAgentButton.displayName = "FloatingAgentButton";
