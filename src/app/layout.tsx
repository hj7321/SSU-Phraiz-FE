import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./_provider";
import Header from "@/components/layout/Header";
import Script from "next/script";
import MobileHeader from "@/components/layout/MobileHeader";
import MobileNavBar from "@/components/layout/MobileNavBar";
import Analytics from "./Analytics";
import { Suspense } from "react";
import ResponsiveSidebarProvider from "@/components/ui/sidebar/ResponsiveSidebarProvider"; // ✅ 추가
import TopButton from "@/components/layout/TopButton";
import ScrollToTop from "@/components/layout/ScrollToTop";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.phraiz.com"),
  title: { default: "Phraiz", template: "%s | Phraiz" },
  description:
    "문장 변환, 요약, 인용 생성을 지원하는 AI 기반 통합 글쓰기 웹사이트",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.phraiz.com/",
    title: "Phraiz",
    description:
      "문장 변환, 문장 요약, 인용 생성을 한 곳에서 — Phraiz에서 더 빠르게 글을 완성해 보세요.",
    images: ["/opengraph/main.jpg"],
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID!;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
                      height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />

        <Suspense fallback={null}>
          <Analytics />
        </Suspense>

        <QueryProvider>
          {/* ✅ 여기서 감싸면 Header, NavBar, SideBar 모두 같은 Provider 사용 */}
          <ResponsiveSidebarProvider>
            <div className="block relative lg:hidden">
              <MobileHeader />
              <MobileNavBar />
            </div>
            <div className="hidden lg:block">
              <Header />
            </div>
            <ScrollToTop />
            <main className="min-h-screen w-full">{children}</main>
            <div className="hidden lg:block">
              <TopButton />
            </div>
          </ResponsiveSidebarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
