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

  // Pinecone initialization
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
  });

  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  const vectorstore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  const retriever = vectorstore.asRetriever();

  /**
   * Wrap the retriever in a tool to present it to the agent in a
   * usable form.
   */
  const tool = createRetrieverTool(retriever, {
    name: "tableau_metrics",
    description: `Query a vector database for relevant information to the user query regarding
    how their metrics are performing. This catalog contains machine learning insights used to
    provide up to date and reliable data regarding all kinds of aspects related to the user's
    subscribed metrics.

    Prioritize using this tool if the user mentions metrics, KPIs, OKRs or similar.
    Make few and simple queries that reflect the user's question unless you are instructed
    to write thorough summaries, reports or analysis requiring multiple complex queries.

    This tool cannot provide precise data values such as the value of a metric on a given date.
    For that you should use a data source query tool to fetch the information directly`,
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
