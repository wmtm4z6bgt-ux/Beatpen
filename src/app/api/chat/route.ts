import { ai } from '@/ai/genkit';
import { Message, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    const { stream: genkitStream } = await ai.generateStream({
      // Преобразуем формат сообщений для Genkit/Gemini
      prompt: messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user', // Gemini использует 'user' и 'model'
        content: [{ text: String(m.content) }],
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
            let content = '';

            // безопасно извлекаем текст
            if (typeof chunk?.text === 'string') {
              content = chunk.text;
            } else if (typeof chunk?.text === 'function') {
              content = chunk.text();
            }

            if (content) {
              controller.enqueue(encoder.encode(content));
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

    return new Response(
      JSON.stringify({
        error: 'AI service unavailable',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}