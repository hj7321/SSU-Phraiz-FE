import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PlanTier = "Free" | "Basic" | "Standard" | "Pro";

interface AuthState {
  isLogin: boolean;
  login: (name: string, tier: PlanTier) => void;
  logout: () => void;
  userName: string | null;
  setUserName: (name: string) => void;
  planTier: PlanTier;
  setPlanTier: (tier: PlanTier) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLogin: false,
      login: (name, tier) =>
        set({ isLogin: true, userName: name, planTier: tier }),
      logout: () => set({ isLogin: false, userName: null, planTier: "Free" }),
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
