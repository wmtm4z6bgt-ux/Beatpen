import { ai } from '@/ai/genkit';
import { Message, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  // Use Genkit to generate a stream.
  // `ai.generateStream` returns a promise that resolves to { stream, response }.
  const { stream: genkitStream } = await ai.generateStream({
    // The `prompt` can be the full message history.
    // We need to map the roles from Vercel AI SDK to Genkit roles.
    prompt: messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : m.role,
      content: [{ text: m.content }],
    })),
  });

  // Adapt Genkit's async iterator stream to a ReadableStream for the Vercel AI SDK.
  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      // The `stream` from Genkit is an async iterator of `Part` objects.
      for await (const chunk of genkitStream) {
        // We only care about the text parts for the chat.
        if (chunk.text) {
          // The Vercel AI SDK's `StreamingTextResponse` expects a stream of encoded strings.
          controller.enqueue(encoder.encode(chunk.text));
        }
      }
      controller.close();
    },
  });

  // Return the stream in a format `useChat` can handle.
  return new StreamingTextResponse(readableStream);
}
