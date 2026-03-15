'use server';

import { ai } from '@/ai/genkit';
import { Message, StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    // Format the conversation history into a single string prompt.
    // This is a robust way to provide context to the model.
    const prompt = messages
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');
    
    // Use the Genkit 1.x streaming pattern.
    const { stream, response } = await ai.generateStream({
      prompt: prompt,
      config: { temperature: 0.7 },
    });

    // Create a ReadableStream to pipe the AI's response.
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          // Await each chunk from the stream and enqueue it.
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          // Ensure the full response is processed before closing.
          await response;
        } catch (error) {
          // If the stream fails, log it and send an error message to the client.
          console.error('AI stream error:', error);
          controller.enqueue(encoder.encode('[AI Assistant is currently unavailable. Please try again later.]'));
        } finally {
          // Close the stream when done.
          controller.close();
        }
      },
    });

    // Return the stream as a response.
    return new StreamingTextResponse(readableStream);

  } catch (error) {
    // Catch any other errors (e.g., JSON parsing) and return a standard 500 response.
    console.error('AI API setup error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred in the AI service.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
