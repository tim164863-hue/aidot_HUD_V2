// OpenClaw data service - fetches real agent/cron/stats data from API proxy
import { api } from './api';

export interface AgentData {
  id: string;
  name: string;
  model: string;
  identity: { name?: string; theme?: string } | null;
  status: 'active' | 'idle' | 'offline';
  capabilities: string[];
  lastActive: string | null;
  tokenUsage: Record<string, unknown> | null;
}

export interface CronJob {
  id: string;
  agentId: string;
  name: string;
  enabled: boolean;
  schedule: { kind: string; expr?: string; tz?: string; atMs?: number };
  sessionTarget: string;
  payload: { kind: string; message?: string };
  state?: {
    nextRunAtMs?: number;
    lastRunAtMs?: number;
    lastStatus?: string;
    lastDurationMs?: number;
  };
}

export interface SystemStats {
  agents: { total: number; active: number };
  cron: { total: number; enabled: number; lastRunStatuses: string[] };
  tokenUsage: number;
  uptime: number;
}

export interface AgentDetail extends AgentData {
  soul: string | null;
  identityMd: string | null;
  sessionCount: number;
}

export interface ActivityEntry {
  timestamp?: string;
  role?: string;
  content?: string;
}

export async function fetchAgents(): Promise<AgentData[]> {
  const data = await api.get<{ agents: AgentData[] }>('/api/agents');
  return data.agents;
}

export async function fetchAgentDetail(id: string): Promise<AgentDetail> {
  return api.get<AgentDetail>(`/api/agents/${id}`);
}

export async function fetchAgentActivity(id: string, limit = 20): Promise<ActivityEntry[]> {
  const data = await api.get<{ activity: ActivityEntry[] }>(`/api/agents/${id}/activity?limit=${limit}`);
  return data.activity;
}

export async function fetchCronJobs(): Promise<CronJob[]> {
  const data = await api.get<{ jobs: CronJob[] }>('/api/cron/jobs');
  return data.jobs;
}

export async function fetchStats(): Promise<SystemStats> {
  return api.get<SystemStats>('/api/stats');
}

export async function fetchHealth(): Promise<{ status: string; uptime: number; version: string }> {
  return api.get('/api/health');
}
