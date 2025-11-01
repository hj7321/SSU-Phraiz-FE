import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // 선택: 에지 런타임
export const dynamic = "force-dynamic"; // 캐시 방지

function ensureDoi(s: string | null): string {
  const v = (s ?? "").trim();
  if (!v) throw new Error("Missing 'doi' query param");
  return v;
}

async function fetchBibliography(doi: string, locale: "ko-KR" | "en-US") {
  // DOI Content Negotiation: APA 서식 그대로 텍스트 반환
  const r = await fetch(`https://doi.org/${encodeURIComponent(doi)}`, {
    headers: { Accept: `text/x-bibliography; style=apa; locale=${locale}` },
    redirect: "follow",
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`doi.org ${r.status}`);
  return r.text();
}

export async function GET(req: NextRequest) {
  try {
    const doi = ensureDoi(req.nextUrl.searchParams.get("doi"));

    // 1차: 한국어 로케일
    try {
      const apa = await fetchBibliography(doi, "ko-KR");
      return NextResponse.json({ apa });
    } catch {
      // 2차: 영문 로케일로 폴백
      const apa = await fetchBibliography(doi, "en-US");
      return NextResponse.json({ apa });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
