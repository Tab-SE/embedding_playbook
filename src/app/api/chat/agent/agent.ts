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
        `You MUST use ONLY this datasource — never query any other datasource regardless of what \`list-datasources\` returns:\n` +
        (datasource.name ? `- name: "${datasource.name}"\n` : "") +
        (datasource.luid ? `- luid: ${datasource.luid}\n` : "") +
        `\nCall \`list-datasources\` first to get this datasource's LUID. ` +
        (datasource.name
          ? `Find the entry whose name is exactly "${datasource.name}" and use its LUID. ` +
            `If no datasource with that exact name appears, tell the user it is not available — do NOT fall back to any other datasource.`
          : `Use the LUID above directly.`) +
        ` Then ALWAYS call the metadata tool for that LUID and build your query only from the exact field ` +
        `names it returns before calling query-datasource. ` +
        `Never query "Sales Commission" or any other datasource — only "${datasource.name || datasource.luid}".`
      : "";

  const agent = createReactAgent({
    llm: chatModel,
    tools,
    messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE + datasourcePinning),
  });

  return agent;
};
