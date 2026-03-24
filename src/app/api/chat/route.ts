// src/app/api/chat/route.ts
import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY environment variable is not set.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { messages } = await req.json();

    // convertToModelMessages теперь асинхронная
    const modelMessages = await convertToModelMessages(messages);

    const result = await streamText({
      model: google('gemini-pro'),
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('[API] Chat Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}