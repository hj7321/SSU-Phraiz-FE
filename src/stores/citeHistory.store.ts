import { HistoryCiteContent } from "@/types/history.type";
import { create } from "zustand";

interface CiteHistoryState {
  selectedCiteHistory: HistoryCiteContent | null;
  setSelectedCiteHistory: (history: HistoryCiteContent) => void;
  clearCiteHistory: () => void;
}

export const useCiteHistoryStore = create<CiteHistoryState>()((set) => ({
  selectedCiteHistory: null,
  setSelectedCiteHistory: (history) => set({ selectedCiteHistory: history }),
  clearCiteHistory: () => set({ selectedCiteHistory: null }),
}));
