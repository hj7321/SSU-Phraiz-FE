import Cite from "citation-js";
import "@citation-js/plugin-csl";
import "citation-js/style/apa";
import "citation-js/style/mla";
import { CSL } from "@/types/citation.type";

export const generateCitation = (cslItem: CSL | string, style: string) => {
  try {
    const citation = new Cite(cslItem).format("bibliography", {
      template: style.toLowerCase(),
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
