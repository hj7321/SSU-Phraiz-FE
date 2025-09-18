import { PlanTier } from "@/stores/auth.store";

export type PlanNumber = {
  [key: number]: PlanTier;
};

export const PLAN_NUMBER: PlanNumber = {
  1: "Free",
  2: "Basic",
  3: "Standard",
  4: "Pro",
};
