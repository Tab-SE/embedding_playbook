import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

import { SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createRetrieverTool } from "langchain/tools/retriever";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

import { AGENT_SYSTEM_TEMPLATE } from "./prompt";
import { initializeMetricsTool, tableauMetrics } from "./tools";


export const bootstrapAgent = async () => {
  const chatModel = new ChatOpenAI({
    model: process.env.AGENT_MODEL!,
    temperature: 0.2,
  });

  /**
   * Use a prebuilt LangGraph agent.
   */
  const agent = await createReactAgent({
    llm: chatModel,
    tools: [ tableauMetrics ],
    /**
     * Modify the stock prompt in the prebuilt agent. See docs
     * for how to customize your agent:
     *
     * https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/
     */
    messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
  });

  return agent;
}
