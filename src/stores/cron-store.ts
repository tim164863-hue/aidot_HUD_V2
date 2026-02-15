import { create } from 'zustand';
import { fetchCronJobs as fetchCronApi, fetchStats as fetchStatsApi, type CronJob, type SystemStats } from '@/services/openclaw';

interface CronState {
  jobs: CronJob[];
  stats: SystemStats | null;
  loading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

export const useCronStore = create<CronState>((set) => ({
  jobs: [],
  stats: null,
  loading: false,
  error: null,
  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const jobs = await fetchCronApi();
      set({ jobs, loading: false });
    } catch (err) {
      console.error('Failed to fetch cron jobs:', err);
      set({ loading: false, error: 'Failed to load cron jobs' });
    }
  },
  fetchStats: async () => {
    try {
      const stats = await fetchStatsApi();
      set({ stats });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  },
}));
