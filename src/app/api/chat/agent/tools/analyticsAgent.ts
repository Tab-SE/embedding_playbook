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

export const analyticsAgent = new DynamicTool({
  name: "analytics_agent",
  description: `Use this tool to answer any questions about pharmacy data, analytics, or metrics.
The input to this tool MUST be a single string containing the user's question in plain, simple English.
DO NOT create a JSON object or write any code. Just pass the user's question exactly as they asked it.

Example:
User asks: "show me all medications expiring in the next 30 days that have a value over $1,000"
Tool input: "show me all medications expiring in the next 30 days that have a value over $1,000"`,
  func: async (input) => {
    try {
      const streamResponse = client.runs.stream(
        null, // threadId
        "a585b681-26dd-5c0a-b77f-47a0e69b1bbd", // assistantId
        {
          input: {
            // Corrected role to 'user' for passing input
            messages: [{ role: "user", content: input }]
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
