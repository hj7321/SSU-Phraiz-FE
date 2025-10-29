import { create } from "zustand";

interface CitationState {
  newCitation: string | null;
  setNewCitation: (citation: string) => void;
}

export const useCitationStore = create<CitationState>()((set) => ({
  newCitation: null,
  setNewCitation: (citation) => set({ newCitation: citation }),
}));
