export type ServiceFeature = {
  title: string;
  description: string;
};

export type ServiceLink = {
  id: string; // map을 돌릴 때 key로 사용
  href: string;
  icon: string;
  alt: string;
  label: string;
  title: string;
  preTitle?: string;
  ctaText: string;
  features: ServiceFeature[];
};

export const SERVICE_LINK: ServiceLink[] = [
  {
    id: "paraphrase",
    href: "/ai-paraphrase",
    icon: "/icons/AI_문장_변환.svg",
    alt: "AI 문장 변환",
    label: "AI 문장 변환",
    title: "AI 문장 변환 (Paraphrasing)",
    ctaText: "AI 문장 변환 기능 이용하러 가기",
    features: [
      {
        title: "정확함을 넘어,<br>글맛까지 살립니다",
        description:
          "Phraiz의 문장 변환은 맞춤법 교정은 기본,<br>5가지 전문 모드와 '사용자 지정' 모드로<br>글의 톤·스타일까지 단숨에 바꿔줘요.",
      },
      {
        title: "슬라이더로 톤·강도까지<br>미세 조정",
        description:
          "슬라이더로 강도를 조절하세요.<br>'기본'은 가볍게, '강조'는 과감하게.<br>문맥은 그대로, 결과만 달라집니다.",
      },
      {
        title: "변환 이력 100% 보존",
        description:
          "폴더별 히스토리를 자동 저장해<br>언제든 이전 버전과 비교하고,<br>가장 마음에 드는 결과만 골라 사용하세요.",
      },
    ],
  },
  {
    id: "summarize",
    href: "/ai-summarize",
    icon: "/icons/AI_요약.svg",
    alt: "AI 요약",
    label: "AI 요약",
    title: "AI 요약 (Summarization)",
    ctaText: "AI 요약 기능 이용하러 가기",
    features: [
      {
        title: "문단별·핵심포인트·<br>한줄 요약까지 원클릭",
        description:
          "리포트부터 블로그 글까지,<br>원하는 깊이로 즉시 요약해<br>시간을 절약하세요.",
      },
      {
        title: "질문형 요약:<br>사용자가 묻고 AI가 답합니다",
        description:
          "사용자가 궁금한 질문을 직접 입력하면,<br>Phraiz가 본문을 분석해 핵심만 추려<br>요약 답변을 제공합니다.",
      },
      {
        title: "독자 맞춤형 요약으로<br>이해도·가독성 200% 상승",
        description:
          "초등학생 눈높이부터 전문가 보고용까지,<br>대상만 선택하면 어휘와 난이도가<br>자동 최적화됩니다.",
      },
    ],
  },
  {
    id: "citation",
    href: "/create-citation",
    icon: "/icons/인용_생성.svg",
    alt: "인용 생성",
    label: "인용 생성",
    title: "인용 생성 (Create Citation)",
    preTitle: "인용 생성<br />(Create Citation)",
    ctaText: "인용 생성 기능 이용하러 가기",
    features: [
      {
        title: "URL만 넣으면<br>APA·MLA·BibTeX 즉석 생성",
        description:
          "복잡한 서지 정보,<br>이제 브라우저 탭 전환 없이<br>한 번에 해결하세요.",
      },
      {
        title: "히스토리에서<br>바로 찾고 복사",
        description:
          "생성된 인용문은 자동 저장됩니다.<br>인용문을 폴더로 정리해 빠르게 찾고,<br>복사 한 번으로 클립보드에 담으세요.",
      },
      {
        title: "클라우드 폴더로 인용 관리",
        description:
          "논문별·과목별로 인용 기록을<br>폴더에 저장해 두었다가,<br>필요할 때 끌어다 쓰세요.",
      },
    ],
  },
];
