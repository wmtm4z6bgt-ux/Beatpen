// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

export const runtime = 'nodejs';

// Function to build the prompt for the Gemini API
function buildGoogleGenAIPrompt(messages: Message[]) {
  return {
    contents: messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
  };
}

export async function POST(req: Request) {
  // Check for the API key inside the handler to avoid crashing the server on startup
  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY environment variable is not set.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const { messages } = await req.json();

    // Create a stream from the Gemini API
    const geminiStream = await genAI
      .getGenerativeModel({ model: 'gemini-pro' })
      .generateContentStream(buildGoogleGenAIPrompt(messages));

    // Convert the stream to a format compatible with the `ai` library
    const stream = GoogleGenerativeAIStream(geminiStream);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error('[API] Chat Error:', error);
    // Return a structured JSON error response
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
