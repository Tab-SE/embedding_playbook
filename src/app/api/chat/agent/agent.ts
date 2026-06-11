import { SystemMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import type { JWT } from "next-auth/jwt";

import { selectModel, ModelProvider } from "./models";
import { AGENT_SYSTEM_TEMPLATE } from "./prompt";
import { getTableauMcpTools } from "./mcp";

// Build a ReAct agent in-process with MCP tools backed by the Tableau MCP server.
// Auth uses passthrough: the user's REST credentials token (from NextAuth) is
// forwarded as `X-Tableau-Auth` on every MCP HTTP request, so each user's
// Tableau identity / RLS / UAF is preserved end-to-end.
export const bootstrapAgent = async (demo: string, token: JWT) => {
  const chatModel = selectModel(
    process.env.MODEL_PROVIDER as ModelProvider,
    process.env.AGENT_MODEL!,
    0.2,
  );

  const { tools } = await getTableauMcpTools(demo, token);

  const agent = createReactAgent({
    llm: chatModel,
    tools,
    messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
  });

  return agent;
};
