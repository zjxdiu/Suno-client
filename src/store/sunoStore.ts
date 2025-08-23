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
    }),
    {
      name: 'suno-client-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ 
        baseUrl: state.baseUrl, 
        apiKey: state.apiKey,
        tasks: state.tasks, // also persist tasks
        autoCheckInterval: state.autoCheckInterval 
      }),
    }
  )
);