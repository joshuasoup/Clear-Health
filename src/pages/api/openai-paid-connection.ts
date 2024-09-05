import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

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
  const { messages } = await req.json();

  // Add a system message to define the assistant's behavior
  const systemMessage = {
    role: 'system',
    content: 'You are an AI bot that analyzes medical reports. Your task is to summarize the reports, define medical terms, and answer related questions. Your explanations should be clear and simple, suitable, and concise for a high school audience. Additionally, provide relevant links that are accessible and resources to support your explanations (Your responses should only be around 40-60 words long)',
  };

  // Combine the system message with the user's messages
  const updatedMessages = [systemMessage, ...messages];

  // Request a streaming chat completion from OpenAI
  const response = await openai.chat.completions.create({
    model:'gpt-4',
    stream: true,
    messages: updatedMessages,
  });
  // Stream the response
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}

export default handler;