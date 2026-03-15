'use server';

import { ai } from '@/ai/genkit';
import { StreamingTextResponse } from 'ai';
import { Message } from 'ai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const { messages, locale }: { messages: Message[], locale?: string } = await req.json();

    const systemPrompt = `You are "BeatPen Guide", a helpful, professional AI assistant for the BEATPEN platform. BEATPEN is a platform for students to find jobs and internships. It helps students showcase their skills and connect with recruiters. Key features include: AI-powered portfolio evaluation, dynamic skill visualization to track learning progress, and direct access to companies without going through HR filters. Your primary role is to guide users on how to best use these features to find an internship. You should also provide specific, actionable career advice. For example, if a user asks about interviews, give them tips on the STAR method. If they ask about resumes, suggest action verbs. Be a proactive and knowledgeable career coach. Always be encouraging and professional. You MUST respond in the same language as the user's request. The current language is '${locale || 'en'}'.`;

    // Transform the Vercel AI SDK messages to Genkit's format
    const history = [
        { role: 'system', content: [{ text: systemPrompt }] },
        ...messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : (m.role as 'user' | 'system' | 'model'),
            content: [{ text: m.content }],
        })),
    ];

    const result = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        history: history,
        stream: true,
    });

    // Convert the Genkit stream to a Vercel AI SDK compatible stream
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            for await (const chunk of result.stream) {
                if (chunk.text) {
                    controller.enqueue(encoder.encode(chunk.text));
                }
            }
            controller.close();
        },
    });
    
    return new StreamingTextResponse(stream);
}
