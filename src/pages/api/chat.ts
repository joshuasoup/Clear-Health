import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse, Message } from 'ai';
import { getContext } from '../../lib/pinecone/context';

// Create an OpenAI API client (edge-friendly)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge
export const runtime = 'edge';

async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(null, { status: 405 }); // Method Not Allowed for non-POST requests
  }

  // Parse the JSON body to extract the messages
  const { messages, fileKey } = await req.json();
  const lastMessage = messages[messages.length - 1];
  const context = await getContext(lastMessage.content, fileKey);

  const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant that analyzes medical reports. Your task is to summarize the reports, and answer related questions. Responses should be clear, simple, suitable, and concise enough for a high school student to be able to interpret.
      START CONTEXT BLOCK 
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      `,
    };

  // Request a streaming chat completion from OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      prompt,
      ...messages.filter((message: Message) => message.role === "user"),

    ]
  });
  // Stream the response
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}

export default handler;
