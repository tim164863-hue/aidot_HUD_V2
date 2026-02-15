import React from 'react';
import GlassCard from '@/components/GlassCard';
import BrainNetwork from '@/components/BrainNetwork';
import { SEED_ACTIVITIES } from '@/lib/mock-data';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity as ActivityIcon, CheckCircle, Zap, Users, Brain } from 'lucide-react';

const chartData = [
  { name: 'Mon', active: 12 },
  { name: 'Tue', active: 18 },
  { name: 'Wed', active: 15 },
  { name: 'Thu', active: 22 },
  { name: 'Fri', active: 30 },
  { name: 'Sat', active: 25 },
  { name: 'Sun', active: 28 },
];

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">System Intelligence</h2>
          <p className="text-[13px] text-zinc-500">Neural network processing aidot ecosystem data in real-time.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border-white/5 bg-white/[0.02]">
          <Brain size={14} className="text-blue-400" />
          <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">aidot Core v3.1</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Agents', value: '12', icon: <Zap size={18} />, color: 'text-amber-400' },
          { label: 'Pending Tasks', value: '8', icon: <ActivityIcon size={18} />, color: 'text-blue-400' },
          { label: 'Tasks Done', value: '142', icon: <CheckCircle size={18} />, color: 'text-emerald-400' },
          { label: 'Collaborators', value: '24', icon: <Users size={18} />, color: 'text-purple-400' },
        ].map((stat, idx) => (
          <GlassCard key={idx} delay={idx * 0.05} className="flex flex-col gap-3">
            <div className={`p-2 w-fit rounded-lg bg-white/5 border border-white/10 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 h-[420px] p-0 flex flex-col relative overflow-hidden" delay={0.2}>
          <div className="absolute top-6 left-6 z-10">
            <h3 className="text-[14px] font-semibold text-white">Neural Manifestation</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Visualization of ecosystem capabilities and knowledge paths.</p>
          </div>
          <div className="flex-1 w-full bg-[#0c0c0e]">
            <BrainNetwork />
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-zinc-600 uppercase">Knowledge Density</span>
                <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-zinc-600 uppercase">Latency Handshake</span>
                <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                </div>
              </div>
            </div>
            <button className="pointer-events-auto px-4 py-2 rounded-xl glass border-white/10 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/5 transition-all">
              Analyze Connections
            </button>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="flex flex-col gap-6" delay={0.25}>
            <h3 className="text-[14px] font-semibold text-white">Agent Utilization</h3>
            <div className="h-[140px] -mx-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-zinc-500 font-medium">Peak Efficiency</span>
                <span className="text-[12px] text-emerald-400 font-bold">92.4%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[92%] h-full bg-emerald-500" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-4" delay={0.3}>
            <h3 className="text-[14px] font-semibold text-white">Latest Activity</h3>
            <div className="flex flex-col gap-3">
              {SEED_ACTIVITIES.slice(0, 3).map((act) => (
                <div key={act.id} className="flex gap-3 items-start group">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-blue-500 transition-colors" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[12px] text-zinc-300 font-medium leading-none">{act.title}</span>
                    <span className="text-[10px] text-zinc-600 truncate max-w-[150px]">{act.description}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-2 text-[10px] text-zinc-500 hover:text-white transition-colors uppercase font-bold tracking-widest text-center py-2 border border-white/5 rounded-lg hover:bg-white/5">
              Full Activity Log
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
