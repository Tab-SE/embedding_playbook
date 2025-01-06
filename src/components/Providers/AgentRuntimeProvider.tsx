'use client'

import { useChat, UseChatHelpers } from "ai/react"
import { AssistantRuntimeProvider } from "@assistant-ui/react"
import { useVercelUseChatRuntime } from "@assistant-ui/react-ai-sdk"
import { Message } from "ai"

// Define a custom type that extends UseChatHelpers
type ExtendedUseChatHelpers = UseChatHelpers & {
  addToolResult: ({ toolCallId, result }: { toolCallId: string; result: any }) => void
  messages: ExtendedMessage[]
}

// Define an extended Message type
type ExtendedMessage = Message & {
  role: "system" | "user" | "assistant" | "data" | "function" | "tool"
}

export function AgentRuntimeProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const chat = useChat({
    api: "/api/chat",
  }) as ExtendedUseChatHelpers

  // @ts-ignore
  const runtime = useVercelUseChatRuntime(chat)

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  )
}

