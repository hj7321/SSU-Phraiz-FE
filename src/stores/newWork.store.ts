import { create } from "zustand";

interface NewWorkState {
  version: number;
  trigger: () => void;
}

export const useNewWorkStore = create<NewWorkState>((set) => ({
  version: 0,
  trigger: () => set((s) => ({ version: s.version + 1 })),
}));
