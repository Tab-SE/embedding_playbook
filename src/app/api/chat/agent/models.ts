import { ChatOpenAI, AzureChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

import { OpenAIEmbeddings, AzureOpenAIEmbeddings } from "@langchain/openai";
import { Embeddings } from "@langchain/core/embeddings";


export type ModelProvider = "openai" | "azure";

export type EmbeddingProvider = "openai" | "azure";


export function selectModel(provider: ModelProvider = "openai", modelName: string, temperature: number = 0.2): BaseChatModel {
  switch (provider) {
    case "azure":
      return new AzureChatOpenAI({
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
        azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
        modelName: modelName,
        temperature: temperature,
      });
    case "openai":
    default:
      return new ChatOpenAI({
        modelName: modelName,
        temperature: temperature,
        apiKey: process.env.OPENAI_API_KEY
      });
  }
}

export function selectEmbeddings(provider: EmbeddingProvider = "openai", modelName: string): Embeddings {
  switch (provider) {
    case "azure":
      return new AzureOpenAIEmbeddings({
        verbose: true,
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        deploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
        openAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
        modelName: modelName
      });
    case "openai":
    default:
      return new OpenAIEmbeddings({
        modelName: modelName,
        apiKey: process.env.OPENAI_API_KEY
      });
  }
}
