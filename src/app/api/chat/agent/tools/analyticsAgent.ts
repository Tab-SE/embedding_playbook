import { Client } from "@langchain/langgraph-sdk";
import { DynamicTool } from "langchain/tools";
import { z } from "zod";

// Define a type for the stream chunk
interface StreamChunk {
  event: string;
  data: any;
}

const client = new Client({
  apiUrl: process.env.ANALYTICS_AGENT_URL || 'http://localhost:8123'
});

export const analyticsAgent = new DynamicTool({
  name: "analytics_agent",
  description: `Command an Analytics Agent to perform ad-hoc analysis. Use this tool if neither metrics
  nor workbooks provide answers to the query.

  When users want specific fields of data, filters, sorting and calculations by being explicit and
  straightforward then your input should be verbatim

  When users ask vague or more complex questions suggesting that you must identify "why's" or relationships
  between data this requires additional fields to help draw conclusions

  Examples:
  User: show me the total sales, profits and average discount by region and category
  Input: 'total sales, profits and average discount by region and category

  User: why is the home office category not doing well?
  Input: 'home office category sales, profit, orders by month of the year for the last 10 years. Include additional
  fields that can help answer "why is the home office category not doing well?"'`,
  func: async (input) => {
    try {
      const streamResponse = client.runs.stream(
        null,
        "fe096781-5601-53d2-b2f6-0d3403f7e9ca",
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
