export const runtime = "nodejs";

import ContentBox from "@/components/box/ContentBox";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "인용 생성",
  alternates: { canonical: "/create-citation" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.phraiz.com/create-citation",
    title: "Phraiz",
    description: "인용 생성",
    images: ["/opengraph/create-citation.png"],
  },
};

export default function CreateCitationPage() {
  return <ContentBox />;
}
