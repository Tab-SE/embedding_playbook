import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, LangChainAdapter } from "ai";
import { getToken } from "next-auth/jwt";

import { bootstrapAgent } from "./agent";
import { convertVercelMessageToLangChainMessage, convertLangChainMessageToVercelMessage } from "./utils";

export const runtime = "edge";


/**
 * This handler initializes and calls a tool caling ReAct agent.
 * See the docs for more information:
 *
 * https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/
 * https://js.langchain.com/docs/use_cases/question_answering/conversational_retrieval_agents
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('🔵 [CHAT ROUTE] ============ NEW REQUEST ============');
    console.log('🔵 [CHAT ROUTE] Received messages count:', body.messages?.length);
    console.log('🔵 [CHAT ROUTE] Messages:', JSON.stringify(body.messages, null, 2));

    // Get user session to determine demo context
    const token = await getToken({ req });
    const demo = (token?.demo as string) || 'documentation';
    console.log('🔵 [CHAT ROUTE] Demo:', demo);

    /**
     * We represent intermediate steps as system messages for display purposes,
     * but don't want them in the chat history.
     */
    const messages = (body.messages ?? [])
      .filter(
        (message: VercelChatMessage) =>
          message.role === "user" || message.role === "assistant",
      )
      .map(convertVercelMessageToLangChainMessage);
    const returnIntermediateSteps = body.show_intermediate_steps;

    console.log('🔵 [CHAT ROUTE] Filtered messages count:', messages.length);
    console.log('🔵 [CHAT ROUTE] Creating agent for demo:', demo);

    const agent = await bootstrapAgent(demo);
    console.log('🔵 [CHAT ROUTE] Agent created successfully');

    if (!returnIntermediateSteps) {
      /**
       * Stream back all generated tokens and steps from their runs.
       *
       * We do some filtering of the generated events and only stream back
       * the final response as a string.
       *
       * For this specific type of tool calling ReAct agents with OpenAI, we can tell when
       * the agent is ready to stream back final output when it no longer calls
       * a tool and instead streams back content.
       *
       * See: https://langchain-ai.github.io/langgraphjs/how-tos/stream-tokens/
       */
      console.log('🔵 [CHAT ROUTE] Starting agent stream...');
      const eventStream = await agent.streamEvents(
        {
          messages,
        },
        {
          streamMode: ["updates", "custom"],
          version: "v2"
        },
      );

      console.log('🔵 [CHAT ROUTE] Event stream created, returning response');
      return LangChainAdapter.toDataStreamResponse(eventStream);

    } else {
      /**
       * We could also pick intermediate steps out from `streamEvents` chunks, but
       * they are generated as JSON objects, so streaming and displaying them with
       * the AI SDK is more complicated.
       */
      console.log('🔵 [CHAT ROUTE] Invoking agent with intermediate steps...');
      const result = await agent.invoke({ messages });
      console.log('🔵 [CHAT ROUTE] Agent invoke complete');
      return NextResponse.json(
        {
          messages: result.messages.map(convertLangChainMessageToVercelMessage),
        },
        { status: 200 },
      );
    }
  } catch (e: any) {
    console.error('🔴 [CHAT ROUTE ERROR]', e);
    console.error('🔴 [CHAT ROUTE ERROR] Stack:', e.stack);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
