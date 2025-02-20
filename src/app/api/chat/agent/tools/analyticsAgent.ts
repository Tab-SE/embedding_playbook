import { Client } from "@langchain/langgraph-sdk";
import { DynamicTool } from "langchain/tools";

const client = new Client({
  apiUrl: process.env.ANALYTICS_AGENT_URL || 'http://localhost:8123'
});

export const analyticsAgent = new DynamicTool({
  name: "analytics_agent",
  description: "Communicate with the Analytics Agent for ad-hoc analysis.",
  func: async (input) => {
    try {
      const streamResponse = client.runs.stream(
        null, // Threadless run
        "cra", // Assuming "agent" is the name of your assistant defined in langgraph.json
        {
          input: {
            messages: [{ role: "assistant", content: input }]
          }
        }
      );

      let fullResponse = '';
      for await (const chunk of streamResponse) {
        if (chunk.event === "on_chain_stream") {
          const update = chunk.data?.updates;
          if (update) {
            fullResponse += JSON.stringify(update);
            console.log("Received update from the Analytics Agent:", update);
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('Error communicating with Analytics Agent:', error);
      return 'Failed to communicate with Analytics Agent';
    }
  }
});
