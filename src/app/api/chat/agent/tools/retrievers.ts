import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

import { createRetrieverTool } from "langchain/tools/retriever";

import { selectEmbeddings, EmbeddingProvider } from "../models";

// Export a function that creates the tools.  This will be called in the API route.
export const initializeRetrievers =  async () => {
  // initialize Pinecone client
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
  });

  const embeddings = selectEmbeddings(
    process.env.MODEL_PROVIDER as EmbeddingProvider,
    process.env.EMBEDDING_MODEL!
  );

  const makeRetriever = async (index, concurrency = 5) => {
    const pineconeIndex = pinecone.Index(index!);

    const vectorstore = await PineconeStore.fromExistingIndex(
      embeddings,
      {
        pineconeIndex,
        maxConcurrency: concurrency,
        textKey: "_node_content",
      }
    );

    const retriever = vectorstore.asRetriever({
      k: 6,
      verbose: false
    });

    return retriever;
  }

  const metricsRetriever = await makeRetriever(process.env.METRICS_INDEX, 5);
  const metricsTool = createRetrieverTool(metricsRetriever, {
    name: 'tableau_metrics',
    description: `Returns ML insights on user-subscribed metrics.
    Use for queries about metrics, KPIs, or OKRs.

    Make thorough queries for relevant context.
    Use "metrics update" for a summary. For detailed metric info, ask about:
    - dimensions
    - data
    - descriptions
    - drivers
    - unusual changes
    - trends
    - sentiment
    - current & previous values
    - period over period change
    - contributors
    - detractors

    NOT for precise data values. Use a data source query tool for specific values.
    NOT for fetching data values on specific dates

    Examples:
    User: give me an update on my KPIs
    Input: 'update on all KPIs, trends, sentiment"

    User: what is going on with sales?
    Input: 'sales trend, data driving sales, unusual changes, contributors, drivers and detractors'

    User: what is the value of sales in 2024?
    -> wrong usage of this tool, not for specific values`,
  });

  const workbooksRetriever = await makeRetriever(process.env.WORKBOOKS_INDEX, 5);
  const workbooksTool = createRetrieverTool(workbooksRetriever, {
    name: 'tableau_workbooks',
    description: `Returns the most relevant or useful Tableau workbooks containing dashboards and charts to answer
    the user's needs. Use this tool when the user either explicitly is looking for a chart or dashboard
    or when the metrics tool did not provide useful results, thus using the fallback analytics tool option.
    Workbooks contain a single description but they contain multiple individual charts. Use this information
    and the chart or sheet names to recommend the best visual analytics resource to explore. Include additional
    context to your inputs besides the verbatim user query so that you can pull in as much useful context as possible

    Examples:
    User: I want to know more about discounts
    Input: 'discounts, pricing, sales strategy, discount tier'`,
  });

  const datasourcesRetriever = await makeRetriever(process.env.DATASOURCES_INDEX, 5);
  const datasourcesTool = createRetrieverTool(datasourcesRetriever, {
    name: 'tableau_datasources',
    description: `Returns the most relevant or useful Tableau data sources that provide information and semantics to metrics and
    analytics. Use this tool when the user either explicitly is looking to interact with a data source or when other
    tools (metrics/analytics/analyst) did not provide useful results, thus having the user to interact with the data
    directly. Include additional context to your inputs besides the verbatim user query so that you can pull in as much
    useful context as possible

    Examples:
    User: I want to know more about discounts
    Input: 'discounts, pricing, sales strategy, discount tiers'`,
  });

  const literatureRetriever = await makeRetriever(process.env.LITERATURE_INDEX, 5);
  const literatureTool = createRetrieverTool(literatureRetriever, {
    name: 'tableau_literature',
    description: `A knowledge base collecting whitepapers, help articles, technical documentation and similar resources describing
    how Tableau's developer platform functions. The goal is to empower the community to build their own analytical apps
    powered by Tableau. Use this tool when the customer is asking a Tableau, software or analytics question since you operate
    within the context of a Tableau developer portal. Use this tool in particular if users have questions about embedded
    analytics and embedded AI. This tool provides sample embed code and best practices on how to use APIs. This tool also describes
    this Tableau developer portal in case you must describe it. Include additional context to your inputs besides the verbatim
    user query so that you can pull in as much  useful context as possible

    Examples:
    User: What is row-level security?
    Input: 'what is row-level security? security, filtering, row-level, permissions, heirarchies'`,
  });

  return {
    metricsTool,
    workbooksTool,
    datasourcesTool,
    literatureTool,
  };
}
