import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SunoTask } from '@/types/suno';

interface SunoState {
  baseUrl: string;
  apiKey: string;
  tasks: SunoTask[];
  autoCheckInterval: number; // in seconds
  setBaseUrl: (url: string) => void;
  setApiKey: (key: string) => void;
  addTask: (task: SunoTask) => void;
  updateTask: (taskId: string, updates: Partial<SunoTask>) => void;
  setAutoCheckInterval: (interval: number) => void;
  deleteTask: (taskId: string) => void;
  renameTask: (taskId: string, newTitle: string) => void;
}

export const useSunoStore = create<SunoState>()(
  persist(
    (set) => ({
      baseUrl: '',
      apiKey: '',
      tasks: [],
      autoCheckInterval: 5, // default to 5 seconds
      setBaseUrl: (url) => set({ baseUrl: url }),
      setApiKey: (key) => set({ apiKey: key }),
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        })),
      setAutoCheckInterval: (interval) => set({ autoCheckInterval: interval }),
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
    }),
    {
      name: 'suno-client-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        baseUrl: state.baseUrl, 
        apiKey: state.apiKey,
        tasks: state.tasks,
        autoCheckInterval: state.autoCheckInterval 
      }),
    }
  )
);