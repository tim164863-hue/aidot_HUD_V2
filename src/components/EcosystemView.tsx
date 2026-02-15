import React from 'react';
import GlassCard from '@/components/GlassCard';
import { SEED_ECOSYSTEM } from '@/lib/mock-data';
import { Globe, ArrowRight } from 'lucide-react';

const EcosystemView: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">Ecosystem</h2>
        <p className="text-[13px] text-zinc-500">Explore integrated tools and external platform connectors.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SEED_ECOSYSTEM.map((product, idx) => (
          <GlassCard key={product.id} delay={idx * 0.1} className="flex flex-col md:flex-row gap-6 p-6 items-center md:items-start group">
            <div className="w-16 h-16 rounded-2xl glass border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-500">
              <Globe size={28} />
            </div>
            <div className="flex-1 flex flex-col gap-2 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-white">{product.name}</h3>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {product.category}
                </span>
              </div>
              <p className="text-[13px] text-zinc-500 leading-relaxed mb-4">
                {product.description}
              </p>
              <button className="w-fit flex items-center gap-2 text-[11px] font-bold text-white hover:text-blue-400 transition-colors">
                Explore Documentation
                <ArrowRight size={12} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 py-12 border-t border-white/5">
        <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-bold">Integrated With</p>
        <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale contrast-150 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="text-lg font-bold text-white tracking-tighter">GITHUB</span>
          <span className="text-lg font-bold text-white tracking-tighter">AWS</span>
          <span className="text-lg font-bold text-white tracking-tighter">STRIPE</span>
          <span className="text-lg font-bold text-white tracking-tighter">NOTION</span>
          <span className="text-lg font-bold text-white tracking-tighter">SLACK</span>
        </div>
      </div>
    </div>
  );
};

export default EcosystemView;
