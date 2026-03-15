'use server';

import { ai } from '@/ai/genkit';
import { Message, StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';
import { Part } from 'genkit';

export const dynamic = 'force-dynamic';

function toGenkitHistory(messages: Message[]): { role: 'user' | 'model'; content: Part[] }[] {
    // Filter out system messages, as Genkit's `generateStream` takes it as a separate parameter.
    return messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: [{ text: m.content }]
        }));
}

export async function POST(req: NextRequest) {
  const { messages, locale }: { messages: Message[], locale?: string } = await req.json();

  const systemPrompt = `You are "BeatPen Guide", a helpful, professional AI assistant for the BEATPEN platform. BEATPEN is a platform for students to find jobs and internships. It helps students showcase their skills and connect with recruiters. Key features include: AI-powered portfolio evaluation, dynamic skill visualization to track learning progress, and direct access to companies without going through HR filters. Your primary role is to guide users on how to best use these features to find an internship. You should also provide specific, actionable career advice. For example, if a user asks about interviews, give them tips on the STAR method. If they ask about resumes, suggest action verbs. Be a proactive and knowledgeable career coach. Always be encouraging and professional. You MUST respond in the same language as the user's request. The current language is '${locale || 'en'}'.`;

  const history = toGenkitHistory(messages);
  const currentMessage = history.pop();

  if (!currentMessage) {
      return new Response('No message found in request', { status: 400 });
  }

  const { stream } = ai.generateStream({
    // The model is picked from the default in src/ai/genkit.ts
    system: systemPrompt,
    prompt: currentMessage.content[0].text,
    history: history,
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of stream) {
        if(chunk.text) {
          controller.enqueue(encoder.encode(chunk.text));
        }
      }
      controller.close();
    }
  });

  return new StreamingTextResponse(readableStream);
}
