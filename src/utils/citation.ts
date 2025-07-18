import Cite from "citation-js";
import "@citation-js/plugin-doi";
import "@citation-js/plugin-bibtex";

// export async function toAPA(doi: string) {
//   const cite = await Cite.async(doi); // 이제 cite 는 정상 객체
//   return cite.format("bibliography", {
//     format: "text",
//     template: "apa",
//   });
// }

// const zoteroItem = {
//   itemType: "journalArticle",
//   title: "도파민 터지는 세상에서 나는 왜 우울한가",
//   creators: [{ name: "장래혁", creatorType: "author" }],
//   publicationTitle: "브레인",
//   date: "2024/1",
//   volume: "103",
//   pages: "8-10",
//   ISSN: "1975-5627",
//   url: "https://www-dbpia-co-kr-ssl.openlink.ssu.ac.kr/Journal/articleDetail?nodeId=NODE11700923",
//   language: "ko",
// };

const cslItem = {
  type: "article-journal",
  title: "도파민 터지는 세상에서 나는 왜 우울한가",
  author: [{ family: "장", given: "래혁" }],
  "container-title": "브레인",
  issued: { "date-parts": [[2024, 1]] },
  volume: "103",
  page: "8-10",
  ISSN: "1975-5627",
  URL: "https://www-dbpia-…",
  language: "ko",
};

export async function toAPA() {
  const cite = new Cite(cslItem); // plugin-zotero 덕분에 그대로 OK
  console.log(
    cite.format("bibliography", {
      template: "apa",
      lang: "ko-KR",
      format: "text",
    })
  );
}
