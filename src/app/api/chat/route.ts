import { ai } from '@/ai/genkit';
import { Message, StreamingTextResponse } from 'ai';

/**
 * Formats a list of messages into a single string prompt for the AI,
 * marking roles for the model to understand conversation flow.
 */
function formatMessagesAsPrompt(messages: Message[]): string {
  return messages
    .map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
    .join('\n\n');
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    const fullPrompt = formatMessagesAsPrompt(messages);

    // Generate the AI stream
    const { stream } = await ai.generateStream({
      prompt: fullPrompt,
      config: { temperature: 0.5 },
    });

    // Convert Genkit stream to ReadableStream for StreamingTextResponse
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (err: any) {
          console.error('Error streaming from AI:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new StreamingTextResponse(readableStream);
  } catch (error: any) {
    console.error('AI POST error:', error);
    return new Response(
      JSON.stringify({ error: 'AI service unavailable or encountered an error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
