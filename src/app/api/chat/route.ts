import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse, Message } from 'ai';
import { getContext } from '../../../lib/pinecone/context';

// Create an OpenAI API client (edge-friendly)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Parse the JSON body to extract the messages
    const { messages, fileKey } = await req.json();

    if (!messages || !fileKey) {
      return new Response(
        JSON.stringify({ error: "Missing messages or fileKey in request body" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get context using the last message content and the fileKey
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);


    // Define the system prompt
    const prompt = {
      role: "system",
      content: `You already have the report text below. Answer only from it. Do NOT ask for the PDF again. If nothing relevant is in the context, say you don't know.

AI style:
- Friendly, approachable, plain-language medical guide
- Breaks medical terms down simply and briefly
- Focus on key findings, risks, next steps; keep answers concise

Example: "marked hydronephrosis and hydroureter" -> "There's swelling in the kidney and the tube that drains urine, like a hose with a backup."

CONTEXT (from Pinecone for fileKey ${fileKey}):
${context || "No context returned"}

If the context doesn't cover the question, reply: "I'm sorry, but I don't know the answer to that question based on this report."`,
    };

    // Request a streaming chat completion from OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
    });

    // Stream the response
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in POST /openai-free-connection:", error);

    return new Response(
      JSON.stringify({ error: "Failed to process the request" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
