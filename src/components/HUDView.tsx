import React, { useState, useEffect, useRef } from 'react';
import BrainNetwork from '@/components/BrainNetwork';
import { chatStream } from '@/services/gemini';
import { useAgentsStore } from '@/stores/agents-store';
import { Shield, Cpu, Wifi, Crosshair, Send, Bot, Terminal as TerminalIcon, ChevronDown, BarChart3 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PROCESSING_LOGS = [
  "ANALYZING_SYNAPTIC_WEIGHTS...",
  "ENCRYPTING_NEURAL_UPLINK...",
  "PARSING_ECOLOGICAL_DATA_FLOW...",
  "OPTIMIZING_AGENT_COORDINATION...",
  "REFRESHING_KNOWLEDGE_INDEX_V4.2",
  "IDENTIFYING_ANOMALOUS_PATTERNS...",
  "CALIBRATING_LOGIC_GATES...",
  "ESTABLISHING_TLS_HANDSHAKE...",
];

const HUDView: React.FC = () => {
  const agents = useAgentsStore((s) => s.agents);
  const [timestamp, setTimestamp] = useState(new Date());
  const [binary, setBinary] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'COMMS_ESTABLISHED: Awaiting strategic inquiry.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [currentLog, setCurrentLog] = useState(PROCESSING_LOGS[0]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTimestamp(new Date()), 1000);
    const binTimer = setInterval(() => {
      setBinary(Math.random().toString(2).slice(2, 18));
    }, 100);
    const logTimer = setInterval(() => {
      setCurrentLog(PROCESSING_LOGS[Math.floor(Math.random() * PROCESSING_LOGS.length)]);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(binTimer);
      clearInterval(logTimer);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    let assistantContent = '';
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    const agentPrompt = `[Acting as ${selectedAgent.name}] ${input}`;
    await chatStream(agentPrompt, (chunk) => {
      assistantContent = chunk;
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: 'assistant', content: assistantContent };
        return next;
      });
    });

    setIsTyping(false);
  };

  const HUDPanel = ({ children, title, className = "" }: { children: React.ReactNode, title?: string, className?: string }) => (
    <div className={`relative glass border-white/5 p-4 overflow-hidden ${className}`}>
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />

      {title && (
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">{title}</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-blue-500/40" />
          </div>
        </div>
      )}
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#050507] hud-grid overflow-hidden pointer-events-none">
      <div className="scanline" />

      <div className="absolute inset-0 pointer-events-auto p-4 md:p-8 pt-20 md:pt-16 flex flex-col gap-6">

        {/* Top Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 glass border-white/10 flex items-center justify-center">
                <Crosshair size={20} className="text-white animate-spin [animation-duration:15s]" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black text-white tracking-widest uppercase italic leading-none">aidot_HUD</h1>
                <span className="text-[9px] text-zinc-500 font-mono tracking-tighter mt-1">LATENCY: 14ms | UPLINK: STABLE</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 font-mono">
            <span className="text-white text-lg font-bold tracking-widest">{timestamp.toLocaleTimeString([], { hour12: false })}</span>
            <span className="text-[10px] text-blue-500/80 uppercase tracking-widest">MISSION_TIME: {binary.slice(0, 8)}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">

          {/* Left Wing - Chat */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-hidden">
            <HUDPanel title="Tactical_Comms" className="flex-1 flex flex-col gap-0 p-0 relative">
              {/* Agent Selector Header */}
              <div className="p-3 border-b border-white/5 bg-white/[0.03] flex items-center justify-between z-20">
                <button
                  onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
                  className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded transition-colors group"
                >
                  <Bot size={14} className="text-blue-400" />
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-zinc-500 uppercase leading-none">TARGET_AGENT</span>
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight">{selectedAgent.name}</span>
                  </div>
                  <ChevronDown size={12} className={`text-zinc-600 group-hover:text-zinc-300 transition-transform ${isAgentMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAgentMenuOpen && (
                  <div className="absolute top-12 left-2 right-2 glass border-white/10 z-30 flex flex-col py-1 shadow-2xl">
                    {agents.map(agent => (
                      <button
                        key={agent.id}
                        onClick={() => {
                          setSelectedAgent(agent);
                          setIsAgentMenuOpen(false);
                        }}
                        className={`px-4 py-2 text-left text-[11px] font-mono hover:bg-blue-500/10 transition-colors ${selectedAgent.id === agent.id ? 'text-blue-400 bg-blue-500/5' : 'text-zinc-400'}`}
                      >
                        &gt; {agent.name.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 opacity-50">
                      <span className="text-[8px] font-mono text-zinc-500">
                        {msg.role === 'user' ? 'OPERATOR' : selectedAgent.name.toUpperCase()}
                      </span>
                    </div>
                    <div className={`max-w-[90%] p-2 rounded-lg text-[11px] font-mono leading-tight ${
                      msg.role === 'user'
                        ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300'
                        : 'bg-white/5 border border-white/10 text-zinc-300'
                    }`}>
                      {msg.content || (isTyping && <span className="animate-pulse">STREAMING_LOGIC...</span>)}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                <div className="relative flex items-center">
                  <TerminalIcon size={12} className="absolute left-3 text-zinc-600" />
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="INPUT_COMMAND..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-10 text-[11px] font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 p-1.5 text-zinc-500 hover:text-white transition-colors disabled:opacity-30"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </HUDPanel>

            <HUDPanel title="Network_Load" className="h-32">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5">
                  <BarChart3 size={16} className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-600 uppercase font-bold">Inbound Traffic</span>
                  <span className="text-[12px] text-white font-mono">1.24 TB / SEC</span>
                </div>
              </div>
              <div className="mt-4 h-1 w-full bg-white/5 overflow-hidden rounded-full">
                <div className="h-full bg-blue-500 w-[62%] animate-pulse" />
              </div>
            </HUDPanel>
          </div>

          {/* Central Neural Core */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 relative">
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] h-[300px] md:h-[450px] border border-white/5 rounded-full animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] border border-dashed border-white/5 rounded-full animate-[spin_40s_linear_infinite]" />
            </div>

            <div className="flex-1 relative z-10">
              <BrainNetwork />
            </div>

            {/* Processing Data Log */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
              <p className="text-[10px] font-mono text-blue-400/80 tracking-[0.4em] uppercase animate-pulse">
                {currentLog}
              </p>
              <div className="flex justify-center gap-1 mt-1 opacity-40">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>

            <div className="h-16 flex items-center justify-center gap-12 glass border-white/5 z-10">
              <div className="flex flex-col items-center">
                <Shield size={16} className="text-emerald-500 mb-1" />
                <span className="text-[9px] font-bold text-zinc-600 uppercase">SECURE</span>
              </div>
              <div className="flex flex-col items-center">
                <Cpu size={16} className="text-blue-500 mb-1" />
                <span className="text-[9px] font-bold text-zinc-600 uppercase">CALC</span>
              </div>
              <div className="flex flex-col items-center">
                <Wifi size={16} className="text-amber-500 mb-1" />
                <span className="text-[9px] font-bold text-zinc-600 uppercase">LINK</span>
              </div>
            </div>
          </div>

          {/* Right Wing - Telemetry & Status */}
          <div className="hidden lg:flex col-span-3 flex-col gap-4 overflow-hidden">
            <HUDPanel title="Telemetry_A" className="h-48">
              <div className="flex items-end gap-1 h-24 mb-4">
                {[40, 60, 45, 90, 75, 50, 65, 80, 40, 55, 30, 45, 70, 50].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-500/20 border-t border-blue-400/40" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                <span>IO_LOAD: 82.4%</span>
                <span>BIT: {binary.slice(12, 16)}</span>
              </div>
            </HUDPanel>

            <HUDPanel title="Network_Health" className="flex-1 overflow-y-auto no-scrollbar">
              <div className="space-y-4 font-mono text-[10px]">
                {agents.map((agent, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-300">#_{agent.name.toUpperCase()}</span>
                      <span className={agent.status === 'active' ? 'text-emerald-500' : 'text-amber-500'}>{agent.status.toUpperCase()}</span>
                    </div>
                    <div className="w-full bg-white/5 h-[1px]">
                      <div className={`h-full ${agent.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'} w-[85%] opacity-40`} />
                    </div>
                  </div>
                ))}
                <div className="pt-4 text-[9px] text-zinc-700 break-all leading-tight italic uppercase tracking-widest">
                  SYNC_TOKEN: {binary}{binary}
                </div>
              </div>
            </HUDPanel>

            <HUDPanel title="Core_Logic" className="h-32">
              <div className="space-y-2 text-[9px] font-mono text-zinc-500">
                <div className="flex justify-between">
                  <span>SYNC_LEVEL</span>
                  <span className="text-emerald-500">OPTIMAL</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span>PROB_RATIO</span>
                  <span>{binary.slice(2, 6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>LOGIC_ADDR</span>
                  <span className="truncate max-w-[100px] italic">0x_AD_{binary.slice(8, 14)}</span>
                </div>
              </div>
            </HUDPanel>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-auto">
          <div className="flex gap-4">
            <span>ACTIVE_MISSION: ALPHA_SYNC</span>
            <span className="text-zinc-800">|</span>
            <span className="text-blue-500/50">CRYPTO_KEY: RSA_4096</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="animate-pulse">TERMINAL_ACTIVE</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HUDView;
