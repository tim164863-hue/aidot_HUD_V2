import React from 'react';
import GlassCard from '@/components/GlassCard';
import { useAgentsStore } from '@/stores/agents-store';
import { Bot, Play, Pause, Settings, MoreVertical } from 'lucide-react';

const AgentsView: React.FC = () => {
  const { agents, loading } = useAgentsStore();

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Agent Workforce</h2>
          <p className="text-[13px] text-zinc-500">Real-time status of your {agents.length} autonomous AI entities.</p>
        </div>
        <button className="p-2.5 glass rounded-xl border-white/10 hover:bg-white/5">
          <Bot size={20} className="text-white" />
        </button>
      </header>

      {loading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 rounded-full border-t-2 border-white/40 animate-spin mx-auto" />
          <p className="text-[11px] text-zinc-500 mt-2">Loading agents...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent, idx) => (
          <GlassCard key={agent.id} delay={idx * 0.1} className="group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
                <Bot size={20} className="text-blue-400" />
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors">
                  <Settings size={14} />
                </button>
                <button className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors">
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-[15px] font-bold text-white">{agent.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : agent.status === 'idle' ? 'bg-amber-500' : 'bg-zinc-600'}`} />
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{agent.status}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((cap, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-[10px] text-zinc-400">
                    {cap}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white text-black text-[11px] font-bold hover:bg-zinc-200 transition-colors">
                  {agent.status === 'active' ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                  {agent.status === 'active' ? 'Pause Task' : 'Start Task'}
                </button>
                <button className="px-4 py-2 rounded-xl glass border-white/10 text-white text-[11px] font-medium hover:bg-white/5">
                  View Logs
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default AgentsView;
