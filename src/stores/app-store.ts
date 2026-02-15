import { create } from 'zustand';
import { AppView } from '@/types';

interface AppState {
  activeView: AppView;
  isLoaded: boolean;
  isSidebarOpen: boolean;
  theme: 'dark';
  setActiveView: (view: AppView) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLoaded: (loaded: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeView: AppView.HUD,
  isLoaded: false,
  isSidebarOpen: false,
  theme: 'dark',
  setActiveView: (view) => set({ activeView: view }),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
}));
