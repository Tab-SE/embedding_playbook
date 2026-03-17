"use client";

import { useRef, createContext, useContext } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useLangGraphRuntime, LangChainMessage } from "@assistant-ui/react-langgraph";
import { Client, ThreadState } from "@langchain/langgraph-sdk";
import { useProgress } from "@/components/Agent/ProgressContext";

const ChatActionsContext = createContext<{
  clearMessages: () => void;
} | null>(null);

export const useChatActions = () => {
  const context = useContext(ChatActionsContext);
  if (!context) {
    throw new Error("useChatActions must be used within LanggraphAgentRuntimeProvider");
  }
  return context;
};

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
  console.log('🔶 [SEND MESSAGE] threadId:', params.threadId);
  console.log('🔶 [SEND MESSAGE] agentId:', params.agentId);
  console.log('🔶 [SEND MESSAGE] messages count:', params.messages.length);
  console.log('🔶 [SEND MESSAGE] messages:', JSON.stringify(params.messages, null, 2));

  const client = createClient();

  console.log('🔶 [SEND MESSAGE] Calling client.runs.stream...');
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
      console.log('🟣 [LANGGRAPH PROVIDER] ========== STREAM CALLED ==========');
      console.log('🟣 [LANGGRAPH PROVIDER] Messages array length:', messages.length);
      console.log('🟣 [LANGGRAPH PROVIDER] All messages:', JSON.stringify(messages, null, 2));

      if (!threadIdRef.current) {
        const { thread_id } = await createThread();
        threadIdRef.current = thread_id;
        console.log('🟣 [LANGGRAPH PROVIDER] Created new thread:', thread_id);
      } else {
        console.log('🟣 [LANGGRAPH PROVIDER] Using existing thread:', threadIdRef.current);
      }
      const threadId = threadIdRef.current;

      // Filter out cancelled tool messages but keep human and ai messages for context
      const cleanMessages = messages.filter(msg => {
        if (msg.type === 'tool') {
          const isCancelled = typeof msg.content === 'string' && msg.content.includes('cancelled');
          console.log('🟣 [LANGGRAPH PROVIDER] Tool message - cancelled:', isCancelled);
          return !isCancelled;
        }
        return true;
      });

      console.log('🟣 [LANGGRAPH PROVIDER] Clean messages to send:', JSON.stringify(cleanMessages, null, 2));
      console.log('🟣 [LANGGRAPH PROVIDER] About to send to LangGraph API...');

      // Start tracking progress
      startStreaming();
      addProgressStep({
        icon: '🔌',
        message: 'Getting available tools...',
        timestamp: Date.now()
      });

      const stream = await sendMessage({ threadId, messages: cleanMessages, agentId });
      console.log('🟣 [LANGGRAPH PROVIDER] Stream received from LangGraph');

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

  const clearMessages = () => {
    // Use the runtime's built-in switchToNewThread method
    runtime.switchToNewThread();
  };

  return (
    <ChatActionsContext.Provider value={{ clearMessages }}>
      <AssistantRuntimeProvider runtime={runtime}>
        {children}
      </AssistantRuntimeProvider>
    </ChatActionsContext.Provider>
  );
}
