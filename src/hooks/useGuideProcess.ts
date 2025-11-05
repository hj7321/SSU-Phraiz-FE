"use client";

import { useGuideStore } from "@/stores/guide.store";
import { ServiceCode } from "@/types/common.type";

export function useGuideProgress(service: ServiceCode) {
  const get = useGuideStore((s) => s.getStep);
  const set = useGuideStore((s) => s.setStep);
  const reset = useGuideStore((s) => s.resetStep);
  return {
    get: () => get(service),
    set: (step1Based: number | null) => set(service, step1Based),
    reset: () => reset(service),
  };
}
