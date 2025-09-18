import { HistoryContent } from "@/types/history.type";
import { create } from "zustand";

interface HistoryState {
  selectedHistory: HistoryContent | null;
  setSelectedHistory: (history: HistoryContent) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()((set) => ({
  selectedHistory: null,
  setSelectedHistory: (history) => set({ selectedHistory: history }),
  clearHistory: () => set({ selectedHistory: null }),
}));
