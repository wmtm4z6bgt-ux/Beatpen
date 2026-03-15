'use client';
import { ai } from '@/ai/genkit';
import { Message, StreamingTextResponse } from 'ai';

/**
 * Formats a list of messages into a single string prompt for the AI,
 * demarcating roles for the model to understand the conversation flow.
 */
function formatMessagesAsPrompt(messages: Message[]): string {
    return messages.map(m => {
        const role = m.role === 'user' ? 'User' : 'AI';
        return `${role}: ${m.content}`;
    }).join('\n\n');
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();
    
    // Convert the message history into a single string prompt.
    // This is a workaround for the TypeScript error indicating that the `history`
    // parameter is not available in the `generateStream` call in this project setup.
    const fullPrompt = formatMessagesAsPrompt(messages);

    // Call generateStream with the formatted string prompt
    const { stream, response } = ai.generateStream({
      prompt: fullPrompt,
      config: { temperature: 0.5 },
    });

    // Convert the Genkit stream into a Vercel AI SDK-compatible stream
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          // Wait for the response promise to resolve, ensuring the stream is complete.
          await response;
        } catch (err: any) {
          console.error('Error streaming from AI:', err);
          // Propagate the error to the stream consumer
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new StreamingTextResponse(readableStream);
  } catch (error: any) {
    console.error('AI POST error:', error);
    // Return a generic error response if something goes wrong outside the stream
    return new Response(
      JSON.stringify({ error: 'AI service unavailable or encountered an error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
