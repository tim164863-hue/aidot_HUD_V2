import React, { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { Terminal, Play, Save, Code2, Layers } from 'lucide-react';

const CodeView: React.FC = () => {
  const [activeFile, setActiveFile] = useState('main.ts');

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Code Pipeline</h2>
          <p className="text-[13px] text-zinc-500">Live development environment and CI/CD status.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 glass rounded-xl border-white/10 text-[11px] font-bold text-zinc-400 hover:text-white transition-all">
            <Save size={14} />
            Save All
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-xl text-[11px] font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10">
            <Play size={14} fill="currentColor" />
            Execute
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 min-h-0">
        <GlassCard className="w-64 flex flex-col p-4 gap-4" delay={0.1}>
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Workspace</h3>
            <Layers size={14} className="text-zinc-600" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {['main.ts', 'utils.ts', 'api/routes.ts', 'types.ts', 'config.json'].map(file => (
              <button
                key={file}
                onClick={() => setActiveFile(file)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[12px] transition-all flex items-center gap-2 ${
                  activeFile === file ? 'bg-white/10 text-white font-medium' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                <Code2 size={12} className={activeFile === file ? 'text-blue-400' : 'text-zinc-700'} />
                {file}
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="flex-1 flex flex-col gap-6 min-h-0">
          <GlassCard className="flex-1 p-0 overflow-hidden flex flex-col" delay={0.2}>
            <div className="bg-black/40 border-b border-white/5 px-4 py-2 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
              </div>
              <span className="text-[11px] text-zinc-500 font-mono tracking-tight">{activeFile}</span>
            </div>
            <div className="flex-1 p-4 font-mono text-[12px] text-zinc-400 leading-relaxed overflow-y-auto bg-black/20">
              <pre className="whitespace-pre-wrap">
                {`import { Agent } from './types';\n\n// Initialize the main agent controller\nconst controller = new Agent({\n  id: 'prime_01',\n  capabilities: ['NLP', 'CODE_GEN'],\n  region: 'us-east-1'\n});\n\nexport async function main() {\n  console.log('aidot Booting...');\n  await controller.sync();\n  \n  // Start background monitoring tasks\n  controller.on('event', (e) => {\n    console.info(\`[Event] \${e.type}: \${e.payload}\`);\n  });\n\n  return controller.status;\n}`}
              </pre>
            </div>
          </GlassCard>

          <GlassCard className="h-32 p-4 bg-black/60 border-white/10" delay={0.3}>
            <div className="flex items-center gap-2 mb-2 text-zinc-500">
              <Terminal size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Output / Terminal</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-500/80">
              &gt; Compilation successful. Finished in 242ms.<br />
              &gt; Listening on port 4000...<br />
              &gt; Agent Prime online. Ready for tasking.
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CodeView;
