import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./_provider";
import Header from "@/components/layout/Header";
import Script from "next/script";
import MobileHeader from "@/components/layout/MobileHeader";
import MobileNavBar from "@/components/layout/MobileNavBar";

export const metadata: Metadata = {
  metadataBase: new URL("https://ssu-phraiz-fe.vercel.app"),
  title: { default: "Phraiz", template: "%s | Phraiz" },
  description:
    "문장 변환, 요약, 인용 생성을 지원하는 AI 기반 통합 글쓰기 웹사이트",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://ssu-phraiz-fe.vercel.app/",
    title: "Phraiz",
    description:
      "문장 변환, 문장 요약,인용 생성을 한 곳에서 — Phraiz에서 더 빠르게 글을 완성해 보세요.",
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
        {/* ① GTM Head 스니펫 — afterInteractive 전략으로 렌더 블로킹 방지 */}
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
        {/* ② GTM noscript 스니펫 — JS 꺼진 브라우저 대비 */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
                      height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
        <QueryProvider>
          <div className="block relative lg:hidden">
            <MobileHeader />
            <MobileNavBar />
          </div>
          <div className="hidden lg:block">
            <Header />
          </div>
          <main className="min-h-screen w-full">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
