import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./_provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Phraiz",
  description:
    "문장 변환, 요약, 인용 생성을 지원하는 AI 기반 통합 글쓰기 웹사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
