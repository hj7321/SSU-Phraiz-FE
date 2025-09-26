import { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const OAuthRedirectPageContent = dynamic(
  () => import("./OAuthRedirectPageContent"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "소셜 로그인",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login/oauth" },
};

export default function OAuthRedirectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthRedirectPageContent />
    </Suspense>
  );
}
