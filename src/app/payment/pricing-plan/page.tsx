import PricingPlan from "@/components/landing/PricingPlan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "요금제 설명",
  alternates: { canonical: "/pricing-plan" },
};

export default function PricingPlanPage() {
  return <PricingPlan />;
}
