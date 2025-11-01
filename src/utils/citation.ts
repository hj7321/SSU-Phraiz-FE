import { CSL } from "@/types/citation.type";

/** citation-js 타입만 별도 import (정적 의존성 제거용) */
type CitationJSType = typeof import("citation-js");

/** 브라우저 전역 객체 확장 */
declare global {
  interface Window {
    Cite?: CitationJSType;
  }
}

const loadedStyles: Record<string, string> = {};

/**
 * citation-js를 CDN에서 클라이언트 런타임에만 로드
 */
async function loadCitationJSFromCDN(): Promise<{ Cite: CitationJSType }> {
  if (typeof window === "undefined") {
    throw new Error("❌ citation-js는 브라우저 환경에서만 동작합니다.");
  }

  if (!window.Cite) {
    // ✅ Webpack 정적 분석을 피하기 위해 문자열 import + eval 사용
    const url = "https://esm.sh/citation-js@0.6.9?bundle";
    const pluginUrl = "https://esm.sh/@citation-js/plugin-csl@0.6.9?bundle";

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const module = (await eval(`import("${url}")`)) as unknown;
    window.Cite = module as CitationJSType;

    await eval(`import("${pluginUrl}")`);
  }

  return { Cite: window.Cite as CitationJSType };
}

/**
 * CSL 템플릿 로드 및 등록
 */
async function ensureTemplateLoaded(
  Cite: CitationJSType,
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

  // citation-js 내부 타입에 CSL.register 정의가 없으므로 안전 캐스팅
  (
    Cite as unknown as {
      CSL: { register: { addTemplate: (k: string, xml: string) => void } };
    }
  ).CSL.register.addTemplate(key, xml);

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
    const { Cite } = await loadCitationJSFromCDN();
    const key = style.toLowerCase();

    await ensureTemplateLoaded(Cite, key);

    const CiteConstructor = Cite as unknown as new (input: CSL | string) => {
      format: (
        mode: "bibliography",
        opts: { template: string; lang: string; format: string }
      ) => string;
    };

    const citation = new CiteConstructor(cslItem).format("bibliography", {
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
