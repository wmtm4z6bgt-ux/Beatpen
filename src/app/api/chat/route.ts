import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Set the runtime to 'nodejs' to prevent build errors on Vercel.
export const runtime = 'nodejs';

// Ensure the API key is defined to avoid runtime errors.
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // The last message is the new prompt
    const lastMessage = messages[messages.length - 1].content;

    // The history is everything before the last message
    const history = messages.slice(0, -1).map((message: { role: string; content: string }) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    }));

    const chat = model.startChat({ history });

    const result = await chat.sendMessageStream(lastMessage);

    // Create a new stream for the response that the client can consume.
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          if (chunk && typeof chunk.text === 'function') {
            const text = chunk.text();
            controller.enqueue(text);
          }
        }
        controller.close();
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error('[API] Chat Error:', error);
    // 2. In case of an error, return a Response object with a stream
    // that contains a user-facing error message. This prevents the client from crashing.
    const errorStream = new ReadableStream({
        start(controller) {
            controller.enqueue('Sorry, I am unable to process your request at the moment. Please try again later.');
            controller.close();
        }
    });
    return new Response(errorStream, { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}
