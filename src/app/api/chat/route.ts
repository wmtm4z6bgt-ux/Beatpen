import { ai } from '@/ai/genkit';
import { Message, StreamingTextResponse } from 'ai';

// IMPORTANT! This API route uses the Node.js runtime by default.
// Genkit is not compatible with the Edge runtime on Vercel, so 'export const runtime = "edge"' is not used.

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    // Format the conversation history into a single string for the AI.
    // This provides context for a continuous conversation.
    const systemPrompt = "You are BeatPen Guide, an AI assistant for students and recent graduates using the BeatPen platform. Your goal is to provide helpful career advice, assist with improving resumes and achievement descriptions, and answer questions about finding internships or using the platform's features. Be professional, encouraging, and supportive.";
    
    const conversation = messages
      .map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
      .join('\n\n');

    const fullPrompt = `${systemPrompt}\n\nHere is the current conversation:\n\n${conversation}`;
    
    // Generate the AI stream using Genkit
    const { stream } = await ai.generateStream({
      prompt: fullPrompt,
      config: { temperature: 0.5 },
    });

    // Convert the Genkit stream into a format compatible with the Vercel AI SDK (StreamingTextResponse)
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
        } catch (error) {
          console.error("Error during AI stream:", error);
          // In case of an error during streaming, we log it but don't crash the app.
          // The stream will simply close.
        } finally {
          controller.close();
        }
      },
    });

    // Return the stream. This is what the `useChat` hook on the frontend expects.
    return new StreamingTextResponse(readableStream);

  } catch (error: any) {
    console.error("AI POST setup error:", error);
    // If the initial setup fails (e.g., JSON parsing, missing API key),
    // return a non-streaming error response. This prevents the client from crashing.
    return new Response(
      JSON.stringify({ error: 'The AI service encountered a setup error. Please check your API key.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
