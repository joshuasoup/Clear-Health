import OpenAI from 'openai';
import { OpenAIStream } from 'ai'; // Ensure this package is correctly installed

// Create an OpenAI API client (edge-friendly)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Parse the JSON body to extract the messages
    const { messages } = await req.json();

    // Add a system message to define the assistant's behavior
    const systemMessage = {
      role: 'system',
      content:
        'You are an AI bot that analyzes medical reports. Your task is to summarize the reports, define medical terms, and answer related questions. Your explanations should be clear, simple, suitable, and concise enough for a high school student to be able to interpret. (Your responses should only be around 30-50 words long)',
    };

    // Combine the system message with the user's messages
    const updatedMessages = [systemMessage, ...messages];

    // Request a streaming chat completion from OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: updatedMessages,
    });

    // Stream the response
    const stream = OpenAIStream(response);

    // Return the stream as a response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in POST /openai-free-connection:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
