import { getEmbeddings } from "../../lib/pinecone/embeddings";
import { getPineconeClient } from "./pinecone";
import { convertToAscii } from "../../lib/pinecone/utils";

// Function to query Pinecone for the most relevant matches based on embeddings
export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = getPineconeClient();
    const pineconeIndex = await client.index("clearhealth");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    const queryResult = await namespace.query({
      topK: 8, // Return top 8 matches
      vector: embeddings,
      includeMetadata: true, // Include metadata in the result
    });

    return queryResult.matches || [];
  } catch (error) {
    console.log("Error querying embeddings", error);
    throw error;
  }
}

// Function to retrieve relevant context from Pinecone based on a query
export async function getContext(query: string, fileKey: string) {
  if(!fileKey){
    return "No filekey accesible";
  }
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  // Filter out low-scoring matches, but allow a small fallback so we always return something
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.35
  );

  const docsToUse =
    qualifyingDocs.length > 0 ? qualifyingDocs : matches?.slice(0, 3) || [];

  // Extract the text from the metadata of qualifying matches
  let docs = docsToUse.map((match) => {
    const meta = match.metadata as Metadata;
    const pageLabel = meta.pageNumber ? `Page ${meta.pageNumber}: ` : "";
    return `${pageLabel}${meta.text}`;
  });

  // Return the concatenated relevant text
  return docs.join("\n").substring(0, 3000); // Limit to 3000 characters
}
