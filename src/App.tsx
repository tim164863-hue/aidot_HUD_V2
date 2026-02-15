import React, { useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { AppView } from '@/types';
import Layout from '@/components/Layout';
import HUDView from '@/components/HUDView';
import DashboardOverview from '@/components/DashboardOverview';
import OpsView from '@/components/OpsView';
import AgentsView from '@/components/AgentsView';
import ChatCenterView from '@/components/ChatCenterView';
import CalendarView from '@/components/CalendarView';
import ContentDraftsView from '@/components/ContentDraftsView';
import EcosystemView from '@/components/EcosystemView';
import KnowledgeView from '@/components/KnowledgeView';
import CodeView from '@/components/CodeView';

const App: React.FC = () => {
  const { activeView, isLoaded, setLoaded } = useAppStore();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, [setLoaded]);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#050507]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-t-2 border-white/40 animate-spin" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-medium animate-pulse">
            Booting aidot OS
          </p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case AppView.HUD: return <HUDView />;
      case AppView.DASHBOARD: return <DashboardOverview />;
      case AppView.OPS: return <OpsView />;
      case AppView.AGENTS: return <AgentsView />;
      case AppView.CHAT: return <ChatCenterView />;
      case AppView.CALENDAR: return <CalendarView />;
      case AppView.CONTENT: return <ContentDraftsView />;
      case AppView.ECOSYSTEM: return <EcosystemView />;
      case AppView.KNOWLEDGE: return <KnowledgeView />;
      case AppView.CODE: return <CodeView />;
      default: return <HUDView />;
    }
  };

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
};

export default App;
