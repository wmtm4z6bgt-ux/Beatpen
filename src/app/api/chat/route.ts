import { ai } from '@/ai/genkit';
import { Message, StreamingTextResponse } from 'ai';

/**
 * Formats a list of messages into a single string prompt for the AI,
 * marking roles for the model to understand conversation flow.
 */
function formatMessagesAsPrompt(messages: Message[]): string {
  // Add a system prompt to guide the AI
  const systemPrompt = "You are BeatPen Guide, an AI assistant for students and recent graduates using the BeatPen platform. Your goal is to provide helpful career advice, assist with improving resumes and achievement descriptions, and answer questions about finding internships or using the platform's features. Be professional, encouraging, and supportive.";
  
  const conversation = messages
    .map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
    .join('\n\n');

  return `${systemPrompt}\n\nHere is the current conversation:\n\n${conversation}`;
}


export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    const fullPrompt = formatMessagesAsPrompt(messages);

    // Generate the AI stream using Genkit
    const { stream } = await ai.generateStream({
      prompt: fullPrompt,
      config: { temperature: 0.5 },
    });

    // Convert Genkit stream to a ReadableStream for the Vercel AI SDK
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
        } catch (err: any) {
          console.error('Error streaming from AI:', err);
          // Send an error message back to the client if something goes wrong during streaming
          const errorJson = JSON.stringify({ error: 'Error during AI stream.' });
          controller.enqueue(encoder.encode(errorJson));
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    // Return the stream as a StreamingTextResponse
    return new StreamingTextResponse(readableStream);

  } catch (error: any) {
    console.error('AI POST error:', error);
    // Return a structured error response if the initial setup fails
    return new Response(
      JSON.stringify({ error: 'AI service unavailable or encountered an error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
