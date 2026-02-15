import React from 'react';
import { NAVIGATION } from '@/constants';
import { AppView } from '@/types';
import { useAppStore } from '@/stores/app-store';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { activeView, setActiveView, isSidebarOpen, toggleSidebar, setSidebarOpen } = useAppStore();
  const isHUD = activeView === AppView.HUD;

  return (
    <div className={`flex flex-col md:flex-row h-screen overflow-hidden ${isHUD ? 'bg-[#050507]' : 'bg-[#09090b]'}`}>
      {/* Floating Toggle Button for HUD Mode */}
      {isHUD && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6 left-6 z-[100] p-3 glass border-white/10 rounded-xl text-white hover:bg-white/5 transition-all active:scale-95"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-50 flex flex-col w-64 glass border-r-0 border-white/[0.04] p-6 gap-8 h-full transition-transform duration-500 ease-in-out
          ${isHUD ? (isSidebarOpen ? 'translate-x-0 bg-[#050507]/95' : '-translate-x-full') : 'translate-x-0'}
          ${!isHUD ? 'hidden md:flex' : 'flex'}
        `}
      >
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
            <span className="font-bold text-white text-lg">a</span>
          </div>
          <h1 className="text-white font-semibold tracking-tight">aidot</h1>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto">
          {NAVIGATION.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                if (isHUD) setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-[13px] font-medium
                ${activeView === item.id
                  ? 'bg-white/10 text-white shadow-sm border border-white/10'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'}`}
            >
              <span className={activeView === item.id ? 'text-white' : 'text-zinc-600'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto pb-24 md:pb-0 relative h-full">
        {!isHUD && (
          <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 glass border-b-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">System Status:</span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Optimal
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <img src="https://picsum.photos/seed/u1/32/32" className="w-8 h-8 rounded-full border-2 border-[#09090b]" alt="U1" />
                <img src="https://picsum.photos/seed/u2/32/32" className="w-8 h-8 rounded-full border-2 border-[#09090b]" alt="U2" />
              </div>
              <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white">
                <span className="sr-only">Notifications</span>
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </button>
            </div>
          </header>
        )}

        <div className={`flex-1 ${isHUD ? 'p-0' : 'p-6 md:p-8 max-w-7xl mx-auto w-full'}`}>
          {children}
        </div>
      </main>

      {/* Tab Bar for Mobile */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/[0.04] px-4 py-2 flex items-center justify-around ${isHUD ? 'bg-black/50 backdrop-blur-md' : ''}`}>
        {NAVIGATION.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-1 p-2 transition-all duration-200
              ${activeView === item.id ? 'text-white' : 'text-zinc-600'}`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Overlay when sidebar is open in HUD mode on mobile */}
      {isHUD && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Layout;
