import { create } from 'zustand';
import type { ChatMessage, Agent } from '@/types';
import { chatStream } from '@/services/gemini';

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent) => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    { id: '1', role: 'assistant', content: 'Hello! I am aidot Assistant. How can I help you manage your ecosystem today?' },
  ],
  isTyping: false,
  selectedAgent: null,
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  sendMessage: async (content: string) => {
    if (!content.trim() || get().isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content };
    const assistantId = (Date.now() + 1).toString();

    set((s) => ({
      messages: [...s.messages, userMsg, { id: assistantId, role: 'assistant', content: '' }],
      isTyping: true,
    }));

    const agent = get().selectedAgent;
    const prompt = agent ? `[Acting as ${agent.name}] ${content}` : content;

    await chatStream(prompt, (fullText) => {
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === assistantId ? { ...m, content: fullText } : m
        ),
      }));
    });

    set({ isTyping: false });
  },
  clearMessages: () =>
    set({
      messages: [
        { id: '1', role: 'assistant', content: 'Hello! I am aidot Assistant. How can I help you manage your ecosystem today?' },
      ],
    }),
}));
