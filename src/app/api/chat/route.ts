// src/app/api/chat/route.ts
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Do not use the edge runtime
// export const runtime = 'edge';

export async function POST(req: Request) {
  // Check for the API key inside the handler to avoid crashing the server on startup
  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY environment variable is not set.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-pro'),
      messages,
    });

    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error('[API] Chat Error:', error);
    return new Response(
        JSON.stringify({ error: error.message || 'An unknown error occurred.' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
  }
}
