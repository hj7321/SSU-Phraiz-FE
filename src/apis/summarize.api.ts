import { api } from "./api";

export type SummarizeApiMode = "one-line" | "full" | "by-paragraph" | "key-points" | "question-based" | "targeted";

// 하나로 통합: 파일도 지원하도록
interface SummarizeRequest {
  text?: string; // 파일만 업로드할 수도 있으므로 optional
  question?: string; // 'question-based' 모드일 때
  target?: string; // 'targeted' 모드일 때
  file?: File; // 파일 업로드 시
}

// API 응답 타입 정의
export interface SummarizeResponse {
  result: string;
  historyId: number;
  name: string;
  remainingToken: number;

  // 토큰 사용량 정보 (optional, fallback용)
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  tokens_used?: number;
  token_count?: number;
}

// FormData와 일반 객체 모두 지원
export const requestSummarize = async (mode: SummarizeApiMode, data: SummarizeRequest | FormData): Promise<SummarizeResponse> => {
  const url = `/summarize/${mode}`;

  // FormData인 경우 그대로 전송
  if (data instanceof FormData) {
    const response = await api.post<SummarizeResponse>(url, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  }

  // 일반 객체인 경우
  const response = await api.post<SummarizeResponse>(url, data);
  return response.data;
};
