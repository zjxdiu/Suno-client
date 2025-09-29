import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SunoTask } from '@/types/suno';

export interface CustomHistoryItem {
  prompt: string;
  tags: string;
  title: string;
}

interface SunoState {
  baseUrl: string;
  apiKey: string;
  tasks: SunoTask[];
  autoCheckInterval: number; // in seconds
  autoRename: boolean;
  creativeHistory: string[];
  customHistory: CustomHistoryItem[];
  setBaseUrl: (url: string) => void;
  setApiKey: (key: string) => void;
  addTask: (task: SunoTask) => void;
  updateTask: (taskId: string, updates: Partial<SunoTask>) => void;
  setAutoCheckInterval: (interval: number) => void;
  setAutoRename: (enabled: boolean) => void;
  deleteTask: (taskId: string) => void;
  renameTask: (taskId: string, newTitle: string) => void;
  toggleTaskExpansion: (taskId: string) => void;
  addCreativeHistoryItem: (prompt: string) => void;
  addCustomHistoryItem: (item: CustomHistoryItem) => void;
  importState: (newState: Partial<SunoState>) => void;
}

export const useSunoStore = create<SunoState>()(
  persist(
    (set) => ({
      baseUrl: '',
      apiKey: '',
      tasks: [],
      autoCheckInterval: 5, // default to 5 seconds
      autoRename: false, // default to false
      creativeHistory: [],
      customHistory: [],
      setBaseUrl: (url) => set({ baseUrl: url }),
      setApiKey: (key) => set({ apiKey: key }),
      addTask: (task) => set((state) => {
        const newTask = { ...task, isExpanded: true };
        return { tasks: [newTask, ...state.tasks] };
      }),
      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        })),
      setAutoCheckInterval: (interval) => set({ autoCheckInterval: interval }),
      setAutoRename: (enabled) => set({ autoRename: enabled }),
      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),
      renameTask: (taskId, newTitle) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, title: newTitle } : task
          ),
        })),
      toggleTaskExpansion: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, isExpanded: !task.isExpanded } : task
          ),
        })),
      addCreativeHistoryItem: (prompt) => set((state) => {
        if (!prompt.trim()) return {};
        const newHistory = [prompt, ...state.creativeHistory.filter(h => h !== prompt)].slice(0, 50);
        return { creativeHistory: newHistory };
      }),
      addCustomHistoryItem: (item) => set((state) => {
        if (!item.tags.trim() && !item.title.trim() && !item.prompt.trim()) return {};
        const newHistory = [item, ...state.customHistory.filter(h => !(h.prompt === item.prompt && h.tags === item.tags && h.title === item.title))].slice(0, 50);
        return { customHistory: newHistory };
      }),
      importState: (newState) => set(newState),
    }),
    {
      name: 'suno-client-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        baseUrl: state.baseUrl, 
        apiKey: state.apiKey,
        tasks: state.tasks,
        autoCheckInterval: state.autoCheckInterval,
        autoRename: state.autoRename,
        creativeHistory: state.creativeHistory,
        customHistory: state.customHistory,
      }),
    }
  )
);