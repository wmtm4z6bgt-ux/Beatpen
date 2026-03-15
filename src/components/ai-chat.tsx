'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { X, Send, Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useAuth();

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {},
  });

  const getInitials = (name?: string | null) => name ? name[0].toUpperCase() : 'U';

  if (!isOpen) {
    return (
      <Button
        id="ai-chat-toggle-button"
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-8 w-8 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl rounded-2xl bg-black/50 backdrop-blur-lg border-violet-500/20 flex flex-col overflow-hidden">
      <CardHeader className="flex justify-between items-center p-4 border-b border-white/10">
        <CardTitle className="text-white font-semibold">BeatPen Guide</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm p-8">
                Ask me anything about internships or using BeatPen!
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={cn("flex gap-2", m.role === 'user' ? 'justify-end' : 'justify-start')}>
                {m.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-violet-500 text-white"><Bot className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  "max-w-xs rounded-2xl px-4 py-2 text-sm",
                  m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary text-secondary-foreground rounded-bl-none'
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
              <div className="flex gap-2 justify-start items-center">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-violet-500 text-white"><Bot className="h-5 w-5"/></AvatarFallback>
                </Avatar>
                <div className="max-w-xs rounded-2xl px-4 py-2 bg-secondary text-secondary-foreground flex items-center">
                  Loading...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4 border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex w-full gap-2 items-center">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask the assistant..."
            className="bg-zinc-800 border-zinc-700 focus:ring-violet-500"
          />
          <Button type="submit" disabled={isLoading} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}