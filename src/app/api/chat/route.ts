import { ai } from '@/ai/genkit';
import { Message, StreamingTextResponse } from 'ai';

// Genkit requires the Node.js runtime and is not compatible with the Edge runtime.
export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    const systemPrompt = "You are BeatPen Guide, an AI assistant for students and recent graduates using the BeatPen platform. Your goal is to provide helpful career advice, assist with improving resumes and achievement descriptions, and answer questions about finding internships or using the platform's features. Be professional, encouraging, and supportive.";
    
    // Format the entire conversation history into a single string.
    // This is the most robust way to pass the conversation to the AI
    // based on the error messages from your build environment.
    const conversation = messages
      .map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
      .join('\n\n');

    const fullPrompt = `${systemPrompt}\n\nHere is the current conversation:\n\n${conversation}`;
    
    // Generate the AI stream using Genkit. We pass the prompt directly as a string.
    const { stream, response } = await ai.generateStream(fullPrompt);

    // Convert the Genkit stream into a format compatible with the Vercel AI SDK
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          // Stream the AI's response chunk by chunk
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          // Wait for the full response to be processed before closing.
          await response;
        } catch (error) {
          console.error("Error during AI stream processing:", error);
          const errorText = "\n\n[AI Assistant is currently unavailable]";
          controller.enqueue(encoder.encode(errorText));
        } finally {
          controller.close();
        }
      },
    });

    return new StreamingTextResponse(readableStream);

  } catch (error: any) {
    console.error("AI POST initial setup error:", error);
    // This block catches errors from the initial request setup, like JSON parsing.
    return new Response(
      JSON.stringify({ error: 'The AI service encountered a setup error. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
