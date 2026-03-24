'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat, type UIMessage } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Bot, Loader2, Send, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const getInitials = (name?: string | null) => 
    name ? name.charAt(0).toUpperCase() : 'U';

  // Кнопка открытия чата
  if (!isOpen) {
    return (
      <Button
        id="ai-chat-trigger"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl bg-gradient-to-br from-violet-600 to-purple-700 z-[100] hover:scale-105 hover:shadow-violet-500/25 transition-all duration-300 group"
        onClick={() => setIsOpen(true)}
        aria-label="Открыть AI ассистент"
      >
        <Bot className="h-6 w-6 text-white group-hover:hidden" />
        <Sparkles className="h-6 w-6 text-white hidden group-hover:block" />
      </Button>
    );
  }

  // Функция для извлечения текста из частей сообщения
  const getMessageText = (message: UIMessage): string => {
    const textPart = message.parts.find(part => part.type === 'text');
    return textPart && 'text' in textPart ? textPart.text : '';
  };

  return (
    <Card className="fixed bottom-6 right-6 w-[380px] h-[520px] shadow-2xl rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-4 fade-in duration-200">
      {/* Заголовок */}
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-600/20">
            <Bot className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <CardTitle className="text-base text-white font-semibold">
              BeatPen Assistant
            </CardTitle>
            <p className="text-xs text-zinc-500">AI-помощник</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg h-8 w-8" 
          onClick={() => setIsOpen(false)}
          aria-label="Закрыть чат"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      {/* Сообщения */}
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-3">
            {/* Приветствие */}
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-8 px-4">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-violet-600/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-violet-400" />
                </div>
                <p className="text-zinc-200 font-medium mb-1">Привет! 👋</p>
                <p className="text-zinc-500 text-sm">
                  Спроси меня о BeatPen, создании музыки или публикации треков
                </p>
              </div>
            )}

            {/* Список сообщений */}
            {messages.map((m: UIMessage) => (
              <div 
                key={m.id} 
                className={cn(
                  'flex gap-2.5 animate-in fade-in slide-in-from-bottom-1 duration-200', 
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {m.role !== 'user' && (
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-violet-600 text-white text-xs">
                      <Bot className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                    m.role === 'user'
                      ? 'bg-violet-600 text-white rounded-br-sm'
                      : 'bg-zinc-800/80 text-zinc-100 rounded-bl-sm'
                  )}
                >
                  {getMessageText(m)}
                </div>

                {m.role === 'user' && (
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${userData?.username || 'guest'}`}
                    />
                    <AvatarFallback className="bg-zinc-700 text-white text-xs">
                      {getInitials(userData?.username)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Индикатор загрузки */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-violet-600 text-white">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl rounded-bl-sm px-3.5 py-2 bg-zinc-800/80 text-zinc-400 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  </span>
                </div>
              </div>
            )}
            
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Поле ввода */}
      <CardFooter className="p-3 border-t border-zinc-800 bg-zinc-900/50">
        <form
          className="flex w-full gap-2 items-center"
          onSubmit={handleSubmit}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Напиши сообщение..."
            className="flex-1 bg-zinc-800/50 border-zinc-700 focus-visible:ring-violet-500/50 focus-visible:border-violet-500 text-white placeholder:text-zinc-500 h-9 text-sm"
            autoComplete="off"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            size="icon"
            className="h-9 w-9 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
