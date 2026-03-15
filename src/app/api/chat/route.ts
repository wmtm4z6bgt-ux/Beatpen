'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse, Message } from 'ai';

// Make sure to set the GOOGLE_GENERATIVE_AI_API_KEY environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export const dynamic = 'force-dynamic';

// convert messages from the Vercel AI SDK Format to the Google Generative AI SDK format
const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
});

export async function POST(req: Request) {
  const { messages, locale }: { messages: Message[], locale?: string } = await req.json();

  const systemPrompt = `You are "BeatPen Guide", a helpful, professional AI assistant for the BEATPEN platform. BEATPEN is a platform for students to find jobs and internships. It helps students showcase their skills and connect with recruiters. Key features include: AI-powered portfolio evaluation, dynamic skill visualization to track learning progress, and direct access to companies without going through HR filters. Your primary role is to guide users on how to best use these features to find an internship. You should also provide specific, actionable career advice. For example, if a user asks about interviews, give them tips on the STAR method. If they ask about resumes, suggest action verbs. Be a proactive and knowledgeable career coach. Always be encouraging and professional. You MUST respond in the same language as the user's request. The current language is '${locale || 'en'}'.`;

  // We are pre-pending the system prompt to the user's first message.
  // This is a common way to provide system instructions to the model.
  const processedMessages = [...messages];
  if (processedMessages.length > 0 && processedMessages[0].role === 'user') {
      processedMessages[0].content = systemPrompt + '\n\n' + processedMessages[0].content;
  } else {
       processedMessages.unshift({id: 'system-prompt', role: 'user', content: systemPrompt});
       // Add a dummy assistant message to satisfy the turn-based requirement
       processedMessages.splice(1, 0, {id: 'dummy-assistant', role: 'assistant', content: 'OK, I am ready to help.'});
  }

  const geminiStream = await genAI
    .getGenerativeModel({ 
        model: 'gemini-pro',
        safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
        ]
    })
    .generateContentStream(buildGoogleGenAIPrompt(processedMessages));

  const stream = GoogleGenerativeAIStream(geminiStream);

  return new StreamingTextResponse(stream);
}
