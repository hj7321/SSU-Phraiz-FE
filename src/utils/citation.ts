import Cite from "citation-js";
import "@citation-js/plugin-csl";
import { CSL } from "@/types/citation.type";

/** 한 번만 로드 후 캐싱 */
const loadedStyles: Record<string, string> = {};

async function ensureTemplateLoaded(style: string) {
  const key = style.toLowerCase();
  if (loadedStyles[key]) return loadedStyles[key];

  // ✅ 클라이언트/서버 환경 구분
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

export const generateCitation = async (
  cslItem: CSL | string,
  style: string
) => {
  const key = style.toLowerCase();
  await ensureTemplateLoaded(key); // ✅ 필요 시 자동 로드

  try {
    const citation = new Cite(cslItem).format("bibliography", {
      template: key,
      lang: "ko-KR",
      format: "text",
    });
    return citation;
  } catch (e) {
    console.error("❌ Citation generation failed:", e);
    alert(`"${style}" 형식의 인용 템플릿을 찾을 수 없습니다.`);
    return "";
  }
};
