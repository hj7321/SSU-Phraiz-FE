import { create } from "zustand";

interface NavbarState {
  isOpenNavbar: boolean;
  openNavbar: () => void;
  closeNavbar: () => void;
  toggleNavbar: () => void;
}

export const useNavbarStore = create<NavbarState>((set) => ({
  isOpenNavbar: false,
  openNavbar: () => set({ isOpenNavbar: true }),
  closeNavbar: () => set({ isOpenNavbar: false }),
  toggleNavbar: () => set((state) => ({ isOpenNavbar: !state.isOpenNavbar })),
}));
