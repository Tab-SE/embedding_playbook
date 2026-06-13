"use client";

import { useEffect, createContext, useContext, useRef, useState } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useVercelUseChatRuntime } from "@assistant-ui/react-ai-sdk";
import { useChat } from "@ai-sdk/react";
import { useSession } from "next-auth/react";

import { useProgress } from "@/components/Agent/ProgressContext";

// The provider keeps its old name so demo layouts (`<LanggraphAgentRuntimeProvider />`)
// don't have to change. Internally it now drives the in-process agent at /api/chat
// (which uses Tableau MCP passthrough), not the LangGraph Cloud deployment.
//
// `agentId` is accepted but ignored — server-side, the demo is read from the
// NextAuth token (the user's selected demo). Kept in the prop signature so
// existing layout code doesn't break.

const ChatActionsContext = createContext<{
  clearMessages: () => void;
  error: Error | null;
  dismissError: () => void;
} | null>(null);

export const useChatActions = () => {
  const context = useContext(ChatActionsContext);
  if (!context) {
    throw new Error("useChatActions must be used within LanggraphAgentRuntimeProvider");
  }
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
  agentId?: string;
}

export function LanggraphAgentRuntimeProvider({ children }: Readonly<ProviderProps>) {
  const { addProgressStep, startStreaming, stopStreaming } = useProgress();
  const wasLoadingRef = useRef(false);

  // useChat's `error` is internal state and never clears on its own. We layer
  // our own dismissed flag so the user can hide the banner via "Dismiss" or
  // "New Chat", and we reset the flag whenever a new request starts so a fresh
  // failure surfaces a fresh banner.
  const [errorDismissed, setErrorDismissed] = useState(false);

  const chat = useChat({
    api: "/api/chat",
    onError: (err) => {
      console.error("[chat] error:", err);
      stopStreaming();
      setErrorDismissed(false); // a new error always re-shows the banner
    },
  });

  // Bridge useChat's loading state into the existing progress UI.
  useEffect(() => {
    if (chat.isLoading && !wasLoadingRef.current) {
      // a request just started — reset the dismissed flag so any prior banner
      // is cleared and a brand-new failure can resurface
      setErrorDismissed(false);
      startStreaming();
      addProgressStep({
        icon: "🔌",
        message: "Getting available tools...",
        timestamp: Date.now(),
      });
      wasLoadingRef.current = true;
    } else if (!chat.isLoading && wasLoadingRef.current) {
      addProgressStep({
        icon: "✅",
        message: "Analysis complete!",
        timestamp: Date.now(),
      });
      setTimeout(() => stopStreaming(), 1000);
      wasLoadingRef.current = false;
    }
  }, [chat.isLoading, addProgressStep, startStreaming, stopStreaming]);

  const runtime = useVercelUseChatRuntime(chat);

  // Wipe chat history when the signed-in user changes. On a client-side
  // logout → login this provider stays mounted and useChat's in-memory messages
  // would otherwise carry over to the next user (leaking the prior person's
  // conversation). Keyed on email; the ref tracks the last identity we saw.
  const { data: authSession } = useSession();
  const authEmail = authSession?.user?.email ?? null;
  const lastEmailRef = useRef<string | null | undefined>(undefined);
  // Keep a stable handle to setMessages. `chat` is a fresh object every render,
  // so depending on it here would re-run this effect on every render (and, with
  // the AuthGuard cycling the session, flip identity → setMessages → re-render →
  // loop). We only ever need the latest setMessages, captured via ref.
  const setMessagesRef = useRef(chat.setMessages);
  setMessagesRef.current = chat.setMessages;
  useEffect(() => {
    // First observation: record the identity without clearing (don't nuke a
    // freshly-loaded session's messages on mount).
    if (lastEmailRef.current === undefined) {
      lastEmailRef.current = authEmail;
      return;
    }
    if (authEmail !== lastEmailRef.current) {
      lastEmailRef.current = authEmail;
      setMessagesRef.current([]);
      setErrorDismissed(true);
    }
  }, [authEmail]);

  const clearMessages = () => {
    chat.setMessages([]);
    setErrorDismissed(true); // "New Chat" should also drop any visible banner
  };

  // Show the error only when useChat has one AND the user hasn't dismissed it.
  // Note: chat.error itself remains in useChat's internal state — there is no
  // public API on useChat to clear it. Hiding via our flag is the only option
  // short of unmounting the hook.
  const error = errorDismissed ? null : ((chat.error ?? null) as Error | null);
  const dismissError = () => setErrorDismissed(true);

  return (
    <ChatActionsContext.Provider value={{ clearMessages, error, dismissError }}>
      <AssistantRuntimeProvider runtime={runtime}>
        {children}
      </AssistantRuntimeProvider>
    </ChatActionsContext.Provider>
  );
}
