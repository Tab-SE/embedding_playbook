import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

import { OpenAIEmbeddings } from "@langchain/openai";
import { createRetrieverTool } from "langchain/tools/retriever";

// initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

const embeddings = new OpenAIEmbeddings({
  model: process.env.EMBEDDING_MODEL!,
});

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

const vectorstore = await PineconeStore.fromExistingIndex(
  embeddings,
  {
    pineconeIndex,
    maxConcurrency: 5,
    textKey: "_node_content",
  }
);

const retriever = vectorstore.asRetriever({
  verbose: true,
  k: 6,
});

/**
 * Wrap the retriever in a tool to present it to the agent in a
 * usable form.
 */
export const tableauMetrics = createRetrieverTool(retriever, {
  name: "tableau_metrics",
  description: `Contains continously updated machine learning insights generated from data
  describing user subscribed metrics. Use this tool if the user mentions metrics, KPIs, OKRs
  or similar. Make thorough queries that request relevant context in addition to the user's
  question so you may synthesize more valuable answers

  To scope a metric, ask about related dimensions or fields, descriptions, what data drives
  a metric, unexpected or unusual changes, trends, sentiment, current values, previous values,
  measurement dates, period over period change, top/bottom contributors, top/bottom drivers,
  and top/bottom detractors

  This tool cannot provide precise data values such as the value of a metric on a given date.
  For that you should use a data source query tool to fetch the information directly`,
});


export const initializeMetricsTool = async (index, name, description, concurrency) => {
  const pineconeIndex = pinecone.Index(index!);

  const vectorstore = await PineconeStore.fromExistingIndex(
    embeddings,
    {
      pineconeIndex,
      maxConcurrency: concurrency || 5,
    }
  );

  const retriever = vectorstore.asRetriever();

  /**
   * Wrap the retriever in a tool to present it to the agent in a
   * usable form.
   */
  return createRetrieverTool(retriever, {
    name: name,
    description: description,
  });
}
