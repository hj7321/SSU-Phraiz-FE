import { HistoryAIContent } from "@/types/history.type";
import { create } from "zustand";

interface AiHistoryState {
  selectedAiHistory: HistoryAIContent | null;
  setSelectedAiHistory: (history: HistoryAIContent) => void;
  clearAiHistory: () => void;
}

export const useAiHistoryStore = create<AiHistoryState>()((set) => ({
  selectedAiHistory: null,
  setSelectedAiHistory: (history) => set({ selectedAiHistory: history }),
  clearAiHistory: () => set({ selectedAiHistory: null }),
}));
