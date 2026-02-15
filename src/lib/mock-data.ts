import type { Activity, CalendarEvent, Task, Contact, ContentDraft, EcosystemProduct, Agent } from '@/types';

export const SEED_ACTIVITIES: Activity[] = [
  { id: '1', type: 'agent', title: 'Agent Prime', description: 'Finished web crawling task for project "Zephyr"', timestamp: Date.now() - 3600000 },
  { id: '2', type: 'task', title: 'Update Pipeline', description: 'Infrastructure update completed successfully', timestamp: Date.now() - 7200000 },
  { id: '3', type: 'system', title: 'Security Scan', description: 'No threats detected in workspace directory', timestamp: Date.now() - 14400000 },
];

export const SEED_TASKS: Task[] = [
  { id: 't1', title: 'Research competitor APIs', status: 'in-progress', priority: 'high' },
  { id: 't2', title: 'Design system refinements', status: 'todo', priority: 'medium' },
  { id: 't3', title: 'Team sync preparation', status: 'done', priority: 'low' },
  { id: 't4', title: 'Gemini model integration', status: 'in-progress', priority: 'high' },
];

export const SEED_AGENTS: Agent[] = [
  { id: 'a1', name: 'Synthesizer', status: 'active', capabilities: ['Text Generation', 'Analysis'] },
  { id: 'a2', name: 'Visionary', status: 'idle', capabilities: ['Image Generation', 'OCR'] },
  { id: 'a3', name: 'CoderX', status: 'active', capabilities: ['TypeScript', 'Python', 'Refactoring'] },
];

export const SEED_CALENDAR: CalendarEvent[] = [
  { id: 'e1', title: 'Strategy Session', start: Date.now() + 3600000, end: Date.now() + 7200000, category: 'work' },
  { id: 'e2', title: 'AI Ethics Workshop', start: Date.now() + 86400000, end: Date.now() + 90000000, category: 'ai' },
];

export const SEED_ECOSYSTEM: EcosystemProduct[] = [
  { id: 'p1', name: 'aidot Cloud', description: 'Distributed computing for large-scale AI tasks.', category: 'Compute', slug: 'cloud' },
  { id: 'p2', name: 'Insight Analytics', description: 'Real-time monitoring for your agent workforce.', category: 'Monitoring', slug: 'analytics' },
  { id: 'p3', name: 'Prompt Vault', description: 'Version controlled, encrypted prompt management.', category: 'Storage', slug: 'vault' },
];

export const SEED_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Alex Rivera', email: 'alex@aidot.io', avatar: 'https://picsum.photos/seed/alex/32/32' },
  { id: 'c2', name: 'Sam Chen', email: 'sam@aidot.io', avatar: 'https://picsum.photos/seed/sam/32/32' },
];
