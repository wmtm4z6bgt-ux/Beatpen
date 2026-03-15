// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StreamingTextResponse } from 'ai';

// IMPORTANT: Use the Node.js runtime to avoid Vercel build errors.
export const runtime = 'nodejs';

// Ensure the Gemini API key is set in environment variables.
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const { messages }: { messages: { role: string; content: string }[] } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(
        'No messages provided',
        { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      );
    }

    const lastMessage = messages[messages.length - 1].content;

    // Set up the model with chat history
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const chat = model.startChat({ history });

    const result = await chat.sendMessageStream(lastMessage);

    // Create a ReadableStream to stream the response
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            if (chunk && typeof chunk.text === 'function') {
              const text = chunk.text();
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (error) {
          console.error('[Stream Error]', error);
          // Send a user-friendly error message in the stream if an error occurs
          controller.enqueue(encoder.encode('[AI Assistant is currently unavailable]'));
        } finally {
          controller.close();
        }
      },
    });

    // Return the stream as a response
    return new StreamingTextResponse(readableStream);
  } catch (error) {
    console.error('[API] Chat Error:', error);
    // Return a structured error stream in case of a server-level failure
    const errorStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode('Sorry, I am unable to process your request. Please try again later.'));
        controller.close();
      },
    });
    return new StreamingTextResponse(errorStream);
  }
}
