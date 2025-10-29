import AiParaphraseBox from "@/components/box/AiParaphraseBox";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 문장 변환",
  alternates: { canonical: "/ai-paraphrase" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://ssu-phraiz-fe.vercel.app/ai-paraphrase",
    title: "Phraiz",
    description: "AI 문장 변환",
    images: ["/opengraph/ai-paraphrase.jpg"],
  },
};

export default function AiParaphrasePage() {
  return <AiParaphraseBox />;
}
