export type CitationForm = {
  value: string;
  name: string;
  fullName?: string;
  description: string;
};

export const CITATION_FORM: CitationForm[] = [
  {
    value: "apa",
    name: "APA",
    fullName: "American Psychological Association",
    description: "사회과학, 교육학, 심리학",
  },
  {
    value: "mla",
    name: "MLA",
    fullName: "Modern Language Association",
    description: "인문학, 문학",
  },
  {
    value: "bibtex",
    name: "BibTeX",
    description: "과학 논문, LaTeX 사용 시",
  },
  {
    value: "chicago",
    name: "Chicago",
    fullName: "Turabian 포함",
    description: "역사학, 출판물",
  },
  {
    value: "harvard",
    name: "Harvard",
    description: "전반적인 학술 분야",
  },
  {
    value: "acs",
    name: "ACS",
    fullName: "American Chemical Society",
    description: "화학 분야",
  },
  {
    value: "ama",
    name: "AMA",
    fullName: "American Medical Association",
    description: "의학, 약학",
  },
  {
    value: "ieee",
    name: "IEEE",
    fullName: "Institute of Electrical and Electronics Engineers",
    description: "공학, 컴퓨터 과학",
  },
  {
    value: "cse",
    name: "CSE",
    fullName: "Council of Science Editors",
    description: "생명과학, 자연과학",
  },
  {
    value: "vancouver",
    name: "Vancouver",
    description: "의학, 생명과학",
  },
];
