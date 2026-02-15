import React from 'react';
import GlassCard from '@/components/GlassCard';
import { Terminal, Cpu, Database, Network } from 'lucide-react';

const OpsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Ops Center</h2>
          <p className="text-[13px] text-zinc-500">Global infrastructure and deployment status.</p>
        </div>
        <button className="px-4 py-2 bg-white text-black text-[12px] font-bold rounded-xl hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10">
          Deploy Patch v2.4
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex flex-col gap-4" delay={0.1}>
          <div className="flex items-center gap-2 text-zinc-400">
            <Cpu size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Compute Health</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[12px]">
              <span className="text-zinc-500">Core Engine</span>
              <span className="text-emerald-500 font-mono">STABLE</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1">
              <div className="bg-emerald-500 h-1 rounded-full w-[94%] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-zinc-500">Worker Node 04</span>
              <span className="text-zinc-400 font-mono">BUSY</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1">
              <div className="bg-blue-500 h-1 rounded-full w-[78%]"></div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4" delay={0.15}>
          <div className="flex items-center gap-2 text-zinc-400">
            <Database size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Storage Status</span>
          </div>
          <div className="flex flex-col items-center justify-center py-4 gap-2">
            <div className="text-3xl font-bold text-white">4.2 <span className="text-zinc-600 text-lg">TB</span></div>
            <p className="text-[10px] text-zinc-500">Remaining Storage Available</p>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4" delay={0.2}>
          <div className="flex items-center gap-2 text-zinc-400">
            <Network size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Network Traffic</span>
          </div>
          <div className="h-24 flex items-end gap-1 px-2">
            {[30, 45, 25, 60, 80, 50, 40, 70, 90, 65, 55, 45].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-white/10 rounded-t-sm hover:bg-blue-500 transition-colors"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden" delay={0.3}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-zinc-500" />
            <span className="text-[12px] font-semibold text-zinc-300">Live Process Monitor</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">UPTIME: 142:32:04</span>
        </div>
        <div className="p-4 font-mono text-[11px] space-y-2 max-h-[300px] overflow-y-auto bg-black/40">
          <p className="text-zinc-600">[08:42:11] <span className="text-emerald-500">SUCCESS:</span> Agent "Harvester" indexed 1,204 nodes.</p>
          <p className="text-zinc-600">[08:42:15] <span className="text-blue-500">INFO:</span> Background cleanup starting on cache/tmp_04.</p>
          <p className="text-zinc-600">[08:43:02] <span className="text-zinc-400">DEBUG:</span> Handshake initiated with gateway_eu_west_1.</p>
          <p className="text-zinc-600">[08:44:59] <span className="text-amber-500">WARN:</span> Node 12 latency spike detected (142ms).</p>
          <p className="text-zinc-600">[08:45:10] <span className="text-emerald-500">SUCCESS:</span> Deployment of agent_logic_patch_v2 complete.</p>
        </div>
      </GlassCard>
    </div>
  );
};

export default OpsView;
