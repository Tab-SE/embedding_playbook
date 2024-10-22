// import { openai } from "@ai-sdk/openai";
// import { createEdgeRuntimeAPI } from "@assistant-ui/react/edge";

// const agentModel = process.env.AGENT_MODEL || 'gpt-4o-mini';

// export const { POST } = createEdgeRuntimeAPI({
//   model: openai(agentModel),
// });


import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";

export const maxDuration = 30;

const agentModel = process.env.AGENT_MODEL || 'gpt-4o-mini';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai(agentModel),
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
