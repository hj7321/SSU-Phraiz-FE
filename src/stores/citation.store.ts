import { create } from "zustand";

interface CitationState {
  newCitation: string | null;
  changedCitation: string | null;
  setNewCitation: (citation: string) => void;
  setChangedCitation: (citation: string) => void;
}

export const useCitationStore = create<CitationState>()((set) => ({
  newCitation: null,
  changedCitation: null,
  setNewCitation: (citation) => set({ newCitation: citation }),
  setChangedCitation: (citation) => set({ changedCitation: citation }),
}));
