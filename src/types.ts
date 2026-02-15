export enum AppView {
  DASHBOARD = 'dashboard',
  HUD = 'hud',
  OPS = 'ops',
  AGENTS = 'agents',
  CHAT = 'chat',
  CALENDAR = 'calendar',
  CONTENT = 'content',
  ECOSYSTEM = 'ecosystem',
  KNOWLEDGE = 'knowledge',
  CODE = 'code',
}

export interface Activity {
  id: string;
  type: 'task' | 'agent' | 'event' | 'system';
  title: string;
  description: string;
  timestamp: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: number;
  end: number;
  category: 'work' | 'personal' | 'ai';
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ContentDraft {
  id: string;
  title: string;
  content: string;
  type: 'post' | 'article' | 'script';
  status: 'draft' | 'review' | 'published';
}

export interface EcosystemProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  slug: string;
}

export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'offline';
  capabilities: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
