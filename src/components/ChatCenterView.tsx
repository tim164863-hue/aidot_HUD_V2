import React, { useState, useRef, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { chatStream } from '@/services/gemini';
import { Send, User, Bot, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const ChatCenterView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am aidot Assistant. How can I help you manage your ecosystem today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    await chatStream(input, (fullText) => {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: fullText } : m));
    });

    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">Chat Center</h2>
        <p className="text-[13px] text-zinc-500">Intelligent context-aware assistant.</p>
      </header>

      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden relative">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                msg.role === 'user'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-[13px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-white text-black font-medium'
                  : 'glass text-zinc-300 border border-white/5'
              }`}>
                {msg.content || (isTyping && msg.role === 'assistant' && <span className="animate-pulse">Analyzing...</span>)}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 glass border-t-0 bg-white/[0.01]">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything or request an action..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-5 pr-12 text-[13px] text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="absolute right-2 p-2 rounded-xl bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all shadow-lg"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {['Deploy v2', 'Analyze Logs', 'Check Calendar', 'New Draft'].map((label, i) => (
              <button key={i} className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border-white/5 text-[10px] text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                <Sparkles size={10} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ChatCenterView;
