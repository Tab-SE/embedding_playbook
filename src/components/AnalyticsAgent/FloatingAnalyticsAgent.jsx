"use client";
import { useState, forwardRef, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Bot, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui";
import { useFloatingPanel } from "@/components/Agent/FloatingPanelContext";

export const FloatingAnalyticsAgent = (props) => {
  const { agentId: agentIdProp, suggestedQuestion = "What are the total sales by region?" } = props;
  // Env is source of truth so NEXT_PUBLIC_ANALYTICS_AGENT_ID always works when set
  const agentId = process.env.NEXT_PUBLIC_ANALYTICS_AGENT_ID || agentIdProp || '0XxHu000001Aj8UKAS';
  // Shared with the MCP assistant so only one panel is open at a time; falls
  // back to local state when no FloatingPanelProvider is present.
  const { isOpen, setOpen: setIsOpen } = useFloatingPanel("analytics-agent");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { status: sessionStatus, data: session } = useSession();
  const panelRef = useRef(null);

  // The embedded Salesforce agent is a cross-origin web component the SDK mounts
  // into #floating-agent-container imperatively — we can't pre-fill its input,
  // so we surface the suggested question as click-to-copy in OUR header.
  // IMPORTANT: the hint lives INSIDE the header row, not as a new sibling of the
  // agent container — keep the header + container as the same two children in
  // the same order so the SDK-mounted node is never re-indexed/remounted.
  const handleCopyQuestion = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(suggestedQuestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context) — text is still visible to type.
    }
  }, [suggestedQuestion]);

  const salesforceUsername = session?.user?.salesforceUsername || session?.user?.email?.split('@')[0] || "";

  const initializeAgent = useCallback(async (authCredential) => {
    try {
      setStatus("initializing");

      // Dynamically import the SDK
      const { initializeAnalyticsSdk, AnalyticsAgent } = await import('@salesforce/analytics-embedding-sdk');

      const orgUrl = process.env.NEXT_PUBLIC_SALESFORCE_ORG_URL;

      if (!orgUrl) {
        throw new Error('Missing NEXT_PUBLIC_SALESFORCE_ORG_URL environment variable');
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

      await initializeAgent(authCredential);
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

  // Close on click away. The panel is a plain div (unlike the Radix-based MCP
  // modal, which closes itself), so we listen for outside clicks. The toggle
  // button has its own handler, so ignore clicks inside it to avoid a
  // close-then-reopen race.
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e) => {
      if (panelRef.current && panelRef.current.contains(e.target)) return;
      if (e.target.closest?.('[data-analytics-agent-toggle]')) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen, setIsOpen]);

  return (
    <>
      <div data-analytics-agent-toggle className="fixed bottom-4 right-[5.5rem] z-[100]" style={{ position: 'fixed', bottom: '1rem', right: '5.5rem', zIndex: 100 }}>
        <FloatingAgentButton
          isOpen={isOpen}
          onClick={handleToggle}
        />
      </div>

      {isOpen && (
        <div ref={panelRef} className="fixed bottom-20 right-4 z-[100] w-[min(92vw,520px)] xl:w-[560px] 2xl:w-[600px] h-[min(85vh,720px)] bg-white dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden flex flex-col" style={{ position: 'fixed', bottom: '5rem', right: '1rem', zIndex: 100 }}>
          <div className="flex flex-col h-full">
            <div className="border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between p-4">
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
              {suggestedQuestion && (
                <div className="flex items-center justify-between gap-2 px-4 pb-2 -mt-1">
                  <p className="text-xs text-stone-600 dark:text-stone-300 min-w-0">
                    <span className="font-medium">Try asking:</span>{" "}
                    <span className="italic">“{suggestedQuestion}”</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyQuestion}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-stone-200 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800"
                    title="Copy question, then paste it into the agent"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
              {error && (
                <div className="p-4 text-sm text-red-500">{error}</div>
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
