import LandingSection from "@/components/landing/LandingSection";
import Main from "@/components/landing/Main";
import PricingPlan from "@/components/landing/PricingPlan";
import Footer from "@/components/landing/Footer";
import { SERVICE_LINK } from "@/constants/serviceLink";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <div className="">
        <Main />
        {SERVICE_LINK.map((service, idx) => (
          <LandingSection key={service.id} data={service} idx={idx} />
        ))}
        <PricingPlan />
        <Footer />
      </div>
    </>
  );
}
