import { create } from "zustand";

interface SidebarBridgeState {
  open: boolean;
  toggle: () => void;
  openSidebar: () => void;
  close: () => void;
}

export const useSidebarBridge = create<SidebarBridgeState>((set) => ({
  open: false,
  toggle: () => set((s) => ({ open: !s.open })),
  openSidebar: () => set({ open: true }),
  close: () => set({ open: false }),
}));
