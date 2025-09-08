import { create } from "zustand";

interface CitationState {
  newCitation: string | null;
  changedCitation: string | null;
  setCitation: (citation: string) => void;
}

export const useCitationStore = create<CitationState>()((set) => ({
  newCitation: null,
  changedCitation: null,
  setCitation: (citation) => set({ newCitation: citation }),
}));
