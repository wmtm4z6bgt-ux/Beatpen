// src/ai/aichat.tsx
'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import type { Message } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Bot, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useAuth();

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  
  const getInitials = (name?: string | null) => name ? name.charAt(0).toUpperCase() : 'U';

  if (!isOpen) {
    return (
      <Button
        id="ai-chat-toggle-button"
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg bg-gradient-to-r from-violet-500 to-purple-500"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-8 w-8 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl rounded-2xl bg-black/50 backdrop-blur-lg border-violet-500/20 flex flex-col overflow-hidden z-50">
      <CardHeader className="flex flex-row justify-between items-center p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-violet-400" />
          <CardTitle className="text-lg text-white font-semibold">BeatPen Guide</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-400 text-sm p-8">
                Ask me anything about BeatPen or internships!
              </div>
            )}

            {messages.map((m: Message) => (
              <div key={m.id} className={cn('flex gap-3', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                {m.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-violet-500 text-white"><Bot className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  'max-w-xs rounded-2xl px-4 py-2 text-sm',
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                )}>
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${userData?.username}`} alt={userData?.username ?? ''} />
                    <AvatarFallback>{getInitials(userData?.username)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-violet-500 text-white"><Bot className="h-5 w-5" /></AvatarFallback>
                </Avatar>
                <div className="max-w-xs rounded-2xl px-4 py-2 bg-secondary text-secondary-foreground flex items-center rounded-bl-none">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4 border-t border-white/10">
        <form className="flex w-full gap-2 items-center" onSubmit={handleSubmit}>
          <Input
            id="chat-input-isolated"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask the assistant..."
            className="bg-zinc-800 border-zinc-700 focus:ring-violet-500"
          />
          <Button id="chat-submit-isolated" type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
