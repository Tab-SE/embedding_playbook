import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, LangChainAdapter } from "ai";
import { getToken } from "next-auth/jwt";

import { bootstrapAgent } from "./agent";
import { McpAuthError } from "./agent/mcp";
import { convertVercelMessageToLangChainMessage, convertLangChainMessageToVercelMessage } from "./utils";

// Use Node runtime — @langchain/mcp-adapters depends on Node-only modules.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('🔵 [CHAT ROUTE] ============ NEW REQUEST ============');
    console.log('🔵 [CHAT ROUTE] Received messages count:', body.messages?.length);

    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: '401: Unauthorized' }, { status: 401 });
    }
    const demo = (token?.demo as string) || 'documentation';
    console.log('🔵 [CHAT ROUTE] Demo:', demo);

    const messages = (body.messages ?? [])
      .filter(
        (message: VercelChatMessage) =>
          message.role === "user" || message.role === "assistant",
      )
      .map(convertVercelMessageToLangChainMessage);
    const returnIntermediateSteps = body.show_intermediate_steps;

    console.log('🔵 [CHAT ROUTE] Filtered messages count:', messages.length);
    console.log('🔵 [CHAT ROUTE] Building agent for demo:', demo);

    const agent = await bootstrapAgent(demo, token);
    console.log('🔵 [CHAT ROUTE] Agent ready');

    if (!returnIntermediateSteps) {
      console.log('🔵 [CHAT ROUTE] Starting agent stream...');
      // recursionLimit raised from default 25 — MCP exposes a dozen+ tools and
      // a multi-step data Q&A often takes >25 model<->tool round trips.
      const eventStream = await agent.streamEvents(
        { messages },
        { streamMode: ["updates", "custom"], version: "v2", recursionLimit: 75 },
      );
      console.log('🔵 [CHAT ROUTE] Event stream created, returning response');
      return LangChainAdapter.toDataStreamResponse(eventStream);
    } else {
      console.log('🔵 [CHAT ROUTE] Invoking agent with intermediate steps...');
      const result = await agent.invoke({ messages }, { recursionLimit: 75 });
      console.log('🔵 [CHAT ROUTE] Agent invoke complete');
      return NextResponse.json(
        { messages: result.messages.map(convertLangChainMessageToVercelMessage) },
        { status: 200 },
      );
    }
  } catch (e: any) {
    if (e instanceof McpAuthError) {
      console.error('🔴 [CHAT ROUTE] MCP auth error:', e.message);
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error('🔴 [CHAT ROUTE ERROR]', e);
    console.error('🔴 [CHAT ROUTE ERROR] Stack:', e.stack);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
