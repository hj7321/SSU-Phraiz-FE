import { api } from "./api";
export type SummarizeApiMode = "one-line" | "full" | "by-paragraph" | "key-points" | "question-based" | "targeted";

// 파라미터 타입 정의
interface SummarizeRequest {
  text: string;
  question?: string; // 'question-based' 모드일 때
  target?: string; // 'targeted' 모드일 때
}

// api 응답 데이터타입 정의
interface SummarizeResponse {
  result: string;

  // 토큰 사용량 정보 (optional로 추가)
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };

  // 다른 가능한 토큰 필드명들도 대비
  tokens_used?: number;
  token_count?: number;
}

export const requestSummarize = async (mode: SummarizeApiMode, data: SummarizeRequest): Promise<SummarizeResponse> => {
  const url = `/summary/summarize/${mode}`;
  const response = await api.post<SummarizeResponse>(url, data);
  return response.data;
};
