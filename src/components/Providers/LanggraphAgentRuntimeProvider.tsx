"use client";

import { useRef } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useLangGraphRuntime, LangChainMessage } from "@assistant-ui/react-langgraph";
import { Client, ThreadState } from "@langchain/langgraph-sdk";
import { useProgress } from "@/components/Agent/ProgressContext";

const createClient = () => {
  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}`
    : "http://localhost:3000"; // Default for server-side or if window is not available
  const apiUrl = `${baseUrl}/api/langgraph`;

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

// Wrap stream to extract progress information
async function* wrapStreamWithProgress(
  stream: any,
  addProgressStep: (step: any) => void,
  stopStreaming: () => void,
  clearProgress: () => void
) {
  let chunkCount = 0;
  let iterationCount = 0;
  let hasStartedAnalysis = false;

  try {
    for await (const chunk of stream) {
      chunkCount++;

      // Extract progress info from chunk
      if (chunk && typeof chunk === 'object') {
        // First meaningful chunk - starting analysis
        if (chunkCount === 3 && !hasStartedAnalysis) {
          hasStartedAnalysis = true;
          addProgressStep({
            icon: '🚀',
            message: 'Starting analysis...',
            timestamp: Date.now()
          });
        }

        // Every 50 chunks, show progress
        if (chunkCount > 10 && chunkCount % 50 === 0) {
          iterationCount++;
          addProgressStep({
            icon: '🔄',
            message: `Analyzing and planning...`,
            iteration: Math.min(iterationCount, 25),
            maxIterations: 30,
            timestamp: Date.now()
          });
        }

        // Midpoint update
        if (chunkCount === 100) {
          addProgressStep({
            icon: '💭',
            message: 'Processing data and generating insights...',
            timestamp: Date.now()
          });
        }

        // Near completion
        if (chunkCount === 200) {
          addProgressStep({
            icon: '✨',
            message: 'Finalizing response...',
            timestamp: Date.now()
          });
        }
      }

      yield chunk;
    }

    // Stream completed
    addProgressStep({
      icon: '✅',
      message: 'Analysis complete!',
      timestamp: Date.now()
    });

    // Keep progress visible for 1 second before clearing
    setTimeout(() => {
      stopStreaming();
    }, 1000);

  } catch (error) {
    console.error('[Stream Progress Error]', error);
    addProgressStep({
      icon: '❌',
      message: 'Error during analysis',
      timestamp: Date.now()
    });
    stopStreaming();
    throw error;
  }
}

export function LanggraphAgentRuntimeProvider({
  children,
  agentId,
}: Readonly<{
  children: React.ReactNode;
  agentId: string;
}>) {
  const threadIdRef = useRef<string | undefined>();
  const { addProgressStep, startStreaming, stopStreaming, clearProgress } = useProgress();

  const runtime = useLangGraphRuntime({
    threadId: threadIdRef.current,
    stream: async (messages) => {
      if (!threadIdRef.current) {
        const { thread_id } = await createThread();
        threadIdRef.current = thread_id;
        console.log('[THREAD] Created new thread:', thread_id);
      } else {
        console.log('[THREAD] Using existing thread:', threadIdRef.current);
      }
      const threadId = threadIdRef.current;
      console.log('[THREAD] Sending message to thread:', threadId, 'Message count:', messages.length);

      // Start tracking progress
      startStreaming();
      addProgressStep({
        icon: '🔌',
        message: 'Getting available tools...',
        timestamp: Date.now()
      });

      const stream = await sendMessage({ threadId, messages, agentId });

      // Wrap stream to track progress
      return wrapStreamWithProgress(stream, addProgressStep, stopStreaming, clearProgress);
    },
    onSwitchToNewThread: async () => {
      const { thread_id } = await createThread();
      threadIdRef.current = thread_id;
    },
    onSwitchToThread: async (threadId) => {
      const state = await getThreadState(threadId);
      threadIdRef.current = threadId;
      return {
        messages: state.values.messages.filter(
          msg => msg.type === 'ai' || msg.type === 'human'
        )
      };
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
