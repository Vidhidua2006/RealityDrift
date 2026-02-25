import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { v4 } from '@/lib/utils-id';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/drift-chat`;

const LiveChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: 'Hi! I\'m the Drift Intelligence Assistant. Ask me anything about drift detection, entity monitoring, or severity analysis.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { id: v4(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const apiMessages = [...messages, userMsg]
      .filter(m => m.id !== '0')
      .map(({ role, content }) => ({ role, content }));

    let assistantContent = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Request failed' }));
        toast({ title: 'Chat error', description: err.error, variant: 'destructive' });
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const assistantId = v4();

      // Add empty assistant message
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              const snapshot = assistantContent;
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content: snapshot } : m)
              );
            }
          } catch { /* partial JSON, wait */ }
        }
      }
    } catch (e) {
      console.error(e);
      toast({ title: 'Chat error', description: 'Failed to connect to AI assistant.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Bot size={16} className="text-primary" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">Drift Assistant</h3>
          <p className="text-[10px] text-muted-foreground">AI-powered help</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className="flex items-start gap-2">
              <Avatar className="h-6 w-6 mt-0.5 shrink-0">
                <AvatarFallback className={`text-[10px] ${msg.role === 'assistant' ? 'bg-primary/20 text-primary' : 'bg-secondary text-foreground'}`}>
                  {msg.role === 'assistant' ? 'AI' : 'U'}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground leading-relaxed break-words min-w-0">
                {msg.content || (isLoading && msg.role === 'assistant' ? '…' : '')}
              </p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about drift..."
          className="h-8 text-xs"
          disabled={isLoading}
        />
        <Button size="icon" className="h-8 w-8 shrink-0" onClick={send} disabled={isLoading}>
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </Button>
      </div>
    </div>
  );
};

export default LiveChat;
