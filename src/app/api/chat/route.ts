import { ai } from '@/ai/genkit';
import { Message, StreamingTextResponse } from 'ai';

// НЕ используем 'edge' runtime — Genkit требует Node.js
export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    // Формируем простой строковый prompt
    const prompt = messages
      .map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
      .join('\n\n');

    const { stream, response } = await ai.generateStream({
      prompt,
      config: { temperature: 0.5 },
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            const text = chunk.text; // свойство, не метод
            if (text) controller.enqueue(encoder.encode(text));
          }
          await response;
        } catch (err) {
          console.error('AI stream error', err);
          controller.enqueue(encoder.encode('[AI is currently unavailable]'));
        } finally {
          controller.close();
        }
      },
    });

    return new StreamingTextResponse(readableStream);

  } catch (err) {
    console.error('AI API setup error', err);
    return new Response(
      JSON.stringify({ error: 'AI service failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}