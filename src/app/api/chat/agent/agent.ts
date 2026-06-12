import { SystemMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import type { JWT } from "next-auth/jwt";

import { selectModel, ModelProvider } from "./models";
import { AGENT_SYSTEM_TEMPLATE } from "./prompt";
import { getTableauMcpTools } from "./mcp";

// Build a ReAct agent in-process with MCP tools backed by the Tableau MCP server.
//
// Per-demo datasource pinning: when a demo has DATASOURCE_NAME_<DEMO> or
// DATASOURCE_LUID_<DEMO> set in env, we append it to the system prompt so the
// agent goes straight to the right datasource instead of roaming the whole
// site. Mirrors the pattern from the old tableau_langchain Python deployment.
export const bootstrapAgent = async (demo: string, token: JWT) => {
  const chatModel = selectModel(
    process.env.MODEL_PROVIDER as ModelProvider,
    process.env.AGENT_MODEL!,
    0.2,
  );

  const { tools, datasource } = await getTableauMcpTools(demo, token);

  const datasourcePinning =
    datasource.name || datasource.luid
      ? `\n\n# This demo's datasource\n` +
        `For the "${demo}" demo you must use this Tableau datasource — do not query others:\n` +
        (datasource.name ? `- name: "${datasource.name}"\n` : "") +
        (datasource.luid ? `- luid: ${datasource.luid}\n` : "") +
        `\nFirst tool call should be \`list-datasources\` with ` +
        (datasource.name
          ? `\`filter: "name:eq:${datasource.name}"\` so you get exactly this datasource's LUID, then use it for query-datasource.`
          : `the LUID above passed directly to query-datasource (skip discovery — you already know the LUID).`)
      : "";

  const agent = createReactAgent({
    llm: chatModel,
    tools,
    messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE + datasourcePinning),
  });

  return agent;
};
