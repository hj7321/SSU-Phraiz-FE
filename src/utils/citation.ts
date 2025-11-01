import { CSL } from "@/types/citation.type";

/** citation-js 의 '형태'만 덕 타이핑으로 정의 (정적 의존성 제거) */
type CitationJSType = {
  new (input: CSL | string): {
    format: (
      mode: "bibliography",
      opts: { template: string; lang: string; format: string }
    ) => string;
  };
  CSL?: { register?: { addTemplate?: (k: string, xml: string) => void } };
};

/** 브라우저 전역 객체 확장 */
declare global {
  interface Window {
    Cite?: CitationJSType;
  }
}

const loadedStyles: Record<string, string> = {};

/** citation-js 형태 확인용 타입가드 */
function isCitationJs(x: unknown): x is CitationJSType {
  return typeof x === "function";
}

/**
 * citation-js를 CDN에서 클라이언트 런타임에만 로드
 * - Webpack 정적 분석 회피를 위해 전역 eval + 문자열 dynamic import 사용
 */
async function loadCitationJSFromCDN(): Promise<{ Cite: CitationJSType }> {
  if (typeof window === "undefined") {
    throw new Error("❌ citation-js는 브라우저 환경에서만 동작합니다.");
  }

  if (!window.Cite) {
    const url = "https://esm.sh/citation-js@0.6.9?bundle";
    const pluginUrl = "https://esm.sh/@citation-js/plugin-csl@0.6.9?bundle";

    // 전역 eval 보장을 위해 (0, eval)(...) 형태 사용
    const ns: unknown = await (0, eval)(`import("${url}")`);
    const picked: unknown = (ns as { default?: unknown })?.default ?? ns;

    if (!isCitationJs(picked)) {
      throw new Error("❌ citation-js 모듈 로드 실패(형식 불일치)");
    }
    window.Cite = picked;

    // 플러그인은 부수효과만 필요
    await (0, eval)(`import("${pluginUrl}")`);
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

  // 안전 접근(옵셔널 체이닝)
  Cite.CSL?.register?.addTemplate?.(key, xml);

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
