import AiSummarizeBox from "@/components/box/AiSummarizeBox";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 문장 요약",
  alternates: { canonical: "/ai-summarize" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.phraiz.com/ai-summarize",
    title: "Phraiz",
    description: "AI 문장 요약",
    images: ["/opengraph/ai-summarize.png"],
  },
};

export default function AiSummarizePage() {
  return <AiSummarizeBox />;
}
