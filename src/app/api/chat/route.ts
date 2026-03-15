'use server';

import {ai} from '@/ai/genkit';
import {Message, StreamingTextResponse} from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const {messages}: {messages: Message[]} = await req.json();

  const {stream: genkitStream} = await ai.generateStream({
    prompt: messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : m.role,
      content: [{text: m.content}],
    })),
    config: {
      temperature: 0.5,
    },
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of genkitStream) {
        if (chunk.text) {
          controller.enqueue(encoder.encode(chunk.text));
        }
      }
      controller.close();
    },
  });

  return new StreamingTextResponse(readableStream);
}
