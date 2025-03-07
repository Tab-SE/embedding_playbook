import { SystemMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

import { selectModel, ModelProvider } from "./models";
import { AGENT_SYSTEM_TEMPLATE } from "./prompt";
import { tableauMetrics, tableauAnalytics, tableauDatasources, tableauLiterature, analyticsAgent } from "./tools";


export const bootstrapAgent = async () => {
  // default model is arbitrarily openai but more models can be supported in the models.ts file
  const chatModel = selectModel(
    process.env.MODEL_PROVIDER as ModelProvider,
    process.env.AGENT_MODEL!,
    0.2
  );

  /**
   * Use a prebuilt LangGraph agent.
   */
  const agent = await createReactAgent({
    name: 'Customer Service Agent',
    llm: chatModel,
    tools: [ tableauMetrics, tableauAnalytics, tableauDatasources, tableauLiterature, analyticsAgent ],
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
