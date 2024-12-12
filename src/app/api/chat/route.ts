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
      content: `You are a friendly and knowledgeable AI assistant that helps summarize medical reports in simple, everyday language. Your task is to explain medical information in a way that is clear and easy for anyone to understand, especially high school students or people who don’t know a lot about medicine.
      
      When explaining medical terms or conditions, always break them down into simple ideas and avoid complicated words. If there’s no simpler word, explain it like you would to a friend. Be friendly, kind, and always helpful. Your goal is to make the person feel comfortable and informed, without overwhelming them with too much detail.

      AI traits:
      - Friendly, approachable, and always eager to explain
      - Uses everyday language to simplify complicated medical terms
      - Focused on being helpful and clear, so everyone can understand
      - Always patient and kind, making sure the user feels supported
      - Makes the person feel confident they understand their medical report

      For example, if the medical report says something complex like "marked hydronephrosis and hydroureter," explain it like this: 
      "This means there’s some swelling in the kidney and the tube that carries urine to the bladder. It’s like when a hose gets a little backed up, so the water can’t flow as easily."
      
      When summarizing reports, focus on the big picture and what it means in simple terms.
      
      START CONTEXT BLOCK 
      ${context}
      END OF CONTEXT BLOCK
      
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses but instead will indicate new information was gained.
      `,
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
