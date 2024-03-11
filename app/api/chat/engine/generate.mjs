/**
 * Loads data from a directory, converts it into LlamaIndex Document objects,
 * creates embeddings (vector representations) for these documents, and then indexes them using Pinecone.
 * @async
 * @function loadAndIndex
 * @returns {Promise<void>} A Promise that resolves when the loading, conversion, embedding creation, and indexing process is complete.
 */

import * as dotenv from "dotenv";
import {
  PineconeVectorStore,
  SimpleDirectoryReader,
  VectorStoreIndex,
  storageContextFromDefaults,
} from "llamaindex";
import { STORAGE_DIR, checkRequiredEnvVars } from "./shared.mjs";

// uses local development environment to generate data
dotenv.config({ path: '.env.development.local' });

async function loadAndIndex() {
  // load objects from storage and convert them into LlamaIndex Document objects
  const documents = await new SimpleDirectoryReader().loadData({
    directoryPath: STORAGE_DIR,
  });

  // create vector store
  const vectorStore = new PineconeVectorStore();

  // create index from all the Documents and store them in Pinecone
  console.log("Start creating embeddings...");
  const storageContext = await storageContextFromDefaults({ vectorStore });
  await VectorStoreIndex.fromDocuments(documents, { storageContext });
  console.log(
    "Successfully created embeddings and save to your Pinecone index.",
  );
}

(async () => {
  checkRequiredEnvVars();
  await loadAndIndex();
  console.log("Finished generating storage.");
})();
