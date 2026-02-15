import React from 'react';
import GlassCard from '@/components/GlassCard';
import { FileText, MoreHorizontal, ExternalLink, Plus } from 'lucide-react';

const DRAFTS = [
  { id: '1', title: 'The Future of Agentic OS', type: 'article', status: 'Review' },
  { id: '2', title: 'Quarterly Cloud Report', type: 'script', status: 'Draft' },
  { id: '3', title: 'aidot Launch Thread', type: 'post', status: 'Published' },
];

const ContentDraftsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Content Drafts</h2>
          <p className="text-[13px] text-zinc-500">Create, review, and schedule across platforms.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DRAFTS.map((draft, idx) => (
          <GlassCard key={draft.id} delay={idx * 0.1} className="group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 group-hover:text-blue-400 transition-colors">
                <FileText size={20} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  draft.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {draft.status}
                </span>
                <button className="text-zinc-600 hover:text-white">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>

            <h3 className="text-[15px] font-bold text-white mb-2 line-clamp-2 leading-snug">
              {draft.title}
            </h3>
            <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-tight mb-4">
              {draft.type}
            </p>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 rounded-xl glass border-white/10 text-[11px] font-bold text-white hover:bg-white/5 transition-all">
                Edit
              </button>
              <button className="p-2 rounded-xl glass border-white/10 text-zinc-500 hover:text-white transition-all">
                <ExternalLink size={14} />
              </button>
            </div>
          </GlassCard>
        ))}

        <button className="h-full min-h-[180px] rounded-[20px] border-2 border-dashed border-white/5 hover:border-white/10 transition-all flex flex-col items-center justify-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-white transition-colors">
            <Plus size={20} />
          </div>
          <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-600">New Content Draft</span>
        </button>
      </div>
    </div>
  );
};

export default ContentDraftsView;
