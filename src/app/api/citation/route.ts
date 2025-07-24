import { NextRequest, NextResponse } from "next/server";
import Cite from "citation-js";
import "@citation-js/plugin-doi";

async function fetchCrossref(doi: string) {
  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  const r = await fetch(url, { headers: { Accept: "application/json" } }); // 헤더 완화
  if (r.status === 404) throw new Error("Crossref 404");
  if (r.status === 406) {
    // 406 → DOI Content-Negotiation 재시도
    const r2 = await fetch(`https://doi.org/${doi}`, {
      headers: { Accept: "application/vnd.citationstyles.csl+json;q=1.0" },
    });
    if (!r2.ok) throw new Error(`doi.org ${r2.status}`);
    return await r2.json();
  }
  if (!r.ok) throw new Error(`Crossref ${r.status}`);
  const { message } = await r.json();
  return message; // CSL-JSON
}

export async function GET(req: NextRequest) {
  const doi = req.nextUrl.searchParams.get("doi") ?? "";
  try {
    const json = await fetchCrossref(doi);
    const apa = new Cite(json).format("bibliography", {
      template: "apa",
      format: "text",
    });
    return NextResponse.json({ apa });
  } catch (e: unknown) {
    // e의 타입을 unknown으로 변경
    console.error(e);
    let errorMessage = "An unknown error occurred.";

    if (e instanceof Error) {
      // Error 인스턴스인지 확인
      errorMessage = e.message;
    } else if (typeof e === "string") {
      // 문자열 에러인 경우
      errorMessage = e;
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
