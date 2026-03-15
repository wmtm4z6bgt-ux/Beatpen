'use server';

import { ai } from '@/ai/genkit';
import { Message, StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    // System prompt to guide the AI
    const systemPrompt = "You are BeatPen Guide, an AI assistant for students and recent graduates using the BeatPen platform. Your goal is to provide helpful career advice, assist with improving resumes and achievement descriptions, and answer questions about finding internships or using the platform's features. Be professional, encouraging, and supportive. You are having a conversation with a user. Keep your responses concise and helpful, in the style of a text message chat.";

    // Format the conversation history into a single string prompt for Genkit
    // This avoids the TypeScript error with the `history` object.
    const conversationHistory = messages
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}\n\nCURRENT CONVERSATION:\n${conversationHistory}`;

    // Call Genkit's generateStream with the single string prompt
    const genkitStream = await ai.generateStream(fullPrompt);

    // This function safely converts the Genkit stream into a format the Vercel AI SDK understands.
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of genkitStream.stream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
          await genkitStream.response; // Wait for the full response to be processed
        } catch (e) {
          // If the stream itself errors, log it and send an error message down the stream.
          console.error("Error during AI stream processing:", e);
          const errorText = "\n\n[AI Assistant is currently unavailable]";
          try {
            controller.enqueue(encoder.encode(errorText));
          } catch {}
        } finally {
          // Ensure the stream is always closed.
          controller.close();
        }
      },
    });

    // Return the stream as a response.
    return new StreamingTextResponse(readableStream);

  } catch (error) {
    // This is the critical error handling block.
    // If any error occurs (e.g., API key is missing), we DO NOT crash.
    // Instead, we return a valid, safe streaming response with an error message.
    // This prevents the frontend from crashing and causing a page reload.
    console.error("Fatal error in AI chat API:", error);
    const errorStream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode("Произошла ошибка. Пожалуйста, попробуйте снова."));
            controller.close();
        }
    });
    return new StreamingTextResponse(errorStream, { status: 500 });
  }
}
