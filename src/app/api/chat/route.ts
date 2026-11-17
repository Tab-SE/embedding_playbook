import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, LangChainAdapter } from "ai";
import { getToken } from "next-auth/jwt";

import { bootstrapAgent } from "./agent";
import { McpAuthError } from "./agent/mcp";
import { getSiteAiFlags, isSiteAiOn } from "@/libs/server/siteAi";

// Demos whose chat assistant is only allowed while AI in Tableau is on for the site.
// Mirrors `ai_chat_requires_site_ai` in the demo config (which hides the UI).
const DEMOS_REQUIRING_SITE_AI = new Set(["pinnacle"]);
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

// Logs every MCP tool call and every model call with its duration, so a stalled
// chat shows in the Heroku logs exactly which step was slow or failed. Logging
// only; it does not change what the agent does. Tool inputs are truncated.
const agentTimingLogger = () => {
  const t0 = Date.now();
  const started = new Map<string, { label: string; at: number }>();
  const sec = (ms: number) => (ms / 1000).toFixed(1) + "s";
  const begin = (runId: string, label: string) => {
    started.set(runId, { label, at: Date.now() });
    console.log(`⏱️ [AGENT +${sec(Date.now() - t0)}] start ${label}`);
  };
  const end = (runId: string, outcome: string) => {
    const s = started.get(runId);
    if (!s) return;
    started.delete(runId);
    console.log(`⏱️ [AGENT +${sec(Date.now() - t0)}] ${outcome} ${s.label} took ${sec(Date.now() - s.at)}`);
  };
  return {
    handleToolStart(tool: any, input: string, runId: string, _p?: string, _t?: string[], _m?: unknown, runName?: string) {
      const name = runName ?? tool?.name ?? tool?.id?.at?.(-1) ?? "tool";
      begin(runId, `tool=${name} input=${String(input).slice(0, 300)}`);
    },
    handleToolEnd(output: any, runId: string) {
      const text = typeof output === "string" ? output : output?.content ?? JSON.stringify(output);
      end(runId, `done (${String(text).length} chars)`);
    },
    handleToolError(err: Error, runId: string) {
      end(runId, `ERROR ${err?.message?.slice(0, 300)} —`);
    },
    handleChatModelStart(_llm: any, _messages: unknown, runId: string) {
      begin(runId, "model");
    },
    handleLLMEnd(_output: unknown, runId: string) {
      end(runId, "done");
    },
    handleLLMError(err: Error, runId: string) {
      end(runId, `ERROR ${err?.message?.slice(0, 300)} —`);
    },
  };
};

const keepAliveDataStreamResponse = (dataStream: ReadableStream<Uint8Array>) => {
  const encoder = new TextEncoder();
  const reader = dataStream.getReader();
  let timer: ReturnType<typeof setInterval> | undefined;
  let lastSent = Date.now();
  // Set once the stream is closed by us or cancelled by the client (browser
  // hung up). After that, enqueue()/close() throw ERR_INVALID_STATE, so every
  // write goes through these guards.
  let finished = false;

  const finish = (controller: ReadableStreamDefaultController<Uint8Array>) => {
    if (finished) return;
    finished = true;
    clearInterval(timer);
    controller.close();
  };
  const send = (controller: ReadableStreamDefaultController<Uint8Array>, chunk: Uint8Array) => {
    if (finished) return;
    controller.enqueue(chunk);
    lastSent = Date.now();
  };

  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      send(controller, encoder.encode("\n"));
      timer = setInterval(() => {
        if (Date.now() - lastSent >= KEEPALIVE_MS) send(controller, encoder.encode("\n"));
      }, 5_000);
    },
    async pull(controller) {
      let chunk: ReadableStreamReadResult<Uint8Array>;
      try {
        chunk = await reader.read();
      } catch (e: any) {
        if (finished) return;
        console.error('🔴 [CHAT ROUTE STREAM ERROR]', e);
        const message = e?.message ?? 'The agent failed while answering.';
        send(controller, encoder.encode(`3:${JSON.stringify(message)}\n`));
        finish(controller);
        return;
      }
      if (chunk.done) {
        finish(controller);
        return;
      }
      send(controller, chunk.value);
    },
    cancel(reason) {
      finished = true;
      clearInterval(timer);
      console.warn('🟠 [CHAT ROUTE] Client disconnected before the answer finished');
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

    if (DEMOS_REQUIRING_SITE_AI.has(demo)) {
      let aiOn = false;
      try {
        aiOn = isSiteAiOn(await getSiteAiFlags(token.email as string));
      } catch (err: any) {
        console.error('🔴 [CHAT ROUTE] site AI check failed:', err?.message);
      }
      if (!aiOn) {
        console.log(`🔵 [CHAT ROUTE] AI in Tableau is off for the site; chat disabled for demo=${demo}`);
        return NextResponse.json({ error: 'AI is turned off for this Tableau site.' }, { status: 403 });
      }
    }

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
        {
          streamMode: ["updates", "custom"],
          version: "v2",
          recursionLimit: 75,
          callbacks: [agentTimingLogger()],
        },
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
