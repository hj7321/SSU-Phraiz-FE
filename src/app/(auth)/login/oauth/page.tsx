import { Suspense } from "react";
import OAuthRedirectPageContent from "./OAuthRedirectPageContent";

export default function OAuthRedirectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthRedirectPageContent />
    </Suspense>
  );
}
