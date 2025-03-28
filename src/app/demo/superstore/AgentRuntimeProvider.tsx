"use client";

import { useRef } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useLangGraphRuntime, LangChainMessage } from "@assistant-ui/react-langgraph";
import { Client, ThreadState } from "@langchain/langgraph-sdk";

const createClient = () => {
  const apiUrl = process.env["NEXT_PUBLIC_LANGGRAPH_API_URL"] || "/api/langgraph";
  return new Client({
    apiUrl,
  });
};

export const createThread = async () => {
  const client = createClient();
  return client.threads.create();
};

export const getThreadState = async (
  threadId: string,
): Promise<ThreadState<{ messages: LangChainMessage[] }>> => {
  const client = createClient();
  return client.threads.getState(threadId);
};

export const sendMessage = async (params: {
  threadId: string;
  messages: LangChainMessage[];
  agentId: string;
}) => {
  const client = createClient();

  return client.runs.stream(
    params.threadId,
    params.agentId!,
    {
      input: {
        messages: params.messages,
      },
      streamMode: "messages",
    },
  );
};


export function AgentRuntimeProvider({
  children,
  agentId,
}: Readonly<{
  children: React.ReactNode;
  agentId: string;
}>
) {
  const threadIdRef = useRef<string | undefined>();

  const runtime = useLangGraphRuntime({
    threadId: threadIdRef.current,
    stream: async (messages) => {
      if (!threadIdRef.current) {
        const { thread_id } = await createThread();
        threadIdRef.current = thread_id;
      }
      const threadId = threadIdRef.current;
      return sendMessage({ threadId, messages, agentId });
    },
    onSwitchToNewThread: async () => {
      const { thread_id } = await createThread();
      threadIdRef.current = thread_id;
    },
    onSwitchToThread: async (threadId) => {
      const state = await getThreadState(threadId);
      threadIdRef.current = threadId;
      return { messages: state.values.messages };
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}


