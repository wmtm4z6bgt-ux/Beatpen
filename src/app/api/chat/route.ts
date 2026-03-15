// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

// IMPORTANT: The 'edge' runtime is not used to ensure compatibility with Vercel's standard Node.js environment.
// export const runtime = 'edge';

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
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue('Error: GEMINI_API_KEY environment variable is not set.');
        controller.close();
      }
    });
    return new StreamingTextResponse(errorStream, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
    });
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
    // For any other errors, return a readable error stream
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue(`Error: ${error.message || 'An unknown error occurred.'}`);
        controller.close();
      }
    });
    return new StreamingTextResponse(errorStream, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
    });
  }
}
