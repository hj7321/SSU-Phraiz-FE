import { CSL } from "@/types/citation.type";
import type { default as CitationJSType } from "citation-js";

/** 한 번만 로드 후 캐싱 */
const loadedStyles: Record<string, string> = {};

/**
 * citation-js 모듈을 클라이언트 환경에서만 동적으로 불러옴
 */
async function loadCitationJS(): Promise<{ Cite: typeof CitationJSType }> {
  if (typeof window === "undefined") {
    throw new Error("❌ citation-js는 브라우저 환경에서만 사용할 수 있습니다.");
  }

  const [{ default: Cite }] = await Promise.all([
    import("citation-js"),
    import("@citation-js/plugin-csl"),
  ]);

  // ✅ Edge 환경일 때 DOMParser 없는 경우 방어
  if (typeof DOMParser === "undefined") {
    class SafeDOMParser {
      parseFromString(str: string): Document {
        const div = document.createElement("div");
        div.innerHTML = str;
        // document.implementation.createDocument로 가짜 Document 반환
        const doc = document.implementation.createDocument(null, "root");
        const root = doc.createElement("root");
        root.innerHTML = div.innerHTML;
        doc.appendChild(root);
        return doc;
      }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: DOMParser 타입 보강
    (window as unknown as { DOMParser: typeof SafeDOMParser }).DOMParser =
      SafeDOMParser;
  }

  return { Cite };
}

/**
 * CSL 템플릿 로드 및 등록
 */
async function ensureTemplateLoaded(
  Cite: typeof CitationJSType,
  style: string
): Promise<string> {
  const key = style.toLowerCase();
  if (loadedStyles[key]) return loadedStyles[key];

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://www.phraiz.com";

  const res = await fetch(`${baseUrl}/csl/${key}.csl`);
  if (!res.ok) throw new Error(`❌ ${key}.csl 파일을 불러오지 못했습니다.`);

  const xml = await res.text();
  Cite.CSL.register.addTemplate(key, xml);
  loadedStyles[key] = xml;
  return xml;
}

/**
 * 인용문 생성
 */
export async function generateCitation(
  cslItem: CSL | string,
  style: string
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("❌ citation-js는 SSR에서 실행할 수 없습니다.");
  }

  try {
    const { Cite } = await loadCitationJS();
    const key = style.toLowerCase();

    await ensureTemplateLoaded(Cite, key);

    const citation = new Cite(cslItem).format("bibliography", {
      template: key,
      lang: "ko-KR",
      format: "text",
    });

    return citation;
  } catch (error) {
    console.error("❌ Citation generation failed:", error);
    alert(`"${style}" 형식의 인용 템플릿을 적용하는 중 오류가 발생했습니다.`);
    return "";
  }
}
