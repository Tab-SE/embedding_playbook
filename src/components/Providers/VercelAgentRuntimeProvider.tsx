"use client";

import { useChat } from "@ai-sdk/react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useVercelUseChatRuntime } from "@assistant-ui/react-ai-sdk";

export function VercelAgentRuntimeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chat = useChat({
    api: "/api/chat",
  });

  const runtime = useVercelUseChatRuntime(chat);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
