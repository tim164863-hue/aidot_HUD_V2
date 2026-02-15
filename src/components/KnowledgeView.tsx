import React from 'react';
import GlassCard from '@/components/GlassCard';
import { Search, BookOpen, Clock, Tag } from 'lucide-react';

const KnowledgeView: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Knowledge Base</h2>
          <p className="text-[13px] text-zinc-500">Unified memory for all ecosystem activity.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search across documents, chats, and logs..."
            className="w-full glass bg-white/[0.02] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[13px] text-white focus:outline-none focus:border-white/30 transition-all"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((item) => (
            <GlassCard key={item} delay={item * 0.1} className="flex gap-4 p-4 hover:translate-x-1 transition-transform group">
              <div className="p-3 rounded-xl glass border-white/10 text-zinc-500 group-hover:text-emerald-400">
                <BookOpen size={20} />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-[14px] font-bold text-white">System Architecture v3.1</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Technical breakdown of the decentralized agent handshake protocol.</p>
                <div className="flex gap-3 pt-2">
                  <span className="flex items-center gap-1 text-[9px] text-zinc-600 font-bold uppercase tracking-widest"><Clock size={10} /> 2h ago</span>
                  <span className="flex items-center gap-1 text-[9px] text-zinc-600 font-bold uppercase tracking-widest"><Tag size={10} /> Technical</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="space-y-6">
          <GlassCard className="p-5" delay={0.4}>
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {['LLM Optimization', 'Edge Deployment', 'Zero-Trust', 'Multi-Agent Flow', 'Token Economy'].map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-full glass border-white/5 text-[10px] text-zinc-400 hover:text-white transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5" delay={0.5}>
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4">Storage Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'Documents', size: '2.4 GB', color: 'bg-blue-500' },
                { label: 'Agent Memory', size: '12.8 GB', color: 'bg-purple-500' },
                { label: 'Chat History', size: '420 MB', color: 'bg-emerald-500' },
              ].map((stat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                    <span className="text-zinc-500">{stat.label}</span>
                    <span className="text-zinc-300">{stat.size}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                    <div className={`h-full ${stat.color} opacity-60`} style={{ width: i === 1 ? '70%' : i === 0 ? '40%' : '15%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeView;
