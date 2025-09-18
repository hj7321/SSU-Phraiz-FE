import { PLAN_NUMBER } from "@/constants/planNumber";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PlanTier = "Free" | "Basic" | "Standard" | "Pro";

interface AuthState {
  isLogin: boolean;
  accessToken: string | null;
  login: (token: string, userName: string, planId: number) => void;
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
      accessToken: null,
      login: (token, name, planId) =>
        set({
          isLogin: true,
          accessToken: token,
          userName: name,
          planTier: PLAN_NUMBER[planId],
        }),
      logout: () =>
        set({
          isLogin: false,
          accessToken: null,
          userName: null,
          planTier: null,
        }),
      userName: null,
      setUserName: (name) => set({ userName: name }),
      planTier: "Free",
      setPlanTier: (tier) => set({ planTier: tier }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
