// utils/citation.ts
import { CSL } from "@/types/citation.type";

/** 로드된 CSL 스타일 캐시 */
const loadedStyles: Record<string, string> = {};

/**
 * citation-js를 클라이언트 전용으로 동적 import
 * (SSR 번들에 citation-js 포함 방지)
 */
async function loadCitationModules() {
  // 이미 로드된 경우 재사용
  if (typeof window === "undefined") {
    throw new Error("❌ citation-js는 클라이언트 환경에서만 동작합니다.");
  }

  const [{ default: Cite }] = await Promise.all([
    import("citation-js"),
    import("@citation-js/plugin-csl"),
  ]);

  return { Cite };
}

/**
 * CSL 템플릿을 한 번만 불러오고 등록
 */
async function ensureTemplateLoaded(Cite: any, style: string) {
  const key = style.toLowerCase();
  if (loadedStyles[key]) return loadedStyles[key];

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://www.phraiz.com";

  const res = await fetch(`${baseUrl}/csl/${key}.csl`);
  if (!res.ok) throw new Error(`❌ ${key}.csl 파일을 불러오지 못했습니다`);

  const xml = await res.text();
  Cite.CSL.register.addTemplate(key, xml);
  loadedStyles[key] = xml;
  return xml;
}

/**
 * 인용문 생성 함수
 */
export const generateCitation = async (
  cslItem: CSL | string,
  style: string
) => {
  try {
    const { Cite } = await loadCitationModules(); // ✅ 클라이언트 전용 import
    const key = style.toLowerCase();

    await ensureTemplateLoaded(Cite, key);

    const citation = new Cite(cslItem).format("bibliography", {
      template: key,
      lang: "ko-KR",
      format: "text",
    });

    return citation;
  } catch (e) {
    console.error("❌ Citation generation failed:", e);
    alert(`"${style}" 형식의 인용 템플릿을 적용하는 중 오류가 발생했습니다.`);
    return "";
  }
};
