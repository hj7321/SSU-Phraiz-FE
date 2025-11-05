"use client";

import { ServiceCode } from "@/types/common.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type GuideState = {
  // 서비스별 마지막 단계(1-based). null이면 처음(1)부터 시작
  progress: Record<ServiceCode, number | null>;
  getStep: (svc: ServiceCode) => number | null;
  setStep: (svc: ServiceCode, step: number | null) => void;
  resetStep: (svc: ServiceCode) => void;
  resetAllStep: () => void;
};

export const useGuideStore = create<GuideState>()(
  persist(
    (set, get) => ({
      progress: {
        paraphrase: null,
        summary: null,
        cite: null,
      },
      getStep: (svc) => get().progress[svc],
      setStep: (svc, step) =>
        set((s) => ({ progress: { ...s.progress, [svc]: step } })),
      resetStep: (svc) =>
        set((s) => ({ progress: { ...s.progress, [svc]: null } })),
      resetAllStep: () =>
        set(() => ({
          progress: { paraphrase: null, summary: null, cite: null },
        })),
    }),
    {
      name: "guide-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
