import { create } from 'zustand';
import type { Agent } from '@/types';
import { fetchAgents as fetchAgentsApi, type AgentData } from '@/services/openclaw';
import { SEED_AGENTS } from '@/lib/mock-data';

interface AgentsState {
  agents: Agent[];
  selectedAgent: Agent | null;
  loading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
  selectAgent: (agent: Agent) => void;
  updateAgentStatus: (id: string, status: Agent['status']) => void;
}

function toAgent(data: AgentData): Agent {
  return {
    id: data.id,
    name: data.identity?.name || data.name,
    status: data.status === 'active' ? 'active' : data.status === 'idle' ? 'idle' : 'offline',
    capabilities: data.capabilities.slice(0, 5),
  };
}

export const useAgentsStore = create<AgentsState>((set, get) => ({
  agents: SEED_AGENTS,
  selectedAgent: SEED_AGENTS[0],
  loading: false,
  error: null,
  fetchAgents: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchAgentsApi();
      const agents = data.map(toAgent);
      const current = get().selectedAgent;
      const selected = current ? agents.find(a => a.id === current.id) || agents[0] : agents[0];
      set({ agents, selectedAgent: selected, loading: false });
    } catch (err) {
      console.error('Failed to fetch agents:', err);
      // Fallback to seed data
      set({ agents: SEED_AGENTS, loading: false, error: 'Failed to load agents' });
    }
  },
  selectAgent: (agent) => set({ selectedAgent: agent }),
  updateAgentStatus: (id, status) =>
    set((s) => ({
      agents: s.agents.map((a) => (a.id === id ? { ...a, status } : a)),
    })),
}));
