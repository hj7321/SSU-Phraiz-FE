import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PlanTier = "Free" | "Basic" | "Standard" | "Pro";

interface AuthState {
  isLogin: boolean;
  login: (userName: string) => void;
  logout: () => void;
  userName: string | null;
  setUserName: (name: string) => void;
  planTier: PlanTier | null;
  setPlanTier: (tier: PlanTier) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLogin: false,
      login: (name) => set({ isLogin: true, userName: name, planTier: "Free" }),
      logout: () => set({ isLogin: false, planTier: null }),
      userName: null,
      setUserName: (name) => set({ userName: name }),
      planTier: "Free",
      setPlanTier: (tier) => set({ planTier: tier }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
