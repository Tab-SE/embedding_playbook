import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, LangChainAdapter } from "ai";
import { getToken } from "next-auth/jwt";

import { bootstrapAgent } from "./agent";
import { McpAuthError } from "./agent/mcp";
import { convertVercelMessageToLangChainMessage, convertLangChainMessageToVercelMessage } from "./utils";

// Use Node runtime — @langchain/mcp-adapters depends on Node-only modules.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Heroku's router returns H12 (503) if no response byte arrives within 30s,
// then requires at least one byte every 55s. The agent emits no text while it
// runs MCP tool calls, so long questions blew past 30s with zero bytes sent.
//
// This wraps the AI SDK data stream and:
//   - sends a bare "\n" immediately and every 15s of silence. The AI SDK client
//     drops empty lines before parsing (processDataStream filters line !== ""),
//     so these never reach the UI.
//   - converts a mid-stream failure into an AI SDK error part ("3:...") so the
//     chat shows the real error instead of the connection being dropped.
const KEEPALIVE_MS = 15_000;

const keepAliveDataStreamResponse = (dataStream: ReadableStream<Uint8Array>) => {
  const encoder = new TextEncoder();
  const reader = dataStream.getReader();
  let timer: ReturnType<typeof setInterval> | undefined;
  let lastSent = Date.now();

  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode("\n"));
      timer = setInterval(() => {
        if (Date.now() - lastSent >= KEEPALIVE_MS) {
          controller.enqueue(encoder.encode("\n"));
          lastSent = Date.now();
        }
      }, 5_000);
    },
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          clearInterval(timer);
          controller.close();
          return;
        }
        controller.enqueue(value);
        lastSent = Date.now();
      } catch (e: any) {
        clearInterval(timer);
        console.error('🔴 [CHAT ROUTE STREAM ERROR]', e);
        const message = e?.message ?? 'The agent failed while answering.';
        controller.enqueue(encoder.encode(`3:${JSON.stringify(message)}\n`));
        controller.close();
      }
    },
    cancel(reason) {
      clearInterval(timer);
      return reader.cancel(reason);
    },
  });

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Vercel-AI-Data-Stream": "v1",
    },
  });
};


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
      return keepAliveDataStreamResponse(LangChainAdapter.toDataStream(eventStream));
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
