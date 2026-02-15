import { create } from 'zustand';
import type { Agent } from '@/types';
import { SEED_AGENTS } from '@/lib/mock-data';

interface AgentsState {
  agents: Agent[];
  selectedAgent: Agent | null;
  loading: boolean;
  error: string | null;
  fetchAgents: () => void;
  selectAgent: (agent: Agent) => void;
  updateAgentStatus: (id: string, status: Agent['status']) => void;
}

export const useAgentsStore = create<AgentsState>((set) => ({
  agents: SEED_AGENTS,
  selectedAgent: SEED_AGENTS[0],
  loading: false,
  error: null,
  fetchAgents: () => {
    set({ loading: true, error: null });
    // Mock fetch - replace with real API call
    setTimeout(() => {
      set({ agents: SEED_AGENTS, loading: false });
    }, 300);
  },
  selectAgent: (agent) => set({ selectedAgent: agent }),
  updateAgentStatus: (id, status) =>
    set((s) => ({
      agents: s.agents.map((a) => (a.id === id ? { ...a, status } : a)),
    })),
}));
