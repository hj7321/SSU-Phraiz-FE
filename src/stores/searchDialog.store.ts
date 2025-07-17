import { create } from "zustand";

interface SearchDialogState {
  isOpenDialog: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useSearchDialogStore = create<SearchDialogState>((set) => ({
  isOpenDialog: false,
  openDialog: () => set({ isOpenDialog: true }),
  closeDialog: () => set({ isOpenDialog: false }),
}));
