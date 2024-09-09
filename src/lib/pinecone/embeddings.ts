import { OpenAIApi, Configuration } from "openai-edge";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export const getEmbeddings = async (text) => {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    const result = await response.json();
    return result.data[0].embedding as number[];
  } catch (err) {
    console.error("Error generating embeddings:", err);
    throw err;
  }
};
