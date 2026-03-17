"use client";

import { createContext, useContext } from "react";
import { useChat } from "@ai-sdk/react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useVercelUseChatRuntime } from "@assistant-ui/react-ai-sdk";

const ChatActionsContext = createContext<{
  clearMessages: () => void;
} | null>(null);

export const useChatActions = () => {
  const context = useContext(ChatActionsContext);
  if (!context) {
    throw new Error("useChatActions must be used within VercelAgentRuntimeProvider");
  }
  return context;
};

export function VercelAgentRuntimeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chat = useChat({
    api: "/api/chat",
  });

  const runtime = useVercelUseChatRuntime(chat);

  const clearMessages = () => {
    chat.setMessages([]);
  };

  return (
    <ChatActionsContext.Provider value={{ clearMessages }}>
      <AssistantRuntimeProvider runtime={runtime}>
        {children}
      </AssistantRuntimeProvider>
    </ChatActionsContext.Provider>
  );
}
