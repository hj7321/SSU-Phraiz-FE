import Cite from "citation-js";
import "@citation-js/plugin-csl";
import { CSL } from "@/types/citation.type";

export const generateCitation = (cslItem: CSL | string, style: string) => {
  const citation = new Cite(cslItem).format("bibliography", {
    template: style.toLowerCase(),
    lang: "ko-KR",
    format: "text",
  });
  return citation;
};
