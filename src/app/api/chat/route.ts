'use server';

import {ai} from '@/ai/genkit';
import {Message, StreamingTextResponse} from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const {messages}: {messages: Message[]} = await req.json();

  // Use a try...catch block to handle potential errors from the AI service
  try {
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
        try {
          for await (const chunk of genkitStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
        } catch (error) {
          console.error('Error during AI stream generation:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new StreamingTextResponse(readableStream);
  } catch (error) {
    console.error('Failed to initialize AI stream:', error);
    // Return a structured error response that the client can handle
    return new Response(
      JSON.stringify({
        error:
          'The AI service is currently unavailable. Please try again later.',
      }),
      {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      }
    );
  }
}
