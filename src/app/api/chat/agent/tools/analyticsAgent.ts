import { Client } from "@langchain/langgraph-sdk";
import { DynamicTool } from "langchain/tools";
import { z } from "zod";

// Define a type for the stream chunk
interface StreamChunk {
  event: string;
  data: any;
}

const client = new Client({
  apiUrl: process.env.LANGGRAPH_API_URL || 'http://localhost:8123'
});

console.log('client', client)

export const analyticsAgent = new DynamicTool({
  name: "analytics_agent",
  description: `AI Analyst performing ad-hoc analysis. Prioritize this tool for analytics and data queries.
  Describe the user query thoroughly in natural language. You can ask for relative dates such as last week,
  3 days ago, current year, previous 3 quarters or specific dates like March 12 1980

  Data Fetching:
  User: show me the total sales, profits and average discount by region and category
  Input: 'the user wants to see total sales, profits and average discount broken down by region and category

  User: what were conects and disconnects for jan 15th 2025?
  Input: 'the user wants to see connects & disconnects for January 15 2025'

  Analysis:
  User: why is the home office category not doing well?
  Agent: 'can you clarify what you mean by not doing well? does that mean with regards to sales or profits?'
  User: yes this category is the least profitable
  Input: 'the user wants to understand why the home office category is not profitable, look at sales, orders and other data to understand the issue'`,
  func: async (input) => {
    try {
      const streamResponse = client.runs.stream(
        null, // threadId
        "a585b681-26dd-5c0a-b77f-47a0e69b1bbd", // assistantId
        {
          input: {
            messages: [{ role: "assistant", content: input }]
          }
        }
      );

      let chunks: StreamChunk[] = [];
      for await (const chunk of streamResponse) {
        chunks.push(chunk);
      }

      // Process chunks in reverse order to find the last non-empty AI message
      for (let i = chunks.length - 1; i >= 0; i--) {
        const chunk = chunks[i];
        if (chunk.event === 'values' && chunk.data && chunk.data.messages) {
          for (let j = chunk.data.messages.length - 1; j >= 0; j--) {
            const message = chunk.data.messages[j];
            if (message.type === 'ai' && message.content && message.content.trim() !== '') {
              return message.content;
            }
          }
        }
      }

      return "No valid response found from the Analytics Agent.";
    } catch (error) {
      console.error('Error communicating with Analytics Agent:', error);
      return 'Failed to communicate with Analytics Agent';
    }
  }
});
