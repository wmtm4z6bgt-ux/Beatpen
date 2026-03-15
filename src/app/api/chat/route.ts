import { ai } from '@/ai/genkit';
import { StreamingTextResponse } from 'ai';
import { Message } from 'ai';

export const dynamic = 'force-dynamic';

function iteratorToStream(iterator: any) {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next()
            if (done) {
                controller.close()
            } else {
                controller.enqueue(new TextEncoder().encode(value))
            }
        },
    })
}

async function* getGenkitStream(messages: Message[], locale: string): AsyncGenerator<string> {
    const systemPrompt = `You are "BeatPen Guide", a helpful, professional AI assistant for the BEATPEN platform. BEATPEN is a platform for students to find jobs and internships. It helps students showcase their skills and connect with recruiters. Key features include: AI-powered portfolio evaluation, dynamic skill visualization to track learning progress, and direct access to companies without going through HR filters. Your primary role is to guide users on how to best use these features to find an internship. You should also provide specific, actionable career advice. For example, if a user asks about interviews, give them tips on the STAR method. If they ask about resumes, suggest action verbs. Be a proactive and knowledgeable career coach. Always be encouraging and professional. You MUST respond in the same language as the user's request. The current language is '${locale}'.`;

    const model = 'googleai/gemini-2.5-flash';
    
    const history: Message[] = [
        { role: 'system', content: systemPrompt, id: 'system-prompt' },
        ...messages,
    ];

    const genkitMessages = history.map(m => ({
        role: m.role === 'assistant' ? 'model' : (m.role as 'user' | 'system' | 'model'),
        content: [{ text: m.content }],
    }));

    const { stream } = await ai.generate({
        model,
        history: genkitMessages,
        stream: true,
    });

    for await (const chunk of stream) {
        if (chunk.text) {
          yield chunk.text;
        }
    }
}

export async function POST(req: Request) {
    const { messages, locale } = await req.json();

    const iterableStream = getGenkitStream(messages, locale || 'en');
    const stream = iteratorToStream(iterableStream);
    
    return new StreamingTextResponse(stream);
}
