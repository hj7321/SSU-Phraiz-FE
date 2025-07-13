import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SidebarState {
  isOpenSidebar: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpenSidebar: false,
      openSidebar: () => set({ isOpenSidebar: true }),
      closeSidebar: () => set({ isOpenSidebar: false }),
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
