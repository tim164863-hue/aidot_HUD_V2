import React from 'react';
import {
  LayoutDashboard,
  Terminal,
  Bot,
  MessageSquare,
  Calendar,
  FileEdit,
  Globe,
  BookOpen,
  Code2,
  Focus,
} from 'lucide-react';
import { AppView } from '@/types';

export const NAVIGATION = [
  { id: AppView.HUD, label: 'Mission HUD', icon: <Focus size={18} /> },
  { id: AppView.DASHBOARD, label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { id: AppView.OPS, label: 'Ops', icon: <Terminal size={18} /> },
  { id: AppView.AGENTS, label: 'Agents', icon: <Bot size={18} /> },
  { id: AppView.CHAT, label: 'Chat', icon: <MessageSquare size={18} /> },
  { id: AppView.CALENDAR, label: 'Calendar', icon: <Calendar size={18} /> },
  { id: AppView.CONTENT, label: 'Content', icon: <FileEdit size={18} /> },
  { id: AppView.ECOSYSTEM, label: 'Ecosystem', icon: <Globe size={18} /> },
  { id: AppView.KNOWLEDGE, label: 'Knowledge', icon: <BookOpen size={18} /> },
  { id: AppView.CODE, label: 'Code', icon: <Code2 size={18} /> },
];

export const APP_WORKSPACE_PATH = import.meta.env.VITE_WORKSPACE_PATH || '~/.aidot/workspace/';
